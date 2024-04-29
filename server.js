const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "19821015",
  port: 5432,
});

app.use(express.json());

app.get("/books", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM bok11");
    const books = result.rows;
    res.json(books);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/books", async (req, res) => {
  const { author, title, genre, year } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO bok11 (author, title, genre, year) VALUES ($1, $2, $3, $4) RETURNING *",
      [author, title, genre, year]
    );
    const newBook = result.rows[0];
    res.json(newBook);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
