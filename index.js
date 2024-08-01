const express = require("express");
const app = express();
const morgan = require("morgan");

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

morgan.token("eventInfo", (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(requestLogger);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :eventInfo"
  )
);
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>
        `);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const errorMsg = (body) => {
  if (persons.find((person) => person.name === body.name)) {
    return { error: "name must be unique" };
  }

  if (!body.name && !body.number) {
    return { error: "name and number are missing" };
  }

  if (!body.name) {
    return { error: "name is missing" };
  }

  if (!body.number) {
    return { error: "number is missing" };
  }

  return null;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const error = errorMsg(body);

  if (error) {
    return res.status(400).json(error);
  }

  const randNum = String(Math.floor(Math.random() * 100000));
  const person = {
    id: randNum,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
