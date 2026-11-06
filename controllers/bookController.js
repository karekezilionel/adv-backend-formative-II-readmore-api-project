const Book = require('../models/Book');
const Author = require('../models/Author');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new book
// @route   POST /books
const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  await book.populate('author');
  res.status(201).json(book);
});

// @desc    Get all books
// @route   GET /books
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate('author');
  res.status(200).json(books);
});

// @desc    Get one book by id
// @route   GET /books/:id
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('author');

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.status(200).json(book);
});

// @desc    Update a book
// @route   PUT /books/:id
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('author');

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.status(200).json(book);
});

// @desc    Delete a book
// @route   DELETE /books/:id
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.status(200).json({ message: 'Book deleted successfully' });
});

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
};