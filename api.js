const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/books", async (req, res) => {
  try {
    const books = await db.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/books", async (req, res) => {
  const { author, title, genre, year } = req.body;
  try {
    const newBook = await db.addBook(author, title, genre, year);
    res.json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/search/author", async (req, res) => {
  const { author } = req.query;
  try {
    const books = await db.searchBooksByAuthor(author);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/books/search/title", async (req, res) => {
  const { title } = req.query;
  try {
    const books = await db.searchBooksByTitle(title);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, genre, year } = req.body;
  try {
    const updatedBook = await db.updateBook(id, author, title, genre, year);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.deleteBook(id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
