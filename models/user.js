const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

userSchema.set('toJSON', {
  transform: (doc, obj) => {
    delete obj.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
