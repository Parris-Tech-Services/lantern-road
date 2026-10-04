# Road & Inn Fallback Rumours

These fill the gaps when the Leader asks for news away from a settlement or when all major local topics have already been heard.

They should never override a newly eligible meaningful settlement rumour.

---

# Road-phase rumours

## RF-01 — Early campaign: carts turning back

**Source:** passing traveller  
**Reliability:** LIKELY  
**Condition:** days 1–4

> “Road feels thinner.”
>
> “Not fewer miles.”
>
> “Fewer people willing to trust the next mile.”

---

## RF-02 — Obligations phase: everybody has urgency

**Source:** drover  
**Reliability:** LOCAL COLOUR  
**Condition:** days 5–8

> “Greyfen says freight is urgent.”
>
> “Alderwatch says medicine is urgent.”
>
> “Candlemere says evidence is urgent.”
>
> “My mule says lunch is urgent.”
>
> “Finally, an institution I understand.”

---

## RF-03 — Revelation phase: old roads

**Source:** traveller with copied map  
**Reliability:** HEARSAY  
**Condition:** days 9–12 / route revelation seeded

> “Everyone's talking about old roads now.”
>
> “Funny how a path becomes interesting once somebody important says it used to exist.”

---

## RF-04 — Pressure phase: weather

**Source:** carter  
**Reliability:** RELIABLE  
**Condition:** days 13–15

> “River's climbing.”
>
> “If you're choosing between the long road and the low road, choose before the rain chooses for you.”

---

## RF-05 — Convergence phase: everyone wants the party

**Source:** messenger  
**Reliability:** HEARSAY  
**Condition:** days 16–17

> “Greyfen wants you.”
>
> “Candlemere wants you.”
>
> “Wardens want you.”
>
> “Blacksalt says they don't, which probably means they do.”

---

# Inn fallback

## IF-01 — Someone else's road story

**Source:** common room  
**Reliability:** LOCAL COLOUR

> “A man at the next table has told the same story three times.”
>
> “The river gets wider in every version.”

---

## IF-02 — Price of dry socks

**Source:** traveller  
**Reliability:** LOCAL COLOUR

> “You can tell how bad the weather is by what people will pay for dry socks.”

---

## IF-03 — No fresh rumour

**Source:** innkeeper  
**Reliability:** LOCAL COLOUR

> “Nothing new.”
>
> “Which means either a quiet day or better liars.”

---

## IF-04 — Party reputation distorted

**Source:** overheard strangers  
**Reliability:** HEARSAY  
**Condition:** Renown notable

> “That's them.”
>
> “No it isn't.”
>
> “They were taller in the story.”

The Leader may choose to correct them or keep listening if later dialogue runtime supports it.

---

## IF-05 — Faction spin collision

**Source:** two travellers  
**Reliability:** BIASED  
**Condition:** strong faction consequences active

> “Guild kept the road open.”
>
> “Wardens kept it safe.”
>
> “Archive proved whose road it was.”
>
> A fourth voice:
>
> “And somehow I still had to walk it.”

Use only where it matches campaign state.

---

# Exhaustion behaviour

When the player repeatedly presses **Hear rumours** with no new eligible topic:

1. do not replay a critical quest hook as if newly discovered;
2. choose a short local-colour fallback not heard recently;
3. allow the UI to say there is **nothing new** while still giving a small atmospheric line;
4. after enough repeats, a direct response is acceptable:

> “You've heard the room.”
>
> “Give it a day or give people something new to talk about.”

This is better than pretending infinite fresh intelligence exists.

---

# Changed-state priority

When an old rumour has a new outcome variant, the new variant should outrank unrelated fallback gossip.

Example priority:

1. direct consequence of player's recent major choice;
2. active quest clue;
3. campaign-phase pressure;
4. faction interpretation;
5. local colour.

That ordering helps the world feel responsive to the player rather than random.
