import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TERMINAL = new Set(["DONE", "CANCELLED"]);

export function isParked(task) {
  return task?.status === "READY" && /\bPARKED\b/i.test(String(task?.notes ?? ""));
}

export function isReviewReady(task) {
  return flowState(task) === "DIRECTOR_REVIEW";
}

export function flowState(task) {
  if (!isParked(task)) return null;
  const notes = String(task.notes ?? "");
  const approved = /(agent\s*7\s+approved|director-approved|director\s+approval\s+covers|approved\s+exact\s+(useful\s+)?head|exact-head\s+approval\s+(?:is\s+)?(?:valid|complete))/i.test(notes);
  const mergeNext = /(fresh(?:ly)?\s+(?:agent\s+\d+\s+)?claim|fresh claimant|reconcil|merge preparation|then merge|merge and mark done)/i.test(notes);
  const reviewNeeded = /(await(?:ing)?[^.]{0,80}(?:director|agent\s*7)[^.]{0,50}(?:review|approval)|missing\s+agent\s*7|director\s+review\s+requested|next action:\s*agent\s*7)/i.test(notes);

  if (task.director_review !== "REQUIRED") {
    return "PARKED_WAIT";
  }
  if (approved && mergeNext) return "OWNER_MERGE";
  if (reviewNeeded) return "DIRECTOR_REVIEW";
  return "PARKED_WAIT";
}

