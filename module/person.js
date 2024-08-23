require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log(`connecting to ${url}`);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MONGODB");
  })
  .catch((error) => {
    console.log("error connecting to DB ", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    unique: true,
    validate: {
      validator: function (value) {
        return /^(\d{2,3})-\d+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
