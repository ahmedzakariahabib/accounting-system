import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(
      "mongodb+srv://accountingsystem:hfmfGhNjdchV5JjT@cluster0.ovgrbnc.mongodb.net/accounting-system"
    )
    .then(() => console.log("database is connected"))
    .catch((err) => console.log("database error", err));
};