export function parkedAtFromNotes(task) {
  const notes = String(task?.notes ?? "");
  const explicit = notes.match(/parked_at=([^\s,;]+)/i);
  if (explicit && Number.isFinite(Date.parse(explicit[1]))) return new Date(explicit[1]).toISOString();

  const isoDate = notes.match(/\bPARKED(?:\s+HANDOFF)?\s+(\d{4}-\d{2}-\d{2})\b/i);
  if (isoDate) return new Date(isoDate[1] + "T00:00:00Z").toISOString();

  const humanDate = notes.match(/\bPARKED(?:\s+HANDOFF)?\s*\((\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\)/i);
  if (humanDate) {
    const parsed = Date.parse(`${humanDate[1]} ${humanDate[2]} ${humanDate[3]} 00:00:00 UTC`);
    if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
  }
  return null;
}

function hoursBetween(start, end) {
  const a = Date.parse(start ?? "");
  const b = Date.parse(end ?? "");
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null;
  return (b - a) / 3_600_000;
}

export function findingIsHighImpact(finding) {
  return ["S0", "S1"].includes(finding?.severity) || finding?.player_impact === "HIGH";
}

export function buildFindingMetrics(findings = []) {
  const usable = findings.filter(f => f && !f._parse_error);
  const activeStatuses = new Set(["OPEN", "ROUTED", "FIXED_PENDING_RETEST"]);
  const high = usable.filter(findingIsHighImpact);
  const highUnresolved = high.filter(f => activeStatuses.has(f.status));
  const highResolved = high.filter(f => f.status === "RESOLVED");
  const pendingRetest = usable.filter(f => f.status === "FIXED_PENDING_RETEST");
  const currentBuild = usable.filter(f => ["CURRENT_MAIN", "CURRENT_DEPLOYED"].includes(f.tested_source));
  const resolutionHours = usable
    .filter(f => f.status === "RESOLVED" && f.observed_at && f.resolved_at)
    .map(f => hoursBetween(f.observed_at, f.resolved_at))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const medianResolutionHours = resolutionHours.length
    ? resolutionHours.length % 2
      ? resolutionHours[(resolutionHours.length - 1) / 2]
      : (resolutionHours[resolutionHours.length / 2 - 1] + resolutionHours[resolutionHours.length / 2]) / 2
    : null;
  const reworkEligible = usable.filter(f => !["DUPLICATE", "WONT_FIX"].includes(f.status));
  const reopened = reworkEligible.filter(f => Number(f.reopen_count ?? 0) > 0);

  return {
    total: usable.length,
    current_build: currentBuild.length,
    unresolved_high_impact: highUnresolved.length,
    resolved_high_impact: highResolved.length,
    pending_retest: pendingRetest.length,
    high_impact_resolution_rate_percent: high.length ? (highResolved.length / high.length) * 100 : null,
    median_time_to_playable_improvement_hours: medianResolutionHours,
    rework_rate_percent: reworkEligible.length ? (reopened.length / reworkEligible.length) * 100 : null,
    reopened_findings: reopened.length
  };
}

function emptyAgent(agent) {
  return {
    number: agent.number,
    name: agent.name,
    total: 0,
    READY: 0,
    BLOCKED: 0,
    DONE: 0,
    CANCELLED: 0,
    parked_ready: 0,
    actionable_ready: 0,
    active_claims: 0,
    work_state: "DONE",
    next_task: null
  };
}

export function buildReport(queue, locks = [], findings = [], options = {}) {
  const tasks = Array.isArray(queue?.tasks) ? queue.tasks : [];
  const roster = Array.isArray(queue?.agent_roster) ? queue.agent_roster : [];
  const snapshotTime = queue?.updated_at ?? new Date().toISOString();
  const inconsistencies = [];
  const warnings = [];
  const byId = new Map();
  const duplicateIds = new Set();

  for (const task of tasks) {
    if (!task?.id) {
      inconsistencies.push("Task missing id.");
      continue;
    }
    if (byId.has(task.id)) duplicateIds.add(task.id);
    else byId.set(task.id, task);
  }
  for (const id of [...duplicateIds].sort()) inconsistencies.push(`Duplicate task id: ${id}`);

  const agents = new Map(roster.map(agent => [agent.number, emptyAgent(agent)]));
  for (const task of tasks) {
    if (!agents.has(task.primary_agent)) {
      inconsistencies.push(`${task.id ?? "<unknown>"}: primary_agent ${task.primary_agent} is not in agent_roster.`);
      continue;
    }
    const row = agents.get(task.primary_agent);
    row.total += 1;
    if (row[task.status] !== undefined) row[task.status] += 1;
    if (task.status === "READY") {
      if (isParked(task)) row.parked_ready += 1;
      else row.actionable_ready += 1;
    }
  }

  for (const task of tasks) {
    for (const dependency of task.depends_on ?? []) {
      if (!byId.has(dependency)) inconsistencies.push(`${task.id}: unknown dependency ${dependency}.`);
    }
    for (const gate of task.merge_gate_depends_on ?? []) {
      if (!byId.has(gate)) inconsistencies.push(`${task.id}: unknown merge gate ${gate}.`);
    }

    if (task.status === "READY") {
      const incomplete = (task.depends_on ?? []).filter(id => byId.get(id)?.status !== "DONE");
      if (incomplete.length) inconsistencies.push(`${task.id}: READY with incomplete dependencies: ${incomplete.join(", ")}.`);
    }
    if (task.status === "BLOCKED") {
      const deps = task.depends_on ?? [];
      if (deps.length && deps.every(id => byId.get(id)?.status === "DONE")) {
        warnings.push(`${task.id}: BLOCKED although all declared dependencies are DONE; verify an external blocker is documented.`);
      }
    }
    if (task.status === "DONE") {
      const incompleteGates = (task.merge_gate_depends_on ?? []).filter(id => byId.get(id)?.status !== "DONE");
      if (incompleteGates.length) inconsistencies.push(`${task.id}: DONE with incomplete merge gates: ${incompleteGates.join(", ")}.`);
    }
  }

  const unfinished = tasks.filter(task => !TERMINAL.has(task.status));
  const direct = new Map();
  const children = new Map();
  for (const task of unfinished) {
    for (const dep of task.depends_on ?? []) {
      if (!byId.has(dep) || TERMINAL.has(byId.get(dep).status)) continue;
      direct.set(dep, (direct.get(dep) ?? 0) + 1);
      const list = children.get(dep) ?? [];
      list.push(task.id);
      children.set(dep, list);
    }
  }

  function downstreamCount(start) {
    const seen = new Set();
    const stack = [...(children.get(start) ?? [])];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue;
      seen.add(id);
      stack.push(...(children.get(id) ?? []));
    }
    return seen.size;
  }

  const fanout = unfinished
    .map(task => ({
      id: task.id,
      title: task.title,
      agent: task.primary_agent,
      status: task.status,
      parked: isParked(task),
      direct: direct.get(task.id) ?? 0,
      transitive: downstreamCount(task.id)
    }))
    .filter(row => row.direct > 0 || row.transitive > 0)
    .sort((a, b) => b.transitive - a.transitive || b.direct - a.direct || a.id.localeCompare(b.id));

  const activeClaims = [];
  const seenSessions = new Map();
  for (const raw of locks) {
    if (raw?._parse_error) {
      inconsistencies.push(`${raw._file}: invalid claim JSON: ${raw._parse_error}`);
      continue;
    }
    const lock = raw ?? {};
    const file = lock._file ?? "<claim>";
    const task = byId.get(lock.task_id);
    activeClaims.push({
      file,
      task_id: lock.task_id,
      scope: lock.exclusive_scope,
      agent: lock.agent_number,
      branch: lock.branch,
      expires_at: lock.expires_at
    });

    if (!task) {
      inconsistencies.push(`${file}: references unknown task ${lock.task_id}.`);
      continue;
    }
    if (lock.exclusive_scope !== task.exclusive_scope) inconsistencies.push(`${file}: scope does not match ${task.id}.`);
    if (lock.agent_number !== task.primary_agent) inconsistencies.push(`${file}: agent ${lock.agent_number} does not own ${task.id} (owner ${task.primary_agent}).`);
    if (["BLOCKED", "CANCELLED"].includes(task.status)) inconsistencies.push(`${file}: ${task.id} is ${task.status} but has an active claim.`);
    if (lock.session_id) {
      if (seenSessions.has(lock.session_id)) inconsistencies.push(`${file}: session ${lock.session_id} also holds ${seenSessions.get(lock.session_id)}.`);
      else seenSessions.set(lock.session_id, file);
    }
    const agent = agents.get(lock.agent_number);
    if (agent) agent.active_claims += 1;
  }
  activeClaims.sort((a, b) => String(a.task_id).localeCompare(String(b.task_id)) || a.file.localeCompare(b.file));

  const fanoutLookup = new Map(fanout.map(row => [row.id, row]));
  for (const agent of agents.values()) {
    const candidates = tasks
      .filter(task => task.primary_agent === agent.number && task.status === "READY" && !isParked(task))
      .map(task => ({
        id: task.id,
        title: task.title,
        priority: task.priority ?? 99,
        direct: fanoutLookup.get(task.id)?.direct ?? 0,
        transitive: fanoutLookup.get(task.id)?.transitive ?? 0
      }))
      .sort((a, b) =>
        a.priority - b.priority ||
        b.transitive - a.transitive ||
        b.direct - a.direct ||
        a.id.localeCompare(b.id)
      );

    agent.next_task = candidates[0] ?? null;
    if (agent.active_claims > 0) agent.work_state = "ACTIVE";
    else if (agent.next_task) agent.work_state = "READY";
    else if (agent.parked_ready > 0) agent.work_state = "REVIEW_DRAIN";
    else if (agent.BLOCKED > 0) agent.work_state = "BLOCKED_ONLY";
    else agent.work_state = "DONE";
  }

  const parked = tasks.filter(isParked).map(task => {
    const parkedAt = parkedAtFromNotes(task);
    const incompleteGates = (task.merge_gate_depends_on ?? []).filter(
      id => byId.get(id)?.status !== "DONE"
    );
    let state = flowState(task);

    if (task.director_review !== "REQUIRED" && incompleteGates.length === 0) {
      state = "OWNER_MERGE";
    } else if (state === "OWNER_MERGE" && incompleteGates.length > 0) {
      state = "PARKED_WAIT";
    }

    return {
      id: task.id,
      title: task.title,
      agent: task.primary_agent,
      priority: task.priority,
      director_review: task.director_review ?? "NOT_REQUIRED",
      review_ready: state === "DIRECTOR_REVIEW",
      flow_state: state,
      incomplete_merge_gates: incompleteGates,
      parked_at: parkedAt,
      parked_age_hours: parkedAt ? hoursBetween(parkedAt, snapshotTime) : null
    };
  }).sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99) || a.id.localeCompare(b.id));

  const fanoutById = new Map(fanout.map(row => [row.id, row]));
  const flowInbox = parked.map(row => ({
    ...row,
    direct: fanoutById.get(row.id)?.direct ?? 0,
    transitive: fanoutById.get(row.id)?.transitive ?? 0
  })).sort((a, b) =>
    (a.priority ?? 99) - (b.priority ?? 99) ||
    b.transitive - a.transitive ||
    b.direct - a.direct ||
    a.id.localeCompare(b.id)
  );

  const findingMetrics = buildFindingMetrics(findings);
  const parkedAges = parked.map(row => row.parked_age_hours).filter(Number.isFinite);
  const oldestParkedReviewAgeHours = parkedAges.length ? Math.max(...parkedAges) : null;

  const fileMap = new Map();
  for (const task of unfinished) {
    for (const file of task.likely_files ?? []) {
      const entry = fileMap.get(file) ?? { file, tasks: [], agents: new Set() };
      entry.tasks.push(task.id);
      entry.agents.add(task.primary_agent);
      fileMap.set(file, entry);
    }
  }
  const collisions = [...fileMap.values()]
    .map(entry => ({ file: entry.file, count: entry.tasks.length, agent_count: entry.agents.size, agents: [...entry.agents].sort((a, b) => a - b) }))
    .filter(entry => entry.count > 1)
    .sort((a, b) => b.count - a.count || b.agent_count - a.agent_count || a.file.localeCompare(b.file));

  return {
    project: queue?.project ?? "Unknown project",
    queue_updated_at: queue?.updated_at ?? null,
    totals: {
      tasks: tasks.length,
      READY: tasks.filter(t => t.status === "READY").length,
      BLOCKED: tasks.filter(t => t.status === "BLOCKED").length,
      DONE: tasks.filter(t => t.status === "DONE").length,
      CANCELLED: tasks.filter(t => t.status === "CANCELLED").length,
      parked_ready: parked.length,
      review_ready: parked.filter(t => t.review_ready).length,
      director_review: flowInbox.filter(t => t.flow_state === "DIRECTOR_REVIEW").length,
      owner_merge: flowInbox.filter(t => t.flow_state === "OWNER_MERGE").length,
      active_claims: activeClaims.length
    },
    agents: [...agents.values()].sort((a, b) => a.number - b.number),
    active_claims: activeClaims,
    fanout,
    parked,
    flow_inbox: flowInbox,
    collisions,
    finding_metrics: findingMetrics,
    fun_loop_state: options.funLoopState ?? null,
    flow_metrics: {
      oldest_parked_review_age_hours: oldestParkedReviewAgeHours
    },
    inconsistencies: [...new Set(inconsistencies)].sort(),
    warnings: [...new Set(warnings)].sort()
  };
}

