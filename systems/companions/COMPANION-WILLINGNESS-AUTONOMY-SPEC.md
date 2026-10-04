# Lantern Road — Companion Willingness, Autonomy & Suggestion Resolution

Task: **LR-0092**  
Owner: **Agent 3 — The Mechanist**  
Primary consumer: **LR-0093 Integrate companion autonomy and leader-suggestion mechanics**  
Governance input: **LR-0089 Player-Leader Party Contract**  
Story input: **LR-0088 Player-Leader and Consequential Dialogue Framework**  
Status: authoring/design only. This task does **not** edit runtime, save state or Storyteller prose.

## 1. Core promise

The player is the in-world **Leader** of a four-person active adventuring party:

- Leader;
- three active companions.

Companions are:

> **persuadable, not programmable.**

The Leader can suggest, ask, defer, negotiate and command.

A companion can:

- accept;
- accept reluctantly;
- counter-offer;
- refuse;
- volunteer;
- warn;
- interject;
- take a bounded proactive action when the situation and established character make that action predictable.

The system must make those responses **understandable**.

It must not create:

- random obstruction;
- hidden personality rolls;
- companions who seize irreversible story choices;
- constant permission prompts for ordinary combat actions;
- “high Trust = obedience”.

## 2. Authority boundary

The Player-Leader Party Contract is authoritative.

### Leader always retains final party-level authority over

- accepting/rejecting major quests;
- core quest resolutions;
- major faction commitments;
- party-level promises;
- revealing/withholding major party-held information;
- spending unique or rare party resources irreversibly;
- initiating an avoidable major battle that closes peaceful options;
- permanent roster dismissal;
- other irreversible campaign decisions.

A companion may:

- object;
- refuse their personal participation;
- propose another route;
- make the social cost visible.

They do **not** silently choose the outcome instead.

### Companion personal authority covers

Requests primarily concerning their own:

- body;
- conscience;
- identity;
- personal secret;
- personal risk;
- religious/moral authority;
- voluntary use of their name/expertise.

Examples:

- accepting treatment;
- taking first watch while injured;
- revealing a secret;
- personally making a statement they believe false;
- volunteering for a high-risk role.

Those are the main places willingness resolution belongs.

## 3. Ordinary combat control is not a refusal roll

Do **not** run willingness every time the player presses:

- Strike;
- Slip Knife;
- Sigil Bolt;
- Mace;
- ordinary target selection.

That would make combat feel like arguing with the controls.

Normal tactical commands are legitimate leadership in immediate danger and are ordinarily followed.

Companion autonomy should enter combat when:

- the action crosses a strong personal/value boundary;
- the companion is physically unable;
- the request uses a scarce/unique party resource;
- a telegraphed proactive tendency triggers;
- a special authored crisis explicitly owns the disagreement.

This keeps combat responsive while still letting companions feel human.

## 4. Deterministic willingness model

Willingness should be **deterministic by default**.

Do not roll a hidden d20 to decide whether a companion feels cooperative.

For a request:

```text
Willingness =
  value fit
+ Trust
+ relevant relationship
+ physical/mental state
+ stakes/urgency
+ resource pressure
+ recent leadership memory
```

Then apply hard boundaries before resolving the final band.

The UI never shows the numeric score.

The score is an implementation tool for consistent outcomes.

## 5. Suggested score range

Use a compact diagnostic range:

```text
-4 to +4
```

Suggested interpretation:

| Score | Default outcome |
| ---: | --- |
| +3 to +4 | **Accept** |
| +1 to +2 | **Reluctant accept** or warm accept depending character |
| 0 | **Counter-offer** when a reasonable alternative exists |
| -1 | **Counter-offer** or soft refusal |
| -2 to -4 | **Refuse** |

A hard personal/value boundary can force **Refuse** regardless of score.

A physically impossible request also refuses regardless of score.

## 6. Why deterministic beats random

The player should be able to learn:

> Garrick resists using the last Bandage on himself.

> Mira dislikes being volunteered to speak exact words for someone else.

> Oren will not certify a claim the evidence does not support.

