import { getAllBooks, getBookById } from '../models/books.js';

const bookIdSchema = Object.freeze({
  type: 'string',
  required: true,
  pattern: /^\d+$/,
  message: 'Invalid book id',
});

const validateBookId = (value) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value !== bookIdSchema.type) {
    return false;
  }

  return bookIdSchema.required && bookIdSchema.pattern.test(String(value));
};

const validateBookIdRequest = (req) => {
  const requestedId = req?.params?.id;

  if (!validateBookId(requestedId)) {
    return {
      isValid: false,
      error: bookIdSchema.message,
    };
  }

  return {
    isValid: true,
    value: requestedId,
  };
};

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
  const validationResult = validateBookIdRequest(req);

  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.error });
  }

  try {
    const book = await getBookById(validationResult.value);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBooksHandler, getBookByIdHandler };