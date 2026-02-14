# commutee

Find others to carpool.

## Run locally

```bash
npm start
```

Then open http://localhost:3000 in your browser.

Or open `index.html` directly in the browser (no server needed for this setup).

## Project structure

```
commutee/
  index.html      # Single page, entry point
  css/style.css   # Styles
  js/app.js       # Main JavaScript (vanilla – no framework)
  package.json    # Optional: run `npm start` for a local server
```

## Java → JavaScript quick reference (for Java devs)

| Java | JavaScript |
|------|------------|
| `String s = "hi";` | `let s = "hi";` or `const s = "hi";` |
| `int x = 5;` | `let x = 5;` (no type – JS has number for int/float) |
| `System.out.println(x);` | `console.log(x);` |
| `==` (equals) | Prefer `===` (strict equality; no auto-convert) |
| `boolean` | `true` / `false` (same) |
| `List<String>` | `const list = ["a", "b"];` or `[]` |
| `Map<K,V>` | `const map = { key: "value" };` or `{}` |
| `public void doStuff() { }` | `function doStuff() { }` or `const doStuff = () => { };` |
| `obj.method()` | `obj.method()` (same) |
| `null` | `null` (and JS has `undefined` for “no value”) |

**Tips:** Use `const` by default, `let` when you reassign. Semicolons are optional but fine to keep. All your DOM work will use `document.getElementById(...)`, `element.addEventListener(...)`, etc. – see `js/app.js` for a small example.