> Brindle will not use faith to promise safety she cannot know.

That is character.

If the same request randomly succeeds one reload and fails the next with no changed context, the companion feels like a slot machine.

Randomness can still exist in:

- skill checks;
- combat attacks;
- travel events.

Core personal willingness should remain explainable.

## 7. Request descriptor

Every autonomy-relevant request should describe its situation declaratively.

Conceptual shape:

```text
request = {
  type,
  actorId,
  targetId,
  tags: [],
  stakes,
  urgency,
  personalRisk,
  scarceResource,
  reversible,
  contextId
}
```

### Request type examples

- treatment;
- rest;
- take_risky_role;
- retreat;
- use_scarce_resource;
- reveal_personal_information;
- speak_for_party;
- make_claim;
- destroy_evidence;
- protect_someone;
- investigate;
- accept_help;
- tactical_volunteer.

The exact runtime schema belongs to LR-0093.

## 8. Request tags

Tags let stable personality values interact with requests without one-off code for every line.

Useful tags:

- `protect_others`
- `shared_burden`
- `self_care`
- `high_personal_risk`
- `limits_autonomy`
- `requires_disclosure`
- `institutional_obedience`
- `truth_claim`
- `unsupported_certainty`
- `destroy_evidence`
- `mercy`
- `cruelty`
- `faith_claim`
- `uses_scarce_resource`
- `urgent`
- `retreat`
- `protect_secret`
- `asks_expertise`
- `micromanages_method`

Do not expose these identifiers as player-facing text.

## 9. Value fit

Each companion profile has a small set of:

- affinity tags;
- resistance tags;
- hard-boundary tags.

Do not create a giant personality stat sheet.

Only the strongest relevant affinity/resistance should usually apply.

Recommended magnitude:

- strong affinity: **+2**;
- mild affinity: **+1**;
- mild resistance: **-1**;
- strong resistance: **-2**.

Hard boundaries are handled separately.

## 10. Trust input

The current runtime internally stores `loyalty` from **-3 to +3**, but canonical player-facing language is **Trust**.

Do not rename the persisted key casually; LR-0093 must consume the save/migration contract.

Current visible bands already map well:

| Internal value | Player-facing relationship |
| ---: | --- |
| -3 | Rivals |
| -2 | Sharp friction |
| -1 | Friction |
| 0 | Unproven |
| +1 | Growing trust |
| +2 | Strong trust |
| +3 | Close |

### Willingness Trust adjustment

Suggested:

| Trust | Willingness modifier |
| --- | ---: |
| -3 | -2 |
| -2 to -1 | -1 |
| 0 | 0 |
| +1 to +2 | +1 |
| +3 | +2 |

Trust applies as **benefit of the doubt**, not as mind control.

It should be reduced or ignored when:

- request directly violates a core value;
- request asks the companion to lie using their own authority;
- request crosses a strong personal boundary.

## 11. High Trust refusal

High Trust can make refusal **more candid**, not less likely.

Example:

> “No.”

> Mira looks genuinely sorry.

> “And you know me well enough to know why.”

This is desirable.

Do not guarantee compliance at +3 Trust.

## 12. Companion-to-companion relationship input

If a request materially concerns another companion, their relationship may shift willingness by at most **±1**.

Examples:

- Garrick may be more eager to cover someone he feels responsible for.
- Mira may resist being used as leverage in another companion's personal matter.
- Brindle may volunteer help after a recent reconciliation.
- Oren may be more patient explaining evidence to someone who previously listened.

Keep this modifier small.

The Leader relationship remains the primary social axis.

## 13. Fatigue input

Fatigue should change willingness only when relevant.

### Fatigue 0–2

No generic modifier.

### Fatigue 3–4

Possible:

- **-1** to optional high-effort/high-risk requests;
- **+1** toward rest when rest is reasonable;
- sharper dialogue tone.

### Fatigue 5–6

Possible:

- **-2** to optional non-urgent personal risk;
- **+2** toward rest/recovery;
- counter-offer to delay a low-urgency task.

Immediate danger may cancel part of this penalty.

