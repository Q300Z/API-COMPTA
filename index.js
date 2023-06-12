const express = require("express");
const connectDB = require("./db/mongoDB");
const rssRoute = require("./routes/routeFac");

const path = require("path");

const app = express();

const port = 3001;
const host = "0.0.0.0";

try {
  const db = connectDB();
} catch (error) {
  db.catch(() => connectDB());
}
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(rssRoute);

app.listen(port, host, () => {
  console.log(`Serveur à l'écoute sur http://${host}:${port} `);
});
