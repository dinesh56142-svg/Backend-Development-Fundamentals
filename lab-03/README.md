\# Lab 3: REST API, Query Parameters, Validation, Debugging



\*\*Live API:\*\* https://backend-development-fundamentals-lab-03.onrender.com



\## Student Details



\- \*\*Name:\*\* D. Dinesh Sesha Sai

\- \*\*Registration Number:\*\* 252U1R6063

\- \*\*Section:\*\* AI\&ML-2B

\- \*\*Course:\*\* Backend Development Fundamentals



\## 1. Overview



This lab focuses on developing a RESTful API using Node.js, Express.js and SQLite.



The API provides book management operations, including retrieving, creating, updating and deleting books. It also supports searching, sorting, pagination, price filtering, input validation and appropriate HTTP status codes.



\## 2. Technologies Used



\- Node.js

\- Express.js

\- SQLite

\- SQLite3

\- JavaScript

\- Postman



\## 3. Live Deployment



The application is deployed on Render.



\*\*Base URL:\*\*  

https://backend-development-fundamentals-lab-03.onrender.com



\*\*Books API:\*\*  

https://backend-development-fundamentals-lab-03.onrender.com/books



The deployed API can be accessed through Postman or a web browser.



\*\*Note:\*\* Render's free service may spin down after inactivity. Its filesystem is ephemeral, so SQLite data created during runtime may not persist through restarts or redeployments. The project includes its database file and initialization logic.



\## 4. Project Structure



```text

lab-03/

│

├── database/

│   └── lab3\_library.db

│

├── postman/

│   ├── collections/

│   │   └── Lab 3 - REST API Testing/

│   └── Lab-3-REST-API-Testing.postman\_collection.json

│

├── screenshots/

│   ├── all-books.png

│   ├── book-not-found.png

│   ├── delete-book-not-found.png

│   ├── delete-book.png

│   ├── max-price-filter.png

│   ├── min-price-filter.png

│   ├── pagination-limit.png

│   ├── pagination-offset.png

│   ├── post-book.png

│   ├── price-range-filter.png

│   ├── search-books.png

│   ├── single-book.png

│   ├── sort-books-asc.png

│   ├── sort-books-desc.png

│   ├── update-book-not-found.png

│   ├── update-book.png

│   ├── validation-empty-author.png

│   ├── validation-empty-title.png

│   ├── validation-invalid-price.png

│   ├── validation-missing-price.png

│   └── validation-negative-price.png

│

├── src/

│   ├── config/

│   │   ├── database.js

│   │   └── initializeDatabase.js

│   ├── controllers/

│   │   └── booksController.js

│   ├── middleware/

│   ├── routes/

│   │   └── booksRoutes.js

│   ├── services/

│   ├── app.js

│   └── server.js

│

├── .gitignore

├── package.json

└── package-lock.json

```



\## 5. Installation and Execution



\### Prerequisites



\- Node.js

\- npm



\### Step 1: Clone the repository



```bash

git clone https://github.com/dinesh56142-svg/Backend-Development-Fundamentals.git

```



\### Step 2: Navigate to Lab 3



```bash

cd Backend-Development-Fundamentals/lab-03

```



\### Step 3: Install dependencies



```bash

npm install

```



\### Step 4: Configure environment variables



The application uses the `PORT` environment variable when provided. Otherwise, it uses port `5000`.



Example:



```env

PORT=5000

```



No additional environment variables are required for the current local configuration.



\### Step 5: Start the application



Development mode:



```bash

npm run dev

```



Production mode:



```bash

npm start

```



The server will be available at:



```text

http://localhost:5000

```



\## 6. API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| GET | `/` | Displays the API welcome message. |

| GET | `/books` | Retrieves books with search, sorting, pagination and price filters. |

| GET | `/books/:id` | Retrieves a specific book using its ID. |

| POST | `/books` | Creates a new book. |

| PUT | `/books/:id` | Updates an existing book. |

| DELETE | `/books/:id` | Deletes a book using its ID. |



\### Query Parameters – GET /books



| Parameter | Description |

|---|---|

| `search\_q` | Searches book titles using partial matching. |

| `order\_by` | Selects the column used for sorting. |

| `order` | Specifies ascending (`ASC`) or descending (`DESC`) order. |

| `limit` | Controls the maximum number of records returned. |

| `offset` | Specifies the number of records to skip. |

| `min\_price` | Filters books with a minimum price. |

| `max\_price` | Filters books with a maximum price. |



\### Example Requests



Search:



```text

GET /books?search\_q=Harry

```



Sort by price:



```text

GET /books?order\_by=price\&order=ASC

```



Pagination:



```text

GET /books?limit=5\&offset=5

```



Minimum price:



```text

GET /books?min\_price=400

```



Maximum price:



```text

GET /books?max\_price=300

```



Price range:



```text

GET /books?min\_price=300\&max\_price=500

```



\## 7. Request Validation and HTTP Status Codes



The API validates incoming book data before creating or updating records.



A valid book requires:



\- A non-empty title.

\- A non-empty author.

\- A valid numeric, non-negative price.



| HTTP Status | Meaning | Usage |

|---|---|---|

| 200 | OK | Successful retrieval, update or deletion. |

| 201 | Created | Successful book creation. |

| 400 | Bad Request | Missing or invalid input. |

| 404 | Not Found | Requested book or endpoint does not exist. |

| 500 | Internal Server Error | Unexpected server-side error. |



Error responses use a consistent JSON message format.



\## 8. Postman Testing



