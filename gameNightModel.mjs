import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// define user schema
const userSchema = mongoose.Schema({
  _id: { type: String, required: true },
  amount: { type: Number, required: true },
});
//compile model from the schema
const User = mongoose.model("User", userSchema);

const createUser = async (name, amount) => {
  const newUser = new User({ _id: name, amount: amount });
  return newUser.save();
};

const findUsers = async (filter, projection, limit) => {
  const query = User.find(filter).select(projection).limit(limit);
  return query.exec();
};

const findUserBy_id = async (_id) => {
    const query = User.findById(_id);
    return query.exec();
};

const updateUser = async function (_id, temp) {
  const result = await User.updateOne(
    { _id: _id },
    { $inc: { amount: temp } },
    { upsert: true }
  );
  return result;
};

const clearUsers = async () => {
  const result = await User.deleteMany({});
  return result.deletedCount;
};

export { createUser, findUsers, clearUsers, updateUser, findUserBy_id };