export function loadRepositoryState(root = process.cwd()) {
  const queuePath = path.join(root, ".agent-coordination", "WORK-QUEUE.json");
  const claimsDir = path.join(root, ".agent-coordination", "claims");
  const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
  const locks = [];
  const findings = [];
  const findingsDir = path.join(root, "QA", "findings");
  const funLoopPath = path.join(root, "QA", "FUN-LOOP-STATE.json");
  let funLoopState = null;

  if (fs.existsSync(claimsDir)) {
    for (const file of fs.readdirSync(claimsDir).filter(name => name.endsWith(".lock.json")).sort()) {
      try {
        locks.push({ ...JSON.parse(fs.readFileSync(path.join(claimsDir, file), "utf8")), _file: file });
      } catch (error) {
        locks.push({ _file: file, _parse_error: error.message });
      }
    }
  }

  if (fs.existsSync(findingsDir)) {
    for (const file of fs.readdirSync(findingsDir).filter(name => name.endsWith(".json")).sort()) {
      try {
        findings.push({ ...JSON.parse(fs.readFileSync(path.join(findingsDir, file), "utf8")), _file: file });
      } catch (error) {
        findings.push({ _file: file, _parse_error: error.message });
      }
    }
  }

  if (fs.existsSync(funLoopPath)) {
    try {
      funLoopState = JSON.parse(fs.readFileSync(funLoopPath, "utf8"));
    } catch (error) {
      funLoopState = { _parse_error: error.message };
    }
  }

  return { queue, locks, findings, funLoopState };
}

