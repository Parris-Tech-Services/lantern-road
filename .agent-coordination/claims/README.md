# Active scope locks

Do not manually place descriptive files here.

An agent claims work by creating exactly one file named:

```
<exclusive_scope>.lock.json
```

using a **create-only** GitHub operation on `main`.

If that file already exists, the scope is already owned and the claiming agent must choose another task.

See `../CLAIM-PROTOCOL.md`.
