# 🔗 **What is `ref` in Mongoose?**

The `ref` property is used in a schema to create a **relationship** between two collections.
It tells Mongoose **which model** this field is referring to.

### 💡 Example: User & Post Relationship

```js
// userModel.js
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});
module.exports = mongoose.model("User", userSchema);
```

```js
// postModel.js
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {              // store the ObjectId of a user
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"        // linking Post to User model
    }
});
module.exports = mongoose.model("Post", postSchema);
```

Here, `author` stores the **ObjectId** of a User, and `ref: "User"` tells Mongoose that it refers to the User collection.

---

# 🔍 **What is `populate()`?**

`populate()` is used to **fetch the full related document** instead of just its ObjectId.

### 🧪 Without populate:

```js
const post = await Post.findOne({ _id: "abc123" });
console.log(post.author);   
// Output: 65f12ab9a677c9e6458e9d13  (just ObjectId)
```

### 🚀 With populate:

```js
const post = await Post.findOne({ _id: "abc123" }).populate("author");
console.log(post.author);
// Output: Full User document
```

### 🎯 Result:

```json
{
  "_id": "abc123",
  "title": "Hello World",
  "author": {
      "_id": "65f12ab9a677c9e6458e9d13",
      "name": "John Doe",
      "email": "john@gmail.com"
  }
}
```

---

# 📌 **Populate selected fields only**

You can choose which fields you want:

```js
const post = await Post.find().populate("author", "name email -_id");
```

✔ `name email` → include
❌ `-_id` → exclude

---

# ▶ **Populate Multiple References**

```js
const post = await Post.find()
    .populate("author")
    .populate("comments");
```

---

# 🔄 **Reverse Populate (Virtual populate)**

You can populate without storing ObjectId in the document:

```js
// In User schema
userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "author"
});
```

Then:

```js
const user = await User.findOne().populate("posts");
```

---

# 👍 Summary Table

| Feature            | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `ref`              | Creates a relationship between collections             |
| `populate()`       | Fetches full related document instead of just ObjectId |
| `virtual populate` | Populate without storing ObjectId in document          |
| `select fields`    | Choose which fields to populate                        |

