if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const Transaction = require("./models/Transactions");
const moment = require("moment");
moment().format();

const PORT = 5000;

const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => {
    console.log("Database error");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.find({});
    console.log(transactions);

    const amounts = transactions.map((trans) => trans.amount);
    const reducer = (acc, currentValue) => acc + currentValue;
    const total = amounts.reduce(reducer, 0).toFixed(2);
    // calculate income

    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, cvalue) => (acc += cvalue), 0)
      .toFixed(2);
    const expense = (
      amounts
        .filter((item) => item < 0)
        .reduce((acc, cvalue) => (acc += cvalue), 0) * -1
    ).toFixed(2);

    res.render("home", { transactions, total, income, expense, moment });
  } catch (error) {
    console.log("Some error occured");
    console.log(error);
  }
});

app.post("/", async (req, res) => {
  const transaction = new Transaction(req.body.transaction);
  await transaction.save();
  res.redirect("/");
});

app.listen(PORT, () => console.log("Server listening at port " + PORT));
