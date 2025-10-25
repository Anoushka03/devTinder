## Which document does findOne() return if there are multiple docs present ?
It returns only the FIRST matching document based on the collection’s natural order (which is typically insertion order unless modified).

## Difference between patch and put request.
Here’s a clear and practical explanation ✅

---

## ✅ **PUT vs PATCH — Key Differences**

| Feature       | **PUT**                                           | **PATCH**                           |
| ------------- | ------------------------------------------------- | ----------------------------------- |
| Purpose       | Replace a **whole resource**                      | Update **part of a resource**       |
| Idempotent?   | ✅ Yes (same request multiple times → same result) | ✅ Yes (usually), but not guaranteed |
| Data Required | Requires the **entire object**                    | Only the **fields to change**       |
| When to Use   | Full overwrite                                    | Partial update                      |

---

### 📌 Example Resource (User)

Stored in DB:

```json
{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "age": 30
}
```

---

### ✅ PUT Request Example (Full Replace)

```http
PUT /users/1
Content-Type: application/json

{
  "id": 1,
  "name": "Johnny",
  "email": "johnny@example.com",
  "age": 30
}
```

Even if you only wanted to update the name, **you must send all fields**.
If you omit `email` or `age`, the server may remove them or replace them with defaults.

---

### ✅ PATCH Request Example (Partial Update)

```http
PATCH /users/1
Content-Type: application/json

{
  "name": "Johnny"
}
```

Only `name` changes — everything else remains the same ✅

---

## ✅ Idempotency Explained

* **PUT** is always idempotent
  Sending the same full update multiple times → data remains unchanged
* **PATCH** can be idempotent depending on logic
  For example, if PATCH increments a value each time — not idempotent

---

## 🚀 Quick Summary

| PUT                       | PATCH                    |
| ------------------------- | ------------------------ |
| Full replacement          | Partial update           |
| Must send entire resource | Send only changed fields |
| Always idempotent         | May or may not be        |
| “Update this **object**”  | “Update this **field**”  |

---

✔️ In REST APIs:

* **PATCH** is more efficient → fewer bytes, avoids accidental data loss
* **PUT** is good when updating **every field** intentionally

---

If you want, I can also show you how to implement `PUT` and `PATCH` routes correctly in Express + Mongoose ✅


## Note - update api only update those attributes which are present in the schema.