Fatigue should not cause random disobedience in basic combat.

## 14. Injury / HP input

Injury affects requests involving:

- treatment;
- rest;
- physical risk;
- watch duty;
- taking point.

Possible general adjustments:

### Healthy / minor damage

No generic change.

### Injured or below half HP

- **+1** toward appropriate treatment/rest;
- **-1** toward avoidable high personal risk.

### Critically hurt / near knockout

- **+2** toward treatment/retreat;
- **-2** toward avoidable high-risk role.

Personality can still resist.

Garrick may remain reluctant to consume scarce treatment even while hurt.

That conflict is the point.

## 15. Stakes and urgency

### Low stakes

Companions have more room to:

- disagree;
- joke;
- refuse;
- counter-offer.

### Serious but reversible

Use normal willingness.

### Immediate danger

Time-critical commands gain **+1 willingness** when:

- request is physically possible;
- request is ordinary combat/escape coordination;
- request does not violate a hard value boundary.

This represents legitimate emergency leadership.

### Irreversible party decision

Willingness does **not** decide the final party outcome.

Companions advise/object; Leader decides.

## 16. Scarce resource pressure

A companion may care whether a treatment/resource is scarce.

Suggested pressure:

| Result after spending | Modifier |
| --- | ---: |
| 2+ ordinary copies remain | 0 |
| 1 ordinary copy remains | -1 |
| spend last ordinary copy | -2 |
| unique/rare party item | no autonomous spend |

Urgency can offset this.

Example:

- last Bandage;
- Garrick is hurt but standing;
- Mira is near knockout.

Garrick's protective values may make refusal especially likely.

## 17. Recent leadership memory

Do not remember every request forever.

Use a small set of relevant recent/important memories.

Examples:

- `respected_boundary`
- `shared_burden`
- `forced_compliance`
- `ignored_advice`
- `accepted_correction`
- `kept_relevant_promise`
- `broke_relevant_promise`
- `used_companion_as_authority`
- `trusted_method`
- `micromanaged_method`

A directly relevant memory may shift willingness by **±1**.

A major authored rupture may be stronger, but belongs in Storyteller content and Trust changes.

## 18. Recent treatment memory

Treatment should not be a stateless button.

Examples:

### Garrick

If Leader repeatedly respects his refusal but later shares burden:

- future treatment willingness can improve.

If Leader repeatedly orders treatment while ignoring his reason:

- he may comply in emergencies but become less cooperative socially.

### Mira

If Leader asks consent before involving her in a plan:

- future voluntary cooperation improves.

If Leader repeatedly volunteers her without asking:

- requests involving personal exposure become harder.

### Oren

If Leader accepts corrections:

- Oren becomes more willing to simplify/advise under pressure.

If Leader repeatedly demands unsupported claims:

- he hardens his refusal.

### Brindle

If Leader respects her faith boundary:

- she becomes more willing to help find honest wording.

If Leader repeatedly uses her authority as propaganda:

- she refuses earlier and more directly.

## 19. Outcome: Accept

Use when:

- request fits values;
- context is reasonable;
- Trust/supporting memories are sufficient;
- no hard boundary applies.

Player-facing result should still sound like the character.

Not:

> **ACCEPT SUCCESS**

Instead:

> “All right.”

> Garrick takes the bandage before he can turn accepting help into an argument.

## 20. Outcome: Reluctant accept

Use when:

- the companion disagrees but accepts Leader authority;
- the cost is personal but not a hard boundary;
- urgency makes compliance reasonable;
- Trust allows benefit of the doubt.

Reluctant acceptance should often create memory.

Example:

> “Then own the order.”

This is not the same as happy agreement.

## 21. Outcome: Counter-offer

Counter-offer is the preferred middle state when a reasonable alternative exists.

Examples:

### Garrick

> “Use the Bandage on Mira. I’ll take half a watch after.”

### Mira

> “I’ll talk to Nera. I choose the words.”

### Oren

> “I won’t call it safe. I’ll say the chart makes the route credible.”

### Brindle

> “I won’t promise protection. I’ll walk with them to the marker.”