A Postman collection named \*\*Lab 3 - Render API Testing\*\* was created to verify the deployed REST API.



The collection contains 24 requests covering successful operations, query parameters and validation failures.



\### Test Cases Covered



1\. Get All Books

2\. Get Single Book

3\. Book Not Found

4\. Create New Book

5\. Update Existing Book

6\. Delete Existing Book

7\. Validation – Missing Title

8\. Validation – Missing Author

9\. Get All Books

10\. Search Books

11\. Sort Books by Price ASC

12\. Sort Books by Price DESC

13\. Pagination Limit

14\. Pagination Offset

15\. Minimum Price Filter

16\. Maximum Price Filter

17\. Price Range Filter

18\. Validation – Non-Numeric Price

19\. Validation – Negative Price

20\. Validation – Missing Price

21\. Validation – Empty Title

22\. Validation – Empty Author

23\. Update Book Not Found

24\. Delete Book Not Found



\*\*Postman Collection Export:\*\*  

`postman/Lab-3-REST-API-Testing.postman\_collection.json`



The exported collection can be imported into Postman to access the requests.



\## 9. Screenshots and Results



\### 9.1 Book Retrieval



\*\*Get All Books\*\*



!\[Get All Books](screenshots/all-books.png)



\*\*Get Single Book\*\*



!\[Get Single Book](screenshots/single-book.png)



\*\*Book Not Found\*\*



!\[Book Not Found](screenshots/book-not-found.png)



\### 9.2 CRUD Operations



\*\*Create Book\*\*



!\[Create Book](screenshots/post-book.png)



\*\*Update Book\*\*



!\[Update Book](screenshots/update-book.png)



\*\*Delete Book\*\*



!\[Delete Book](screenshots/delete-book.png)



\*\*Update Book Not Found\*\*



!\[Update Book Not Found](screenshots/update-book-not-found.png)



\*\*Delete Book Not Found\*\*



!\[Delete Book Not Found](screenshots/delete-book-not-found.png)



\### 9.3 Search, Sorting and Filtering



\*\*Search Books\*\*



!\[Search Books](screenshots/search-books.png)



\*\*Sort by Price – Ascending\*\*



!\[Sort ASC](screenshots/sort-books-asc.png)



\*\*Sort by Price – Descending\*\*



!\[Sort DESC](screenshots/sort-books-desc.png)



\*\*Pagination – Limit\*\*



!\[Pagination Limit](screenshots/pagination-limit.png)



\*\*Pagination – Offset\*\*



!\[Pagination Offset](screenshots/pagination-offset.png)



\*\*Minimum Price Filter\*\*



!\[Minimum Price Filter](screenshots/min-price-filter.png)



\*\*Maximum Price Filter\*\*



!\[Maximum Price Filter](screenshots/max-price-filter.png)



\*\*Price Range Filter\*\*



!\[Price Range Filter](screenshots/price-range-filter.png)



\### 9.4 Validation and Error Handling



\*\*Empty Title\*\*



!\[Empty Title Validation](screenshots/validation-empty-title.png)



\*\*Empty Author\*\*



!\[Empty Author Validation](screenshots/validation-empty-author.png)



\*\*Invalid Price\*\*



!\[Invalid Price Validation](screenshots/validation-invalid-price.png)



\*\*Missing Price\*\*



!\[Missing Price Validation](screenshots/validation-missing-price.png)



\*\*Negative Price\*\*



!\[Negative Price Validation](screenshots/validation-negative-price.png)



\## 10. Debugging and Problems Faced



The lab included debugging common backend development errors.



\### 1. Port Conflict – EADDRINUSE



\*\*Problem:\*\* The server could not start because the configured port was already in use by another running process.



\*\*Solution:\*\* The duplicate server process was stopped, and the application was restarted using the configured port.



\### 2. Incorrect Import Path



\*\*Problem:\*\* An incorrect relative module path can prevent Node.js from locating and loading a required file.



\*\*Solution:\*\* The import paths were checked and corrected according to the project directory structure.



\### 3. SQLite Table-Name Error



\*\*Problem:\*\* An incorrect table name in an SQL query can produce a `no such table` error.



\*\*Solution:\*\* The SQL statements were checked against the actual database table names and corrected.



\### 4. Missing await



\*\*Problem:\*\* Database initialization is asynchronous. Starting the server before initialization finishes can cause execution-order problems.



\*\*Solution:\*\* `await` was used to ensure database initialization completes before the server starts accepting requests.



\## 11. Important Implementation Practices



\- RESTful endpoint naming using nouns.

\- Appropriate HTTP methods for CRUD operations.

\- Parameterized SQL queries to prevent SQL injection.

\- Input validation before database operations.

\- Consistent JSON response structure.

\- Appropriate HTTP status codes.

\- Asynchronous database operations.

\- Environment-based port configuration.

\- `.gitignore` to exclude `node\_modules`, `.env` and unnecessary files.



\## 12. Conclusion



This lab provided practical experience in building and deploying a RESTful API using Node.js, Express.js and SQLite.



The implementation demonstrates CRUD operations, search functionality, sorting, pagination, price-range filtering, request validation, error handling and debugging.



The API was deployed on Render and verified using a Postman collection containing 24 requests covering both successful and unsuccessful scenarios.



The lab helped strengthen my understanding of REST API development, database integration, asynchronous programming, HTTP status codes and backend debugging.



\---



\*\*GitHub Repository:\*\*  

https://github.com/dinesh56142-svg/Backend-Development-Fundamentals



\*\*Live API:\*\*  

https://backend-development-fundamentals-lab-03.onrender.com

