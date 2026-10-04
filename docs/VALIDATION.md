# Repository validation commands

These checks are technical safety nets. They do not replace Warden black-box testing, Wayfinder accessibility/UX review, or Josh's creative sign-off.

## DOM contract integrity

Run:

```bash
node scripts/validate-dom-contract.mjs
```

The validator checks objective HTML/runtime wiring:

- duplicate non-empty `id` attributes in `index.html`;
- missing targets referenced by `for`, `aria-controls`, `aria-labelledby`, and `aria-describedby`;
- literal `document.getElementById("...")` references in first-party runtime JavaScript;
- literal `#id` references inside `querySelector(...)` and `querySelectorAll(...)`.

Dynamic selectors are intentionally ignored rather than guessed.

The check does **not** decide whether a label is good, whether focus order is intuitive, whether contrast is sufficient, or whether the interaction is accessible in practice. Those remain Wayfinder/Warden responsibilities.

GitHub Actions runs the same validation whenever `index.html`, runtime JavaScript, or the validator itself changes.
