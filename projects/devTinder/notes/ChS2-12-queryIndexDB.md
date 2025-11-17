# ✅ **What is an Index in MongoDB?**

An **index** is a data structure stored by MongoDB that allows fast lookup of documents based on specific fields.

Without an index, MongoDB scans every document in the collection (called a **COLLSCAN**), which is slow.

With an index, MongoDB uses a fast search path (like a **B-tree**) to find data quickly.

---

# ✅ **Why Indexes Are Important**

Indexes make the following operations fast:

* Searching (`find`)
* Sorting (`sort`)
* Filtering (`find({ name: "John" })`)
* Uniqueness (`unique: true`)
* Range queries (`age > 30`)

---

# 🧠 **Analogy**

Without index → reading the whole book to find a topic.
With index → jump directly to the page number.

---

# 🧩 **Types of Indexes in MongoDB**

### 1️⃣ **Default Index (_id)**

Every collection automatically creates:

```js
{ _id: 1 }
```

Unique, fast lookup by `_id`.

---

### 2️⃣ **Single Field Index**

Index a single field:

```js
db.users.createIndex({ email: 1 });
```

Ascending order.

---

### 3️⃣ **Unique Index**

Prevents duplicate values:

```js
db.users.createIndex({ email: 1 }, { unique: true });
```

---

### 4️⃣ **Compound Index**

Index multiple fields together:

```js
db.users.createIndex({ firstName: 1, lastName: 1 });
```

Query must follow index order.

---

### 5️⃣ **Text Index**

Used for text search:

```js
db.posts.createIndex({ content: "text" });
```

---

### 6️⃣ **Hashed Index**

Used for sharding:

```js
db.users.createIndex({ userId: "hashed" });
```

---

### 7️⃣ **TTL Index (Time to Live)**

Automatically deletes documents after some time:

```js
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

---

# 🏎️ **Performance Benefits**

Indexes improve:

✔ Query speed
✔ Sorting speed
✔ Filtering speed
✔ Joins (lookup)

---

# 🐢 **Downsides of Indexes**

⚠ More memory usage
⚠ Slows down insert/update/delete
⚠ You shouldn’t create an index on every field

---

# 📌 **How to Check Existing Indexes**

```js
db.users.getIndexes();
```

---

# 📌 **Example: Creating Index in Mongoose**

```js
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    index: true
  }
});
```

Or manually:

```js
userSchema.index({ age: 1 });
```

---

# 🧪 Example: Why Your Query Needs Index

If your query is:

```js
await User.find({ email: req.body.email });
```

To make it fast:

```js
db.users.createIndex({ email: 1 });
```

---

# 🟢 Summary Table

| Index Type   | Use Case                |
| ------------ | ----------------------- |
| `_id`        | Internal fast lookup    |
| Single field | Speed up filtering      |
| Unique       | No duplicates allowed   |
| Compound     | Multi-field queries     |
| Text         | Search articles/strings |
| Hashed       | Sharding                |
| TTL          | Auto-delete             |

---


A **compound index** in MongoDB is an index built on **multiple fields** of a document.
It helps MongoDB efficiently execute queries that filter or sort using more than one field.

---

# ✅ **What is a Compound Index?**

A *compound index* looks like:

```js
db.users.createIndex({ age: 1, name: 1 });
```

This creates an index on **age first**, then **name**.

---

# 🔍 Why Use Compound Indexes?

They make queries faster when:

* Filtering on multiple fields
  → `{ age: 25, name: "John" }`

* Sorting on multiple fields
  → `.sort({ age: 1, name: 1 })`

* Filtering on the first field only
  → `{ age: 25 }`
  (This works!)

---

# ❗ ORDER MATTERS in Compound Indexes

Given this index:

```js
{ age: 1, name: 1 }
```

MongoDB **can** use it for:

| Query                       | Can Use This Index?    |
| --------------------------- | ---------------------- |
| `{ age: 25 }`               | ✔ Yes                  |
| `{ age: 25, name: "John" }` | ✔ Yes                  |
| `{ name: "John" }`          | ❌ No (skips first key) |

MongoDB must follow the left-to-right order of the index.

---

# 🌟 Example

### Create an index:

```js
db.users.createIndex({ country: 1, age: -1 });
```

### Efficient query:

```js
db.users.find({ country: "India" }).sort({ age: -1 });
```

This query hits the compound index perfectly.

---

# 🧪 Example in Mongoose

```js
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  country: String
});

