## 1. Why -g is used while install npm module ?

* `-g` = **global install**.
* Without `-g` → the module is installed **locally** inside your project’s `node_modules/`.
* With `-g` → the module is installed **system-wide** (so it’s available from the command line anywhere).

---

## 📌 Local vs Global Install

### 🔹 Local install (default)

```bash
npm install express
```

* Installs into `./node_modules/express/`
* Creates/updates `package.json` dependencies.
* You import it in your code:

  ```js
  const express = require("express");
  ```
* Used for project-specific libraries.

---

### 🔹 Global install (`-g`)

```bash
npm install -g nodemon
```

* Installs into a global location (depends on OS):

  * Linux/Mac: `/usr/local/lib/node_modules/`
  * Windows: `%AppData%\npm\node_modules\`
* Adds the module’s **binary/CLI commands** to your PATH, so you can run it from anywhere:

  ```bash
  nodemon app.js
  ```
* Typically used for **command-line tools**, not libraries.

---

## 📌 When to Use `-g`

✅ Use `-g` for tools you want available in your terminal:

* `nodemon` (auto-restart server on changes)
* `eslint` (linting tool)
* `npm`, `yarn`, `typescript (tsc)` compiler
* `create-react-app`

❌ Don’t use `-g` for app dependencies (like `express`, `mongoose`, `lodash`).
Those should stay **local** so your project can be portable.

---

## 2. What is backward compatibility in versioning ?
**Backward compatibility** means:
➡️ *A newer version of software can still work with things (apps, APIs, files, libraries) that were built for older versions.*

It’s about **not breaking existing code** when you upgrade.

---

## 📌 Example in Node.js or npm packages

* Suppose you’re using a library:

  ```js
  const math = require("math-lib");
  console.log(math.add(2, 3));
  ```
* If version `1.2.0` defines `add(a, b)`,
  and version `1.3.0` still supports `add(a, b)` → ✅ backward compatible.
* But if version `2.0.0` renames it to `sum(a, b)` → ❌ not backward compatible (old code breaks).

---

## 📌 Real-world Examples

1. **Backward compatible change**

   * Adding a new optional parameter
   * Adding new features while keeping old ones
   * Bug fixes

   ```js
   // v1.0.0
   add(a, b)

   // v1.1.0 (still works, just added optional c)
   add(a, b, c = 0)
   ```

2. **Breaking change (not backward compatible)**

   * Removing functions
   * Changing function signatures
   * Changing default behavior

   ```js
   // v1.0.0
   add(a, b)

   // v2.0.0 (old code breaks)
   sum(a, b)
   ```

---

## 📌 In Semantic Versioning (SemVer)

* `MAJOR.MINOR.PATCH`

  * **PATCH (x.y.Z)** → backward compatible bug fixes
  * **MINOR (x.Y.z)** → backward compatible new features
  * **MAJOR (X.y.z)** → not backward compatible (breaking changes)

Example:

* `1.2.3` → `1.2.4` (bug fix, safe)
* `1.2.3` → `1.3.0` (new feature, safe)
* `1.2.3` → `2.0.0` (breaking change, not backward compatible)

---

## ✅ Summary

* **Backward compatibility** = old code still works with the new version.
* Important for avoiding breaking user applications after upgrades.
* In versioning:

  * Patch/minor releases → should be backward compatible.
  * Major releases → may break backward compatibility.

---


