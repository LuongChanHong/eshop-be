const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.e6b0l5j.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

app.use(cookieParser());

const sessionStore = new mongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: true,
});

app.use(
  session({
    secret: "secret cookie",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: "lax",
      secure: true,
    },
  })
);

app.enable("trust proxy", 1);

app.use(
  cors({
    origin: [
      "https://eshop-user.netlify.app",
      "https://hong-eshop-admin.netlify.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET,POST,PUT,PATH,DELETE,OPTIONS"],
    credentials: true,
  })
);

// app.use("/", (req, res, next) => {
//   // res.setHeader("Access-Control-Allow-Origin", "*");
//   // res.setHeader("Access-Control-Allow-Credentials", "include");
//   // res.setHeader(
//   //   "Access-Control-Allow-Headers",
//   //   "Origin, X-Requested-With, Content-Type, Accept"
//   // );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Headers", "Authorization");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,PATH,DELETE,OPTIONS"
//   );
//   next();
// });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  try {
    res.json({
      status: 200,
      msg: "GET DATA SUCCESS",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("SERVER ERROR");
  }
});
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);
app.use("/cart", cartRoute);

app.use((error, req, res, next) => {
  console.log("=====================");
  console.log("ERROR HANDLER::", error);
  res.statusMessage = "Something go wrong";
  res.status(500).json(error);
});

mongoose
  .set("strictQuery", true)
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("SOCKET IO CONNECTED");
    });
  })
  .catch((err) => console.log("mongoose connect err:", err));