// Compound index
userSchema.index({ country: 1, age: -1 });

const User = mongoose.model("User", userSchema);
```

---

# ⚡ Benefits of Compound Indexes

| Benefit                       | Description                              |
| ----------------------------- | ---------------------------------------- |
| Faster multi-field queries    | Great for APIs with filtering + sorting  |
| Matches real-world queries    | e.g., search by country + age            |
| Reduces full collection scans | Uses index instead of scanning documents |

---

# ⚠ Limitations

* Too many compound indexes → heavy memory usage
* Slows down insert/update/delete operations
* Can't skip the left-most field
  → index `{ a: 1, b: 1 }` cannot support a query on `{ b: 1 }` alone
* Max index size = 1024 bytes per entry

---

# 💡 Rule of Thumb

👉 **Create a compound index based on your most common query filters and sorts — in the correct order.**

---

# 🎯 Example: API Filter Use Case

Query:

```
GET /users?country=India&sort=age
```

Best index:

```js
db.users.createIndex({ country: 1, age: 1 });
```

---

If you want, I can show you how to check if your query is using your compound index using:

```js
db.users.find(...).explain("executionStats");
```


In Mongoose, **`schema.pre()`** is a middleware hook that runs **before** a certain action happens on a document or model.

It’s commonly used for:

* Hashing passwords before saving
* Validating data
* Logging
* Updating timestamps
* Preventing invalid updates
* Pre-populating fields

---

# ✅ **What is `pre()` in Mongoose?**

`schema.pre()` allows you to register **pre-middleware**, which runs **before** a specific operation.

### Syntax:

```js
schema.pre(<hookName>, function (next) {
    // your pre logic here
    next();
});
```

---

# 🌟 **Most Common Hooks**

### 1️⃣ **pre("save")**

Runs **before saving** a document into MongoDB.

Used for hashing passwords:

```js
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
```

This runs before:

```js
user.save();
```

---

### 2️⃣ **pre("findOneAndUpdate")**

Runs before `findOneAndUpdate()`

Example: enforce validation:

```js
userSchema.pre("findOneAndUpdate", function (next) {
    this.setOptions({ runValidators: true });
    next();
});
```

---

### 3️⃣ **pre("updateOne")**

```js
userSchema.pre("updateOne", function (next) {
    this.set({ updatedAt: new Date() });
    next();
});
```

---

### 4️⃣ **pre("validate")**

Runs before validation.

```js
userSchema.pre("validate", function (next) {
  console.log("Document is being validated");
  next();
});
```

---

### 5️⃣ **pre("remove")**

Runs before a document is removed.

```js
userSchema.pre("remove", function (next) {
  console.log("Removing document", this._id);
  next();
});
```

---

# 🧠 **Why Use `pre()` Middleware?**

| Use Case           | Why                    |
| ------------------ | ---------------------- |
| Password hashing   | Security               |
| Setting timestamps | Custom logic           |
| Validating changes | Enforce data integrity |
| Check references   | Ensure relational data |
| Logging actions    | Debug & audit          |

---

# 🧪 **Example: Hash password before saving**

```js
const bcrypt = require("bcrypt");

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
```

---

# 🧪 **Example: Auto-set updatedAt on updates**

```js
userSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: new Date() });
    next();
});
```

---

# ⚠ Important Notes

### 1️⃣ `pre("save")` works only when calling `.save()`

It **does not** run on:

* `updateOne()`
* `updateMany()`
* `findOneAndUpdate()`

You must add separate middleware for those.

---

### 2️⃣ Always call `next()` unless using async/await

If using async, you don’t need to call next:

```js
userSchema.pre("save", async function () {
    // async logic
});
```

---

# 🟢 Summary

`schema.pre()` runs middleware logic **before** an operation.

Common hooks:

| Hook                      | When it runs           |
| ------------------------- | ---------------------- |
| `pre("save")`             | Before saving document |
| `pre("validate")`         | Before validation      |
| `pre("findOneAndUpdate")` | Before updating doc    |
| `pre("updateOne")`        | Before updateOne       |
| `pre("remove")`           | Before deleting        |

---