export function formatReport(report, { top = 10 } = {}) {
  const lines = [];
  lines.push(`${report.project} — AED queue health (advisory only; not a merge gate)`);
  if (report.queue_updated_at) lines.push(`Queue updated: ${report.queue_updated_at}`);
  lines.push(`Tasks: ${report.totals.tasks} | READY ${report.totals.READY} | BLOCKED ${report.totals.BLOCKED} | DONE ${report.totals.DONE} | parked READY ${report.totals.parked_ready} | Director review ${report.totals.director_review} | owner merge ${report.totals.owner_merge} | active claims ${report.totals.active_claims}`);
  lines.push("");
  lines.push("Agent workload:");
  for (const a of report.agents) {
    const next = a.next_task
      ? ` | NEXT ${a.next_task.id} P${a.next_task.priority}: ${a.next_task.title}`
      : "";
    lines.push(`  ${a.number} ${a.name}: ${a.work_state} | total ${a.total}, READY ${a.READY} (${a.actionable_ready} actionable, ${a.parked_ready} parked), BLOCKED ${a.BLOCKED}, DONE ${a.DONE}, claims ${a.active_claims}${next}`);
  }
  lines.push("");
  lines.push("Active claims:");
  if (!report.active_claims.length) lines.push("  none");
  for (const c of report.active_claims) lines.push(`  ${c.task_id} | agent ${c.agent} | ${c.scope} | ${c.branch ?? "no branch"}`);
  lines.push("");
  lines.push(`Top dependency fan-out (top ${top}):`);
  if (!report.fanout.length) lines.push("  none");
  for (const row of report.fanout.slice(0, top)) lines.push(`  ${row.id} | direct ${row.direct} | transitive ${row.transitive} | agent ${row.agent} | ${row.status}${row.parked ? " parked" : ""} | ${row.title}`);
  lines.push("");
  lines.push(`Critical-path flow inbox (top ${top}):`);
  if (!report.flow_inbox.length) lines.push("  none");
  for (const row of report.flow_inbox.slice(0, top)) lines.push(`  ${row.id} | ${row.flow_state} | P${row.priority ?? "?"} | fan-out ${row.direct}/${row.transitive} | agent ${row.agent} | ${row.title}`);
  lines.push("");
  lines.push(`Parked/review-ready (top ${top}):`);
  if (!report.parked.length) lines.push("  none");
  for (const row of report.parked.slice(0, top)) lines.push(`  ${row.id} | agent ${row.agent} | priority ${row.priority ?? "?"} | ${row.review_ready ? "review-ready" : "parked"} | ${row.title}`);
  lines.push("");
  lines.push(`Collision surfaces (top ${top}):`);
  if (!report.collisions.length) lines.push("  none");
  for (const row of report.collisions.slice(0, top)) lines.push(`  ${row.file} | ${row.count} unfinished tasks | ${row.agent_count} agents (${row.agents.join(",")})`);
  lines.push("");
  lines.push("Player-impact QA:");
  const fm = report.finding_metrics;
  lines.push(`  findings ${fm.total} | current-build ${fm.current_build} | unresolved high-impact ${fm.unresolved_high_impact} | resolved high-impact ${fm.resolved_high_impact} | pending retest ${fm.pending_retest}`);
  lines.push(`  high-impact resolution rate: ${fm.high_impact_resolution_rate_percent == null ? "unavailable" : fm.high_impact_resolution_rate_percent.toFixed(1) + "%"}`);
  lines.push(`  median time-to-playable-improvement proxy: ${fm.median_time_to_playable_improvement_hours == null ? "unavailable" : fm.median_time_to_playable_improvement_hours.toFixed(1) + "h"}`);
  lines.push(`  finding rework/reopen rate: ${fm.rework_rate_percent == null ? "unavailable" : fm.rework_rate_percent.toFixed(1) + "%"}`);
  lines.push(`  oldest parked review age: ${report.flow_metrics.oldest_parked_review_age_hours == null ? "unavailable" : report.flow_metrics.oldest_parked_review_age_hours.toFixed(1) + "h"}`);
  if (report.fun_loop_state?.last_tested_main_sha) {
    lines.push(`  last current-main playtest: ${report.fun_loop_state.last_tested_main_sha} at ${report.fun_loop_state.last_tested_at ?? "unknown time"}`);
  } else {
    lines.push("  last current-main playtest: none recorded");
  }
  lines.push("");
  lines.push("Inconsistencies:");
  if (!report.inconsistencies.length) lines.push("  none");
  for (const item of report.inconsistencies) lines.push(`  ERROR: ${item}`);
  for (const item of report.warnings) lines.push(`  WARN: ${item}`);
  return lines.join("\n");
}

function parseArgs(argv) {
  const args = { json: false, root: process.cwd(), top: 10 };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--json") args.json = true;
    else if (argv[i] === "--root") args.root = path.resolve(argv[++i]);
    else if (argv[i] === "--top") args.top = Number.parseInt(argv[++i], 10);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!Number.isInteger(args.top) || args.top < 1) throw new Error("--top must be a positive integer");
  return args;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const { queue, locks, findings, funLoopState } = loadRepositoryState(args.root);
    const report = buildReport(queue, locks, findings, { funLoopState });
    console.log(args.json ? JSON.stringify(report, null, 2) : formatReport(report, { top: args.top }));
  } catch (error) {
    console.error(`AED report failed: ${error.message}`);
    process.exit(1);
  }
}
