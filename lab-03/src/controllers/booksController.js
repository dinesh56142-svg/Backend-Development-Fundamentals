
const db = require("../config/database");

const allowedSortColumns = [
  "id",
  "title",
  "author",
  "price",
  "created_at"
];

// Validate book request body
function validateBook(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "A valid JSON request body is required.";
  }

  const { title, author, price } = data;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof author !== "string" ||
    !author.trim() ||
    price === undefined ||
    price === null ||
    price === "" ||
    (typeof price !== "number" && typeof price !== "string") ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  ) {
    return "Title, author and a valid non-negative price are required.";
  }

  return null;
}

// Validate book ID
function validateId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /books - Search, filter, sort and paginate
exports.getBooks = (req, res) => {
  const {
    search_q,
    order_by = "id",
    order = "ASC",
    limit = "10",
    offset = "0",
    min_price,
    max_price
  } = req.query;

  const parsedLimit = Number(limit);
  const parsedOffset = Number(offset);
  const sortOrder = order.toUpperCase();

  // Validate pagination
  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100 ||
    !Number.isInteger(parsedOffset) ||
    parsedOffset < 0
  ) {
    return res.status(400).json({
      message: "Limit must be 1-100 and offset must be non-negative."
    });
  }

  // Validate sorting
  if (
    !allowedSortColumns.includes(order_by) ||
    !["ASC", "DESC"].includes(sortOrder)
  ) {
    return res.status(400).json({
      message: "Invalid sorting column or order."
    });
  }

  const conditions = [];
  const params = [];

  // Search by partial book title only
  if (search_q !== undefined) {
    if (typeof search_q !== "string") {
      return res.status(400).json({
        message: "search_q must be a string."
      });
    }

    if (search_q.trim()) {
      conditions.push("title LIKE ?");
      params.push(`%${search_q.trim()}%`);
    }
  }

  // Minimum price filter
  if (min_price !== undefined) {
    if (
      min_price === "" ||
      !Number.isFinite(Number(min_price)) ||
      Number(min_price) < 0
    ) {
      return res.status(400).json({
        message: "Invalid min_price."
      });
    }

    conditions.push("price >= ?");
    params.push(Number(min_price));
  }

  // Maximum price filter
  if (max_price !== undefined) {
    if (
      max_price === "" ||
      !Number.isFinite(Number(max_price)) ||
      Number(max_price) < 0
    ) {
      return res.status(400).json({
        message: "Invalid max_price."
      });
    }

    conditions.push("price <= ?");
    params.push(Number(max_price));
  }

  // Validate price range
  if (
    min_price !== undefined &&
    max_price !== undefined &&
    Number(min_price) > Number(max_price)
  ) {
    return res.status(400).json({
      message: "min_price cannot exceed max_price."
    });
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const sql = `
    SELECT * FROM books
    ${whereClause}
    ORDER BY ${order_by} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  params.push(parsedLimit, parsedOffset);

  db.all(sql, params, (error, books) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to retrieve books."
      });
    }

    return res.status(200).json({
      totalReturned: books.length,
      limit: parsedLimit,
      offset: parsedOffset,
      books
    });
  });
};

// GET /books/:id - Get a single book
exports.getBookById = (req, res) => {
  const id = validateId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid book ID."
    });
  }

  db.get(
    "SELECT * FROM books WHERE id = ?",
    [id],
    (error, book) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to retrieve book."
        });
      }

      if (!book) {
        return res.status(404).json({
          message: "Book not found."
        });
      }

      return res.status(200).json(book);
    }
  );
};

// POST /books - Create a new book
exports.createBook = (req, res) => {
  const validationError = validateBook(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError
    });
  }

  const { title, author, price } = req.body;

  db.serialize(() => {
    db.get(
      `SELECT id FROM reusable_book_ids
       ORDER BY deleted_at DESC, id DESC
       LIMIT 1`,
      [],
      (selectError, reusableId) => {
        if (selectError) {
          return res.status(500).json({
            message: "Failed to allocate book ID."
          });
        }

        const insertBook = (id) => {
          const sql = id === null
            ? `INSERT INTO books (title, author, price)
               VALUES (?, ?, ?)`
            : `INSERT INTO books (id, title, author, price)
               VALUES (?, ?, ?, ?)`;

          const params = id === null
            ? [title.trim(), author.trim(), Number(price)]
            : [id, title.trim(), author.trim(), Number(price)];

          db.run(sql, params, function (insertError) {
            if (insertError) {
              return res.status(500).json({
                message: "Failed to create book."
              });
            }

            const newId = this.lastID;

            const sendCreatedBook = () => {
              db.get(
                "SELECT * FROM books WHERE id = ?",
                [newId],
                (fetchError, book) => {
                  if (fetchError) {
                    return res.status(500).json({
                      message: "Book created, but could not retrieve it."
                    });
                  }

                  return res.status(201).json({
                    message: "Book created successfully.",
                    book
                  });
                }
              );
            };

            if (id === null) {
              return sendCreatedBook();
            }

            db.run(
              "DELETE FROM reusable_book_ids WHERE id = ?",
              [id],
              (deleteError) => {
                if (deleteError) {
                  return res.status(500).json({
                    message: "Book created, but ID allocation cleanup failed."
                  });
                }

                sendCreatedBook();
              }
            );
          });
        };

        if (!reusableId) {
          return insertBook(null);
        }

        insertBook(reusableId.id);
      }
    );
  });
};

// PUT /books/:id - Update an existing book
exports.updateBook = (req, res) => {
  const id = validateId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid book ID."
    });
  }

  const validationError = validateBook(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError
    });
  }

  const { title, author, price } = req.body;

  db.run(
    `UPDATE books
     SET title = ?, author = ?, price = ?
     WHERE id = ?`,
    [title.trim(), author.trim(), Number(price), id],
    function (error) {
      if (error) {
        return res.status(500).json({
          message: "Failed to update book."
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Book not found."
        });
      }

      db.get(
        "SELECT * FROM books WHERE id = ?",
        [id],
        (fetchError, book) => {
          if (fetchError) {
            return res.status(500).json({
              message: "Book updated, but could not retrieve it."
            });
          }

          return res.status(200).json({
            message: "Book updated successfully.",
            book
          });
        }
      );
    }
  );
};

// DELETE /books/:id - Delete an existing book
exports.deleteBook = (req, res) => {
  const id = validateId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid book ID."
    });
  }

  db.serialize(() => {
    db.get(
      "SELECT id FROM books WHERE id = ?",
      [id],
      (selectError, book) => {
        if (selectError) {
          return res.status(500).json({
            message: "Failed to find book."
          });
        }

        if (!book) {
          return res.status(404).json({
            message: "Book not found."
          });
        }

        db.run(
          "DELETE FROM books WHERE id = ?",
          [id],
          function (deleteError) {
            if (deleteError) {
              return res.status(500).json({
                message: "Failed to delete book."
              });
            }

            db.run(
              `INSERT OR REPLACE INTO reusable_book_ids
               (id, deleted_at)
               VALUES (?, CURRENT_TIMESTAMP)`,
              [id],
              (poolError) => {
                if (poolError) {
                  return res.status(500).json({
                    message: "Book deleted, but ID could not be registered for reuse."
                  });
                }

                return res.status(200).json({
                  message: "Book deleted successfully.",
                  deletedId: id
                });
              }
            );
          }
        );
      }
    );
  });
};
