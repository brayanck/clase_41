const express = require("express");
const app = express();
const { PORT, MONGO_URL } = require("./config/config");
const ManagerDb = require("./daos/mongodb/classes/ManagerDb");
const dataBaseConect = new ManagerDb(MONGO_URL);
const session = require("express-session");
const MongoStore = require("connect-mongo");
const handlebars = require("handlebars");
const handlebarsExpress = require("express-handlebars");
const passport = require("passport");
const initializePassport = require("./config/passport");
const cors = require("cors");
const addLogger = require('./config/config_base')
// const http = require("http");

// const socketIO = require("socket.io");
// const server = http.createServer(app);
// const io = socketIO(server);
const compression = require("express-compression");
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUIExpress = require('swagger-ui-express')
//routes
const cartRouter = require("./routes/carts.routes");
const productsRouter = require("./routes/products.routes");
// const chatRouter = require("./routes/message.routes")(io);
const authRouter = require("./routes/auth.routes");

const perfilRouter = require("./routes/perfil.routes");
const testRouter = require("./routes/test.routes");

// uso
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//public
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
    }),
    secret: "coderHouse",
    resave: false,
    saveUninitialized: true,
  })
);
//passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//handlebars
handlebars.registerHelper("isEqual", function (value1, value2, options) {
  if (value1 == value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
//view
app.engine(
  "handlebars",
  handlebarsExpress.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");



//compresion
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

app.use(addLogger);

//swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",

    info: {
      title: "Documentacion API Adoptme",
      description: "Documentacion para uso de swagger",
    },
  },

  apis: [`./src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);


//Declare swagger api endpoint

app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
//Routes 2
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
//app.use("api/chat", chatRouter);
app.use("/api/auth", authRouter);

app.use("/api/loggerTest", testRouter);
app.use("api/perfil", perfilRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dataBaseConect.conectarse();
});