A counter-offer should present a concrete alternative action.

## 22. Outcome: Refuse

Refusal is appropriate when:

- hard personal/value boundary;
- severe negative willingness;
- physically impossible;
- request repeats a recently rejected boundary without meaningful change.

Refusal should state a reason.

Avoid:

> Mira refuses.

Prefer:

> “No. You don’t get to volunteer my history for this.”

## 23. Hard boundaries

Hard boundaries override numeric willingness.

### Garrick

Potential hard/near-hard boundaries:

- deliberately shifting avoidable danger onto someone clearly less able to bear it;
- abandoning someone in immediate danger when he could reasonably help.

### Mira

Potential hard boundaries:

- forced disclosure of personal history;
- promises made in her name without consent;
- using her identity as institutional proof.

### Oren

Potential hard boundaries:

- certifying something he believes evidence does not support;
- deliberately destroying important evidence in his care without an exceptional authored crisis.

### Brindle

Potential hard boundaries:

- using faith to knowingly promise safety/certainty she cannot defend;
- cruelty presented as necessary efficiency when a real alternative exists.

Storyteller owns exact prose and authored exceptions.

Mechanist owns predictable resolution.

## 24. Garrick profile

Canonical values:

- Duty;
- Protection.

Mechanistic traits:

- protective;
- direct;
- stoic;
- self-sacrificing.

### Affinities

- `protect_others` +2
- `shared_burden` +2
- `urgent` +1
- clear responsibility +1

### Resistances

- `self_care` when resources are scarce -1
- `limits_autonomy` around rest/treatment -1
- shifting risk to another person -2

### Typical personal conflict

Garrick does not resist because he is “proud” as a generic trait.

He resists because:

> if he uses the resource, someone else may not have it later.

### Treatment example

Request:

> “Garrick, take a Bandage.”

Context:

- Growing Trust: +1
- Garrick hurt: +1
- last Bandage: -2
- Mira hurt worse: protective resistance -2

Likely result:

**Refuse / counter-offer.**

> “Use it on Mira.”

Change context:

- three Bandages remain;
- Leader recently shared first watch;
- Garrick below half HP.

Likely result:

**Accept.**

## 25. Garrick proactive tendency

Trigger:

- ally is in clearly telegraphed immediate danger;
- Garrick can protect them without spending a unique party resource.

Allowed:

- volunteer to take point;
- recommend Hold Fast;
- automatically resolve an already-armed Intercept Reaction;
- offer to take a dangerous but reversible role.

Not allowed:

- start an avoidable battle;
- spend the last healing item;
- seize a quest decision.

## 26. Mira profile

Canonical values:

- Freedom;
- Truth.

Mechanistic traits:

- independent;
- guarded;
- perceptive;
- improvisational.

### Affinities

- `asks_expertise` +2
- `protect_secret` +2
- honest uncertainty +1
- room to choose method +2

### Resistances

- `micromanages_method` -2
- `requires_disclosure` -2
- `institutional_obedience` -1
- `limits_autonomy` -2

### Social-role example

Request:

> “Mira, talk to Nera. She’ll hear it better from you.”

If Leader adds:

> “Choose your words.”

likely **Accept**.

If Leader says:

> “Say exactly this.”

likely **Counter-offer / reluctant accept** depending urgency/Trust.

If request exposes her old identity:

likely **Refuse** unless authored context has changed the boundary.

## 27. Mira proactive tendency

Allowed:

- volunteer to scout;
- warn about a trap/lie;
- propose an alternate route;
- interject when someone makes a claim she knows is false;
- suggest a deceptive approach.

Not allowed:

- disclose her own protected secret without authored reason;
- make a party promise;
- initiate major combat to “be bold”.

If a future companion is explicitly bold, use the generic bounded-proactivity rules in Section 39 rather than turning Mira into that archetype.

## 28. Oren profile

Canonical values:

- Knowledge;
- Responsibility.

Mechanistic traits:

- analytical;
- evidence-bound;
- cautious;
- accountable.

### Affinities

