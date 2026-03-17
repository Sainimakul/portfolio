require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./helpers/db");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors(
   { origin: 'https://portfolioweb.makulsaini.online'}
));
app.use(express.json());

app.use("/api", userRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port ", `${process.env.PORT}`);
});
