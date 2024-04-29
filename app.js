const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const {
  getAllBooks,
  addBook,
  searchBooksByAuthor,
  searchBooksByTitle,
  updateBook,
  deleteBook,
} = require("./database");

app.use(express.json());

app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/books", async (req, res) => {
  const { author, title, genre, year } = req.body;
  try {
    const newBook = await addBook(author, title, genre, year);
    res.json(newBook);
  } catch (error) {
    console.error(error);
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