- `asks_expertise` +2
- `truth_claim` when evidence supports it +2
- explicit reasoning +2
- investigation +1

### Resistances

- `unsupported_certainty` -2
- `destroy_evidence` -2
- expertise treated as obedience -2
- reckless action without reason -1

### Claim example

Leader:

> “Tell Crow the chart proves the route is safe.”

Oren knows it proves only historical use.

Hard response:

**Refuse wording.**

Counter-offer:

> “I’ll say the chart makes the route credible enough to inspect.”

High Trust does not remove this boundary.

## 29. Oren proactive tendency

Allowed:

- correct a material factual error;
- warn when evidence does not support a plan;
- volunteer analysis;
- propose a safer claim/experiment;
- surface a relevant contradiction.

Not allowed:

- overrule the Leader's final quest decision;
- destroy/keep party evidence secretly because he believes he knows better.

## 30. Brindle profile

Canonical values:

- Mercy;
- Faith.

Mechanistic traits:

- compassionate;
- perceptive;
- service-oriented;
- morally bounded.

### Affinities

- `mercy` +2
- care for vulnerable person +2
- shared responsibility +1
- honest comfort +2

### Resistances

- `cruelty` -2
- `faith_claim` when used as unsupported certainty -2
- instrumentalising her authority -2
- unnecessary harm -1

### Faith example

Leader:

> “Tell them the Lamp will keep them safe.”

Likely:

**Value refusal.**

Counter-offer:

> “I can tell them I’ll walk with them.”

Trust changes the warmth/directness, not the boundary.

## 31. Brindle proactive tendency

Allowed:

- offer comfort;
- suggest treatment;
- point out an avoidably cruel option;
- volunteer non-scarce help;
- interject when faith is being used as false certainty.

Not allowed:

- spend a rare medicine automatically;
- override Leader allocation of a unique resource;
- promise on behalf of the party.

## 32. Treatment suggestion flow

Recommended interaction:

1. Leader selects **Suggest treatment**.
2. System evaluates willingness.
3. Companion responds in character.
4. If accept:
   - show exact resource/time cost;
   - Leader confirms spend.
5. If reluctant accept:
   - show response;
   - Leader confirms;
   - relevant memory may record.
6. If counter-offer:
   - present alternative.
7. If refuse:
   - allow **Ask why** or leave it.
8. Command/persuasion options appear only if valid.

Do not spend the Bandage before the social resolution and Leader confirmation.

## 33. Rest suggestion flow

Rest is a party-level expedition choice, so companions cannot veto the Leader's final decision.

They may:

- advocate for/against rest;
- refuse a personal watch duty;
- volunteer;
- complain;
- remember repeated disregard.

If Leader chooses camp/rest:

- party rests.

Autonomy changes relationships/roles around the rest, not whether the game obeys a final party-level travel decision.

## 34. Retreat suggestion flow

Retreat in immediate danger is party-level tactical authority.

Companions may:

- strongly advocate;
- object;
- volunteer to cover withdrawal.

The Leader owns the final retreat decision.

A companion may refuse a *personal suicidal rearguard request*.

That refusal uses willingness.

## 35. Risky role flow

Examples:

- take point;
- cross unstable span first;
- draw enemy attention;
- climb dangerous structure;
- carry dangerous object.

This is an ideal willingness use case.

Factors:

- companion role/skills;
- personal risk;
- values;
- injury/Fatigue;
- Trust;
- who else would bear risk if they refuse.

A competent companion may still refuse a reckless request.

## 36. Scarce resource flow

A companion may recommend:

> “Use the last tonic on Mira.”

But may not automatically spend it.

If Leader suggests the companion consume a scarce resource:

- willingness can accept/refuse personal use;
- final actual spend is still explicitly confirmed by Leader.

If the resource is unique/rare:

- no autonomous spend under this system.

## 37. Persuasion hooks

Do not make persuasion a universal reroll button.

The Leader can use **one meaningful follow-up** per request instance.

Possible follow-ups:

### Ask why

No score bonus.

Reveals:

- main reason;
- possible counter-offer;
- whether boundary is soft/hard.

### Explain

