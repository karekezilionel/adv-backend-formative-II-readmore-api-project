# ReadMore API - Express & MongoDB

A RESTful API for a bookstore built with Express.js, MongoDB, and Mongoose. It features two related entities (Authors and Books) and enforces strict business rules.

## Setup & Installation
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file in the root directory and add:
   `MONGO_URI=your_mongodb_connection_string`
   `PORT=3000`
4. Run `npm run dev` to start the server locally.

## API Endpoints

### Authors
* `POST /authors` - Create an author
* `GET /authors` - Get all authors
* `GET /authors/:id` - Get one author
* `PUT /authors/:id` - Update an author
* `DELETE /authors/:id` - Delete an author (Blocked if books exist)
* `GET /authors/:id/books` - Get all books by an author
* `GET /authors/:id/stats` - Get stats for an author

### Books
* `POST /books` - Create a book
* `GET /books` - Get all books (Supports dynamic filtering/sorting)
* `GET /books/:id` - Get one book
* `PUT /books/:id` - Update a book
* `DELETE /books/:id` - Delete a book

## Business Rules Enforced
1. **No orphan books:** Books must belong to a real author (400).
2. **No duplicate titles:** Per author, case-insensitive (409).
3. **Validation:** Price > 0, Year between 1450 and current (422).
4. **Author Deletion Policy:** Block deletion if the author has books (409).
5. **Dynamic Filtering:** GET /books supports `genre`, `minPrice`, `maxPrice`, `author`, `search`, `sort`, `order`.
6. **Stats:** Endpoint handles authors with zero books gracefully.


### Video link: https://youtu.be/ltlDPqC_Qwk
