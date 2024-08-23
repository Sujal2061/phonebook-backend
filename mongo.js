const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://sujalkoirala404:${password}@cluster0.lwbn76w.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model("Person", phonebookSchema);

const phonebook = new Phonebook({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 5) {
  phonebook.save().then((result) => {
    console.log("note saved!");
    mongoose.connection.close();
  });
} else {
  Phonebook.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
}
