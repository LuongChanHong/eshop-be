const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

const productRoute = require("./routes/product");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.e6b0l5j.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATH,DELETE,OPTIONS"
  );
  next();
});

app.use(productRoute);

app.use((error, req, res, next) => {
  console.log("=====================");
  console.log("ERROR HANDLER::", error);
  res.statusMessage = "Something go wrong";
  res.status(500).send({ message: "Something go wrong" });
});

mongoose
  .set("strictQuery", true)
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(process.env.PORT || 5000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("SOCKET IO CONNECTED");
    });
  })
  .catch((err) => console.log("mongoose connect err:", err));
