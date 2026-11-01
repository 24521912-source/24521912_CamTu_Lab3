# AI Failure Audit — Exercise 2

## 1. `npm install` fails due to a TypeScript version conflict

### Description

The AI scaffolded Exercise2 with `typescript: "~7.0.2"` in `package.json`. Running `npm install` produced this error in the terminal:

```
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
npm error Found: typescript@7.0.2
npm error Could not resolve dependency:
npm error peer typescript@">=4.8.4 <6.1.0" from typescript-eslint@8.72.1
```

As a result, `node_modules` was never installed, so `npm run dev`, `npm run build` (`tsc -b`) and `npm run lint` (`eslint`) could not run.

### How I detected it

- I ran `npm install` in `Exercise2/` and saw the `ERESOLVE` error in the terminal.
- I read the error message: `typescript-eslint@8.72.1` requires the peer dependency `typescript >=4.8.4 <6.1.0`, but the project declares `typescript ~7.0.2`, which is outside the supported range.

### Root cause

The AI picked the newest TypeScript release (7.x) without checking the peer dependency of `typescript-eslint`, which does not support TypeScript 7 yet.

### How I fixed it

1. Edited `package.json` to downgrade TypeScript to a compatible version, matching Exercise1:

   ```diff
   - "typescript": "~7.0.2",
   + "typescript": "~6.0.3",
   ```

2. I did not use `--force` or `--legacy-peer-deps`, because those flags only hide the conflict instead of fixing it and can make ESLint break at runtime.



## 2. AI told me to use the React Profiler tab without mentioning the required extension

### Description

ChatGPT told me to check the **Profiler** tab of the web app in the browser DevTools. However, the Profiler tab is not built into the browser. It comes from the **React Developer Tools** extension, which I had not installed. The AI did not mention this prerequisite.

### How I detected it

I opened the browser DevTools as instructed, but there was no Profiler tab, so I could not follow the AI's instructions.

### Root cause

The AI assumed the React Developer Tools extension was already installed and skipped this setup step in its instructions.

### How I fixed it

1. Installed the **React Developer Tools** extension for my browser.
2. Reloaded the app and reopened DevTools. The **Profiler** tab (and the **Components** tab) appeared, and I was able to check the Profiler successfully.


