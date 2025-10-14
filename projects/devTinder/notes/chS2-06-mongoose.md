## 1. What is a model in mongoose ?

A **Model** in Mongoose is a **constructor function** (or class) that represents a **collection** in MongoDB.
It’s created from a **Schema**, and it’s what you actually use to **create, read, update, and delete (CRUD)** documents in the database.

In short:

> **Schema = structure**
> **Model = interface to the database**

---

## ⚙️ Step-by-Step Example

```js
const mongoose = require("mongoose");

// 1️⃣ Define a Schema (structure of a document)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

// 2️⃣ Create a Model (represents a collection)
const User = mongoose.model("User", userSchema);

// 3️⃣ Use the Model to interact with the DB
async function run() {
  await mongoose.connect("mongodb://localhost:27017/testdb");

  // Create a new document
  const newUser = new User({ name: "Alice", email: "alice@example.com", age: 25 });
  await newUser.save(); // inserts into "users" collection

  // Find users
  const users = await User.find();
  console.log(users);

  await mongoose.disconnect();
}

run();
```

---

## 🧩 What’s Happening Behind the Scenes

| Step                                 | Description                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `mongoose.Schema({...})`             | Defines the **structure** and rules for documents in a collection               |
| `mongoose.model("User", userSchema)` | Creates a **Model class** called `User` bound to the MongoDB collection `users` |
| `new User({...})`                    | Creates a **document instance** of the model                                    |
| `User.find()`                        | Runs a query on the underlying MongoDB collection                               |
| `user.save()`                        | Inserts or updates the document in the DB                                       |

---

## 💡 Model Naming Convention

When you call:

```js
mongoose.model("User", userSchema);
```

Mongoose will automatically look for (or create) a collection named **`users`** (lowercased and pluralized form).

So:

* Model name → `User`
* Collection name → `users`

---

## 🧱 Schema vs Model vs Document

| Concept      | Description                                      | Example                         |
| ------------ | ------------------------------------------------ | ------------------------------- |
| **Schema**   | Defines the shape (structure) of documents       | `{ name: String, age: Number }` |
| **Model**    | Provides an interface to the DB for a collection | `User.find(), User.create()`    |
| **Document** | A single record created from a model             | `const user = new User({...})`  |

---

## 🧠 Analogy

Think of it like this:

| Analogy   | Mongoose Term           |
| --------- | ----------------------- |
| Blueprint | **Schema**              |
| Factory   | **Model**               |
| Product   | **Document (instance)** |

---

✅ **In short:**

> A **Model** is the **connection point between your Node.js app and your MongoDB collection**, built from a Schema.

## 2. what is __v in mongoDb ?
Excellent 👏 — you’ve spotted the mysterious `__v` field in MongoDB documents that Mongoose creates.

The `__v` field is **added automatically by Mongoose** to each document to track the **version** of that document.

It’s short for **“version key”**, and its main purpose is to help with **document versioning and concurrency control**.

---

## ⚙️ Example

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

async function run() {
  await mongoose.connect("mongodb://localhost:27017/testdb");

  const user = await User.create({ name: "Alice", email: "alice@example.com" });
  console.log(user);
}

run();
```

### 👉 Output (in MongoDB):

```json
{
  "_id": "6700e2a7c4d2f7330a789123",
  "name": "Alice",
  "email": "alice@example.com",
  "__v": 0
}
```

✅ `__v: 0` — this is the **initial version number** created by Mongoose.

---

## 🧩 Why Does `__v` Exist?

It’s used for **optimistic concurrency control**.

Let’s say two users are editing the same document at the same time:

* User A reads version 0
* User B reads version 0

User A updates the record → version increments to `__v = 1`.

If User B tries to update based on the *old* version (0), Mongoose detects a **version mismatch** and can throw a **VersionError** (if you have optimistic concurrency enabled).

This prevents one update from accidentally **overwriting another’s changes**.

---

## ⚙️ How Versioning Works

Each time you save a document:

* If the document is modified, Mongoose increments `__v` by **1**.
* If someone else modified it in the meantime, your save may fail due to a version conflict.

### Example:

| Step            | Action          | Version (`__v`) |
| --------------- | --------------- | --------------- |
| Create document | `User.create()` | 0               |
| Update document | `user.save()`   | 1               |
| Another update  | `user.save()`   | 2               |

---

## 🧰 How to Disable It

If you don’t need versioning, you can turn it off in your schema:

```js
const userSchema = new mongoose.Schema(
  { name: String, email: String },
  { versionKey: false }  // disables __v
);
```

Now the documents won’t include the `__v` field at all.

---

## ⚙️ How to Rename It (Optional)

You can also rename the version key if you prefer a custom field name:

```js
const userSchema = new mongoose.Schema(
  { name: String, email: String },
  { versionKey: 'version' }
);
```

Now the field will appear as `"version": 0` instead of `__v`.

---

## ✅ Summary

| Feature       | Description                                     |
| ------------- | ----------------------------------------------- |
| Field name    | `__v`                                           |
| Added by      | Mongoose                                        |
| Purpose       | Tracks document version for concurrency control |
| Default value | 0                                               |
| Increments    | Each time the document is modified/saved        |
| Can disable   | Yes → `{ versionKey: false }`                   |



