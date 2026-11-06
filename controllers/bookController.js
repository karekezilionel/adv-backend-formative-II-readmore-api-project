const Book = require('../models/Book');
const Author = require('../models/Author');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new book
// @route   POST /books
const createBook = asyncHandler(async (req, res) => {
  const { title, price, publishedYear, author } = req.body;

  // RULE 1: No orphan books. Check if the author actually exists.
  const authorExists = await Author.findById(author);
  if (!authorExists) {
    return res.status(400).json({ error: 'Cannot create book: Author does not exist' });
  }

  // RULE 2: No duplicate titles per author (case-insensitive)
  const duplicateBook = await Book.findOne({
    author: author,
    title: { $regex: new RegExp(`^${title}$`, 'i') } 
  });

  if (duplicateBook) {
    return res.status(409).json({ error: 'This author already has a book with this exact title' });
  }

  // RULE 3: Validate price and publishedYear
  const currentYear = new Date().getFullYear();
  
  if (price <= 0) {
    return res.status(422).json({ error: 'Price must be greater than zero' });
  }

  if (publishedYear < 1450 || publishedYear > currentYear) {
    return res.status(422).json({ 
      error: `Published year must be between 1450 and ${currentYear}` 
    });
  }

  // If all checks pass, create the book
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
  // We will add the same validation rules to the update function later.
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