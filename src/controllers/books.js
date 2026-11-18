import {
  getAllBooks,
  getBookById,
  getBooksByAuthorId,
  createBook,
  updateBook,
  deleteBook,
} from '../models/books.js';
import { getAuthorById as getAuthorByIdFromDb } from '../models/authors.js';

// Keep getBooksHandler...
const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;
  try {
    const book = await getBookById(requestedId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Week02
const getBooksByAuthorHandler = async (req, res) => {
  const authorId = req.params.id;
  try {
    const author = await getAuthorByIdFromDb(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const books = await getBooksByAuthorId(authorId);
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /authors/:id/books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required fields: id, authorId, title, publicationDate are required.' });
    }

    const existingBook = await getBookById(id);
    if (existingBook) {
      return res.status(400).json({ message: `A book with ID '${id}' already exists.` });
    }

    const author = await getAuthorByIdFromDb(authorId);
    if (!author) {
      return res.status(400).json({ message: `Validation failed: Author with ID '${authorId}' does not exist.` });
    }

    const newBook = { id, authorId, title, publicationDate };
    await createBook(newBook);

    return res.status(201).json(newBook);
  } catch (error) {
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { authorId, title, publicationDate } = req.body;

    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required fields: authorId, title, publicationDate are required.' });
    }

    const existingBook = await getBookById(bookId);
    if (!existingBook) {
      return res.status(404).json({ message: `Book with ID '${bookId}' not found.` });
    }

    const author = await getAuthorByIdFromDb(authorId);
    if (!author) {
      return res.status(400).json({ message: `Validation failed: Author with ID '${authorId}' does not exist.` });
    }

    const updatedData = { authorId, title, publicationDate };
    const updatedBook = await updateBook(bookId, updatedData);
    if (!updatedBook) return res.status(404).json({ message: `Book with ID '${bookId}' not found.` });

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const bookId = req.params.id;

    const existingBook = await getBookById(bookId);
    if (!existingBook) {
      return res.status(404).json({ message: `Book with ID '${bookId}' not found.` });
    }

    await deleteBook(bookId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  getBooksByAuthorHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};