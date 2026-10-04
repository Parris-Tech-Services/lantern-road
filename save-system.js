(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.LanternRoadSave = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CURRENT_SCHEMA_VERSION = 2;
  const LEGACY_UNVERSIONED_SCHEMA = 1;

  class SaveError extends Error {
    constructor(code, message) {
      super(message);
      this.name = "SaveError";
      this.code = code;
    }
  }

  function isPlainObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (isPlainObject(value)) {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, clone(entry)]));
    }
    return value;
  }

  function mergeDefaults(defaults, candidate) {
    if (Array.isArray(defaults)) return Array.isArray(candidate) ? clone(candidate) : clone(defaults);
    if (!isPlainObject(defaults)) return candidate === undefined ? clone(defaults) : clone(candidate);
    if (!isPlainObject(candidate)) return clone(defaults);

    const merged = clone(defaults);
    for (const [key, value] of Object.entries(candidate)) {
      if (key in defaults) merged[key] = mergeDefaults(defaults[key], value);
      else merged[key] = clone(value);
    }
    return merged;
  }

  function numberOr(value, fallback, warnings, label, options = {}) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      warnings.push(`${label} was invalid and was restored to a safe default.`);
      return fallback;
    }
    let result = numeric;
    if (Number.isFinite(options.min)) result = Math.max(options.min, result);
    if (Number.isFinite(options.max)) result = Math.min(options.max, result);
    if (options.integer) result = Math.trunc(result);
    return result;
  }

  function mergeParty(defaultParty, candidateParty, warnings) {
    if (!Array.isArray(candidateParty)) {
      warnings.push("Party data was missing or invalid and was restored to safe defaults.");
      return clone(defaultParty);
    }

    const defaultsById = new Map(defaultParty.map(member => [member.id, member]));
    const candidatesById = new Map(
      candidateParty
        .filter(member => isPlainObject(member) && typeof member.id === "string")
        .map(member => [member.id, member])
    );

    const merged = defaultParty.map(member => mergeDefaults(member, candidatesById.get(member.id)));
    for (const member of candidateParty) {
      if (isPlainObject(member) && typeof member.id === "string" && !defaultsById.has(member.id)) {
        merged.push(clone(member));
      }
    }
    return merged;
  }

  function mergeQuests(defaultQuests, candidateQuests, warnings) {
    if (!isPlainObject(candidateQuests)) {
      warnings.push("Quest state was missing or invalid and was restored to safe defaults.");
      return clone(defaultQuests);
    }

    const merged = clone(defaultQuests);
    for (const [id, quest] of Object.entries(candidateQuests)) {
      merged[id] = id in defaultQuests ? mergeDefaults(defaultQuests[id], quest) : clone(quest);
    }
    return merged;
  }

  function normalizeCampaign(candidate, defaults) {
    if (!isPlainObject(candidate)) {
      throw new SaveError("SAVE_STATE_INVALID", "The saved campaign is not a valid Lantern Road state object.");
    }
    if (!isPlainObject(defaults)) {
      throw new SaveError("SAVE_DEFAULTS_INVALID", "Save migration defaults are unavailable.");
    }

    const warnings = [];
    const normalized = mergeDefaults(defaults, candidate);

    normalized.seed = numberOr(candidate.seed, defaults.seed, warnings, "Campaign seed", { integer: true, min: 1 });
    normalized.rngState = numberOr(candidate.rngState, normalized.seed, warnings, "Random state", { integer: true, min: 1 });
    normalized.day = numberOr(candidate.day, defaults.day, warnings, "Campaign day", { integer: true, min: 1 });
    normalized.hour = numberOr(candidate.hour, defaults.hour, warnings, "Campaign hour", { min: 0, max: 23 });
    normalized.gold = numberOr(candidate.gold, defaults.gold, warnings, "Gold", { integer: true, min: 0 });
    normalized.renown = numberOr(candidate.renown, defaults.renown, warnings, "Renown", { integer: true, min: 0 });
    normalized.fatigue = numberOr(candidate.fatigue, defaults.fatigue, warnings, "Fatigue", { integer: true, min: 0 });

    if (!isPlainObject(candidate.position) || !Number.isFinite(Number(candidate.position.q)) || !Number.isFinite(Number(candidate.position.r))) {
      warnings.push("Map position was missing or invalid and was restored to the starting location.");
      normalized.position = clone(defaults.position);
    } else {
      normalized.position = {
        q: Math.trunc(Number(candidate.position.q)),
        r: Math.trunc(Number(candidate.position.r))
      };
    }

    for (const key of ["discoveredHexes", "discoveredSites", "inventory", "factions", "worldFlags"]) {
      if (!isPlainObject(candidate[key])) {
        warnings.push(`${key} was missing or invalid and was repaired.`);
        normalized[key] = clone(defaults[key]);
      }
    }

    if (!Array.isArray(candidate.knownRumours)) {
      warnings.push("Known rumours were missing or invalid and were repaired.");
      normalized.knownRumours = clone(defaults.knownRumours);
    }
    if (!Array.isArray(candidate.logs)) {
      warnings.push("Campaign log was missing or invalid and was repaired.");
      normalized.logs = clone(defaults.logs);
    }

    normalized.quests = mergeQuests(defaults.quests, candidate.quests, warnings);
    normalized.party = mergeParty(defaults.party, candidate.party, warnings);

    if (!isPlainObject(candidate.characterState)) {
      warnings.push("Character memories and relationships were missing and were initialized safely.");
      normalized.characterState = clone(defaults.characterState);
    } else {
      normalized.characterState = mergeDefaults(defaults.characterState, candidate.characterState);
    }

    if (!isPlainObject(candidate.ui)) {
      warnings.push("UI state was missing or invalid and was reset safely.");
      normalized.ui = clone(defaults.ui);
    } else {
      normalized.ui = mergeDefaults(defaults.ui, candidate.ui);
    }

    if (candidate.activeScene !== null && !isPlainObject(candidate.activeScene)) {
      warnings.push("An invalid active scene was discarded.");
      normalized.activeScene = null;
    }
    if (candidate.combat !== null && !isPlainObject(candidate.combat)) {
      warnings.push("An invalid combat state was discarded.");
      normalized.combat = null;
    }

    if (typeof normalized.weather !== "string" || !normalized.weather) normalized.weather = defaults.weather;
    if (typeof normalized.lastSettlement !== "string" || !normalized.lastSettlement) normalized.lastSettlement = defaults.lastSettlement;

    return { state: normalized, warnings };
  }

  function parse(raw) {
    if (typeof raw !== "string" || !raw.trim()) {
      throw new SaveError("SAVE_EMPTY", "The saved campaign is empty.");
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new SaveError("SAVE_PARSE_FAILED", "The saved campaign is not valid JSON.");
    }

    if (!isPlainObject(parsed)) {
      throw new SaveError("SAVE_STATE_INVALID", "The saved campaign has an invalid top-level format.");
    }

    if (Object.prototype.hasOwnProperty.call(parsed, "schemaVersion")) {
      if (!Number.isInteger(parsed.schemaVersion) || parsed.schemaVersion < 1) {
        throw new SaveError("SAVE_SCHEMA_INVALID", "The saved campaign has an invalid schema version.");
      }
      if (parsed.schemaVersion > CURRENT_SCHEMA_VERSION) {
        throw new SaveError("SAVE_VERSION_NEWER", "This save was created by a newer Lantern Road version.");
      }
      if (!isPlainObject(parsed.state)) {
        throw new SaveError("SAVE_STATE_INVALID", "The versioned save does not contain a valid campaign state.");
      }
      return {
        sourceVersion: parsed.schemaVersion,
        state: parsed.state,
        metadata: {
          gameVersion: typeof parsed.gameVersion === "string" ? parsed.gameVersion : null,
          savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : null
        }
      };
    }

    return {
      sourceVersion: LEGACY_UNVERSIONED_SCHEMA,
      state: parsed,
      metadata: { gameVersion: null, savedAt: null }
    };
  }

  function migrate(parsed) {
    let version = parsed.sourceVersion;
    let campaign = clone(parsed.state);
    const migrations = [];

    if (version === 1) {
      migrations.push("v1-unversioned-to-v2-envelope");
      version = 2;
    }

    if (version !== CURRENT_SCHEMA_VERSION) {
      throw new SaveError("SAVE_MIGRATION_MISSING", `No migration path exists from save schema ${parsed.sourceVersion}.`);
    }

    return { version, campaign, migrations };
  }

  function decode(raw, defaults) {
    const parsed = parse(raw);
    const migrated = migrate(parsed);
    const normalized = normalizeCampaign(migrated.campaign, defaults);
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      sourceVersion: parsed.sourceVersion,
      migrated: parsed.sourceVersion !== CURRENT_SCHEMA_VERSION || migrated.migrations.length > 0,
      migrations: migrated.migrations,
      warnings: normalized.warnings,
      metadata: parsed.metadata,
      state: normalized.state
    };
  }

  function encode(state, options = {}) {
    if (!isPlainObject(state)) {
      throw new SaveError("SAVE_STATE_INVALID", "Cannot save an invalid campaign state.");
    }
    const envelope = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      gameVersion: typeof options.gameVersion === "string" ? options.gameVersion : null,
      savedAt: typeof options.savedAt === "string" ? options.savedAt : new Date().toISOString(),
      state: clone(state)
    };
    return JSON.stringify(envelope);
  }

  return {
    CURRENT_SCHEMA_VERSION,
    LEGACY_UNVERSIONED_SCHEMA,
    SaveError,
    decode,
    encode,
    normalizeCampaign
  };
});
