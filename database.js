const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "19821015",
    port: 5432,
});

async function getClient() {
    const client = await pool.connect();
    return client;
}

module.exports = {
    async getAllBooks() {
        let client;
        try {
            client = await getClient();
            const result = await client.query("SELECT * FROM bok11");
            return result.rows;
        } catch (error) {
            console.error("Error fetching books:", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    },

    async addBook(author, title, genre, year) {
        let client;
        try {
            client = await getClient();
            const result = await client.query(
                "INSERT INTO bok11 (author, title, genre, year) VALUES ($1, $2, $3, $4) RETURNING *",
                [author, title, genre, year]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error adding book:", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    },

    async searchBooksByAuthor(author) {
        let client;
        try {
            client = await getClient();
            const result = await client.query(
                "SELECT * FROM bok11 WHERE author ILIKE $1",
                [`%${author}%`]
            );
            return result.rows;
        } catch (error) {
            console.error("Error searching books by author:", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    },

    async searchBooksByTitle(title) {
        let client;
        try {
            client = await getClient();
            const result = await client.query(
                "SELECT * FROM bok11 WHERE title ILIKE $1",
                [`%${title}%`]
            );
            return result.rows;
        } catch (error) {
            console.error("Error searching books by title:", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    },

    async updateBook(bookId, author, title, genre, year) {
        let client;
        try {
            client = await getClient();
            const result = await client.query(
                "UPDATE bok11 SET author = $1, title = $2, genre = $3, year = $4 WHERE id = $5 RETURNING *",
                [author, title, genre, year, bookId]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error updating book:", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    },

    async deleteBook(bookId) {
        let client;
        try {
            client = await getClient();
            await client.query("DELETE FROM bok11 WHERE id = $1", [bookId]);
        } catch (error) {
            console.error("Error deleting book:", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    },
};
