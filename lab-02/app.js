
const express = require("express");
const path = require("path");
const fs = require("fs");

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbFolder = path.join(__dirname, "database");
const dbPath = path.join(dbFolder, "library.db");

let db = null;

// =====================================================
// 60 SAMPLE BOOKS
// =====================================================

const sampleBooks = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", price: 399, pages: 281 },
  { id: 2, title: "1984", author: "George Orwell", price: 299, pages: 328 },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 250, pages: 180 },
  { id: 4, title: "The Catcher in the Rye", author: "J.D. Salinger", price: 350, pages: 234 },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen", price: 220, pages: 279 },
  { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", price: 450, pages: 310 },
  { id: 7, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", price: 499, pages: 223 },
  { id: 8, title: "The Alchemist", author: "Paulo Coelho", price: 299, pages: 208 },
  { id: 9, title: "Crime and Punishment", author: "Fyodor Dostoevsky", price: 420, pages: 430 },
  { id: 10, title: "The Da Vinci Code", author: "Dan Brown", price: 380, pages: 454 },
  { id: 11, title: "The Lord of the Rings", author: "J.R.R. Tolkien", price: 599, pages: 1178 },
  { id: 12, title: "Brave New World", author: "Aldous Huxley", price: 320, pages: 288 },
  { id: 13, title: "The Book Thief", author: "Markus Zusak", price: 399, pages: 584 },
  { id: 14, title: "Animal Farm", author: "George Orwell", price: 199, pages: 112 },
  { id: 15, title: "The Kite Runner", author: "Khaled Hosseini", price: 350, pages: 371 },
  { id: 16, title: "Jane Eyre", author: "Charlotte Bronte", price: 280, pages: 532 },
  { id: 17, title: "Wuthering Heights", author: "Emily Bronte", price: 260, pages: 416 },
  { id: 18, title: "The Picture of Dorian Gray", author: "Oscar Wilde", price: 240, pages: 254 },
  { id: 19, title: "Fahrenheit 451", author: "Ray Bradbury", price: 299, pages: 194 },
  { id: 20, title: "The Fault in Our Stars", author: "John Green", price: 320, pages: 313 },
  { id: 21, title: "The Hunger Games", author: "Suzanne Collins", price: 399, pages: 374 },
  { id: 22, title: "Divergent", author: "Veronica Roth", price: 350, pages: 487 },
  { id: 23, title: "The Chronicles of Narnia", author: "C.S. Lewis", price: 499, pages: 767 },
  { id: 24, title: "Little Women", author: "Louisa May Alcott", price: 300, pages: 449 },
  { id: 25, title: "The Secret Garden", author: "Frances Hodgson Burnett", price: 250, pages: 331 },
  { id: 26, title: "Moby-Dick", author: "Herman Melville", price: 350, pages: 635 },
  { id: 27, title: "The Odyssey", author: "Homer", price: 320, pages: 541 },
  { id: 28, title: "The Iliad", author: "Homer", price: 320, pages: 683 },
  { id: 29, title: "Les Miserables", author: "Victor Hugo", price: 450, pages: 1463 },
  { id: 30, title: "The Count of Monte Cristo", author: "Alexandre Dumas", price: 399, pages: 1276 },
  { id: 31, title: "The Old Man and the Sea", author: "Ernest Hemingway", price: 220, pages: 127 },
  { id: 32, title: "A Tale of Two Cities", author: "Charles Dickens", price: 280, pages: 489 },
  { id: 33, title: "Oliver Twist", author: "Charles Dickens", price: 260, pages: 608 },
  { id: 34, title: "Great Expectations", author: "Charles Dickens", price: 299, pages: 505 },
  { id: 35, title: "Dracula", author: "Bram Stoker", price: 280, pages: 418 },
  { id: 36, title: "Frankenstein", author: "Mary Shelley", price: 240, pages: 280 },
  { id: 37, title: "The Time Machine", author: "H.G. Wells", price: 199, pages: 118 },
  { id: 38, title: "The War of the Worlds", author: "H.G. Wells", price: 250, pages: 287 },
  { id: 39, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", price: 350, pages: 307 },
  { id: 40, title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", price: 280, pages: 256 },
  { id: 41, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", price: 399, pages: 465 },
  { id: 42, title: "Gone Girl", author: "Gillian Flynn", price: 350, pages: 422 },
  { id: 43, title: "The Silent Patient", author: "Alex Michaelides", price: 399, pages: 336 },
  { id: 44, title: "The Midnight Library", author: "Matt Haig", price: 399, pages: 304 },
  { id: 45, title: "Atomic Habits", author: "James Clear", price: 499, pages: 320 },
  { id: 46, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 399, pages: 336 },
  { id: 47, title: "The Psychology of Money", author: "Morgan Housel", price: 350, pages: 256 },
  { id: 48, title: "Think and Grow Rich", author: "Napoleon Hill", price: 299, pages: 320 },
  { id: 49, title: "Deep Work", author: "Cal Newport", price: 399, pages: 304 },
  { id: 50, title: "Ikigai", author: "Hector Garcia", price: 299, pages: 208 },
  { id: 51, title: "Sapiens", author: "Yuval Noah Harari", price: 499, pages: 443 },
  { id: 52, title: "Homo Deus", author: "Yuval Noah Harari", price: 499, pages: 450 },
  { id: 53, title: "The Power of Habit", author: "Charles Duhigg", price: 399, pages: 371 },
  { id: 54, title: "Man's Search for Meaning", author: "Viktor Frankl", price: 280, pages: 184 },
  { id: 55, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", price: 399, pages: 224 },
  { id: 56, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", price: 250, pages: 180 },
  { id: 57, title: "The Guide", author: "R.K. Narayan", price: 220, pages: 220 },
  { id: 58, title: "Malgudi Days", author: "R.K. Narayan", price: 250, pages: 256 },
  { id: 59, title: "The White Tiger", author: "Aravind Adiga", price: 299, pages: 321 },
  { id: 60, title: "Train to Pakistan", author: "Khushwant Singh", price: 280, pages: 192 }
];

// =====================================================
// DATABASE INITIALIZATION
// =====================================================

const initializeDB = async () => {
  try {
    fs.mkdirSync(dbFolder, { recursive: true });

    db = await sqlite.open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    // Insert sample books without duplicating existing IDs.
    for (const book of sampleBooks) {
      await db.run(
        `INSERT OR IGNORE INTO book
         (id, title, author, price, pages)
         VALUES (?, ?, ?, ?, ?)`,
        [book.id, book.title, book.author, book.price, book.pages]
      );
    }

    const result = await db.get(
      "SELECT COUNT(*) AS count FROM book"
    );

    console.log(`Database initialized. Total books: ${result.count}`);

  } catch (error) {
    console.error("SQLite initialization failed:", error);
    throw error;
  }
};

const dbPromise = initializeDB();

// =====================================================
// DATABASE MIDDLEWARE
// =====================================================

app.use(async (req, res, next) => {
  try {
    await dbPromise;
    next();
  } catch (error) {
    console.error("Database middleware error:", error);
    res.status(500).json({
      error: "Database initialization failed"
    });
  }
});

// =====================================================
// ROOT ROUTE
// GET /
// =====================================================

app.get("/", (req, res) => {
  res.status(200).send(
    "Backend Development Fundamentals Lab 2 - SQLite Database and CRUD Routes"
  );
});

// =====================================================
// READ ALL BOOKS
// GET /books
// =====================================================

app.get(["/books", "/books/"], async (req, res) => {
  try {
    const books = await db.all(
      "SELECT * FROM book ORDER BY id"
    );

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// READ ONE BOOK
// GET /books/:bookId
// =====================================================

app.get(["/books/:bookId", "/books/:bookId/"], async (req, res) => {
  try {
    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [req.params.bookId]
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// CREATE BOOK
// POST /books
// =====================================================

app.post(["/books", "/books/"], async (req, res) => {
  try {
    const { title, author, price, pages } = req.body || {};

    if (
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      !Number.isFinite(Number(price)) ||
      !Number.isInteger(Number(pages)) ||
      Number(price) < 0 ||
      Number(pages) <= 0
    ) {
      return res.status(400).json({
        error: "Provide a valid title, author, price and positive page count"
      });
    }

    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [title.trim(), author.trim(), Number(price), Number(pages)]
    );

    res.status(201).json({
      message: "Book Added Successfully",
      bookId: result.lastID
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// UPDATE BOOK
// PUT /books/:bookId
// =====================================================

app.put(["/books/:bookId", "/books/:bookId/"], async (req, res) => {
  try {
    const { title, author, price, pages } = req.body || {};
    const bookId = Number(req.params.bookId);

    if (
      !Number.isInteger(bookId) || bookId <= 0 ||
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      !Number.isFinite(Number(price)) ||
      !Number.isInteger(Number(pages)) ||
      Number(price) < 0 ||
      Number(pages) <= 0
    ) {
      return res.status(400).json({
        error: "Provide a valid book ID, title, author, price and page count"
      });
    }

    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [title.trim(), author.trim(), Number(price), Number(pages), bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "Book Details Updated Successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// DELETE BOOK
// DELETE /books/:bookId
// =====================================================

app.delete(["/books/:bookId", "/books/:bookId/"], async (req, res) => {
  try {
    const bookId = Number(req.params.bookId);

    if (!Number.isInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        error: "Invalid book ID"
      });
    }

    const result = await db.run(
      "DELETE FROM book WHERE id = ?",
      [bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "Book Deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// START SERVER
// LOCAL + RENDER
// =====================================================

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  dbPromise
    .then(() => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}

module.exports = app;
