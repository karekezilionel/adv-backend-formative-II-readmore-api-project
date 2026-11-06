const express = require('express');
const router = express.Router();
const {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getAuthorBooks
} = require('../controllers/authorController');

router.route('/')
  .post(createAuthor)
  .get(getAuthors);

router.route('/:id/books')
  .get(getAuthorBooks);

router.route('/:id')
  .get(getAuthorById)
  .put(updateAuthor)
  .delete(deleteAuthor);

module.exports = router;