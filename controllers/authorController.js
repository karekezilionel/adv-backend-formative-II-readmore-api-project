const Author = require('../models/Author');
const Book = require('../models/Book');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new author
// @route   POST /authors
const createAuthor = asyncHandler(async (req, res) => {
  const author = await Author.create(req.body);
  res.status(201).json(author);
});

// @desc    Get all authors
// @route   GET /authors
const getAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find();
  res.status(200).json(authors);
});

// @desc    Get one author by id
// @route   GET /authors/:id
const getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  
  if (!author) {
    res.status(404);
    throw new Error('Author not found');
  }
  
  res.status(200).json(author);
});

// @desc    Update an author
// @route   PUT /authors/:id
const updateAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true, 
    runValidators: true 
  });

  if (!author) {
    res.status(404);
    throw new Error('Author not found');
  }

  res.status(200).json(author);
});

// @desc    Delete an author
// @route   DELETE /authors/:id
const deleteAuthor = asyncHandler(async (req, res) => {
  // RULE 4 (Option A): Block deletion if the author has books
  const bookCount = await Book.countDocuments({ author: req.params.id });
  
  if (bookCount > 0) {
    return res.status(409).json({ 
      error: `Cannot delete author: ${bookCount} book(s) still reference them. Delete or reassign those books first.` 
    });
  }

  const author = await Author.findByIdAndDelete(req.params.id);

  if (!author) {
    res.status(404);
    throw new Error('Author not found');
  }

  res.status(200).json({ message: 'Author deleted successfully' });
});

// @desc    Get all books by a specific author
// @route   GET /authors/:id/books
const getAuthorBooks = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  
  if (!author) {
    res.status(404);
    throw new Error('Author not found');
  }

  const books = await Book.find({ author: req.params.id });
  res.status(200).json(books);
});

// @desc    Get statistics for a specific author
// @route   GET /authors/:id/stats
const getAuthorStats = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    res.status(404);
    throw new Error('Author not found');
  }

  // Find all books by this author, sorted by price (cheapest to most expensive)
  const books = await Book.find({ author: req.params.id }).sort({ price: 1 });

  // Edge case: Author has no books
  if (books.length === 0) {
    return res.status(200).json({
      author: author.name,
      bookCount: 0,
      averagePrice: 0,
      cheapestBook: null,
      mostExpensiveBook: null
    });
  }

  // Calculate statistics
  const totalPrice = books.reduce((sum, book) => sum + book.price, 0);
  const averagePrice = totalPrice / books.length;

  res.status(200).json({
    author: author.name,
    bookCount: books.length,
    averagePrice: Number(averagePrice.toFixed(2)), 
    cheapestBook: books[0].title, 
    mostExpensiveBook: books[books.length - 1].title 
  });
});

module.exports = {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getAuthorBooks,
  getAuthorStats
};