Leader chooses an authored reason.

If reason aligns with the companion value:

- **+1 willingness**.

Examples:

- shared burden for Garrick;
- autonomy/complete information for Mira;
- evidence/reasoning for Oren;
- mercy/honest responsibility for Brindle.

### Reassure

Useful where fear/uncertainty is the issue.

Not useful against hard values.

### Invoke Trust

Not a literal button label.

At high Trust, an authored option may say:

> “I’m asking you to trust my judgement.”

Maximum:

- **+1**;
- cannot break hard boundary.

### Command

See Section 38.

Only one persuasion/command escalation should resolve the same request.

Do not let the player spam every dialogue option until the score rises.

## 38. Command hook

A Command is legitimate primarily in:

- immediate danger;
- time-critical coordination;
- an established command responsibility.

### Command may convert

- Counter-offer → Reluctant accept;
- Soft refusal → Reluctant accept;

when:

- physically possible;
- no hard value boundary;
- urgency is credible.

### Command cost

If used where cooperation was reasonably available:

- record `forced_compliance` or `commanded_recently`;
- possible Trust -1 depending authored context.

Do not apply Trust loss automatically for every combat order.

### Command cannot silently override

- hard personal/value boundary;
- protected personal disclosure;
- unique resource spend;
- irreversible quest/faction decision.

## 39. Bounded proactive behaviour

A proactive tendency is a **triggered character expression**, not a random AI takeover.

### Trigger requirements

All proactive behaviours must be:

1. character-grounded;
2. triggered by visible circumstances;
3. bounded in consequence;
4. explainable;
5. rare enough that Leader authority remains meaningful.

### Preferred proactive forms

#### Offer

> Garrick: “I’ll take point.”

Leader can accept or decline.

#### Warning

> Oren: “That conclusion goes further than the evidence.”

No action stolen.

#### Counterproposal

> Mira: “There’s another path.”

Leader chooses.

#### Interjection

> Brindle: “Don’t call that mercy if we haven’t named who pays.”

Conversation changes; final choice remains Leader's.

#### Armed reaction

If the Leader has already chosen a stance/ability that authorises a reaction, the companion may resolve it automatically under its declared rule.

Example:

- Leader uses Hold Fast;
- Garrick's first legal Intercept resolves when triggered.

## 40. Bold / guarded / proud generic tendencies

The system should support future/current character traits without reducing people to archetypes.

### Bold

May:

- volunteer for a risky role;
- propose immediate action;
- in already-started combat, favour proactive/forward tactical suggestions.

May **not**:

- automatically start an avoidable major battle;
- spend unique resources;
- seize irreversible decisions.

### Guarded / shy

May:

- decline optional personal conversation;
- offer shorter answers at low Trust;
- require time/new evidence before reopening a personal topic.

Must not:

- block required functional communication;
- randomly refuse ordinary combat actions because “shy”.

### Proud / self-reliant

May:

- resist treatment/help;
- counter-offer to continue with a lower-cost option;
- react negatively to public micromanagement.

Must not:

- ignore physically impossible limits;
- become immune to Trust/context.

These are tools for authored personality, not universal sliders every character needs.

## 41. Proactivity frequency cap

Avoid constant companion interruptions.

Recommended first implementation:

- at most **one unsolicited proactive social/expedition offer per meaningful scene/context**;
- at most **one proactive combat prompt per companion per encounter**, outside declared Reactions;
- authored major scenes may deliberately exceed this.

Routine warnings already embedded in dialogue do not need a mechanical “proactivity event”.

## 42. Inspectable reasons

The player should understand why a request resolved as it did.

Do not expose:

> Willingness = -2

Use character response plus optional concise reason cues.

Example:

> **Garrick refuses the Bandage.**

> “Mira needs it more.”

Supporting UI may show:

- **Last Bandage**
- **Mira badly hurt**
- **Garrick: Protection**

Keep it short.

## 43. No hidden arbitrary refusal

A refusal must be traceable to at least one of:

- value;
- Trust;
- relationship;
- injury/Fatigue;
- stakes;
- resource scarcity;
- recent relevant memory;
- hard boundary;
- physical impossibility.

