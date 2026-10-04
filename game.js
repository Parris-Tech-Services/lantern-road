
(() => {
  "use strict";

  const C = window.CONTENT;
  const TILE_MAP = {};
  const SITE_MAP = Object.fromEntries(C.sites.map(s => [s.id, s]));
  const SETTLEMENT_MAP = Object.fromEntries(C.settlements.map(s => [s.id, s]));
  const NPC_MAP = Object.fromEntries(C.npcs.map(n => [n.id, n]));
  const ITEM_MAP = Object.fromEntries(C.items.map(i => [i.id, i]));
  const QUEST_MAP = Object.fromEntries(C.quests.map(q => [q.id, q]));
  const FACTION_MAP = Object.fromEntries(C.factions.map(f => [f.id, f]));
  const EVENT_MAP = Object.fromEntries(C.travelEvents.map(e => [e.id, e]));
  const CAMP_EVENT_MAP = Object.fromEntries(C.campEvents.map(e => [e.id, e]));
  const ENCOUNTER_MAP = Object.fromEntries(C.encounters.map(e => [e.id, e]));
  const ENEMY_MAP = Object.fromEntries(C.enemyArchetypes.map(e => [e.id, e]));
  const RUMOUR_MAP = Object.fromEntries(C.rumours.map(r => [r.id, r]));
  const INJURY_MAP = Object.fromEntries((C.injuries || []).map(i => [i.id, i]));
  C.region.tiles.forEach(t => TILE_MAP[`${t.q},${t.r}`] = t);

  // Keep the historical storage key so existing installs can discover and migrate raw v1 saves.
  const SAVE_KEY = "lantern-road-save-v1";
  const LEGACY_BACKUP_KEY = "lantern-road-save-v1-backup";
  const SaveSystem = window.LanternRoadSave;
  if (!SaveSystem) throw new Error("Lantern Road save system failed to load.");
  const dom = {
    statusStrip: document.getElementById("statusStrip"),
    tabContent: document.getElementById("tabContent"),
    modalRoot: document.getElementById("modalRoot"),
    feedbackRoot: document.getElementById("feedbackRoot"),
    mapCanvas: document.getElementById("mapCanvas"),
    tabs: Array.from(document.querySelectorAll(".tab")),
    newGameBtn: document.getElementById("newGameBtn"),
    saveBtn: document.getElementById("saveBtn"),
    loadBtn: document.getElementById("loadBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    soundToggleBtn: document.getElementById("soundToggleBtn"),
    ambienceToggleBtn: document.getElementById("ambienceToggleBtn"),
    volumeSlider: document.getElementById("volumeSlider"),
    campBtn: document.getElementById("campBtn"),
    focusHereBtn: document.getElementById("focusHereBtn"),
    mapHint: document.getElementById("mapHint")
  };
  const ctx = dom.mapCanvas.getContext("2d");
  let state = null;
  let hexLayout = [];
  let feedbackTimer = null;
  let visualFxTimer = null;

  const ART_GLYPHS = {
    settlement: "◆",
    site: "✦",
    enemy: "⚔",
    item: "◇"
  };

  function artSlot(kind, id, label, wide = false) {
    const safeLabel = String(label || id || "").replace(/[<>&"]/g, "");
    const glyph = ART_GLYPHS[kind] || safeLabel.trim().charAt(0).toUpperCase() || "•";
    return `
      <div class="art-slot art-${kind} ${wide ? "art-wide" : ""}" data-art-kind="${kind}" data-art-id="${id}" role="img" aria-label="${safeLabel}">
        <span class="art-sigil" aria-hidden="true">${glyph}</span>
        <span class="art-caption">${safeLabel}</span>
      </div>
    `;
  }

  const AUDIO_PREF_KEY = "lantern-road-audio-v1";
  const AUDIO_DEFAULTS = { enabled: false, ambience: true, volume: 0.28 };
  let audioPrefs = loadAudioPrefs();
  let audioCtx = null;
  let audioMaster = null;
  let audioUnlocked = false;
  let ambienceNodes = [];
  let activeAmbienceKey = "";

  function loadAudioPrefs() {
    try {
      const saved = JSON.parse(localStorage.getItem(AUDIO_PREF_KEY) || "null");
      if (!saved || typeof saved !== "object") return { ...AUDIO_DEFAULTS };
      return {
        enabled: saved.enabled === true,
        ambience: saved.ambience !== false,
        volume: Math.max(0, Math.min(1, Number.isFinite(Number(saved.volume)) ? Number(saved.volume) : AUDIO_DEFAULTS.volume))
      };
    } catch {
      return { ...AUDIO_DEFAULTS };
    }
  }

  function saveAudioPrefs() {
    try {
      localStorage.setItem(AUDIO_PREF_KEY, JSON.stringify(audioPrefs));
    } catch {
      // Audio preferences are non-critical; the game remains playable if storage is blocked.
    }
  }

  function audioSupported() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  function updateAudioControls() {
    const supported = audioSupported();
    if (dom.soundToggleBtn) {
      dom.soundToggleBtn.disabled = !supported;
      dom.soundToggleBtn.textContent = supported ? `Sound: ${audioPrefs.enabled ? "On" : "Off"}` : "Sound unavailable";
      dom.soundToggleBtn.setAttribute("aria-pressed", String(audioPrefs.enabled && supported));
      dom.soundToggleBtn.title = audioPrefs.enabled && !audioUnlocked
        ? "Sound starts after a user gesture because browsers block autoplay."
        : "Toggle Lantern Road sound.";
    }
    if (dom.ambienceToggleBtn) {
      dom.ambienceToggleBtn.disabled = !supported || !audioPrefs.enabled;
      dom.ambienceToggleBtn.textContent = `Ambience: ${audioPrefs.ambience ? "On" : "Off"}`;
      dom.ambienceToggleBtn.setAttribute("aria-pressed", String(audioPrefs.ambience));
    }
    if (dom.volumeSlider) {
      dom.volumeSlider.disabled = !supported || !audioPrefs.enabled;
      dom.volumeSlider.value = String(audioPrefs.volume);
    }
  }

  function applyMasterVolume() {
    if (!audioCtx || !audioMaster) return;
    const target = audioPrefs.enabled ? audioPrefs.volume : 0;
    const now = audioCtx.currentTime;
    audioMaster.gain.cancelScheduledValues(now);
    audioMaster.gain.setTargetAtTime(target, now, 0.025);
  }

  async function unlockAudio() {
    if (!audioPrefs.enabled || !audioSupported()) return false;
    try {
      if (!audioCtx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioCtor();
        audioMaster = audioCtx.createGain();
        audioMaster.gain.value = audioPrefs.volume;
        audioMaster.connect(audioCtx.destination);
      }
      if (audioCtx.state === "suspended") await audioCtx.resume();
      audioUnlocked = audioCtx.state === "running";
      applyMasterVolume();
      updateAudioControls();
      if (audioUnlocked) refreshAmbience(true);
      return audioUnlocked;
    } catch (err) {
      console.warn("Lantern Road audio could not start.", err);
      audioUnlocked = false;
      return false;
    }
  }

  function stopAmbience() {
    ambienceNodes.forEach(node => {
      try { if (typeof node.stop === "function") node.stop(); } catch {}
      try { if (typeof node.disconnect === "function") node.disconnect(); } catch {}
    });
    ambienceNodes = [];
    activeAmbienceKey = "";
  }

  function addNoiseLayer({ gain = 0.01, frequency = 1000, type = "lowpass", q = 0.6 } = {}) {
    if (!audioCtx || !audioMaster) return;
    const seconds = 1.5;
    const buffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * seconds), audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const source = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const layerGain = audioCtx.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    layerGain.gain.value = gain;
    source.connect(filter);
    filter.connect(layerGain);
    layerGain.connect(audioMaster);
    source.start();
    ambienceNodes.push(source, filter, layerGain);
  }

  function addDroneLayer(frequency, gain = 0.004, type = "sine", detune = 0) {
    if (!audioCtx || !audioMaster) return;
    const osc = audioCtx.createOscillator();
    const layerGain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    layerGain.gain.value = gain;
    osc.connect(layerGain);
    layerGain.connect(audioMaster);
    osc.start();
    ambienceNodes.push(osc, layerGain);
  }

  function getAmbienceProfile() {
    if (!state) return { key: "none", weather: "clear", place: "road" };
    const tile = currentTile();
    const loc = currentLocation();
    let place = `terrain:${tile?.terrain || "plains"}`;
    if (state.combat) {
      place = "combat";
    } else if (loc?.type === "settlement") {
      place = "settlement";
    } else if (loc?.type === "site") {
      const id = String(loc.data.id || "");
      if (tile?.terrain === "swamp" || id.includes("marsh")) place = "swamp-site";
      else if (/saint|chapel|shrine|reliquary/.test(id)) place = "sacred-site";
      else place = "ruin-site";
    }
    return { key: `${state.weather}|${place}`, weather: state.weather, place };
  }

  function startAmbience(profile) {
    if (!audioCtx || !audioMaster || !audioPrefs.enabled || !audioPrefs.ambience) return;

    if (profile.weather === "drizzle") {
      addNoiseLayer({ gain: 0.018, frequency: 2600, type: "lowpass", q: 0.35 });
    } else if (profile.weather === "wind") {
      addNoiseLayer({ gain: 0.017, frequency: 520, type: "bandpass", q: 0.55 });
      addDroneLayer(88, 0.003, "sine", -7);
    } else if (profile.weather === "storm") {
      addNoiseLayer({ gain: 0.032, frequency: 700, type: "lowpass", q: 0.45 });
      addDroneLayer(48, 0.006, "triangle", -10);
    }

    if (profile.place === "settlement") {
      addDroneLayer(110, 0.0055, "triangle");
      addDroneLayer(164.81, 0.0024, "sine", 4);
    } else if (profile.place === "swamp-site" || profile.place === "terrain:swamp") {
      addDroneLayer(73.42, 0.004, "sine", -9);
      addNoiseLayer({ gain: 0.006, frequency: 920, type: "bandpass", q: 0.8 });
    } else if (profile.place === "sacred-site") {
      addDroneLayer(196, 0.0035, "sine");
      addDroneLayer(293.66, 0.0018, "sine", 3);
    } else if (profile.place === "ruin-site") {
      addDroneLayer(82.41, 0.004, "triangle", -12);
    } else if (profile.place === "terrain:forest") {
      addNoiseLayer({ gain: 0.005, frequency: 1500, type: "lowpass", q: 0.4 });
    } else if (profile.place === "terrain:mountain" || profile.place === "terrain:hills") {
      addDroneLayer(92.5, 0.0028, "sine", -6);
    } else if (profile.place === "combat") {
      addDroneLayer(55, 0.0045, "triangle", -8);
    }
  }

  function refreshAmbience(force = false) {
    if (!audioUnlocked || !audioCtx || !audioPrefs.enabled || !audioPrefs.ambience) {
      if (ambienceNodes.length) stopAmbience();
      return;
    }
    const profile = getAmbienceProfile();
    if (!force && profile.key === activeAmbienceKey) return;
    stopAmbience();
    activeAmbienceKey = profile.key;
    startAmbience(profile);
  }

  function playTone({ frequency, endFrequency = null, duration = 0.08, gain = 0.06, type = "sine", delay = 0 } = {}) {
    if (!audioUnlocked || !audioCtx || !audioMaster || !audioPrefs.enabled || audioCtx.state !== "running") return;
    const osc = audioCtx.createOscillator();
    const cueGain = audioCtx.createGain();
    const start = audioCtx.currentTime + delay;
    const end = start + duration;
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), end);
    cueGain.gain.setValueAtTime(0.0001, start);
    cueGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + Math.min(0.018, duration * 0.3));
    cueGain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(cueGain);
    cueGain.connect(audioMaster);
    osc.start(start);
    osc.stop(end + 0.02);
  }

  function playCue(name) {
    if (!audioPrefs.enabled) return;
    switch (name) {
      case "ui":
        playTone({ frequency: 460, endFrequency: 420, duration: 0.045, gain: 0.028, type: "triangle" });
        break;
      case "travel":
        playTone({ frequency: 230, endFrequency: 320, duration: 0.11, gain: 0.038, type: "triangle" });
        break;
      case "hit":
        playTone({ frequency: 135, endFrequency: 76, duration: 0.09, gain: 0.075, type: "sawtooth" });
        break;
      case "heal":
        playTone({ frequency: 392, endFrequency: 587, duration: 0.15, gain: 0.052, type: "sine" });
        break;
      case "status":
        playTone({ frequency: 520, endFrequency: 650, duration: 0.09, gain: 0.036, type: "triangle" });
        break;
      case "combat":
        playTone({ frequency: 96, endFrequency: 72, duration: 0.16, gain: 0.065, type: "triangle" });
        break;
      case "victory":
        playTone({ frequency: 392, endFrequency: 523.25, duration: 0.15, gain: 0.045, type: "sine" });
        playTone({ frequency: 523.25, endFrequency: 659.25, duration: 0.18, gain: 0.04, type: "sine", delay: 0.12 });
        break;
      case "defeat":
        playTone({ frequency: 196, endFrequency: 98, duration: 0.28, gain: 0.052, type: "triangle" });
        break;
    }
  }

  async function toggleSound() {
    audioPrefs.enabled = !audioPrefs.enabled;
    saveAudioPrefs();
    updateAudioControls();
    if (!audioPrefs.enabled) {
      stopAmbience();
      applyMasterVolume();
      showFeedback("Sound off", "Lantern Road is quiet. Your setting is saved.");
      return;
    }
    const started = await unlockAudio();
    if (!started) {
      audioPrefs.enabled = false;
      saveAudioPrefs();
      updateAudioControls();
      showFeedback("Sound unavailable", "This browser would not start audio.", "bad");
      return;
    }
    playCue("status");
    showFeedback("Sound on", audioPrefs.ambience ? "Ambient sound and restrained action cues are enabled." : "Action cues are enabled; ambience remains off.", "good");
  }

  async function toggleAmbience() {
    if (!audioPrefs.enabled) return;
    audioPrefs.ambience = !audioPrefs.ambience;
    saveAudioPrefs();
    updateAudioControls();
    if (audioPrefs.ambience) {
      await unlockAudio();
      refreshAmbience(true);
      playCue("status");
      showFeedback("Ambience on", "Weather and location atmosphere will follow the party.", "good");
    } else {
      stopAmbience();
      showFeedback("Ambience off", "Action cues remain on, but continuous atmosphere is muted.");
    }
  }

  function setAudioVolume(value) {
    audioPrefs.volume = Math.max(0, Math.min(1, Number(value) || 0));
    saveAudioPrefs();
    applyMasterVolume();
    updateAudioControls();
  }

  function resumeSavedAudioFromGesture() {
    if (audioPrefs.enabled && !audioUnlocked) void unlockAudio();
  }

  function signalVisualEffect(type) {
    playCue(type);
    const root = document.getElementById("app");
    if (!root || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const classes = ["fx-hit", "fx-heal", "fx-status", "fx-travel"];
    classes.forEach(name => root.classList.remove(name));
    void root.offsetWidth;
    root.classList.add(`fx-${type}`);
    if (visualFxTimer) clearTimeout(visualFxTimer);
    visualFxTimer = setTimeout(() => root.classList.remove(`fx-${type}`), type === "travel" ? 520 : 360);
  }

  function showFeedback(title, text = "", tone = "") {
    if (!dom.feedbackRoot) return;
    if (feedbackTimer) clearTimeout(feedbackTimer);
    dom.feedbackRoot.innerHTML = `
      <div class="feedback-card ${tone}">
        <strong>${title}</strong>
        ${text ? `<span>${text}</span>` : ""}
      </div>
    `;
    dom.feedbackRoot.classList.add("visible");
    feedbackTimer = setTimeout(() => {
      dom.feedbackRoot.classList.remove("visible");
      dom.feedbackRoot.innerHTML = "";
    }, 3400);
  }

  function hasBlockingFeedback() {
    return !!(state && (state.combat || state.activeScene || state.ui?.dialogue || state.ui?.shop));
  }

  function tileKey(q, r) {
    return `${q},${r}`;
  }

  function getTile(q, r) {
    return TILE_MAP[tileKey(q, r)];
  }

  function rand() {
    state.rngState ^= state.rngState << 13;
    state.rngState ^= state.rngState >>> 17;
    state.rngState ^= state.rngState << 5;
    return ((state.rngState >>> 0) / 4294967296);
  }

  function randInt(min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function offsetToCube(q, r) {
    const x = q - (r - (r & 1)) / 2;
    const z = r;
    const y = -x - z;
    return { x, y, z };
  }

  function hexDistance(a, b) {
    const ac = offsetToCube(a.q, a.r);
    const bc = offsetToCube(b.q, b.r);
    return Math.max(Math.abs(ac.x - bc.x), Math.abs(ac.y - bc.y), Math.abs(ac.z - bc.z));
  }

  function neighbours(q, r) {
    const odd = r & 1;
    const dirs = odd
      ? [[1, 0], [1, -1], [0, -1], [-1, 0], [0, 1], [1, 1]]
      : [[1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
    return dirs
      .map(([dq, dr]) => ({ q: q + dq, r: r + dr }))
      .filter(p => p.q >= 0 && p.r >= 0 && p.q < C.region.width && p.r < C.region.height);
  }

  function getTerrainDef(tile) {
    return C.terrainDefs[tile.terrain];
  }

  function currentTile() {
    return getTile(state.position.q, state.position.r);
  }

  function currentLocation() {
    return getLocationAt(state.position.q, state.position.r, true);
  }

  function getLocationAt(q, r, includeHiddenIfCurrent = false) {
    const settlement = C.settlements.find(s => s.q === q && s.r === r);
    if (settlement) return { type: "settlement", data: settlement };
    const site = C.sites.find(s => s.q === q && s.r === r && (state.discoveredSites[s.id] || (!s.hidden && includeHiddenIfCurrent)));
    if (site) return { type: "site", data: site };
    return null;
  }

  function revealAround(q, r) {
    state.discoveredHexes[tileKey(q, r)] = true;
    neighbours(q, r).forEach(n => {
      state.discoveredHexes[tileKey(n.q, n.r)] = true;
    });
    C.settlements.forEach(s => {
      if (hexDistance({ q, r }, s) <= 1) state.discoveredSites[s.id] = true;
    });
    C.sites.forEach(s => {
      if (!s.hidden && hexDistance({ q, r }, s) <= 1) {
        if (!state.discoveredSites[s.id]) {
          state.discoveredSites[s.id] = true;
          if (s.discoverRumour) discoverRumour(s.discoverRumour, false);
          addLog(`You mark ${s.name} on the party map.`);
        }
      }
      if (s.hidden && state.worldFlags[`reveal_${s.id}`]) {
        state.discoveredSites[s.id] = true;
      }
    });
  }

  function addLog(text) {
    state.logs.unshift(`Day ${state.day}, ${formatHour(state.hour)} — ${text}`);
    state.logs = state.logs.slice(0, 80);
  }

  function formatHour(hour) {
    const h = ((hour % 24) + 24) % 24;
    const suffix = h >= 12 ? "pm" : "am";
    const base = h % 12 === 0 ? 12 : h % 12;
    return `${base}${suffix}`;
  }

  function timeLabel() {
    return `Day ${state.day}, ${formatHour(state.hour)}`;
  }

  function getItemQty(id) {
    return (state.inventory[id] || 0);
  }

  function hasItem(id, qty = 1) {
    return getItemQty(id) >= qty;
  }

  function changeItem(id, qty, logIt = true) {
    const before = getItemQty(id);
    let after = before + qty;
    if (after < 0) after = 0;
    state.inventory[id] = after;
    if (after === 0) {
      delete state.inventory[id];
      const equipment = state.progression?.equipment;
      if (equipment) {
        const equippedHeroId = Object.keys(equipment).find(heroId => equipment[heroId] === id);
        if (equippedHeroId) {
          equipment[equippedHeroId] = null;
          addLog(`${getPartyBase(equippedHeroId).name} no longer has ${ITEM_MAP[id]?.name || id} equipped.`);
        }
      }
    }
    if (logIt && qty !== 0) {
      const item = ITEM_MAP[id];
      addLog(`${qty > 0 ? "Gained" : "Lost"} ${Math.abs(qty)} × ${item.name}.`);
    }
    clampPartyHp();
  }

  function itemName(id) {
    return ITEM_MAP[id] ? ITEM_MAP[id].name : id;
  }

  function getFactionStanding(id) {
    return state.factions[id] || 0;
  }

  function changeFaction(id, amount) {
    state.factions[id] = Math.max(-5, Math.min(5, (state.factions[id] || 0) + amount));
    addLog(`${FACTION_MAP[id].name} standing ${amount > 0 ? "improved" : "fell"} to ${state.factions[id]}.`);
  }

  function getPartyBase(memberId) {
    return C.party.find(p => p.id === memberId);
  }

  function getPartyMember(memberId) {
    return state.party.find(p => p.id === memberId);
  }

  function ensureCharacterState() {
    if (!state.characterState || typeof state.characterState !== "object") state.characterState = {};
    if (!state.characterState.members || typeof state.characterState.members !== "object") state.characterState.members = {};
    C.party.forEach(member => {
      const current = state.characterState.members[member.id];
      if (!current || typeof current !== "object") {
        state.characterState.members[member.id] = { loyalty: 0, memories: [] };
        return;
      }
      if (!Number.isFinite(current.loyalty)) current.loyalty = 0;
      if (!Array.isArray(current.memories)) current.memories = [];
    });
    if (!state.characterState.relationships || typeof state.characterState.relationships !== "object") {
      state.characterState.relationships = {};
    }
    if (!Array.isArray(state.characterState.seenCampMoments)) state.characterState.seenCampMoments = [];
  }

  function characterState(memberId) {
    ensureCharacterState();
    return state.characterState.members[memberId];
  }

  function relationshipKey(a, b) {
    return [a, b].sort().join("|");
  }

  function changeCharacterLoyalty(memberId, amount) {
    if (!amount) return;
    const member = characterState(memberId);
    member.loyalty = Math.max(-3, Math.min(3, member.loyalty + amount));
    addLog(`${getPartyBase(memberId).name}'s trust ${amount > 0 ? "deepened" : "strained"}.`);
  }

  function addCharacterMemory(memberId, memoryId, text) {
    if (!text) return;
    const member = characterState(memberId);
    const id = memoryId || `memory-${member.memories.length + 1}`;
    if (member.memories.some(memory => memory.id === id)) return;
    member.memories.push({ id, text, day: state.day });
    member.memories = member.memories.slice(-12);
  }

  function hasCharacterMemory(memberId, memoryId) {
    return characterState(memberId).memories.some(memory => memory.id === memoryId);
  }

  function changeRelationship(a, b, amount) {
    if (!amount || a === b) return;
    ensureCharacterState();
    const key = relationshipKey(a, b);
    const before = state.characterState.relationships[key] || 0;
    state.characterState.relationships[key] = Math.max(-3, Math.min(3, before + amount));
  }

  function loyaltyLabel(value) {
    if (value >= 3) return "Deeply loyal";
    if (value >= 2) return "Trusting";
    if (value >= 1) return "Warming";
    if (value <= -3) return "Alienated";
    if (value <= -2) return "Strained";
    if (value <= -1) return "Wary";
    return "Steady";
  }

  function relationshipLabel(value) {
    if (value >= 3) return "Close";
    if (value >= 2) return "Strong trust";
    if (value >= 1) return "Growing trust";
    if (value <= -3) return "Rivals";
    if (value <= -2) return "Sharp friction";
    if (value <= -1) return "Friction";
    return "Unproven";
  }

  function personalArcReady(memberId) {
    const base = getPartyBase(memberId);
    const unlock = base.personalArc?.unlock;
    if (!unlock) return false;
    if (Number.isFinite(unlock.minLoyalty) && characterState(memberId).loyalty < unlock.minLoyalty) return false;
    if (unlock.memory && !hasCharacterMemory(memberId, unlock.memory)) return false;
    return true;
  }

  function getEligibleCharacterCampMoments() {
    ensureCharacterState();
    return (C.characterCampMoments || []).filter(moment => {
      if (state.characterState.seenCampMoments.includes(moment.id)) return false;
      if (moment.minDay && state.day < moment.minDay) return false;
      if (moment.maxDay && state.day > moment.maxDay) return false;
      if (moment.minLoyalty) {
        for (const [memberId, minimum] of Object.entries(moment.minLoyalty)) {
          if (characterState(memberId).loyalty < minimum) return false;
        }
      }
      if (moment.requiresMemory && !hasCharacterMemory(moment.character, moment.requiresMemory)) return false;
      if (moment.requiresDecision && !state.worldFlags[`characterDecision:${moment.requiresDecision}`]) return false;
      if (moment.requiresAnyDecision && !moment.requiresAnyDecision.some(id => state.worldFlags[`characterDecision:${id}`])) return false;
      return true;
    });
  }

  function openCharacterCampMoment(moment) {
    openDialogue({
      title: moment.title,
      text: moment.text,
      choices: moment.choices.map((choice, index) => ({
        key: `characterMoment:${moment.id}:${index}`,
        label: choice.label
      }))
    });
  }

  function resolveCharacterCampMoment(momentId, choiceIndex) {
    ensureCharacterState();
    const moment = (C.characterCampMoments || []).find(entry => entry.id === momentId);
    const choice = moment?.choices?.[choiceIndex];
    if (!moment || !choice) {
      closeDialogue();
      return;
    }
    if (!state.characterState.seenCampMoments.includes(moment.id)) {
      state.characterState.seenCampMoments.push(moment.id);
    }
    Object.entries(choice.loyalty || {}).forEach(([memberId, amount]) => changeCharacterLoyalty(memberId, amount));
    Object.entries(choice.memories || {}).forEach(([memberId, text]) => {
      const memoryId = choice.addMemoryIds?.[memberId] || `${moment.id}:${memberId}`;
      addCharacterMemory(memberId, memoryId, text);
    });
    (choice.bonds || []).forEach(([a, b, amount]) => changeRelationship(a, b, amount));
    addLog(`Camp conversation: ${moment.title}.`);
    closeDialogue();
    openMessage(choice.resultTitle || moment.title, choice.resultText || "The conversation settles into the firelight.");
    renderAll();
  }

  function reactToDecision(decisionId) {
    ensureCharacterState();
    const flag = `characterDecision:${decisionId}`;
    if (state.worldFlags[flag]) return;
    const reaction = C.characterDecisionReactions?.[decisionId];
    if (!reaction) return;
    state.worldFlags[flag] = true;
    Object.entries(reaction.loyalty || {}).forEach(([memberId, amount]) => changeCharacterLoyalty(memberId, amount));
    Object.entries(reaction.memories || {}).forEach(([memberId, text]) => {
      addCharacterMemory(memberId, `decision:${decisionId}`, text);
    });
    (reaction.bonds || []).forEach(([a, b, amount]) => changeRelationship(a, b, amount));
    const lines = (reaction.reactions || []).map(entry => `${getPartyBase(entry.member).name}: ${entry.text}`);
    if (lines.length && state.ui?.dialogue) {
      state.ui.dialogue.text += `\n\nParty reaction\n${lines.join("\n\n")}`;
      renderModal();
    } else if (lines.length) {
      showFeedback("Party reaction", lines[0]);
    }
  }

  function ensureProgressionState() {
    const previousProgression = state.progression;
    const migrateLegacyEquipment = !previousProgression
      || typeof previousProgression !== "object"
      || !previousProgression.equipment
      || typeof previousProgression.equipment !== "object";

    if (!state.progression || typeof state.progression !== "object") state.progression = {};
    if (!state.progression.builds || typeof state.progression.builds !== "object") state.progression.builds = {};
    if (!state.progression.equipment || typeof state.progression.equipment !== "object") state.progression.equipment = {};
    if (!state.progression.injuries || typeof state.progression.injuries !== "object") state.progression.injuries = {};

    const legacyGear = {
      garrick: "mail_patch",
      mira: "trail_charms",
      oren: "keen_lens",
      brindle: "healer_satchel"
    };

    C.party.forEach(hero => {
      if (!(hero.id in state.progression.builds)) state.progression.builds[hero.id] = null;
      if (!(hero.id in state.progression.equipment)) state.progression.equipment[hero.id] = null;
      if (!(hero.id in state.progression.injuries)) state.progression.injuries[hero.id] = null;

      const injury = state.progression.injuries[hero.id];
      if (typeof injury === "string") {
        const def = INJURY_MAP[injury];
        state.progression.injuries[hero.id] = {
          id: injury,
          restRemaining: def?.restNights || 2
        };
      }

      const equipped = state.progression.equipment[hero.id];
      if (equipped && (!hasItem(equipped) || ITEM_MAP[equipped]?.hero !== hero.id)) {
        state.progression.equipment[hero.id] = null;
      }
      if (migrateLegacyEquipment && !state.progression.equipment[hero.id] && hasItem(legacyGear[hero.id])) {
        state.progression.equipment[hero.id] = legacyGear[hero.id];
      }
    });
  }

  function getBuildChoice(memberId) {
    const id = state.progression?.builds?.[memberId];
    return C.heroBuilds?.[memberId]?.choices?.find(choice => choice.id === id) || null;
  }

  function getEquippedItem(memberId) {
    const itemId = state.progression?.equipment?.[memberId];
    if (!itemId || !hasItem(itemId)) return null;
    const item = ITEM_MAP[itemId];
    return item?.hero === memberId ? item : null;
  }

  function getInjury(memberId) {
    const injury = state.progression?.injuries?.[memberId];
    if (!injury) return null;
    const def = INJURY_MAP[injury.id];
    return def ? { ...injury, def } : null;
  }

  function getBuildEffects(memberId) {
    return getBuildChoice(memberId)?.effects || {};
  }

  function getProgressionEffect(memberId, key) {
    const build = getBuildEffects(memberId);
    const gear = getEquippedItem(memberId);
    return (build[key] || 0) + (gear?.[key] || 0);
  }

  function getProgressionSkillBonus(memberId, skill) {
    const build = getBuildEffects(memberId);
    const gear = getEquippedItem(memberId);
    return (build.skillBonus?.[skill] || 0) + (gear?.skillBonus?.[skill] || 0);
  }

  function getMaxHp(memberId) {
    const base = getPartyBase(memberId).maxHp;
    const injury = getInjury(memberId);
    const maxHpBonus = getProgressionEffect(memberId, "maxHpBonus");
    const injuryPenalty = injury?.def.maxHpPenalty || 0;
    return Math.max(1, base + maxHpBonus - injuryPenalty);
  }

  function clampPartyHp() {
    state.party.forEach(m => {
      const max = getMaxHp(m.id);
      if (m.hp > max) m.hp = max;
      if (m.hp < 0) m.hp = 0;
    });
  }

  function healMember(memberId, amount) {
    const m = getPartyMember(memberId);
    const before = m.hp;
    m.hp = Math.min(getMaxHp(memberId), m.hp + amount);
    if (m.hp > before) signalVisualEffect("heal");
  }

  function healAll(amount) {
    state.party.forEach(m => healMember(m.id, amount));
  }

  function maybeApplyInjury(memberId) {
    ensureProgressionState();
    if (state.progression.injuries[memberId]) return null;
    const pool = C.injuries || [];
    if (!pool.length) return null;
    const def = pickRandom(pool);
    state.progression.injuries[memberId] = {
      id: def.id,
      restRemaining: def.restNights || 2
    };
    const message = `${getPartyBase(memberId).name} suffers ${def.name}.`;
    addLog(message);
    if (state.combat) addCombatLog(message);
    return def;
  }

  function recoverInjuriesAtInn() {
    ensureProgressionState();
    const updates = [];
    C.party.forEach(hero => {
      const injury = state.progression.injuries[hero.id];
      if (!injury) return;
      injury.restRemaining = Math.max(0, (injury.restRemaining || 1) - 1);
      const def = INJURY_MAP[injury.id];
      if (injury.restRemaining <= 0) {
        state.progression.injuries[hero.id] = null;
        updates.push(`${hero.name}'s ${def?.name || "injury"} has healed.`);
      } else {
        updates.push(`${hero.name}'s ${def?.name || "injury"} needs ${injury.restRemaining} more proper rest${injury.restRemaining === 1 ? "" : "s"}.`);
      }
    });
    return updates;
  }

  function damageMember(memberId, amount) {
    const m = getPartyMember(memberId);
    const before = m.hp;
    m.hp = Math.max(0, m.hp - amount);
    if (m.hp < before) signalVisualEffect("hit");
    if (before > 0 && m.hp === 0) maybeApplyInjury(memberId);
  }

  function damageAll(amount) {
    state.party.forEach(m => damageMember(m.id, amount));
  }

  function livingParty() {
    return state.party.filter(m => m.hp > 0);
  }

  function averagePartyHpFraction() {
    const total = state.party.reduce((sum, m) => sum + m.hp, 0);
    const max = state.party.reduce((sum, m) => sum + getMaxHp(m.id), 0);
    return total / max;
  }

  function fatiguePenalty() {
    if (state.fatigue >= 5) return -2;
    if (state.fatigue >= 3) return -1;
    return 0;
  }

  function getSkill(memberId, skill) {
    const base = getPartyBase(memberId).skills[skill] || 0;
    const injury = getInjury(memberId);
    const injuryPenalty = injury?.def.skill === skill ? (injury.def.skillPenalty || 0) : 0;
    return base + getProgressionSkillBonus(memberId, skill) - injuryPenalty + fatiguePenalty();
  }

  function buildUnlockRenown(memberId) {
    return C.heroBuilds?.[memberId]?.unlockRenown ?? 2;
  }

  function chooseBuild(memberId, buildId) {
    ensureProgressionState();
    const hero = getPartyBase(memberId);
    const config = C.heroBuilds?.[memberId];
    const choice = config?.choices?.find(entry => entry.id === buildId);
    if (!choice) {
      showFeedback("Path unavailable", "That path does not exist.", "bad");
      return;
    }
    if (state.progression.builds[memberId]) {
      const existing = getBuildChoice(memberId);
      showFeedback("Path already chosen", `${hero.name} is already committed to ${existing?.name || "a path"}.`);
      return;
    }
    if (state.renown < buildUnlockRenown(memberId)) {
      showFeedback("Path still locked", `Reach ${buildUnlockRenown(memberId)} renown before committing ${hero.name} to a path.`);
      return;
    }

    state.progression.builds[memberId] = buildId;
    clampPartyHp();
    addLog(`${hero.name} commits to the ${choice.name} path.`);
    playCue("ui");
    renderAll();
    showFeedback("Path chosen", `${hero.name}: ${choice.name}. This choice is permanent for this campaign.`, "good");
  }

  function equipGear(itemId) {
    ensureProgressionState();
    const item = ITEM_MAP[itemId];
    if (!item || item.kind !== "gear" || !item.hero) {
      showFeedback("Cannot equip", "That item is not hero equipment.", "bad");
      return;
    }
    if (!hasItem(itemId)) {
      showFeedback("Gear unavailable", `You do not currently carry ${item.name}.`, "bad");
      return;
    }

    const hero = getPartyBase(item.hero);
    if (state.progression.equipment[item.hero] === itemId) {
      showFeedback("Already equipped", `${hero.name} is already using ${item.name}.`);
      return;
    }

    const previous = getEquippedItem(item.hero);
    state.progression.equipment[item.hero] = itemId;
    clampPartyHp();
    addLog(`${hero.name} equips ${item.name}${previous ? `, replacing ${previous.name}` : ""}.`);
    playCue("ui");
    renderAll();
    showFeedback("Gear equipped", `${hero.name} now uses ${item.name}.`, "good");
  }

  function maybeAnnounceBuildUnlock(previousRenown) {
    const thresholds = Object.values(C.heroBuilds || {}).map(entry => entry.unlockRenown ?? 2);
    const threshold = thresholds.length ? Math.min(...thresholds) : Infinity;
    if (previousRenown < threshold && state.renown >= threshold) {
      addLog("Your growing renown has opened permanent hero paths. Choose them in the Party tab.");
      showFeedback("Hero paths unlocked", "Open Party to choose one permanent path for each hero.", "good");
    }
  }

  function rollCheck(actor, skill, dc) {
    const die = randInt(1, 20);
    const mod = getSkill(actor, skill);
    const total = die + mod;
    return {
      die, mod, total, dc,
      success: total >= dc
    };
  }

  function revealQuest(id) {
    const q = state.quests[id];
    if (!q.known) {
      q.known = true;
      q.status = "offered";
      q.stage = "offered";
      addLog(`Quest discovered: ${QUEST_MAP[id].title}.`);
    }
  }

  function acceptQuest(id) {
    const q = state.quests[id];
    q.known = true;
    q.status = "active";
    q.stage = "accepted";
    if (QUEST_MAP[id].deadline && !q.dueDay) {
      q.dueDay = state.day + QUEST_MAP[id].deadline - 1;
    }
    addLog(`Accepted quest: ${QUEST_MAP[id].title}.`);
  }

  function setQuestStage(id, stage) {
    const q = state.quests[id];
    q.known = true;
    if (q.status === "hidden") q.status = "active";
    q.stage = stage;
  }

  function completeQuest(id, outcome) {
    const q = state.quests[id];
    q.known = true;
    q.status = "completed";
    q.stage = "completed";
    q.outcome = outcome || "";
    q.completedDay = state.day;
    const previousRenown = state.renown;
    state.renown += 2;
    maybeAnnounceBuildUnlock(previousRenown);
    addLog(`Completed quest: ${QUEST_MAP[id].title}.`);
  }

  function failQuest(id, reason) {
    const q = state.quests[id];
    if (q.status === "completed" || q.status === "failed") return;
    q.known = true;
    q.status = "failed";
    q.stage = "failed";
    q.outcome = reason || "";
    addLog(`Failed quest: ${QUEST_MAP[id].title}.`);
  }

  function questState(id) {
    return state.quests[id];
  }

  function discoverRumour(id, logIt = true) {
    if (!state.knownRumours.includes(id)) {
      state.knownRumours.push(id);
      if (logIt) addLog(`New rumour: ${RUMOUR_MAP[id].text}`);
    }
  }

  function createInitialState(seedValue = 123456789) {
    const seed = (Number(seedValue) >>> 0) || 123456789;
    return {
      seed,
      rngState: seed,
      day: 1,
      hour: 8,
      weather: "clear",
      gold: 28,
      renown: 0,
      fatigue: 0,
      position: { q: SETTLEMENT_MAP[C.startingLocation].q, r: SETTLEMENT_MAP[C.startingLocation].r },
      discoveredHexes: {},
      discoveredSites: {},
      inventory: { rations: 6, bandage: 2, lantern_oil: 1, rope: 1 },
      factions: { guild: 0, wardens: 0, archive: 0, veil: 0 },
      knownRumours: [...C.startingRumours],
      quests: Object.fromEntries(C.quests.map(q => [q.id, { known: false, status: "hidden", stage: "", outcome: "", dueDay: null }])),
      party: C.party.map(p => ({ id: p.id, hp: p.maxHp, guard: 0, bless: 0 })),
      characterState: {
        members: Object.fromEntries(C.party.map(p => [p.id, { loyalty: 0, memories: [] }])),
        relationships: {},
        seenCampMoments: []
      },
      progression: {
        builds: Object.fromEntries(C.party.map(p => [p.id, null])),
        equipment: Object.fromEntries(C.party.map(p => [p.id, null])),
        injuries: Object.fromEntries(C.party.map(p => [p.id, null]))
      },
      logs: [],
      worldFlags: {},
      activeScene: null,
      combat: null,
      ui: {
        tab: "context",
        focus: { type: "settlement", id: C.startingLocation },
        dialogue: null,
        shop: null
      },
      lastSettlement: C.startingLocation
    };
  }

  function startNewGame() {
    const seed = (Date.now() >>> 0) || 123456789;
    state = createInitialState(seed);
    ensureCharacterState();
    ensureProgressionState();
    revealAround(state.position.q, state.position.r);
    C.settlements.forEach(s => { if (s.id === C.startingLocation) state.discoveredSites[s.id] = true; });
    addLog("You begin in Hearthwick with a little coin, enough food for a few days, and a road full of trouble.");
    renderAll();
    openIntro();
  }

  function openIntro() {
    openDialogue({
      title: "The Grey March",
      text: "Roads join a handful of settlements across the Grey March: trade routes, shrine paths, river crossings, and old ruins half reclaimed by weather and people with reasons to hide.\n\nYour party lives by movement, judgement, and the work you choose to finish. Earn enough renown before the eighteenth day and the March will remember your names.",
      choices: [
        { key: "close", label: "Set out from Hearthwick." }
      ]
    });
  }

  function serializeState() {
    return SaveSystem.encode(state, { gameVersion: C.version });
  }

  function saveGame() {
    if (!state) return;
    try {
      localStorage.setItem(SAVE_KEY, serializeState());
      addLog("Campaign saved.");
      renderAll();
      openMessage("Saved", `Your campaign was saved on this device using save schema v${SaveSystem.CURRENT_SCHEMA_VERSION}.`);
    } catch (err) {
      console.error(err);
      openMessage("Save Failed", "The browser could not store this campaign. Your current run is still open, but this save was not written.");
    }
  }

  function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      openMessage("No Save Found", "There is no saved Lantern Road campaign on this device yet.");
      return;
    }

    try {
      const result = SaveSystem.decode(raw, createInitialState(123456789));

      if (result.migrated) {
        try {
          if (!localStorage.getItem(LEGACY_BACKUP_KEY)) localStorage.setItem(LEGACY_BACKUP_KEY, raw);
        } catch (backupError) {
          console.warn("Lantern Road could not preserve a legacy save backup.", backupError);
        }
      }

      state = result.state;
      ensureCharacterState();
      ensureProgressionState();
      clampPartyHp();

      if (result.migrated || result.warnings.length) {
        try {
          localStorage.setItem(SAVE_KEY, serializeState());
        } catch (upgradeError) {
          console.warn("Lantern Road loaded the campaign but could not persist the upgraded save.", upgradeError);
        }
      }

      renderAll();
      addLog("Campaign loaded.");
      renderAll();

      const loc = currentLocation();
      const locationLabel = loc ? loc.data.name : getTerrainDef(currentTile()).name;
      if (result.migrated) {
        showFeedback(
          "Campaign upgraded",
          `Legacy save schema v${result.sourceVersion} was migrated to v${SaveSystem.CURRENT_SCHEMA_VERSION}. ${timeLabel()} • ${locationLabel}`,
          "good"
        );
      } else if (result.warnings.length) {
        showFeedback(
          "Campaign repaired",
          `${result.warnings.length} invalid or missing save field${result.warnings.length === 1 ? "" : "s"} were restored safely. ${timeLabel()} • ${locationLabel}`,
          "good"
        );
      } else {
        showFeedback("Campaign loaded", `${timeLabel()} • ${locationLabel}`, "good");
      }
    } catch (err) {
      console.error(err);
      if (err && err.code === "SAVE_VERSION_NEWER") {
        openMessage(
          "Save From Newer Version",
          "This campaign was created by a newer Lantern Road save format. It has not been overwritten. Update the game before trying to load it again."
        );
        return;
      }
      openMessage(
        "Load Failed",
        "The saved campaign could not be migrated or repaired safely. The stored save was left untouched so it can be recovered or inspected later."
      );
    }
  }

  function openMessage(title, text) {
    state.ui.dialogue = {
      title,
      text,
      choices: [{ key: "close", label: "Close" }]
    };
    renderModal();
  }

  function openDialogue(dialogue) {
    state.ui.shop = null;
    state.ui.dialogue = dialogue;
    renderModal();
  }

  function closeDialogue() {
    state.ui.dialogue = null;
    renderModal();
  }

  function clearTransientModal() {
    state.ui.dialogue = null;
    state.ui.shop = null;
    renderModal();
  }

  function openScene(scene, source) {
    state.activeScene = {
      sceneId: scene.id,
      source,
      title: scene.title,
      text: scene.text,
      options: scene.options
    };
    renderModal();
  }

  function closeScene() {
    state.activeScene = null;
    renderModal();
  }

  function openShop(settlementId) {
    state.ui.shop = settlementId;
    state.ui.dialogue = null;
    renderModal();
  }

  function closeShop() {
    state.ui.shop = null;
    renderModal();
  }

  function getVisibleRumoursForSettlement(settlementId) {
    const settlement = SETTLEMENT_MAP[settlementId];
    const ids = settlement.npcs.flatMap(id => NPC_MAP[id].rumours || []);
    return [...new Set(ids)];
  }

  function hearRumours(settlementId) {
    const settlement = SETTLEMENT_MAP[settlementId];
    const pool = getVisibleRumoursForSettlement(settlementId).filter(id => !state.knownRumours.includes(id));
    if (!pool.length) {
      addLog("You hear plenty of talk, but nothing truly new.");
      renderAll();
      openMessage("Nothing New", `You listen around ${settlement.name}, but every useful story is one the party has already heard.`);
      return;
    }
    const learned = pool.slice(0, 2);
    learned.forEach(id => discoverRumour(id, false));
    addLog(`You gather ${learned.length} fresh rumour${learned.length > 1 ? "s" : ""} in ${settlement.name}.`);
    renderAll();
    openMessage(
      learned.length > 1 ? "Fresh Rumours" : "Fresh Rumour",
      learned.map(id => `• ${RUMOUR_MAP[id].text}`).join("\n\n")
    );
  }

  function innRest(settlementId) {
    const settlement = SETTLEMENT_MAP[settlementId];
    if (state.gold < settlement.innCost) {
      openMessage("Not Enough Coin", `A room in ${settlement.name} costs ${settlement.innCost} gold.`);
      return;
    }
    const beforeRations = getItemQty("rations");
    state.gold -= settlement.innCost;
    state.fatigue = 0;
    const injuryUpdates = recoverInjuriesAtInn();
    state.party.forEach(m => m.hp = getMaxHp(m.id));
    advanceToMorning();
    state.lastSettlement = settlementId;
    addLog(`You rest properly in ${settlement.name}.`);
    injuryUpdates.forEach(message => addLog(message));
    renderAll();

    const rationUsed = Math.max(0, beforeRations - getItemQty("rations"));
    const injurySummary = injuryUpdates.length ? ` ${injuryUpdates.join(" ")}` : "";
    const summary = `Paid ${settlement.innCost} gold. The party is fully healed, fatigue is cleared, and you wake at ${timeLabel()}.${rationUsed ? ` ${rationUsed} ration was consumed overnight.` : ""}${injurySummary}`;
    if (state.ui.dialogue) {
      showFeedback(`Rested at ${settlement.name}`, summary, "good");
    } else {
      openMessage(`Rested at ${settlement.name}`, summary);
    }
  }

  function advanceToMorning() {
    // If it is already after midnight but before 7am, sleep only until this morning.
    // Otherwise, advance to 7am on the next day.
    const advance = state.hour < 7 ? (7 - state.hour) : (24 - state.hour + 7);
    advanceTime(advance);
  }

  function chooseWeather() {
    const roll = rand();
    if (roll < 0.46) return "clear";
    if (roll < 0.70) return "drizzle";
    if (roll < 0.88) return "wind";
    return "storm";
  }

  function consumeSuppliesForDay() {
    if (hasItem("rations")) {
      changeItem("rations", -1, false);
      addLog("The party consumes one unit of rations for the day.");
    } else {
      damageAll(2);
      state.fatigue = Math.min(6, state.fatigue + 1);
      addLog("With no rations left, the road bites hard. Everyone loses 2 HP.");
    }
  }

  function checkTimedQuests() {
    const med = questState("sealed_medicine");
    if (med.status === "active" && med.dueDay && state.day > med.dueDay) {
      failQuest("sealed_medicine", "too_late");
      changeFaction("guild", -1);
      changeFaction("wardens", -1);
      if (hasItem("sealed_crate")) changeItem("sealed_crate", -1, false);
      openMessage("Too Late", "The medicine crate reached nobody in time. The March will remember the delay.");
    }
  }

  function advanceTime(hours) {
    let remaining = hours;
    while (remaining > 0) {
      state.hour += 1;
      remaining -= 1;
      if (state.hour >= 24) {
        state.hour = 0;
        state.day += 1;
        consumeSuppliesForDay();
        state.weather = chooseWeather();
        checkTimedQuests();
      }
    }
    renderAll();
  }

  function getRoadRiskBonus() {
    return state.worldFlags.roadSafe ? -0.05 : 0;
  }

  function maybeTravelEvent(tile) {
    const terrain = getTerrainDef(tile);
    const weather = C.weatherDefs[state.weather];
    let chance = terrain.risk + weather.risk + (state.fatigue * 0.03) + getRoadRiskBonus();
    if (tile.road) chance -= 0.08;
    chance = Math.max(0.05, chance);
    if (rand() > chance) return false;
    const options = C.travelEvents.filter(e => eventMatches(e, tile));
    if (!options.length) return false;
    openScene(pickRandom(options), "travel");
    return true;
  }

  function eventMatches(event, tile) {
    const c = event.conditions || {};
    if (c.minDay && state.day < c.minDay) return false;
    if (c.roadOnly && !tile.road) return false;
    if (c.terrain && !c.terrain.includes(tile.terrain)) return false;
    if (typeof c.nearSettlement === "boolean") {
      const near = C.settlements.some(s => hexDistance(state.position, s) <= 1);
      if (near !== c.nearSettlement) return false;
    }
    return true;
  }

  function moveTo(q, r) {
    if (!getTile(q, r)) return;
    const isAdjacent = neighbours(state.position.q, state.position.r).some(n => n.q === q && n.r === r);
    if (!isAdjacent) return;
    const tile = getTile(q, r);
    const terrain = getTerrainDef(tile);
    const weather = C.weatherDefs[state.weather];
    const moveHours = Math.max(4, terrain.move - (tile.road ? 2 : 0) + weather.move);
    state.position = { q, r };
    revealAround(q, r);
    state.ui.focus = null;
    advanceTime(moveHours);
    state.fatigue = Math.min(6, state.fatigue + (tile.road ? 0 : 1) + (state.weather === "storm" ? 1 : 0));
    const loc = currentLocation();
    if (loc) {
      state.ui.focus = { type: loc.type, id: loc.data.id };
      if (loc.type === "settlement") state.lastSettlement = loc.data.id;
      addLog(`You arrive at ${loc.data.name}.`);
    } else {
      addLog(`You travel into ${terrain.name.toLowerCase()}.`);
    }
    signalVisualEffect("travel");
    renderAll();
    const eventOpened = (!loc || loc.type !== "settlement") ? maybeTravelEvent(tile) : false;
    if (!eventOpened && !hasBlockingFeedback()) {
      showFeedback(
        loc ? `Arrived: ${loc.data.name}` : `Travelled into ${terrain.name}`,
        `${moveHours} hours pass • ${timeLabel()} • fatigue ${state.fatigue}/6`
      );
    }
  }

  function campParty(extraCalm = false) {
    clearTransientModal();
    const fatigueBefore = state.fatigue;
    const healAmount = extraCalm ? 3 : 2;
    advanceTime(8);
    state.fatigue = Math.max(0, state.fatigue - 2);
    healAll(healAmount);
    if (state.ui.dialogue) {
      renderAll();
      return;
    }
    const pool = C.campEvents;
    const characterMoments = getEligibleCharacterCampMoments();
    const shouldShowCharacterMoment = !extraCalm && characterMoments.length && (
      state.characterState.seenCampMoments.length === 0 || rand() < 0.55
    );
    if (shouldShowCharacterMoment) {
      openCharacterCampMoment(pickRandom(characterMoments));
    } else if (!extraCalm && rand() < 0.35) {
      openScene(pickRandom(pool), "camp");
    } else {
      addLog("The camp passes without serious trouble.");
      renderAll();
      if (!state.ui.dialogue) {
        showFeedback(
          "Camp complete",
          `8 hours pass • party healed up to ${healAmount} HP • fatigue ${fatigueBefore} → ${state.fatigue}`,
          "good"
        );
      }
    }
  }

  function focusCurrentLocation() {
    const loc = currentLocation();
    if (loc) {
      state.ui.focus = { type: loc.type, id: loc.data.id };
      showFeedback("Focused here", loc.data.name);
    } else {
      state.ui.focus = { type: "hex", id: tileKey(state.position.q, state.position.r) };
      showFeedback("Focused here", getTerrainDef(currentTile()).name);
    }
    renderAll();
  }

  function useConsumable(itemId, memberId) {
    if (!hasItem(itemId)) {
      showFeedback("Item unavailable", "You no longer have that item.", "bad");
      return;
    }
    if (itemId === "bandage") {
      const amount = 4 + getProgressionEffect("brindle", "consumableHealBonus");
      const name = getPartyBase(memberId).name;
      const before = getPartyMember(memberId).hp;
      healMember(memberId, amount);
      const healed = getPartyMember(memberId).hp - before;
      changeItem("bandage", -1, false);
      addLog(`You use a bandage on ${name}.`);
      showFeedback("Bandage used", `${name} recovered ${healed} HP.`, "good");
    } else if (itemId === "healing_tonic") {
      const name = getPartyBase(memberId).name;
      const before = getPartyMember(memberId).hp;
      healMember(memberId, 7);
      const healed = getPartyMember(memberId).hp - before;
      changeItem("healing_tonic", -1, false);
      addLog(`A healing tonic steadies ${name}.`);
      showFeedback("Healing tonic used", `${name} recovered ${healed} HP.`, "good");
    } else if (itemId === "ward_salve") {
      const fatigueBefore = state.fatigue;
      healAll(2);
      state.fatigue = Math.max(0, state.fatigue - 1);
      changeItem("ward_salve", -1, false);
      addLog("Ward salve eases sore muscles and road-worn minds.");
      showFeedback("Ward salve used", `Party healed up to 2 HP • fatigue ${fatigueBefore} → ${state.fatigue}`, "good");
    }
    renderAll();
  }

  function buyItem(settlementId, itemId) {
    const item = ITEM_MAP[itemId];
    if (state.gold < item.value) {
      showFeedback("Not enough gold", `${item.name} costs ${item.value} gold.`, "bad");
      return;
    }
    if (!item.stack && hasItem(itemId)) {
      showFeedback("Already owned", `You already carry ${item.name}.`);
      return;
    }
    state.gold -= item.value;
    changeItem(itemId, 1, false);
    addLog(`Bought ${item.name} in ${SETTLEMENT_MAP[settlementId].name}.`);
    renderAll();
    renderModal();
    showFeedback("Purchase complete", `${item.name} • -${item.value} gold • ${state.gold} gold left`, "good");
  }

  function sellItem(itemId) {
    const item = ITEM_MAP[itemId];
    if (!hasItem(itemId)) {
      showFeedback("Nothing to sell", `You no longer carry ${item.name}.`);
      return;
    }
    const equippedHeroId = Object.keys(state.progression?.equipment || {}).find(heroId => state.progression.equipment[heroId] === itemId) || null;
    const price = Math.max(2, Math.floor(item.value * 0.5));
    state.gold += price;
    changeItem(itemId, -1, false);
    addLog(`Sold ${item.name}.`);
    renderAll();
    renderModal();
    const equipmentNote = equippedHeroId ? ` • unequipped from ${getPartyBase(equippedHeroId).name}` : "";
    showFeedback("Sale complete", `${item.name} • +${price} gold • ${state.gold} gold total${equipmentNote}`, "good");
  }

  function applyEffects(effects) {
    if (!effects) return;
    effects.forEach(effect => {
      const [type, a, b, c] = effect;
      switch (type) {
        case "time":
          if (a > 0) advanceTime(a);
          else state.hour = Math.max(0, state.hour + a);
          break;
        case "fatigue":
          state.fatigue = Math.max(0, Math.min(6, state.fatigue + a));
          break;
        case "log":
          addLog(a);
          break;
        case "addGold":
          state.gold = Math.max(0, state.gold + a);
          if (a !== 0) addLog(`${a > 0 ? "Gained" : "Lost"} ${Math.abs(a)} gold.`);
          break;
        case "addItem":
          changeItem(a, b, false);
          break;
        case "discoverRumour":
          discoverRumour(a, true);
          break;
        case "discoverSite":
          state.worldFlags[`reveal_${a}`] = true;
          state.discoveredSites[a] = true;
          addLog(`A new site is marked: ${SITE_MAP[a].name}.`);
          break;
        case "addReputation":
          changeFaction(a, b);
          break;
        case "healAll":
          healAll(a);
          addLog(`The whole party recovers ${a} HP.`);
          break;
        case "damageAll":
          damageAll(a);
          addLog(`The whole party suffers ${a} damage.`);
          break;
        case "openCamp":
          campParty(!!a);
          break;
        case "startCombat":
          startCombat(a, b);
          break;
        case "addRenown": {
          const previousRenown = state.renown;
          state.renown += a;
          maybeAnnounceBuildUnlock(previousRenown);
          addLog(`${a} renown gained.`);
          break;
        }
      }
    });
    clampPartyHp();
    renderAll();
  }

  function resolveSceneOption(index) {
    const scene = state.activeScene;
    if (!scene) return;
    const option = scene.options[index];
    const logBefore = state.logs[0] || "";
    if (!option) return;
    if (option.requiresItem && !hasItem(option.requiresItem)) {
      openMessage("Need Something First", `You need ${itemName(option.requiresItem)} for that.`);
      return;
    }
    if (option.requiresAnyItem && !option.requiresAnyItem.some(id => hasItem(id))) {
      openMessage("Need Something First", "You do not have the right item for that.");
      return;
    }
    closeScene();
    if (option.check) {
      const result = rollCheck(option.check.actor, option.check.skill, option.check.dc);
      addLog(`${getPartyBase(option.check.actor).name} rolled ${result.die} + ${result.mod} = ${result.total} vs DC ${result.dc}.`);
      applyEffects(result.success ? option.check.success : option.check.failure);
      if (option.check.successText || option.check.failureText) {
        openMessage(result.success ? "Success" : "Setback", result.success ? (option.check.successText || "It works.") : (option.check.failureText || "It does not go cleanly."));
      }
    } else {
      applyEffects(option.effects);
    }
    renderAll();
    if (!hasBlockingFeedback()) {
      const newestLog = state.logs[0] || "";
      showFeedback(
        "Choice resolved",
        newestLog && newestLog !== logBefore ? newestLog.replace(/^Day \d+, [^—]+ — /, "") : option.label,
        "good"
      );
    }
  }

  function terrainBadge(tile) {
    const terrain = getTerrainDef(tile);
    return `<span class="tag">${terrain.name}${tile.road ? " • road" : ""}</span>`;
  }

  function renderStatus() {
    const loc = currentLocation();
    const tile = currentTile();
    const locationName = loc ? loc.data.name : getTerrainDef(tile).name;
    const supplies = getItemQty("rations");
    const chips = [
      { label: "Time", value: `${timeLabel()} • ${C.weatherDefs[state.weather].name}` },
      { label: "Location", value: locationName },
      { label: "Resources", value: `${state.gold} gold • ${supplies} rations` },
      { label: "Pressure", value: `Fatigue ${state.fatigue}/6 • Renown ${state.renown}` },
      { label: "Goal", value: `${C.success.renownTarget} renown by day ${C.success.days}` },
      { label: "Party", value: `${livingParty().length}/4 standing • ${Math.round(averagePartyHpFraction()*100)}% health` }
    ];
    dom.statusStrip.innerHTML = chips.map(chip => `
      <div class="stat-chip">
        <div class="label">${chip.label}</div>
        <div class="value">${chip.value}</div>
      </div>
    `).join("");
  }

  function factionDisplay(value) {
    if (value >= 4) return "Trusted";
    if (value >= 2) return "Favoured";
    if (value >= 1) return "Noted";
    if (value <= -4) return "Enemy";
    if (value <= -2) return "Disliked";
    if (value <= -1) return "Wary";
    return "Neutral";
  }


  function isAtLocation(locationId) {
    const settlement = SETTLEMENT_MAP[locationId];
    if (settlement) return settlement.q === state.position.q && settlement.r === state.position.r;
    const site = SITE_MAP[locationId];
    if (site) return site.q === state.position.q && site.r === state.position.r;
    return false;
  }

  function renderContextTab() {
    const focus = state.ui.focus || { type: "hex", id: tileKey(state.position.q, state.position.r) };
    if (focus.type === "settlement") return renderSettlementContext(focus.id);
    if (focus.type === "site") return renderSiteContext(focus.id);
    return renderHexContext();
  }

  function renderHexContext() {
    const tile = currentTile();
    const nearby = neighbours(state.position.q, state.position.r)
      .map(n => getLocationAt(n.q, n.r))
      .filter(Boolean)
      .map(loc => `<span class="tag">${loc.data.name}</span>`)
      .join(" ");
    return `
      <div class="card">
        <h3>On the Road</h3>
        <p>${getTerrainDef(tile).name}. ${tile.road ? "The road improves the pace a little." : "Off-road travel is slower and riskier here."}</p>
        <div class="row">${terrainBadge(tile)} ${tile.river ? '<span class="tag">river</span>' : ''}</div>
        <div class="notice">${nearby || "No marked sites within immediate reach."}</div>
      </div>
      <div class="card">
        <h3>What Next?</h3>
        <div class="choice-list">
          <button data-action="focus-current">Focus current hex</button>
          <button data-action="camp">Make camp here</button>
        </div>
      </div>
    `;
  }

  function renderSettlementContext(settlementId) {
    const s = SETTLEMENT_MAP[settlementId];
    const here = isAtLocation(settlementId);
    return `
      <div class="card location-card">
        ${artSlot("settlement", s.id, s.name, true)}
        <div class="entry-head">
          <div>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
          </div>
          <div class="location-pill">${s.kind}</div>
        </div>
        <div class="row">
          ${s.services.map(service => `<span class="tag">${service}</span>`).join("")}
        </div>
      </div>
      <div class="card">
        <h3>Services</h3>
        ${here ? "" : `<p class="muted">You are viewing this place from the map. Travel there to interact.</p>`}
        <div class="choice-list">
          <button ${here ? "" : "disabled"} data-action="inn-rest" data-settlement="${s.id}">Rest at the inn (${s.innCost} gold)</button>
          <button ${here ? "" : "disabled"} data-action="open-shop" data-settlement="${s.id}">Visit the market</button>
          <button ${here ? "" : "disabled"} data-action="hear-rumours" data-settlement="${s.id}">Hear rumours</button>
        </div>
      </div>
      <div class="card">
        <h3>People</h3>
        ${s.npcs.map(id => {
          const npc = NPC_MAP[id];
          return `
            <div class="npc-entry art-entry">
              ${artSlot("npc", npc.id, npc.name)}
              <div class="art-entry-body">
                <div class="entry-head">
                  <div>
                    <strong>${npc.name}</strong>
                    <div>${npc.role}</div>
                  </div>
                  <span class="tag" style="background:${FACTION_MAP[npc.faction].color}33">${FACTION_MAP[npc.faction].name}</span>
                </div>
                <p>${npc.description}</p>
                <div class="row">
                  <button class="small" ${here ? "" : "disabled"} data-action="talk-npc" data-npc="${npc.id}">Talk</button>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderSiteContext(siteId) {
    const site = SITE_MAP[siteId];
    const actions = getSiteActions(siteId);
    const here = isAtLocation(siteId);
    return `
      <div class="card location-card">
        ${artSlot("site", site.id, site.name, true)}
        <div class="entry-head">
          <div>
            <h3>${site.name}</h3>
            <p>${site.description}</p>
          </div>
          <div class="location-pill">${site.kind}</div>
        </div>
      </div>
      <div class="card">
        <h3>Actions</h3>
        ${here ? "" : `<p class="muted">Travel here before you can act.</p>`}
        <div class="choice-list">
          ${actions.map(a => `<button ${(a.disabled || !here) ? "disabled" : ""} data-action="site-action" data-key="${a.key}">${a.label}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function questStageText(questId) {
    const q = questState(questId);
    if (!q.known) return "";
    const stages = QUEST_MAP[questId].stages;
    const stage = stages.find(s => s.id === q.stage);
    if (q.status === "completed") return q.outcome ? `${stage ? stage.label : ""} (${q.outcome})` : (stage ? stage.label : "Completed");
    if (q.status === "failed") return q.outcome ? `Failed (${q.outcome})` : "Failed";
    return stage ? stage.label : "";
  }

  function renderJournalTab() {
    const questEntries = C.quests.filter(q => state.quests[q.id].known).map(q => {
      const st = state.quests[q.id];
      return `
        <div class="quest-entry">
          <div class="entry-head">
            <div>
              <strong>${q.title}</strong>
              <div>${q.type}</div>
            </div>
            <span class="tag">${st.status}</span>
          </div>
          <p>${q.summary}</p>
          <p><em>${questStageText(q.id)}</em></p>
          ${st.dueDay ? `<p>Due by end of day ${st.dueDay}.</p>` : ""}
        </div>
      `;
    }).join("") || "<p>No quests discovered yet. Talk to people in towns.</p>";

    const rumours = state.knownRumours.map(id => `
      <div class="rumour-entry"><strong>${RUMOUR_MAP[id].text}</strong></div>
    `).join("") || "<p>No rumours yet.</p>";

    const discovered = Object.keys(state.discoveredSites).filter(id => state.discoveredSites[id]).map(id => {
      const loc = SETTLEMENT_MAP[id] || SITE_MAP[id];
      return `<span class="tag">${loc.name}</span>`;
    }).join(" ");

    const factions = C.factions.map(f => `
      <div class="faction-entry">
        <div class="entry-head">
          <strong>${f.name}</strong>
          <span class="tag">${factionDisplay(getFactionStanding(f.id))}</span>
        </div>
        <p>${f.description}</p>
      </div>
    `).join("");

    return `
      <div class="card">
        <h3>Quests</h3>
        ${questEntries}
      </div>
      <div class="card">
        <h3>Rumours</h3>
        ${rumours}
      </div>
      <div class="card">
        <h3>Discovered Places</h3>
        <p>${discovered || "You have not marked much of the March yet."}</p>
      </div>
      <div class="card">
        <h3>Factions</h3>
        ${factions}
      </div>
    `;
  }

  function memberCard(memberId) {
    const base = getPartyBase(memberId);
    const member = getPartyMember(memberId);
    const hpPct = Math.round((member.hp / getMaxHp(memberId)) * 100);
    const story = characterState(memberId);
    const latestMemory = story.memories[story.memories.length - 1];
    const arcReady = personalArcReady(memberId);
    const gear = getEquippedItem(memberId);
    const injury = getInjury(memberId);
    const build = getBuildChoice(memberId);
    const buildConfig = C.heroBuilds?.[memberId];
    const unlock = buildUnlockRenown(memberId);

    const itemButtons = ["bandage", "healing_tonic"].filter(id => hasItem(id)).map(id =>
      `<button class="small" data-action="use-item" data-item="${id}" data-member="${memberId}">Use ${ITEM_MAP[id].name}</button>`
    ).join("");

    let buildHtml = "";
    if (build) {
      buildHtml = `<p><strong>Path — ${build.name}:</strong> ${build.description}</p>`;
    } else if (buildConfig && state.renown >= unlock) {
      buildHtml = `
        <p><strong>Choose a permanent path:</strong></p>
        <div class="choice-list">
          ${buildConfig.choices.map(choice => `
            <button class="small" data-action="choose-build" data-member="${memberId}" data-build="${choice.id}">
              ${choice.name} — ${choice.description}
            </button>
          `).join("")}
        </div>
      `;
    } else if (buildConfig) {
      buildHtml = `<p class="subtle">Path unlocks at ${unlock} renown.</p>`;
    }

    const injuryHtml = injury
      ? `<p><strong>Injury — ${injury.def.name}:</strong> ${injury.def.description} ${injury.restRemaining} proper rest${injury.restRemaining === 1 ? "" : "s"} to recover.</p>`
      : `<p class="subtle">No persistent injury.</p>`;

    return `
      <div class="party-card art-card">
        ${artSlot("party", memberId, base.name)}
        <div class="art-card-body">
          <div class="entry-head">
            <div>
              <strong>${base.name}</strong>
              <div>${base.role}</div>
            </div>
            <span class="tag">${member.hp}/${getMaxHp(memberId)} HP</span>
          </div>
          <div class="hp-bar"><div class="hp-fill" style="width:${hpPct}%"></div></div>
          <p>${base.description}</p>
          <div class="mini-grid">
            <div>Might +${getSkill(memberId,"might")}</div>
            <div>Scout +${getSkill(memberId,"scout")}</div>
            <div>Wits +${getSkill(memberId,"wits")}</div>
            <div>Spirit +${getSkill(memberId,"spirit")}</div>
            <div>Guile +${getSkill(memberId,"guile")}</div>
          </div>
          <p><strong>${base.ability.name}:</strong> ${base.ability.text}</p>
          <p><strong>Gear:</strong> ${gear ? gear.name : "No hero gear equipped"}.</p>
          ${buildHtml}
          ${injuryHtml}
          <div class="row">
            <span class="tag">Trust: ${loyaltyLabel(story.loyalty)}${story.loyalty ? ` (${story.loyalty > 0 ? "+" : ""}${story.loyalty})` : ""}</span>
            ${(base.values || []).map(value => `<span class="tag">${value}</span>`).join("")}
          </div>
          ${latestMemory ? `<p><em>Remembers: ${latestMemory.text}</em></p>` : ""}
          ${base.personalArc ? `<p><strong>Personal thread — ${base.personalArc.title}:</strong> ${arcReady ? "This story is ready to deepen." : base.personalArc.premise}</p>` : ""}
          <div class="row">${itemButtons}</div>
        </div>
      </div>
    `;
  }

  function renderPartyRelationships() {
    ensureCharacterState();
    const entries = Object.entries(state.characterState.relationships)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => {
        const [a, b] = key.split("|");
        return `
          <div class="faction-entry">
            <div class="entry-head">
              <strong>${getPartyBase(a).name} & ${getPartyBase(b).name}</strong>
              <span class="tag">${relationshipLabel(value)}${value ? ` (${value > 0 ? "+" : ""}${value})` : ""}</span>
            </div>
          </div>
        `;
      }).join("");
    return entries || "<p>The party is still learning one another's edges.</p>";
  }

  function renderPartyTab() {
    ensureProgressionState();
    const inventory = Object.entries(state.inventory).map(([id, qty]) => {
      const item = ITEM_MAP[id];
      const equipped = item.kind === "gear" && item.hero && state.progression.equipment[item.hero] === id;
      const heroName = item.hero ? getPartyBase(item.hero)?.name : "";
      const equipmentAction = item.kind === "gear" && item.hero
        ? `<button class="small" ${equipped ? "disabled" : ""} data-action="equip-gear" data-item="${id}">${equipped ? `Equipped by ${heroName}` : `Equip to ${heroName}`}</button>`
        : "";

      return `
        <div class="item-entry art-entry">
          ${artSlot("item", id, item.name)}
          <div class="art-entry-body">
            <div class="entry-head">
              <strong>${item.name}</strong>
              <span class="tag">${qty}</span>
            </div>
            <p>${item.description}</p>
            ${equipmentAction}
          </div>
        </div>
      `;
    }).join("") || "<p>No items carried.</p>";

    const extra = hasItem("ward_salve") ? `<button data-action="use-item" data-item="ward_salve" data-member="all">Use Ward Salve</button>` : "";
    return `
      <div class="card">
        <h3>Adventuring Party</h3>
        <p class="subtle">Each hero has one gear slot. Gear can be swapped freely; hero paths are permanent for this campaign.</p>
        ${state.party.map(m => memberCard(m.id)).join("")}
      </div>
      <div class="card">
        <h3>Party Bonds</h3>
        ${renderPartyRelationships()}
      </div>
      <div class="card">
        <h3>Inventory</h3>
        <div class="choice-list">${extra}</div>
        ${inventory}
      </div>
    `;
  }

  function renderLogTab() {
    return `
      <div class="card">
        <h3>Recent Events</h3>
        ${state.logs.map(entry => `<div class="log-entry">${entry}</div>`).join("")}
      </div>
    `;
  }

  function renderTabs() {
    dom.tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.tab === state.ui.tab));
  }

  function renderTabContent() {
    let html = "";
    if (state.ui.tab === "context") html = renderContextTab();
    if (state.ui.tab === "journal") html = renderJournalTab();
    if (state.ui.tab === "party") html = renderPartyTab();
    if (state.ui.tab === "log") html = renderLogTab();
    dom.tabContent.innerHTML = html;
  }

  function getSiteActions(siteId) {
    const qLantern = questState("lantern_road");
    const qLedger = questState("missing_ledger");
    const qRelic = questState("pilgrim_reliquary");
    const qMed = questState("sealed_medicine");
    const qTower = questState("silent_tower");
    const qMarsh = questState("ash_in_marsh");

    switch (siteId) {
      case "watchers_rest":
        return [
          { key: "watchers_rest:rest", label: "Take shelter and rest a little (4 gold)" },
          { key: "watchers_rest:ledgers", label: "Read the old weather ledgers" }
        ];
      case "saint_rhel":
        return [
          { key: "saint_rhel:pray", label: "Light the lamp and pray" },
          { key: "saint_rhel:search", label: qRelic.status === "active" && qRelic.stage === "accepted" ? "Search for the hidden reliquary chamber" : "Search the old niche and lintel" },
          { key: "saint_rhel:take", label: "Open the reliquary chamber", disabled: qRelic.stage !== "opened_way" || hasItem("saint_bone") || qRelic.status === "completed" }
        ];
      case "old_barrow":
        return [
          { key: "old_barrow:enter", label: state.worldFlags.oldBarrowCleared ? "Search the cleared hall" : "Enter the reopened hall" },
          { key: "old_barrow:search", label: "Search the side chambers" }
        ];
      case "broken_span":
        return [
          { key: "broken_span:search", label: qLedger.status === "active" && qLedger.stage === "accepted" ? "Read the changing chalk marks" : "Inspect the chalk marks and snapped ropes" },
          { key: "broken_span:scavenge", label: state.worldFlags.brokenSpanSalvaged ? "Bridge salvage exhausted" : "Scavenge rope and salvage", disabled: !!state.worldFlags.brokenSpanSalvaged }
        ];
      case "weeping_stones":
        return [
          { key: "weeping_stones:tracks", label: qLantern.status === "active" && qLantern.stage === "accepted" ? "Track the false lantern crew" : "Study the damp tracks between the stones" },
          { key: "weeping_stones:deal", label: "Deal with the false lantern crew", disabled: !(qLantern.status === "active" && (qLantern.stage === "found_tracks" || state.worldFlags.lanternTracksFound) && !state.worldFlags.roadSafe) },
          { key: "weeping_stones:study", label: "Study the mineral seep" }
        ];
      case "redwater_ferry":
        return [
          { key: "redwater_ferry:cross", label: "Pay for a quick crossing (4 gold)" },
          { key: "redwater_ferry:inspect", label: "Inspect the mooring posts and tally marks" }
        ];
      case "moonmere":
        return [
          { key: "moonmere:path", label: "Find a safe way into the tower" },
          { key: "moonmere:archive", label: "Enter the upper archive", disabled: !(qTower.stage === "tower_open" || state.worldFlags.moonmerePath) || hasItem("moon_chart") || qTower.status === "completed" }
        ];
      case "mosslight":
        return [
          { key: "mosslight:lights", label: "Follow the green lights into the ruins" },
          { key: "mosslight:circle", label: "Break the black-candle circle" }
        ];
      case "hollowglass":
        return [
          { key: "hollowglass:search", label: "Search the ringing mineral shelves" }
        ];
      case "pilgrim_ford":
        return [
          { key: "pilgrim_ford:cross", label: "Use the hidden ford to slip south" }
        ];
      case "smuggler_cache":
        return [
          { key: "smuggler_cache:open", label: "Force open the hidden stone cache" }
        ];
      default:
        return [{ key: `${siteId}:look`, label: "Look around" }];
    }
  }

  function handleSiteAction(key) {
    const [siteId, action] = key.split(":");
    const logBefore = state.logs[0] || "";
    const qLantern = questState("lantern_road");
    const qLedger = questState("missing_ledger");
    const qRelic = questState("pilgrim_reliquary");
    const qTower = questState("silent_tower");
    const qMarsh = questState("ash_in_marsh");
    switch (`${siteId}:${action}`) {
      case "watchers_rest:rest":
        if (state.gold < 4) return openMessage("Not Enough Gold", "Even a lonely wayhouse charges coin.");
        state.gold -= 4;
        healAll(3);
        state.fatigue = Math.max(0, state.fatigue - 1);
        advanceTime(6);
        addLog("Watcher's Rest gives you a dry meal and a little quiet.");
        break;
      case "watchers_rest:ledgers": {
        const result = rollCheck("oren", "wits", 11);
        addLog(`Oren reads the ledgers: ${result.die} + ${result.mod} = ${result.total}.`);
        if (result.success) {
          discoverRumour("tower_path");
          changeItem("rations", 1, false);
          openMessage("Useful Notes", "The ledgers mark safer stone ridges leading toward Moonmere, along with an old ration stash still hidden in the pantry wall.");
        } else {
          openMessage("Smudged Records", "The worst pages are the useful ones. You leave with only a vague sense of old weather patterns.");
        }
        break;
      }
      case "saint_rhel:pray":
        healAll(2);
        state.fatigue = Math.max(0, state.fatigue - 1);
        discoverRumour("saint_shrine");
        addLog("The shrine steadies the party.");
        break;
      case "saint_rhel:search":
        revealQuest("pilgrim_reliquary");
        if (qRelic.status === "offered") acceptQuest("pilgrim_reliquary");
        if (hasItem("lantern_oil")) {
          setQuestStage("pilgrim_reliquary", "opened_way");
          addLog("Lantern oil reveals soot lines and a hidden catch behind the shrine stone.");
          openMessage("Hidden Chamber Found", "With better light, the concealed chamber becomes obvious. You can open it now.");
        } else {
          const result = rollCheck("brindle", "spirit", 12);
          addLog(`Brindle searches by instinct and prayer: ${result.die} + ${result.mod} = ${result.total}.`);
          if (result.success) {
            setQuestStage("pilgrim_reliquary", "opened_way");
            openMessage("Hidden Chamber Found", "Brindle notices a draft and a prayer notch worn by older hands. The chamber yields.");
          } else {
            openMessage("Nothing Yet", "You find old soot and wax, but not the chamber itself.");
          }
        }
        break;
      case "saint_rhel:take":
        if (!hasItem("saint_bone")) {
          changeItem("saint_bone", 1, false);
          setQuestStage("pilgrim_reliquary", "recovered");
          state.renown += 1;
          addLog("You recover the Saint-Bone Reliquary.");
          openMessage("Reliquary Recovered", "The little silver reliquary is heavier with meaning than weight.");
        }
        break;
      case "old_barrow:enter":
        if (!state.worldFlags.oldBarrowCleared) {
          startCombat("barrow_dead", "Old Barrow Keep wakes the moment you disturb its reopened hall.");
          state.worldFlags.oldBarrowCleared = true;
        } else {
          changeItem("ancient_coin", 2, false);
          addLog("You find old coin in Barrow dust.");
        }
        break;
      case "old_barrow:search": {
        const result = rollCheck("mira", "scout", 13);
        addLog(`Mira searches the side chambers: ${result.die} + ${result.mod} = ${result.total}.`);
        if (result.success) {
          if (!hasItem("marsh_key")) changeItem("marsh_key", 1, false);
          openMessage("Iron Key", "Tucked inside a cracked urn is a damp iron key engraved with moth wings.");
        } else {
          damageMember("mira", 2);
          openMessage("Loose Stone", "A dropped stone clips Mira's shoulder. The chamber gives up nothing else.");
        }
        break;
      }
      case "broken_span:search": {
        const actor = hasItem("keen_lens") ? "oren" : "mira";
        const skill = actor === "oren" ? "wits" : "scout";
        const result = rollCheck(actor, skill, 12);
        addLog(`${getPartyBase(actor).name} studies the chalk marks: ${result.die} + ${result.mod} = ${result.total}.`);
        if (result.success) {
          revealQuest("missing_ledger");
          if (qLedger.status === "offered") acceptQuest("missing_ledger");
          setQuestStage("missing_ledger", "found_clue");
          if (!hasItem("cache_map")) changeItem("cache_map", 1, false);
          state.worldFlags.reveal_smuggler_cache = true;
          state.discoveredSites.smuggler_cache = true;
          discoverRumour("cache_map");
          openMessage("Cache Clue", "The marks resolve into directions: the ledger did not go north. It went into the southern reeds.");
        } else {
          openMessage("Rain-Scrubbed", "The markings almost make sense, then slide back into nonsense under the next drip.");
        }
        break;
      }
      case "broken_span:scavenge":
        if (state.worldFlags.brokenSpanSalvaged) {
          openMessage("Nothing Left to Salvage", "You have already stripped the useful rope and fittings from the Broken Span.");
          break;
        }
        changeItem("rope", 1, false);
        state.worldFlags.brokenSpanSalvaged = true;
        advanceTime(1);
        addLog("You salvage usable rope from the bridge wreckage.");
        openMessage("Salvage Recovered", "After an hour picking through snapped beams and wet stone, you recover 1 Climber's Rope. The useful salvage here is now exhausted.");
        break;
      case "weeping_stones:tracks": {
        const result = rollCheck("mira", "scout", 12);
        addLog(`Mira reads the mud around the stones: ${result.die} + ${result.mod} = ${result.total}.`);
        if (result.success) {
          revealQuest("lantern_road");
          if (qLantern.status === "offered") acceptQuest("lantern_road");
          setQuestStage("lantern_road", "found_tracks");
          state.worldFlags.lanternTracksFound = true;
          openMessage("False Lantern Crew", "The tracks show a neat trick: one lantern, several men, and a route back toward the southern reeds.");
        } else {
          openMessage("Bad Ground", "The water around the stones keeps the truth soft.");
        }
        break;
      }
      case "weeping_stones:deal":
        openDialogue({
          title: "At the Weeping Stones",
          text: "A handful of road raiders step out with shuttered lanterns. They expected frightened merchants, not an armed party asking who pays them.",
          choices: [
            { key: "lanternFight", label: "Drive them off by force." },
            { key: "lanternTalk", label: "Try to break the crew without a fight." },
            { key: "close", label: "Back away for now." }
          ]
        });
        break;
      case "weeping_stones:study": {
        const result = rollCheck("oren", "wits", 11);
        addLog(`Oren studies the seep-streaked stone: ${result.die} + ${result.mod} = ${result.total}.`);
        if (result.success) {
          changeItem("bog_amber", 1, false);
          openMessage("Mineral Prize", "You chip out a clean piece of bog amber from the stone's damp seam.");
        } else {
          openMessage("Only Wet Stone", "The stones weep, but not in any profitable way today.");
        }
        break;
      }
      case "redwater_ferry:cross":
        if (state.gold < 4) return openMessage("Not Enough Gold", "The ferryman wants 4 gold for a fast crossing.");
        state.gold -= 4;
        state.fatigue = Math.max(0, state.fatigue - 1);
        advanceTime(2);
        addLog("A quick ferry crossing saves your legs if not your purse.");
        break;
      case "redwater_ferry:inspect": {
        const result = rollCheck("oren", "wits", 12);
        if (result.success) {
          state.worldFlags.reveal_smuggler_cache = true;
          state.discoveredSites.smuggler_cache = true;
          discoverRumour("river_checks");
          openMessage("Good Marks", "The tally cuts match those at Broken Span. Somebody on this crossing knew where the ledger went.");
        } else {
          openMessage("Tar and Rope", "The moorings reveal routine work and nothing more.");
        }
        break;
      }
      case "moonmere:path":
        revealQuest("silent_tower");
        if (qTower.status === "offered") acceptQuest("silent_tower");
        if (hasItem("rope")) {
          setQuestStage("silent_tower", "tower_open");
          state.worldFlags.moonmerePath = true;
          openMessage("A Safe Ascent", "With rope and patience you find a clean path to the tower's upper archive.");
        } else {
          const actor = getFactionStanding("archive") >= 1 ? "oren" : "mira";
          const skill = actor === "oren" ? "wits" : "scout";
          const result = rollCheck(actor, skill, 12);
          addLog(`${getPartyBase(actor).name} seeks a path up: ${result.die} + ${result.mod} = ${result.total}.`);
          if (result.success) {
            setQuestStage("silent_tower", "tower_open");
            state.worldFlags.moonmerePath = true;
            openMessage("A Safe Ascent", "You find a broken stair and a stable crack in the outer wall that gets you above the worst of the collapse.");
          } else {
            openMessage("No Clean Entry", "The tower wants a better plan, better tools, or both.");
          }
        }
        break;
      case "moonmere:archive":
        if (!state.worldFlags.moonmereCleared) {
          state.worldFlags.moonmereCleared = true;
          startCombat("tower_wisps", "Cold lights stir inside the upper archive.");
        } else if (!hasItem("moon_chart")) {
          changeItem("moon_chart", 1, false);
          setQuestStage("silent_tower", "recovered");
          openMessage("Moon Chart Recovered", "Wrapped in rotten cloth, the star chart survives.");
        }
        if (!hasItem("moon_chart") && state.worldFlags.moonmereCleared && !state.combat) {
          changeItem("moon_chart", 1, false);
          setQuestStage("silent_tower", "recovered");
        }
        break;
      case "mosslight:lights":
        revealQuest("ash_in_marsh");
        if (qMarsh.status === "offered") acceptQuest("ash_in_marsh");
        setQuestStage("ash_in_marsh", "met_veil");
        state.worldFlags.mossParley = true;
        openDialogue({
          title: "The People Behind the Lights",
          text: "The green lights belong not to spirits but to Veil runners and desperate marsh folk moving medicine, letters, and other things that official roads delay or seize.",
          choices: [
            { key: "marshExpose", label: "Take note and report them to Edda Briar." },
            { key: "marshBroker", label: "Hear their grievance and consider a bargain." },
            { key: "marshFight", label: "Break the circle now." }
          ]
        });
        break;
      case "mosslight:circle":
        revealQuest("ash_in_marsh");
        if (qMarsh.status === "offered") acceptQuest("ash_in_marsh");
        setQuestStage("ash_in_marsh", "decision");
        startCombat("marsh_cult", "Black candles gutter as the circle turns violent.");
        break;
      case "hollowglass:search": {
        const actor = hasItem("keen_lens") ? "mira" : "oren";
        const skill = actor === "oren" ? "wits" : "scout";
        const result = rollCheck(actor, skill, 12);
        addLog(`${getPartyBase(actor).name} searches Hollowglass: ${result.die} + ${result.mod} = ${result.total}.`);
        if (result.success) {
          if (!hasItem("keen_lens")) {
            changeItem("keen_lens", 1, false);
            openMessage("Keen Lens", "A wrapped lens case has survived in a mineral pocket. Oren immediately wants to clean it.");
          } else {
            changeItem("bog_amber", 2, false);
            openMessage("Amber and Shards", "You come away with a few saleable pieces.");
          }
        } else {
          openMessage("Cut Hands", "Shards and brittle panes give you little but small cuts.");
          damageAll(1);
        }
        break;
      }
      case "pilgrim_ford:cross":
        state.fatigue = Math.max(0, state.fatigue - 1);
        advanceTime(2);
        addLog("The hidden ford lets you slip south with little notice.");
        break;
      case "smuggler_cache:open":
        if (!(qLedger.stage === "found_clue" || hasItem("cache_map"))) {
          return openMessage("No Clear Lead", "You know there is something hidden here, but not how to open it cleanly.");
        }
        if (state.worldFlags.cacheOpened) {
          return openMessage("Already Open", "The cache is empty now.");
        }
        if (hasItem("lockpicks")) {
          state.worldFlags.cacheOpened = true;
          if (!hasItem("guild_ledger")) {
            changeItem("guild_ledger", 1, false);
            setQuestStage("missing_ledger", "recovered");
          }
          openMessage("Ledger Recovered", "Inside the dry stone hollow: the missing ledger, a coin pouch, and a smell of lamp smoke.");
          state.gold += 12;
        } else {
          const result = rollCheck("garrick", "might", 12);
          addLog(`Garrick forces the cache: ${result.die} + ${result.mod} = ${result.total}.`);
          if (result.success) {
            state.worldFlags.cacheOpened = true;
            if (!hasItem("guild_ledger")) {
              changeItem("guild_ledger", 1, false);
              setQuestStage("missing_ledger", "recovered");
            }
            state.gold += 10;
            openMessage("Ledger Recovered", "Stone gives way with a crack. Inside lies the missing ledger, dry and dangerous.");
          } else {
            startCombat("brigand_pair", "The failed attempt draws two watchers from the reeds.");
          }
        }
        break;
      default:
        addLog("You spend a little time looking and find nothing pressing.");
    }
    renderAll();
    if (!hasBlockingFeedback()) {
      const newestLog = state.logs[0] || "";
      showFeedback(
        SITE_MAP[siteId]?.name || "Action complete",
        newestLog && newestLog !== logBefore ? newestLog.replace(/^Day \d+, [^—]+ — /, "") : "Your action is complete.",
        "good"
      );
    }
  }

  function buildNpcDialogue(npcId) {
    const npc = NPC_MAP[npcId];
    const qLantern = questState("lantern_road");
    const qLedger = questState("missing_ledger");
    const qRelic = questState("pilgrim_reliquary");
    const qMed = questState("sealed_medicine");
    const qTower = questState("silent_tower");
    const qMarsh = questState("ash_in_marsh");

    switch (npcId) {
      case "mayor_rowan":
        if (!qLantern.known) {
          return {
            title: npc.name,
            text: "Rowan Pike rubs his temple. \"Trade is thinning because folk see false lanterns near the Weeping Stones and assume the worst. If nobody acts, Hearthwick pays first.\"",
            choices: [
              { key: "acceptQuest:lantern_road", label: "Take the road trouble job." },
              { key: "rumour:road_lanterns", label: "Ask what people have seen." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qLantern.status === "active" && state.worldFlags.roadSafe) {
          return {
            title: npc.name,
            text: "Rowan listens without interrupting, then exhales for what sounds like the first time all week.",
            choices: [
              { key: "turnIn:lantern_road:rowan", label: "Report the Weeping Stones are safe again." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "Rowan keeps one eye on the road out of habit. \"Frontiers do not collapse all at once. They thin, then bend.\"",
          choices: [
            { key: "rumour:old_keep_noise", label: "Ask about other trouble." },
            { key: "close", label: "Leave." }
          ]
        };
      case "tessa_inn":
        return {
          title: npc.name,
          text: "\"People talk truer when they're damp and hungry,\" Tessa says, polishing a cup that may never become clean. \"Lucky for me, the road provides both.\"",
          choices: [
            { key: "rumour:missing_ledger", label: "Ask about Greyfen gossip." },
            { key: "rumour:ferry_trouble", label: "Ask who has been moving south." },
            { key: "close", label: "Leave." }
          ]
        };
      case "sister_elira":
        if (!qRelic.known) {
          return {
            title: npc.name,
            text: "\"Looters have started prying silver off the old reliquaries,\" Sister Elira says. \"Saint Rhel's roadside shrine deserves kinder hands than theirs.\"",
            choices: [
              { key: "acceptQuest:pilgrim_reliquary", label: "Promise to recover the reliquary." },
              { key: "rumour:saint_shrine", label: "Ask about the shrine." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qRelic.status === "active" && hasItem("saint_bone")) {
          return {
            title: npc.name,
            text: "Elira sees the wrapped reliquary and falls silent for a heartbeat.",
            choices: [
              { key: "turnIn:pilgrim_reliquary:elira", label: "Return the reliquary to Sister Elira." },
              { key: "close", label: "Keep considering." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "\"A road shrine matters because it is small,\" Elira says. \"People can bring one honest thing to it without an audience.\"",
          choices: [
            { key: "rumour:pilgrim_bones", label: "Ask what thieves have been doing." },
            { key: "close", label: "Leave." }
          ]
        };
      case "oswin_marris":
        if (!qLedger.known) {
          return {
            title: npc.name,
            text: "\"A ledger vanished,\" Oswin says in a voice carefully flatter than panic. \"Some books are worth more than cargo because they prove who bought whose silence.\"",
            choices: [
              { key: "acceptQuest:missing_ledger", label: "Take the missing ledger job." },
              { key: "rumour:guild_whispers", label: "Ask what is really in the book." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qLedger.status === "active" && hasItem("guild_ledger")) {
          return {
            title: npc.name,
            text: "Oswin's posture changes the instant he sees the ledger.",
            choices: [
              { key: "turnIn:missing_ledger:oswin", label: "Return the ledger to Oswin Marris." },
              { key: "close", label: "Not yet." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "\"Greyfen runs on tallies, trust, and the illusion those are the same thing,\" Oswin says.",
          choices: [
            { key: "rumour:bridge_signs", label: "Ask about Broken Span." },
            { key: "close", label: "Leave." }
          ]
        };
      case "captain_crow":
        if (!qLantern.known) {
          return {
            title: npc.name,
            text: "\"If you're looking for paid honesty,\" Captain Crow says, \"someone needs to deal with the Weeping Stones trick before more wagons turn back.\"",
            choices: [
              { key: "acceptQuest:lantern_road", label: "Take the Weeping Stones job." },
              { key: "rumour:smuggler_rumours", label: "Ask who profits from the fear." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qLantern.status === "active" && state.worldFlags.roadSafe) {
          return {
            title: npc.name,
            text: "Crow nods once as you finish. \"Good. The road only works if fear does not get the right of way.\"",
            choices: [
              { key: "turnIn:lantern_road:crow", label: "Report to Captain Crow." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "Crow always sounds like he has already heard the excuse and disliked it.",
          choices: [
            { key: "rumour:bridge_signs", label: "Ask about Broken Span." },
            { key: "close", label: "Leave." }
          ]
        };
      case "joric_pell":
        if (!qMed.known) {
          return {
            title: npc.name,
            text: "\"Alderwatch needs this crate before a fever turns mean,\" Joric says. \"I would haul it myself, but the wagons are tied up and the road south has gone stupid.\"",
            choices: [
              { key: "acceptQuest:sealed_medicine", label: "Carry the medicine to Alderwatch." },
              { key: "rumour:medicine_run", label: "Ask how urgent it is." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qMed.status === "active") {
          return {
            title: npc.name,
            text: qMed.dueDay ? `\"Every hour matters. Get it there by day ${qMed.dueDay},\" Joric says.` : "\"Get moving. The road will not shorten itself.\"",
            choices: [
              { key: "close", label: "Leave." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "\"You either respect logistics or you learn to respect consequences,\" Joric says.",
          choices: [
            { key: "close", label: "Leave." }
          ]
        };
      case "sen_marrow":
        if (!qTower.known) {
          return {
            title: npc.name,
            text: "\"Moonmere Tower still holds a star chart that could settle three ownership disputes and start a fourth,\" Sen says. \"Before the damp finishes it, I want it recovered.\"",
            choices: [
              { key: "acceptQuest:silent_tower", label: "Take the Moonmere chart commission." },
              { key: "rumour:moonmere", label: "Ask what still survives in the tower." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qTower.status === "active" && hasItem("moon_chart")) {
          return {
            title: npc.name,
            text: "Sen's careful expression slips for a second into pure delight when he sees the chart.",
            choices: [
              { key: "turnIn:silent_tower:sen", label: "Hand the Moonmere chart to Sen Marrow." },
              { key: "turnIn:pilgrim_reliquary:archive", label: hasItem("saint_bone") ? "Offer the reliquary to the Archive instead." : "", hidden: !hasItem("saint_bone") },
              { key: "close", label: "Leave." }
            ].filter(c => !c.hidden)
          };
        }
        return {
          title: npc.name,
          text: "\"There is no such thing as neutral evidence,\" Sen says. \"Only records waiting for a side to claim them.\"",
          choices: [
            { key: "rumour:old_chart", label: "Ask what the chart proves." },
            { key: "close", label: "Leave." }
          ]
        };
      case "magister_holt":
        return {
          title: npc.name,
          text: "\"Records make cowards of the guilty and fools of the lazy,\" Holt says. \"That is why I like them.\"",
          choices: [
            { key: hasItem("guild_ledger") ? "turnIn:missing_ledger:holt" : "rumour:ledger_value", label: hasItem("guild_ledger") ? "Place the ledger in Magister Holt's hands." : "Ask why the ledger matters." },
            { key: hasItem("ashen_sigil") ? "turnIn:ash_in_marsh:holt" : "rumour:veiled_names", label: hasItem("ashen_sigil") ? "Turn over the Ashen Sigil as evidence." : "Ask about the Ashen Veil." },
            { key: "close", label: "Leave." }
          ]
        };
      case "alwen_reed":
        return {
          title: npc.name,
          text: "\"Pilgrims remember paths better than officials do,\" Alwen says. \"That alone should make you trust them more.\"",
          choices: [
            { key: "rumour:saint_shrine", label: "Ask about Saint Rhel's Shrine." },
            { key: "rumour:barrow_keep", label: "Ask about Old Barrow Keep." },
            { key: "close", label: "Leave." }
          ]
        };
      case "edda_briar":
        if (!qMarsh.known) {
          return {
            title: npc.name,
            text: "\"Green lights, missing watchmen, and too many stories trying to turn organised people into ghosts,\" Edda says. \"I want facts from Mosslight, not superstition.\"",
            choices: [
              { key: "acceptQuest:ash_in_marsh", label: "Take the Mosslight investigation." },
              { key: "rumour:watch_missing", label: "Ask what the wardens have found." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qMarsh.status === "active" && (qMarsh.stage === "decision" || qMarsh.stage === "met_veil" || hasItem("ashen_sigil"))) {
          return {
            title: npc.name,
            text: "Edda waits with the patience of someone who has learned impatience fixes nothing.",
            choices: [
              { key: "turnIn:ash_in_marsh:edda", label: "Report the Mosslight operation to Edda Briar." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "\"We are not losing the marsh to rumours and theatrics,\" Edda says.",
          choices: [
            { key: "rumour:marsh_lights", label: "Ask about the lights." },
            { key: "close", label: "Leave." }
          ]
        };
      case "fen_lark":
        return {
          title: npc.name,
          text: "\"You can cross half the March on bad decisions if you walk fast enough,\" Fen says. \"You just will not like the condition you arrive in.\"",
          choices: [
            { key: "rumour:cache_map", label: "Ask about the southern reeds." },
            { key: "rumour:tower_path", label: "Ask about Moonmere paths." },
            { key: "close", label: "Leave." }
          ]
        };
      case "quartermaster_yor":
        if (qMed.status === "active" && hasItem("sealed_crate")) {
          return {
            title: npc.name,
            text: "\"Please tell me that's the crate,\" Yor says before he remembers to sound dignified.",
            choices: [
              { key: "turnIn:sealed_medicine:yor", label: "Deliver the medicine crate." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "\"Everything here is enough for today and not enough for next week,\" Yor says.",
          choices: [
            { key: "rumour:supply_shortage", label: "Ask what Alderwatch lacks most." },
            { key: "close", label: "Leave." }
          ]
        };
      case "nera_vale":
        if (qLedger.status === "active" && hasItem("guild_ledger")) {
          return {
            title: npc.name,
            text: "\"That book hurts the wrong people depending on whose desk it lands on,\" Nera says. \"I can make it disappear into a fairer silence.\"",
            choices: [
              { key: "turnIn:missing_ledger:nera", label: "Give the ledger to Nera Vale." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        if (qMed.status === "active" && hasItem("sealed_crate")) {
          return {
            title: npc.name,
            text: "\"That crate could solve problems other than the official one,\" Nera says. \"Official routes do not own all virtue.\"",
            choices: [
              { key: "divertMedicine", label: "Divert the crate through the Veil for fast coin." },
              { key: "close", label: "Refuse." }
            ]
          };
        }
        if (qMarsh.status === "active" && (qMarsh.stage === "met_veil" || qMarsh.stage === "decision")) {
          return {
            title: npc.name,
            text: "\"Mosslight exists because the frontier makes needs faster than forms,\" Nera says.",
            choices: [
              { key: "turnIn:ash_in_marsh:nera", label: "Broker a deal with Nera instead of exposing the cell." },
              { key: "close", label: "Leave." }
            ]
          };
        }
        return {
          title: npc.name,
          text: "\"The law is a road,\" Nera says. \"Useful, expensive, and not the only way to get somewhere.\"",
          choices: [
            { key: "rumour:smuggler_rumours", label: "Ask who the Ashen Veil really are." },
            { key: "rumour:cache_map", label: "Ask about the southern reeds." },
            { key: "close", label: "Leave." }
          ]
        };
      case "tobin_reed":
        return {
          title: npc.name,
          text: "Tobin keeps a room loud enough that everybody can pretend not to hear the important bits.",
          choices: [
            { key: "rumour:ferry_trouble", label: "Ask about river traffic." },
            { key: "rumour:marsh_lights", label: "Ask about the green lights." },
            { key: "close", label: "Leave." }
          ]
        };
      case "ferry_vesk":
        return {
          title: npc.name,
          text: "\"People blame the river for the things they choose on its banks,\" Vesk says, spitting neatly into the current.",
          choices: [
            { key: "rumour:broken_span", label: "Ask about Broken Span." },
            { key: "rumour:river_checks", label: "Ask who has been checking writs." },
            { key: "close", label: "Leave." }
          ]
        };
      default:
        return {
          title: npc.name,
          text: npc.description,
          choices: [{ key: "close", label: "Leave." }]
        };
    }
  }

  function handleDialogueChoice(key) {
    if (key === "close") {
      closeDialogue();
      return;
    }
    if (key.startsWith("characterMoment:")) {
      const [, momentId, choiceIndex] = key.split(":");
      resolveCharacterCampMoment(momentId, Number(choiceIndex));
      return;
    }
    if (key.startsWith("acceptQuest:")) {
      const questId = key.split(":")[1];
      revealQuest(questId);
      acceptQuest(questId);
      if (questId === "sealed_medicine" && !hasItem("sealed_crate")) changeItem("sealed_crate", 1, false);
      if (questId === "missing_ledger") discoverRumour("missing_ledger");
      if (questId === "lantern_road") discoverRumour("road_lanterns");
      if (questId === "ash_in_marsh") discoverRumour("marsh_lights");
      closeDialogue();
      renderAll();
      openMessage("Quest Accepted", `${QUEST_MAP[questId].title}\n\n${QUEST_MAP[questId].summary}`);
      return;
    }
    if (key.startsWith("rumour:")) {
      const rumourId = key.split(":")[1];
      discoverRumour(rumourId);
      closeDialogue();
      renderAll();
      openMessage("Rumour Learned", RUMOUR_MAP[rumourId].text);
      return;
    }
    if (key === "lanternFight") {
      closeDialogue();
      startCombat("toll_cutters", "The false lantern crew decides its bluff is over.");
      state.worldFlags.lanternPendingOutcome = "fight";
      return;
    }
    if (key === "lanternTalk") {
      const result = rollCheck("brindle", "guile", 13);
      addLog(`Brindle tries to break the crew's nerve: ${result.die} + ${result.mod} = ${result.total}.`);
      closeDialogue();
      if (result.success) {
        state.worldFlags.roadSafe = true;
        state.worldFlags.lanternOutcome = "bargained";
        setQuestStage("lantern_road", "solved");
        changeFaction("veil", 1);
        changeFaction("wardens", -1);
        openMessage("Lanterns Extinguished", "The crew scatters without blood. They will likely remember who made that deal possible.");
        reactToDecision("lantern_bargained");
      } else {
        startCombat("toll_cutters", "Talk fails and the crew reaches for steel.");
        state.worldFlags.lanternPendingOutcome = "fight";
      }
      return;
    }
    if (key === "marshExpose") {
      closeDialogue();
      setQuestStage("ash_in_marsh", "decision");
      state.worldFlags.marshOutcomeHint = "expose";
      openMessage("Facts Collected", "You leave with names, routes, and enough proof to give Edda Briar a clean target.");
      return;
    }
    if (key === "marshBroker") {
      closeDialogue();
      setQuestStage("ash_in_marsh", "decision");
      state.worldFlags.marshOutcomeHint = "broker";
      changeFaction("veil", 1);
      openMessage("A Different Kind of Truth", "You leave with a sense that Mosslight solves real needs badly rather than imaginary ones theatrically.");
      return;
    }
    if (key === "marshFight") {
      closeDialogue();
      setQuestStage("ash_in_marsh", "decision");
      startCombat("marsh_cult", "The Mosslight circle erupts into violence.");
      return;
    }
    if (key === "divertMedicine") {
      closeDialogue();
      if (!hasItem("sealed_crate")) return;
      changeItem("sealed_crate", -1, false);
      failQuest("sealed_medicine", "diverted");
      state.gold += 25;
      changeFaction("veil", 2);
      changeFaction("guild", -2);
      changeFaction("wardens", -2);
      openMessage("Quiet Coin", "The crate vanishes into the Veil's routes. You are paid well, and judged accordingly.");
      reactToDecision("medicine_diverted");
      renderAll();
      return;
    }
    if (key.startsWith("turnIn:")) {
      const [, questId, who] = key.split(":");
      closeDialogue();
      resolveTurnIn(questId, who);
      renderAll();
      return;
    }
  }

  function resolveTurnIn(questId, who) {
    switch (`${questId}:${who}`) {
      case "lantern_road:rowan":
      case "lantern_road:crow":
        if (!state.worldFlags.roadSafe) return;
        completeQuest("lantern_road", state.worldFlags.lanternOutcome || "cleared");
        state.gold += 22;
        if ((state.worldFlags.lanternOutcome || "") === "bargained") {
          changeFaction("wardens", 0);
        } else {
          changeFaction("wardens", 2);
        }
        state.renown += 1;
        openMessage("Road Restored", "Wagons will risk the road again. In a frontier village, that matters more than speeches.");
        reactToDecision((state.worldFlags.lanternOutcome || "") === "bargained" ? "lantern_bargained" : "lantern_fought_clear");
        break;
      case "pilgrim_reliquary:elira":
        if (!hasItem("saint_bone")) return;
        changeItem("saint_bone", -1, false);
        completeQuest("pilgrim_reliquary", "returned_to_shrine");
        state.gold += 18;
        changeFaction("wardens", 2);
        openMessage("A Small Holy Thing", "Sister Elira receives the reliquary like someone greeting a traveller home.");
        reactToDecision("reliquary_shrine");
        break;
      case "pilgrim_reliquary:archive":
        if (!hasItem("saint_bone")) return;
        changeItem("saint_bone", -1, false);
        completeQuest("pilgrim_reliquary", "archived");
        state.gold += 28;
        changeFaction("archive", 2);
        changeFaction("wardens", -1);
        openMessage("Catalogued", "The Archive records and secures the reliquary. Whether that is the same as honouring it depends on who you ask.");
        reactToDecision("reliquary_archive");
        break;
      case "missing_ledger:oswin":
        if (!hasItem("guild_ledger")) return;
        changeItem("guild_ledger", -1, false);
        completeQuest("missing_ledger", "returned_to_guild");
        state.gold += 28;
        changeFaction("guild", 2);
        changeFaction("veil", -1);
        openMessage("Paid Quietly", "Oswin pays fast and asks for no copy. That, perhaps, is its own answer.");
        reactToDecision("ledger_guild");
        break;
      case "missing_ledger:nera":
        if (!hasItem("guild_ledger")) return;
        changeItem("guild_ledger", -1, false);
        completeQuest("missing_ledger", "buried_by_veil");
        state.gold += 24;
        changeFaction("veil", 2);
        changeFaction("guild", -2);
        openMessage("Gone to Ground", "Nera disappears the ledger into channels where accountability goes to be argued about later.");
        reactToDecision("ledger_veil");
        break;
      case "missing_ledger:holt":
        if (!hasItem("guild_ledger")) return;
        changeItem("guild_ledger", -1, false);
        completeQuest("missing_ledger", "archived_as_evidence");
        state.gold += 20;
        changeFaction("archive", 2);
        changeFaction("guild", -1);
        changeFaction("wardens", 1);
        openMessage("Recorded", "Holt stores the ledger as evidence, which is a more dangerous burial than fire.");
        reactToDecision("ledger_archive");
        break;
      case "sealed_medicine:yor":
        if (!hasItem("sealed_crate")) return;
        changeItem("sealed_crate", -1, false);
        completeQuest("sealed_medicine", state.day <= questState("sealed_medicine").dueDay ? "delivered_in_time" : "late_but_useful");
        state.gold += 20;
        changeFaction("wardens", 2);
        changeFaction("guild", 1);
        healAll(3);
        openMessage("Crate Delivered", "The quartermaster nearly snatches the crate out of your hands. Whatever else the road is, today it carried help.");
        reactToDecision("medicine_delivered");
        break;
      case "silent_tower:sen":
        if (!hasItem("moon_chart")) return;
        changeItem("moon_chart", -1, false);
        completeQuest("silent_tower", "chart_to_archive");
        state.gold += 26;
        changeFaction("archive", 2);
        openMessage("A Record Recovered", "Sen is already thinking ahead to what the chart will prove and whom it will annoy.");
        reactToDecision("chart_archive");
        break;
      case "ash_in_marsh:edda":
        completeQuest("ash_in_marsh", "exposed_to_wardens");
        if (hasItem("ashen_sigil")) changeItem("ashen_sigil", -1, false);
        state.gold += 24;
        changeFaction("wardens", 2);
        changeFaction("veil", -1);
        openMessage("Wardens Move In", "Edda takes the report with grim clarity. Mosslight will not stay quiet for long now.");
        reactToDecision("marsh_exposed");
        break;
      case "ash_in_marsh:nera":
        completeQuest("ash_in_marsh", "brokered_with_veil");
        state.gold += 20;
        changeFaction("veil", 2);
        changeFaction("wardens", -1);
        openMessage("Brokered Peace", "Nera promises the Mosslight routes will avoid warden stores and medicine lines. That is not law, but it may be enough.");
        reactToDecision("marsh_brokered");
        break;
      case "ash_in_marsh:holt":
        if (!hasItem("ashen_sigil")) return;
        changeItem("ashen_sigil", -1, false);
        completeQuest("ash_in_marsh", "recorded_as_evidence");
        state.gold += 18;
        changeFaction("archive", 2);
        changeFaction("veil", -1);
        openMessage("Entered into Record", "Holt receives the sigil with a look best described as professionally delighted.");
        reactToDecision("marsh_recorded");
        break;
    }
  }

  function startCombat(encounterId, introText) {
    const encounter = ENCOUNTER_MAP[encounterId];
    const enemies = encounter.enemies.map((enemyId, index) => {
      const base = ENEMY_MAP[enemyId];
      return {
        uid: `${enemyId}_${index}_${randInt(100,999)}`,
        archetypeId: enemyId,
        name: base.name,
        hp: base.hp,
        maxHp: base.hp,
        armor: base.armor,
        attack: base.attack,
        damage: base.damage,
        initiative: base.initiative + randInt(0, 3),
        statuses: { exposed: 0, weakened: 0 }
      };
    });
    const order = [];
    state.party.forEach(member => {
      order.push({
        kind: "party",
        id: member.id,
        initiative: getSkill(member.id, "scout") + getProgressionEffect(member.id, "initiativeBonus") + randInt(1, 20)
      });
    });
    enemies.forEach(enemy => {
      order.push({
        kind: "enemy",
        id: enemy.uid,
        initiative: enemy.initiative + randInt(1, 20)
      });
    });
    order.sort((a, b) => b.initiative - a.initiative);
    state.combat = {
      encounterId,
      introText: introText || encounter.name,
      enemies,
      turnOrder: order,
      turnIndex: 0,
      log: [introText || encounter.name],
      pendingAction: null,
      round: 1
    };
    playCue("combat");
    refreshAmbience(true);
    renderModal();
    maybeAdvanceEnemyTurn();
  }

  function combatUnitAlive(token) {
    if (token.kind === "party") return getPartyMember(token.id).hp > 0;
    const enemy = state.combat.enemies.find(e => e.uid === token.id);
    return enemy && enemy.hp > 0;
  }

  function currentCombatToken() {
    const combat = state.combat;
    if (!combat) return null;
    for (let loops = 0; loops < combat.turnOrder.length; loops++) {
      const token = combat.turnOrder[combat.turnIndex % combat.turnOrder.length];
      if (combatUnitAlive(token)) return token;
      combat.turnIndex = (combat.turnIndex + 1) % combat.turnOrder.length;
    }
    return null;
  }

  function addCombatLog(text) {
    state.combat.log.unshift(text);
    state.combat.log = state.combat.log.slice(0, 18);
  }

  function maybeAdvanceEnemyTurn() {
    if (!state.combat) return;
    if (checkCombatOutcome()) return;
    const token = currentCombatToken();
    if (!token) return;
    if (token.kind === "enemy") {
      setTimeout(() => {
        enemyAct(token.id);
      }, 180);
    }
  }

  function heroDefense(memberId) {
    const might = getSkill(memberId, "might");
    return 10 + Math.max(0, Math.floor(might / 2)) + getProgressionEffect(memberId, "defenseBonus");
  }

  function enemyAct(enemyUid) {
    const combat = state.combat;
    if (!combat) return;
    const enemy = combat.enemies.find(e => e.uid === enemyUid);
    if (!enemy || enemy.hp <= 0) {
      advanceCombatTurn();
      return;
    }
    const targets = livingParty();
    if (!targets.length) {
      resolveCombatDefeat();
      return;
    }
    const sortedTargets = [...targets].sort((a, b) => a.hp - b.hp);
    let target = sortedTargets[0];
    const guarded = state.party.find(m => m.guard > 0 && m.hp > 0);
    if (guarded && rand() < 0.65) target = guarded;
    const attackRoll = randInt(1, 20) + enemy.attack - enemy.statuses.weakened;
    const defence = heroDefense(target.id);
    if (attackRoll >= defence) {
      let dmg = randInt(enemy.damage[0], enemy.damage[1]);
      if (target.guard > 0) {
        dmg = Math.max(1, dmg - Math.max(3, target.guard));
        target.guard = 0;
      }
      damageMember(target.id, dmg);
      addCombatLog(`${enemy.name} hits ${getPartyBase(target.id).name} for ${dmg}.`);
    } else {
      addCombatLog(`${enemy.name} misses ${getPartyBase(target.id).name}.`);
    }
    enemy.statuses.weakened = 0;
    advanceCombatTurn();
  }

  function getHeroActions(memberId) {
    switch (memberId) {
      case "garrick":
        return [
          { key: "strike", label: "Strike", target: "enemy" },
          { key: "guard", label: "Hold Fast", target: "ally" }
        ];
      case "mira":
        return [
          { key: "knife", label: "Slip Knife", target: "enemy" },
          { key: "pin", label: "Pin Shot", target: "enemy" }
        ];
      case "oren":
        return [
          { key: "bolt", label: "Sigil Bolt", target: "enemy" },
          { key: "bind", label: "Bind", target: "enemy" }
        ];
      case "brindle":
        return [
          { key: "mace", label: "Mace", target: "enemy" },
          { key: "mend", label: "Lantern Grace", target: "ally" },
          { key: "bless", label: "Bless", target: "ally" }
        ];
      default:
        return [{ key: "wait", label: "Act", target: "enemy" }];
    }
  }

  function chooseCombatAction(actionKey) {
    if (!state.combat) return;
    state.combat.pendingAction = actionKey;
    renderModal();
  }

  function heroAct(actionKey, targetId) {
    const token = currentCombatToken();
    if (!token || token.kind !== "party") return;
    const memberId = token.id;
    const hero = getPartyBase(memberId);
    const member = getPartyMember(memberId);

    if (actionKey === "strike") {
      attackEnemy(memberId, targetId, getSkill(memberId, "might"), [4, 7], `${hero.name} strikes`);
    }
    if (actionKey === "knife") {
      attackEnemy(memberId, targetId, getSkill(memberId, "scout"), [3, 6], `${hero.name} slips a knife in`);
    }
    if (actionKey === "pin") {
      const hit = attackEnemy(memberId, targetId, getSkill(memberId, "scout"), [2, 4], `${hero.name} pins`);
      if (hit) {
        const enemy = state.combat.enemies.find(e => e.uid === targetId);
        if (enemy) enemy.statuses.exposed = 1;
        signalVisualEffect("status");
        addCombatLog(`${enemy.name} is exposed.`);
      }
    }
    if (actionKey === "bolt") {
      attackEnemy(memberId, targetId, getSkill(memberId, "wits"), [3, 6], `${hero.name} blasts`);
    }
    if (actionKey === "bind") {
      const hit = attackEnemy(memberId, targetId, getSkill(memberId, "wits"), [2, 4], `${hero.name} binds`);
      if (hit) {
        const enemy = state.combat.enemies.find(e => e.uid === targetId);
        if (enemy) enemy.statuses.weakened = 2 + getProgressionEffect(memberId, "bindBonus");
        signalVisualEffect("status");
        addCombatLog(`${enemy.name}'s next attack is weakened.`);
      }
    }
    if (actionKey === "mace") {
      attackEnemy(memberId, targetId, getSkill(memberId, "spirit"), [2, 5], `${hero.name} smacks`);
    }
    if (actionKey === "guard") {
      const ally = getPartyMember(targetId);
      ally.guard = 3 + getProgressionEffect(memberId, "guardReduction");
      signalVisualEffect("status");
      addCombatLog(`${hero.name} guards ${getPartyBase(targetId).name}.`);
    }
    if (actionKey === "mend") {
      const heal = 5 + getProgressionEffect(memberId, "healBonus");
      healMember(targetId, heal);
      addCombatLog(`${hero.name} restores ${heal} HP to ${getPartyBase(targetId).name}.`);
    }
    if (actionKey === "bless") {
      const ally = getPartyMember(targetId);
      ally.bless = 2 + getProgressionEffect(memberId, "blessBonus");
      signalVisualEffect("status");
      addCombatLog(`${hero.name} blesses ${getPartyBase(targetId).name}'s next strike.`);
    }
    state.combat.pendingAction = null;
    advanceCombatTurn();
  }

  function attackEnemy(memberId, enemyUid, bonus, damageRange, verb) {
    const enemy = state.combat.enemies.find(e => e.uid === enemyUid);
    if (!enemy || enemy.hp <= 0) return false;
    const actor = getPartyMember(memberId);
    let attack = randInt(1, 20) + bonus + (actor.bless || 0) + enemy.statuses.exposed;
    if (attack >= enemy.armor) {
      let dmg = randInt(damageRange[0], damageRange[1]) + getProgressionEffect(memberId, "damageBonus");
      enemy.hp = Math.max(0, enemy.hp - dmg);
      signalVisualEffect("hit");
      addCombatLog(`${verb} ${enemy.name} for ${dmg}.`);
      actor.bless = 0;
      enemy.statuses.exposed = 0;
      return true;
    }
    actor.bless = 0;
    addCombatLog(`${getPartyBase(memberId).name} misses ${enemy.name}.`);
    return false;
  }

  function advanceCombatTurn() {
    if (!state.combat) return;
    if (checkCombatOutcome()) return;
    state.combat.turnIndex = (state.combat.turnIndex + 1) % state.combat.turnOrder.length;
    if (state.combat.turnIndex === 0) state.combat.round += 1;
    renderModal();
    maybeAdvanceEnemyTurn();
  }

  function checkCombatOutcome() {
    const allEnemiesDown = state.combat.enemies.every(e => e.hp <= 0);
    if (allEnemiesDown) {
      resolveCombatVictory();
      return true;
    }
    const everyoneDown = livingParty().length === 0;
    if (everyoneDown) {
      resolveCombatDefeat();
      return true;
    }
    return false;
  }

  function collectEnemyLoot() {
    const loot = [];
    state.combat.enemies.forEach(enemy => {
      const base = ENEMY_MAP[enemy.archetypeId];
      (base.loot || []).forEach(rule => {
        if (rand() <= rule.chance) {
          const qty = randInt(rule.qty[0], rule.qty[1]);
          loot.push({ id: rule.id, qty });
        }
      });
    });
    loot.forEach(item => changeItem(item.id, item.qty, false));
    return loot;
  }

  function resolveCombatVictory() {
    const encounter = ENCOUNTER_MAP[state.combat.encounterId];
    const gold = randInt(encounter.rewardGold[0], encounter.rewardGold[1]);
    state.gold += gold;
    applyEffects(encounter.onWin);
    const loot = collectEnemyLoot();
    const lootText = loot.length ? loot.map(l => `${l.qty} × ${itemName(l.id)}`).join(", ") : "no extra loot";
    let characterDecision = null;
    if (state.worldFlags.lanternPendingOutcome === "fight") {
      state.worldFlags.roadSafe = true;
      state.worldFlags.lanternOutcome = "fought_clear";
      setQuestStage("lantern_road", "solved");
      state.worldFlags.lanternPendingOutcome = null;
      characterDecision = "lantern_fought_clear";
    }
    if (state.combat.encounterId === "marsh_cult") {
      setQuestStage("ash_in_marsh", "decision");
      if (!hasItem("ashen_sigil")) changeItem("ashen_sigil", 1, false);
    }
    if (state.combat.encounterId === "tower_wisps" && !hasItem("moon_chart")) {
      changeItem("moon_chart", 1, false);
      setQuestStage("silent_tower", "recovered");
    }
    state.combat = null;
    playCue("victory");
    renderModal();
    openMessage("Victory", `The party wins.\n\nReward: ${gold} gold and ${lootText}.`);
    if (characterDecision) reactToDecision(characterDecision);
    renderAll();
  }

  function resolveCombatDefeat() {
    const encounter = ENCOUNTER_MAP[state.combat.encounterId];
    applyEffects(encounter.onLose);
    const fallback = SETTLEMENT_MAP[state.lastSettlement] || SETTLEMENT_MAP.hearthwick;
    state.position = { q: fallback.q, r: fallback.r };
    state.ui.focus = { type: "settlement", id: fallback.id };
    state.party.forEach(m => {
      m.hp = Math.max(4, Math.ceil(getMaxHp(m.id) * 0.45));
      m.guard = 0;
      m.bless = 0;
    });
    state.gold = Math.max(0, state.gold - 10);
    state.fatigue = Math.min(6, state.fatigue + 2);
    revealAround(state.position.q, state.position.r);
    state.combat = null;
    playCue("defeat");
    renderModal();
    openMessage("Driven Back", `The party is beaten and dragged back toward ${fallback.name}. You lose 10 gold and gain 2 fatigue.`);
    renderAll();
  }

  function renderShopModal() {
    const settlementId = state.ui.shop;
    const settlement = SETTLEMENT_MAP[settlementId];
    const buyList = settlement.shopStock.map(itemId => {
      const item = ITEM_MAP[itemId];
      const canBuy = state.gold >= item.value && (item.stack || !hasItem(itemId));
      return `
        <div class="item-entry">
          <div class="entry-head">
            <strong>${item.name}</strong>
            <span class="tag">${item.value}g</span>
          </div>
          <p>${item.description}</p>
          <button ${canBuy ? "" : "disabled"} data-action="buy-item" data-settlement="${settlementId}" data-item="${itemId}">Buy</button>
        </div>
      `;
    }).join("");
    const sellable = Object.entries(state.inventory).filter(([id, qty]) => qty > 0 && ["valuable"].includes(ITEM_MAP[id].kind)).map(([id, qty]) => {
      const item = ITEM_MAP[id];
      const price = Math.max(2, Math.floor(item.value * 0.5));
      return `
        <div class="item-entry">
          <div class="entry-head">
            <strong>${item.name}</strong>
            <span class="tag">${qty} owned</span>
          </div>
          <p>Sell for ${price} gold each.</p>
          <button data-action="sell-item" data-item="${id}">Sell one</button>
        </div>
      `;
    }).join("") || "<p>No easy valuables to sell.</p>";

    return `
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2>${settlement.name} Market</h2>
            <p class="subtle">${state.gold} gold on hand.</p>
          </div>
          <button class="close-btn" data-action="close-shop">Close</button>
        </div>
        <div class="card">
          <h3>Buy</h3>
          ${buyList}
        </div>
        <div class="card">
          <h3>Sell</h3>
          ${sellable}
        </div>
      </div>
    `;
  }

  function renderSceneModal() {
    const scene = state.activeScene;
    return `
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2>${scene.title}</h2>
            <p class="subtle">${scene.source === "camp" ? "Night event" : "Travel event"}</p>
          </div>
          <button class="close-btn" data-action="close-scene">Close</button>
        </div>
        <div class="notice">${scene.text}</div>
        <div class="choice-list">
          ${scene.options.map((option, index) => {
            let disabled = false;
            if (option.requiresItem && !hasItem(option.requiresItem)) disabled = true;
            if (option.requiresAnyItem && !option.requiresAnyItem.some(id => hasItem(id))) disabled = true;
            return `<button ${disabled ? "disabled" : ""} data-action="scene-option" data-index="${index}">${option.label}</button>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderDialogueModal() {
    const d = state.ui.dialogue;
    return `
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2>${d.title}</h2>
          </div>
          <button class="close-btn" data-action="close-dialogue">Close</button>
        </div>
        <div class="notice">${d.text.replace(/\n/g, "<br>")}</div>
        <div class="choice-list">
          ${d.choices.map(choice => `<button data-action="dialogue-choice" data-key="${choice.key}">${choice.label}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function renderCombatModal() {
    const combat = state.combat;
    const token = currentCombatToken();
    const pending = combat.pendingAction;
    const heroActions = token && token.kind === "party" ? getHeroActions(token.id) : [];
    const neededTarget = heroActions.find(a => a.key === pending);
    const enemyButtons = combat.enemies.map(enemy => `
      <div class="unit-card art-card ${enemy.hp <= 0 ? "dead" : ""} ${token && token.kind === "enemy" && token.id === enemy.uid ? "active" : ""}">
        ${artSlot("enemy", enemy.archetypeId, enemy.name)}
        <div class="art-card-body">
          <strong>${enemy.name}</strong>
          <div>${Math.max(0, enemy.hp)}/${enemy.maxHp} HP • Armor ${enemy.armor}</div>
          <div class="status-line">${enemy.statuses.exposed ? '<span class="status-badge bad">Exposed</span>' : ""}${enemy.statuses.weakened ? '<span class="status-badge bad">Weakened</span>' : ""}</div>
          ${neededTarget && neededTarget.target === "enemy" ? `<button class="small" ${enemy.hp <= 0 ? "disabled" : ""} data-action="combat-target" data-target="${enemy.uid}">${pending ? "Target" : "Select"}</button>` : ""}
        </div>
      </div>
    `).join("");
    const allyButtons = state.party.map(member => `
      <div class="unit-card art-card ${member.hp <= 0 ? "dead" : ""} ${token && token.kind === "party" && token.id === member.id ? "active" : ""}">
        ${artSlot("party", member.id, getPartyBase(member.id).name)}
        <div class="art-card-body">
          <strong>${getPartyBase(member.id).name}</strong>
          <div>${member.hp}/${getMaxHp(member.id)} HP • Def ${heroDefense(member.id)}</div>
          <div class="status-line">${member.guard ? '<span class="status-badge good">Guarded</span>' : ""}${member.bless ? '<span class="status-badge good">Blessed</span>' : ""}</div>
          ${neededTarget && neededTarget.target === "ally" ? `<button class="small" ${member.hp <= 0 ? "disabled" : ""} data-action="combat-target" data-target="${member.id}">${pending ? "Target" : "Select"}</button>` : ""}
        </div>
      </div>
    `).join("");

    return `
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2>${ENCOUNTER_MAP[combat.encounterId].name}</h2>
            <p class="subtle">Round ${combat.round} • ${token ? (token.kind === "party" ? `${getPartyBase(token.id).name}'s turn` : `${combat.enemies.find(e => e.uid === token.id)?.name}'s turn`) : ""}</p>
          </div>
          <button class="close-btn" disabled>In combat</button>
        </div>
        <div class="notice">${combat.introText}</div>
        ${token && token.kind === "party" ? `
          <div class="card">
            <h3>${getPartyBase(token.id).name}</h3>
            <div class="row">
              ${heroActions.map(action => `<button class="${pending === action.key ? "good" : ""}" data-action="combat-action" data-key="${action.key}">${action.label}</button>`).join("")}
            </div>
            <p class="subtle">${pending ? "Select a target below." : "Choose an action."}</p>
          </div>
        ` : `<div class="card"><p>The enemy acts.</p></div>`}
        <div class="combat-board">
          <div class="combat-column">
            <h3>Party</h3>
            ${allyButtons}
          </div>
          <div class="combat-column">
            <h3>Enemies</h3>
            ${enemyButtons}
          </div>
        </div>
        <div class="card">
          <h3>Combat Log</h3>
          ${combat.log.map(entry => `<div class="log-entry">${entry}</div>`).join("")}
        </div>
      </div>
    `;
  }

  function renderModal() {
    let html = "";
    if (state && state.combat) html = renderCombatModal();
    else if (state && state.activeScene) html = renderSceneModal();
    else if (state && state.ui.shop) html = renderShopModal();
    else if (state && state.ui.dialogue) html = renderDialogueModal();
    if (html) {
      dom.modalRoot.classList.remove("hidden");
      dom.modalRoot.innerHTML = html;
    } else {
      dom.modalRoot.classList.add("hidden");
      dom.modalRoot.innerHTML = "";
    }
  }

  function renderMap() {
    const rect = dom.mapCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    dom.mapCanvas.width = Math.floor(rect.width * dpr);
    dom.mapCanvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const mapW = rect.width;
    const mapH = rect.height;
    const size = Math.min(mapW / (Math.sqrt(3) * (C.region.width + 1.2)), mapH / (1.5 * (C.region.height + 1.3)));
    hexLayout = [];
    for (let r = 0; r < C.region.height; r++) {
      for (let q = 0; q < C.region.width; q++) {
        const x = size * Math.sqrt(3) * (q + 0.5 * (r & 1)) + size * 1.6;
        const y = size * 1.5 * r + size * 1.7;
        drawHex(q, r, x, y, size);
      }
    }
    dom.mapHint.textContent = "Gold-edged hexes are one step away. ◆ marks settlements, ✦ marks discovered sites, and the lantern ring marks your party.";
  }

  function hexPoints(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 180 * (60 * i - 30);
      points.push({
        x: cx + size * Math.cos(angle),
        y: cy + size * Math.sin(angle)
      });
    }
    return points;
  }

  function terrainColor(tile) {
    const palette = {
      plains: "#7f9760",
      forest: "#506c4e",
      hills: "#94815c",
      swamp: "#587062",
      mountain: "#7b7a83"
    };
    return palette[tile.terrain] || "#8b8b8b";
  }

  function drawHex(q, r, cx, cy, size) {
    const key = tileKey(q, r);
    const tile = getTile(q, r);
    const discovered = !!state.discoveredHexes[key];
    const points = hexPoints(cx, cy, size - 1);
    hexLayout.push({ q, r, cx, cy, size, points });
    ctx.beginPath();
    points.forEach((p, idx) => idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = discovered ? terrainColor(tile) : "#b8ae97";
    ctx.fill();
    ctx.strokeStyle = discovered ? "rgba(41,31,25,.42)" : "rgba(41,31,25,.18)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    if (!discovered) {
      ctx.fillStyle = "rgba(22,17,13,.58)";
      ctx.fill();
      return;
    }
    if (tile.road) {
      ctx.strokeStyle = "#f0ddb0";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.5, cy);
      ctx.lineTo(cx + size * 0.5, cy);
      ctx.stroke();
    }
    if (tile.river) {
      ctx.strokeStyle = "#8db8ca";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.55, cy + size * 0.2);
      ctx.quadraticCurveTo(cx, cy - size * 0.2, cx + size * 0.5, cy + size * 0.25);
      ctx.stroke();
    }

    const reachable = hexDistance(state.position, { q, r }) === 1;
    if (reachable) {
      ctx.strokeStyle = "rgba(232, 190, 91, .82)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      points.forEach((p, idx) => idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.stroke();
    }

    const loc = getLocationAt(q, r);
    if (loc) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(22,17,13,.48)";
      ctx.shadowBlur = 4;
      if (loc.type === "settlement") {
        ctx.fillStyle = "#2f241c";
        ctx.strokeStyle = "#e8be5b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.29, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f1d17a";
        ctx.font = `bold ${Math.max(11, size * 0.34)}px serif`;
        ctx.fillText("◆", cx, cy + size * 0.12);
        ctx.fillStyle = "#f8f0dc";
        ctx.font = `bold ${Math.max(11, size * 0.27)}px serif`;
        ctx.fillText(loc.data.name, cx, cy - size * 0.46);
      } else if (state.discoveredSites[loc.data.id]) {
        ctx.fillStyle = "#eadfc6";
        ctx.strokeStyle = "#2f241c";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - size * 0.25);
        ctx.lineTo(cx + size * 0.25, cy);
        ctx.lineTo(cx, cy + size * 0.25);
        ctx.lineTo(cx - size * 0.25, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#2f241c";
        ctx.font = `bold ${Math.max(10, size * 0.24)}px serif`;
        ctx.fillText("✦", cx, cy + size * 0.09);
        ctx.fillStyle = "#f8f0dc";
        ctx.font = `bold ${Math.max(10, size * 0.24)}px serif`;
        ctx.fillText(loc.data.name, cx, cy - size * 0.46);
      }
      ctx.restore();
    }

    if (state.position.q === q && state.position.r === r) {
      ctx.save();
      ctx.strokeStyle = "#f4c968";
      ctx.lineWidth = 4;
      ctx.setLineDash([Math.max(3, size * .12), Math.max(2, size * .08)]);
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#fff1b8";
      ctx.strokeStyle = "#2f241c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#5a3b19";
      ctx.font = `bold ${Math.max(9, size * .22)}px serif`;
      ctx.textAlign = "center";
      ctx.fillText("✦", cx, cy + size * .075);
      ctx.restore();
    }
  }

  function pointInPoly(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / ((yj - yi) || 0.0001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function onMapPointer(event) {
    if (!state || state.combat) return;
    const rect = dom.mapCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clicked = hexLayout.find(h => pointInPoly(x, y, h.points));
    if (!clicked) return;
    const loc = getLocationAt(clicked.q, clicked.r);
    if (clicked.q === state.position.q && clicked.r === state.position.r) {
      focusCurrentLocation();
      return;
    }
    const adjacent = neighbours(state.position.q, state.position.r).some(n => n.q === clicked.q && n.r === clicked.r);
    if (adjacent) {
      moveTo(clicked.q, clicked.r);
      return;
    }
    if (loc && state.discoveredSites[loc.data.id]) {
      state.ui.focus = { type: loc.type, id: loc.data.id };
      renderAll();
      showFeedback("Map focus", `${loc.data.name} is too far to travel to directly. Choose neighbouring hexes to move toward it.`);
      return;
    }
    showFeedback(
      "Too far to travel",
      "Choose one of the six neighbouring hexes around the party, then continue from there.",
      "bad"
    );
  }

  function renderAll() {
    if (!state) return;
    if (state.day > C.success.days && state.renown >= C.success.renownTarget && !state.worldFlags.victoryShown) {
      state.worldFlags.victoryShown = true;
      openMessage("Frontier Success", `By day ${state.day}, your party has earned ${state.renown} renown. The Grey March speaks your names with something like trust.`);
    }
    renderStatus();
    renderTabs();
    renderTabContent();
    renderMap();
    renderModal();
    refreshAmbience();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        if (!document.exitFullscreen) throw new Error("Fullscreen exit is unavailable");
        await document.exitFullscreen();
        showFeedback("Fullscreen off", "Returned to the normal browser view.");
        return;
      }
      if (!document.documentElement.requestFullscreen) {
        showFeedback("Fullscreen unavailable", "This browser does not allow fullscreen here.", "bad");
        return;
      }
      await document.documentElement.requestFullscreen();
      showFeedback("Fullscreen on", "Lantern Road is now using the full screen.", "good");
    } catch (err) {
      console.error(err);
      showFeedback("Fullscreen unavailable", "The browser blocked the fullscreen request.", "bad");
    }
  }

  function renderGameToText() {
    const location = state ? currentLocation() : null;
    return JSON.stringify({
      coordinateSystem: "Hex map uses offset coordinates; q increases right and r increases down.",
      mode: state?.combat ? "combat" : state?.activeScene ? "scene" : state?.ui?.dialogue ? "dialogue" : "exploration",
      campaign: state ? {
        day: state.day,
        hour: state.hour,
        weather: state.weather,
        gold: state.gold,
        renown: state.renown,
        fatigue: state.fatigue,
        position: state.position,
        location: location?.data?.name || null,
        inventory: state.inventory,
        factions: state.factions,
        activeQuests: Object.entries(state.quests)
          .filter(([, quest]) => quest.status === "active")
          .map(([id, quest]) => ({ id, stage: quest.stage, dueDay: quest.dueDay })),
        party: state.party.map((member) => ({
          id: member.id,
          hp: member.hp,
          guard: member.guard,
          loyalty: characterState(member.id).loyalty,
          memories: characterState(member.id).memories.map(memory => memory.id),
          personalArcReady: personalArcReady(member.id),
          build: state.progression?.builds?.[member.id] || null,
          equipment: state.progression?.equipment?.[member.id] || null,
          injury: state.progression?.injuries?.[member.id] || null
        })),
        relationships: state.characterState?.relationships || {}
      } : null,
      combat: state?.combat ? {
        encounterId: state.combat.encounterId,
        round: state.combat.round,
        activeId: state.combat.turnOrder[state.combat.turnIndex],
        enemies: state.combat.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => ({
          id: enemy.uid,
          kind: enemy.id,
          hp: enemy.hp,
          maxHp: enemy.maxHp
        }))
      } : null
    });
  }

  function installE2ETestHooks() {
    const params = new URLSearchParams(window.location.search);
    const localHost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    if (!localHost || params.get("e2e") !== "1") return;

    window.__lanternRoadTest = Object.freeze({
      adjacentHexCenter() {
        const adjacent = hexLayout.find(hex =>
          neighbours(state.position.q, state.position.r).some(point => point.q === hex.q && point.r === hex.r)
        );
        return adjacent ? { q: adjacent.q, r: adjacent.r, x: adjacent.cx, y: adjacent.cy } : null;
      },
      placeAtSite(siteId) {
        const site = SITE_MAP[siteId];
        if (!site) throw new Error(`Unknown site: ${siteId}`);
        state.position = { q: site.q, r: site.r };
        state.discoveredSites[siteId] = true;
        revealAround(site.q, site.r);
        state.activeScene = null;
        state.combat = null;
        state.ui.dialogue = null;
        state.ui.shop = null;
        state.ui.tab = "context";
        state.ui.focus = { type: "site", id: siteId };
        renderAll();
      },
      startCombat(encounterId = "toll_cutters") {
        if (!ENCOUNTER_MAP[encounterId]) throw new Error(`Unknown encounter: ${encounterId}`);
        state.activeScene = null;
        state.ui.dialogue = null;
        state.ui.shop = null;
        state.rngState = 123456789;
        startCombat(encounterId, "Regression test encounter.");
      }
    });
  }

  function handleDocumentClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;

    if (action === "set-tab") return;
    if (!state && !["load-game", "new-game"].includes(action)) return;

    switch (action) {
      case "close-dialogue":
        closeDialogue();
        break;
      case "close-scene":
        closeScene();
        break;
      case "close-shop":
        closeShop();
        break;
      case "scene-option":
        resolveSceneOption(Number(button.dataset.index));
        break;
      case "dialogue-choice":
        handleDialogueChoice(button.dataset.key);
        break;
      case "talk-npc":
        openDialogue(buildNpcDialogue(button.dataset.npc));
        break;
      case "hear-rumours":
        hearRumours(button.dataset.settlement);
        break;
      case "inn-rest":
        innRest(button.dataset.settlement);
        break;
      case "open-shop":
        openShop(button.dataset.settlement);
        break;
      case "use-item":
        useConsumable(button.dataset.item, button.dataset.member);
        break;
      case "equip-gear":
        equipGear(button.dataset.item);
        break;
      case "choose-build":
        chooseBuild(button.dataset.member, button.dataset.build);
        break;
      case "buy-item":
        buyItem(button.dataset.settlement, button.dataset.item);
        break;
      case "sell-item":
        sellItem(button.dataset.item);
        break;
      case "site-action":
        handleSiteAction(button.dataset.key);
        break;
      case "combat-action":
        chooseCombatAction(button.dataset.key);
        break;
      case "combat-target":
        heroAct(state.combat.pendingAction, button.dataset.target);
        break;
      case "focus-current":
        focusCurrentLocation();
        break;
      case "camp":
        campParty();
        break;
      default:
        console.warn(`Unhandled player action: ${action}`, button);
        showFeedback(
          "Action unavailable",
          "That control is not connected correctly yet. The game state was not changed.",
          "bad"
        );
        break;
    }
  }

  function bindStaticUI() {
    dom.newGameBtn.addEventListener("click", () => {
      startNewGame();
    });
    dom.saveBtn.addEventListener("click", saveGame);
    dom.loadBtn.addEventListener("click", loadGame);
    dom.fullscreenBtn.addEventListener("click", toggleFullscreen);
    dom.soundToggleBtn?.addEventListener("click", toggleSound);
    dom.ambienceToggleBtn?.addEventListener("click", toggleAmbience);
    dom.volumeSlider?.addEventListener("input", event => setAudioVolume(event.target.value));
    dom.campBtn.addEventListener("click", () => state && campParty());
    dom.focusHereBtn.addEventListener("click", () => state && focusCurrentLocation());
    dom.tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        if (!state) return;
        state.ui.tab = tab.dataset.tab;
        renderAll();
      });
    });
    document.body.addEventListener("click", handleDocumentClick);
    document.body.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button || button === dom.soundToggleBtn || button === dom.ambienceToggleBtn) return;
      playCue("ui");
    }, true);
    document.addEventListener("pointerdown", resumeSavedAudioFromGesture, { once: true, capture: true });
    document.addEventListener("keydown", resumeSavedAudioFromGesture, { once: true, capture: true });
    dom.mapCanvas.addEventListener("pointerdown", onMapPointer);
    window.addEventListener("resize", renderAll);
    document.addEventListener("keydown", event => {
      if (event.key.toLowerCase() === "f" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        toggleFullscreen();
      }
    });
  }

  function init() {
    bindStaticUI();
    updateAudioControls();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
    startNewGame();
    installE2ETestHooks();
    window.render_game_to_text = renderGameToText;
    window.advanceTime = () => {
      renderAll();
      return renderGameToText();
    };
  }

  init();
})();
