import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const queuePath = path.join(root, ".agent-coordination", "WORK-QUEUE.json");
const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;

if (!fs.existsSync(queuePath)) {
  console.error("WORK-QUEUE.json not found.");
  process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const doneEvidenceTasks = (queue.tasks ?? []).filter(
  task => task.status === "DONE" && task.completion_evidence_required?.evidence_file
);

if (doneEvidenceTasks.length === 0) {
  console.log("No DONE evidence-gated tasks to verify against GitHub Actions.");
  process.exit(0);
}

if (!token || !repository) {
  console.error("GITHUB_TOKEN and GITHUB_REPOSITORY are required to verify gate evidence.");
  process.exit(1);
}

async function github(pathname) {
  const response = await fetch(`https://api.github.com/repos/${repository}${pathname}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json();
}

const failures = [];

for (const task of doneEvidenceTasks) {
  const requirement = task.completion_evidence_required;
  const evidencePath = path.join(root, requirement.evidence_file);
  let evidence;
  try {
    evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
  } catch (error) {
    failures.push(`${task.id}: cannot read evidence: ${error.message}`);
    continue;
  }

  try {
    execFileSync("git", ["merge-base", "--is-ancestor", evidence.candidate_commit_sha, "HEAD"]);
  } catch {
    failures.push(`${task.id}: candidate commit ${evidence.candidate_commit_sha} is not an ancestor of the closure commit.`);
    continue;
  }

  let run;
  try {
    run = await github(`/actions/runs/${evidence.ci.workflow_run_id}`);
  } catch (error) {
    failures.push(`${task.id}: cannot verify workflow run ${evidence.ci.workflow_run_id}: ${error.message}`);
    continue;
  }

  if (run.repository?.full_name !== repository) {
    failures.push(`${task.id}: workflow run belongs to ${run.repository?.full_name}, expected ${repository}.`);
  }
  if (run.head_sha !== evidence.candidate_commit_sha) {
    failures.push(`${task.id}: workflow run head_sha ${run.head_sha} does not match candidate ${evidence.candidate_commit_sha}.`);
  }
  if (run.status !== "completed" || run.conclusion !== "success") {
    failures.push(`${task.id}: referenced workflow run is not completed successfully (status=${run.status}, conclusion=${run.conclusion}).`);
  }

  let artifacts;
  try {
    artifacts = await github(`/actions/runs/${evidence.ci.workflow_run_id}/artifacts?per_page=100`);
  } catch (error) {
    failures.push(`${task.id}: cannot inspect workflow artifacts: ${error.message}`);
    continue;
  }

  const available = new Set(
    (artifacts.artifacts ?? []).filter(a => !a.expired).map(a => a.name)
  );
  const requiredNames = requirement.required_ci_artifact_names ?? [];
  const evidenceNames = new Set(evidence.ci.artifact_names ?? []);

  for (const name of requiredNames) {
    if (!evidenceNames.has(name)) failures.push(`${task.id}: evidence record does not name required artifact "${name}".`);
    if (!available.has(name)) failures.push(`${task.id}: required artifact "${name}" is absent or expired on workflow run ${evidence.ci.workflow_run_id}.`);
  }

  for (const repoPath of requirement.required_repository_paths ?? []) {
    const full = path.join(root, repoPath);
    if (!fs.existsSync(full)) {
      failures.push(`${task.id}: required repository path is missing: ${repoPath}`);
      continue;
    }
    if (fs.statSync(full).isDirectory()) {
      const entries = fs.readdirSync(full).filter(name => !name.startsWith("."));
      if (entries.length === 0) failures.push(`${task.id}: required repository directory is empty: ${repoPath}`);
    }
  }

  console.log(`${task.id}: checked GitHub Actions run ${evidence.ci.workflow_run_id} on ${evidence.candidate_commit_sha}.`);
}

if (failures.length) {
  console.error("\nFoundation gate evidence verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Verified machine evidence for ${doneEvidenceTasks.length} DONE foundation gate(s).`);