If none apply, refusal is a bug/design error.

## 44. Save/persistence boundary

LR-0093 must consume LR-0011's versioned save system.

Persist:

- significant willingness-related memories;
- Trust;
- companion relationship state;
- persistent injury/Fatigue through their owning systems;
- any explicit configured proactive tendency if such a setting exists.

Do not persist:

- computed willingness score;
- temporary reason text;
- derived outcome if the underlying state can reproduce it;
- every trivial accepted suggestion.

## 45. Existing internal loyalty key

Canonical UI term is **Trust**.

Current save/runtime may still store:

```text
characterState.members[id].loyalty
```

Do not rename that persisted key inside LR-0093 unless the owning save migration explicitly covers it.

Use a compatibility accessor if needed.

## 46. Memory ownership boundary

Storyteller owns:

- prose;
- exact character voice;
- specific personal promises;
- personal-arc callbacks;
- authored value ruptures.

Mechanist owns:

- willingness resolution;
- modifier meanings;
- request types/tags;
- outcome bands;
- bounded proactivity;
- anti-frustration rules.

Steward owns:

- stable runtime/state architecture.

Do not create a second dialogue-memory engine.

## 47. Integration with LR-0094 action economy

Companion autonomy should not bypass action costs.

If a companion takes a proactive combat action:

- it spends the same Action/Quick Action/Reaction resource that the action normally uses;
- or it is an explicitly free authored effect.

No “personality AI” gets secret extra turns.

If Garrick automatically uses an armed Intercept:

- spend Reaction.

If a companion volunteers for a Quick Action:

- the Leader must still confirm if it spends a scarce resource.

## 48. Integration with injuries/recovery

Consume LR-0058.

Injury may change willingness but should not:

- stack arbitrary personality penalties;
- make a companion unusable;
- create random refusal.

Examples:

- injured Garrick becomes more resistant to being sidelined, while objective danger makes treatment more reasonable;
- exhausted Mira becomes blunter, not generically hostile;
- injured Oren may resent being treated as incapable;
- exhausted Brindle may decline optional emotional labour.

## 49. Integration with direct companion dialogue

Consume LR-0091 when authored.

A refusal/counter-offer should be discussable through direct dialogue when content exists.

Example:

> “Why won’t you take the Bandage?”

This can expose:

- resource concern;
- old memory;
- personal value;
- relationship issue.

Mechanics provide reason codes.

Storyteller provides voice.

## 50. Representative deterministic scenarios

### Scenario A — Garrick and last Bandage

State:

- Trust +1;
- Garrick at 45% HP;
- Mira at 20% HP;
- 1 Bandage;
- no immediate combat.

Likely:

**Counter-offer / refuse self-treatment.**

> “Use it on Mira.”

### Scenario B — Garrick, supplies comfortable

State:

- Trust +2;
- Garrick at 40% HP;
- 4 Bandages;
- Leader recently shared watch burden.

Likely:

**Accept.**

### Scenario C — Mira asked to speak freely

State:

- Trust +1;
- no sensitive identity exposure;
- Leader asks her to speak to Nera in her own words.

Likely:

**Accept.**

### Scenario D — Mira micromanaged

State:

- Trust 0;
- Leader dictates exact wording;
- topic implicates Mira's past.

Likely:

**Refuse / counter-offer.**

### Scenario E — Oren asked to overstate evidence

State:

- Trust +3;
- evidence does not support “safe”.

Likely:

**Value refusal.**

Trust does not change it.

### Scenario F — Oren asked for analysis in emergency

State:

- Trust 0;
- immediate danger;
- evidence available.

Likely:

**Accept.**

### Scenario G — Brindle asked for false certainty

State:

- Trust +3;
- Leader asks her to promise the Lamp guarantees safety.

Likely:

**Value refusal + honest counter-offer.**

### Scenario H — exhausted companion risky role

State:

- Fatigue 5;
- injury;
- non-urgent risky role.

Likely:

**Counter-offer/refuse** unless personal values strongly demand taking it.

