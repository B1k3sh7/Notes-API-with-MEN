const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const globalEmitter = require("./emitter/globalEmitter");

const connectTOMongo = require("./middlewares/dbConnect");
const auth = require("./middlewares/auth.middleware");
const logger = require("./middlewares/logger.middleware");
require("dotenv").config();

//Swagger API Options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Note API",
      version: "1.0.0",
      description: "A Simple Express Note API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: {
      bearerAuth: [],
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
const app = express();

//Middlewares
app.use(express.json());

//Custom Logger Middleware
app.use(logger);

//Routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/notes", auth, require("./routes/note.routes"));
app.use("/", require("./routes/user.routes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

//Events
//User Events
globalEmitter.on("login", (userId) => {
  console.log(`User LoggedIn! id: ${userId}`);
});

globalEmitter.on("signup", (userId) => {
  console.log(`New user SignedUp! id: ${userId}`);
});

//Notes Events
globalEmitter.on("createNote", (noteId) => {
  console.log(`Note created having id: ${noteId}`);
});

globalEmitter.on("updateNote", (noteId) => {
  console.log(`Note updated having id: ${noteId}`);
});

globalEmitter.on("deleteNote", (noteId) => {
  console.log(`Note deleted having id: ${noteId}`);
});

app.listen(process.env["PORT"], () => {
  connectTOMongo().then(() => {
    console.log("Port is Running");
  });
});
