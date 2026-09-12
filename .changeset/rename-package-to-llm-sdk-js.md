---
"llm-sdk-js": minor
---

Renamed the npm package from `llm-sdk` to `llm-sdk-js` (the original name was already taken by
an unrelated package). Update imports and install commands accordingly:

```bash
npm install llm-sdk-js
```

```ts
import { createRouter } from "llm-sdk-js";
```

The GitHub repository name is unchanged.