## 51. Anti-frustration tests

LR-0093 should fail review if any of these become common:

- player must ask permission for every basic combat action;
- same request gives different result after reload with no state change;
- companion spends a rare item automatically;
- companion starts an avoidable major battle without authored warning;
- high Trust always means yes;
- low Trust means constant petty refusal;
- “personality” overrides obvious physical reality;
- refusal gives no understandable reason;
- persuasion can be spammed until compliance;
- commands have no social cost outside emergencies;
- a reserve companion reacts to an event they did not witness.

## 52. Runtime resolution pseudocode

Conceptual only:

```text
resolveSuggestion(companion, request):
  if physicallyImpossible(request):
    return REFUSE(reason=PHYSICAL_LIMIT)

  if hardBoundary(companion, request):
    return REFUSE(reason=VALUE_BOUNDARY)

  score = valueFit(companion, request)
  score += trustModifier(companion.trust, request)
  score += relationshipModifier(companion, request)
  score += conditionModifier(companion, request)
  score += stakesModifier(request)
  score += scarcityModifier(request)
  score += recentMemoryModifier(companion, request)

  if score >= 3:
    return ACCEPT

  if score >= 1:
    return RELUCTANT_ACCEPT

  if score >= -1 and hasCounterOffer(companion, request):
    return COUNTER_OFFER

  return REFUSE
```

No random term.

## 53. Persuasion resolution pseudocode

```text
followUp(request, companion, approach):
  if request.alreadyEscalated:
    return currentOutcome

  if approach == ASK_WHY:
    revealReasons()
    return currentOutcome

  if approach matches companion value:
    score += 1

  if approach == COMMAND and emergencyAuthorityApplies:
    softRefusal may become RELUCTANT_ACCEPT
    record command memory if socially significant

  hard boundary remains hard

  mark request escalated
  resolve once
```

## 54. Required automated tests for LR-0093

At minimum:

1. same state → same willingness result;
2. Trust shifts a soft request outcome predictably;
3. high Trust does not override Oren/Brindle hard boundary;
4. Fatigue changes non-urgent risky-role response;
5. injury changes treatment response;
6. last Bandage changes Garrick treatment response;
7. relevant recent memory changes a soft request by one band;
8. Ask Why reveals reason but does not alter state;
9. matching Explain approach can move one soft band;
10. escalation cannot be spammed repeatedly;
11. emergency Command can produce reluctant acceptance for a soft refusal;
12. Command cannot override hard boundary;
13. unique resource is never auto-spent;
14. proactive offer does not make irreversible decision;
15. proactive combat action spends normal action resource;
16. reserve companion cannot proactively react to unseen event;
17. save/reload preserves relevant persistent context;
18. player-facing result never exposes internal score/tag keys.

## 55. Acceptance mapping for LR-0092

### Compact willingness model

Sections 4–18 define deterministic value, Trust, relationship, condition, stakes, scarcity and memory inputs.

### Suggestions rather than absolute commands

Sections 2–3 and 32–38 distinguish personal suggestions from legitimate party/tactical authority.

### Accept / reluctant accept / refuse / counter-offer

Sections 19–22 define all four outcomes and their player-facing meaning.

### Bounded proactive tendencies

Sections 25, 27, 29, 31 and 39–41 define character-specific and generic proactivity without arbitrary behaviour.

### Irreversible choices / rare resources remain Leader-owned

Sections 2, 36 and 39 enforce the governance boundary.

### Predictable persuasion, Trust and override hooks

Sections 37–38, 42–43 and 52–53 define deterministic escalation and anti-frustration rules.

## 56. Handoff to LR-0093

LR-0093 should implement the smallest reusable resolution layer that can support:

- treatment willingness;
- risky-role willingness;
- retreat/recovery advice;
- scarce-resource confirmation;
- selected bounded proactive behaviours.

Do **not** attempt to turn every combat click and every dialogue line into an autonomy calculation.

The player-facing promise is:

> **You lead people who have reasons.**

A companion should sometimes say yes, sometimes say no, and sometimes offer something better — but the player should nearly always understand why.
