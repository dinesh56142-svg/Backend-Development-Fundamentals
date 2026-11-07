
const db = require("./database");

const sampleBooks = [
  ["The Great Gatsby", "F. Scott Fitzgerald", 299],
  ["To Kill a Mockingbird", "Harper Lee", 349],
  ["1984", "George Orwell", 249],
  ["Pride and Prejudice", "Jane Austen", 399],
  ["The Alchemist", "Paulo Coelho", 199],
  ["Atomic Habits", "James Clear", 450],
  ["The Hobbit", "J.R.R. Tolkien", 499],
  ["Wings of Fire", "A.P.J. Abdul Kalam", 275],
  ["Rich Dad Poor Dad", "Robert Kiyosaki", 320],
  ["The Book Thief", "Markus Zusak", 375],
  ["Deep Work", "Cal Newport", 425],
  ["The Psychology of Money", "Morgan Housel", 350],
  ["Think and Grow Rich", "Napoleon Hill", 299],
  ["The Power of Habit", "Charles Duhigg", 399],
  ["Ikigai", "Hector Garcia", 250],
  ["The Pragmatic Programmer", "Andrew Hunt", 450],
  ["Clean Code", "Robert C. Martin", 550],
  ["The Silent Patient", "Alex Michaelides", 320],
  ["Sapiens", "Yuval Noah Harari", 599],
  ["Homo Deus", "Yuval Noah Harari", 650],
  ["The Lean Startup", "Eric Ries", 425],
  ["Zero to One", "Peter Thiel", 375],
  ["Start With Why", "Simon Sinek", 399],
  ["The 5 AM Club", "Robin Sharma", 299],
  ["Richest Man in Babylon", "George S. Clason", 199],
  ["The Intelligent Investor", "Benjamin Graham", 699],
  ["Can't Hurt Me", "David Goggins", 499],
  ["Mindset", "Carol S. Dweck", 350],
  ["Grit", "Angela Duckworth", 399],
  ["The Subtle Art of Not Giving a F*ck", "Mark Manson", 425],
  ["The Monk Who Sold His Ferrari", "Robin Sharma", 275],
  ["Man's Search for Meaning", "Viktor E. Frankl", 299],
  ["The 7 Habits of Highly Effective People", "Stephen Covey", 499],
  ["How to Win Friends and Influence People", "Dale Carnegie", 349],
  ["The Art of War", "Sun Tzu", 199],
  ["The Secret", "Rhonda Byrne", 299],
  ["A Brief History of Time", "Stephen Hawking", 450],
  ["The Da Vinci Code", "Dan Brown", 399],
  ["Angels and Demons", "Dan Brown", 375],
  ["The Fault in Our Stars", "John Green", 299],
  ["Harry Potter and the Philosopher's Stone", "J.K. Rowling", 499],
  ["Harry Potter and the Chamber of Secrets", "J.K. Rowling", 525],
  ["The Hunger Games", "Suzanne Collins", 399],
  ["The Maze Runner", "James Dashner", 349],
  ["The Kite Runner", "Khaled Hosseini", 375],
  ["A Thousand Splendid Suns", "Khaled Hosseini", 425],
  ["The Midnight Library", "Matt Haig", 399],
  ["It Ends with Us", "Colleen Hoover", 350],
  ["Verity", "Colleen Hoover", 425],
  ["The Book of Joy", "Dalai Lama and Desmond Tutu", 399]
];

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

async function initializeDatabase() {
  const createBooksTableSQL = `
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await runQuery(createBooksTableSQL);

  const createReusableIdsTableSQL = `
    CREATE TABLE IF NOT EXISTS reusable_book_ids (
      id INTEGER PRIMARY KEY,
      deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await runQuery(createReusableIdsTableSQL);

  // Insert only missing sample books.
  for (const book of sampleBooks) {
    const existing = await getQuery(
      "SELECT id FROM books WHERE title = ? AND author = ?",
      [book[0], book[1]]
    );

    if (!existing) {
      await runQuery(
        `INSERT INTO books (title, author, price)
         VALUES (?, ?, ?)`,
        book
      );
    }
  }

  const finalResult = await getQuery(
    "SELECT COUNT(*) AS total FROM books"
  );

  console.log(
    `Database currently contains ${finalResult.total} books.`
  );

  console.log("Lab 3 database initialized successfully.");
}

module.exports = initializeDatabase;
