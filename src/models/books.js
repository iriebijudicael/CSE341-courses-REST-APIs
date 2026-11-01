import { getDb } from '../db/connect.js';

const MAX_PAGE_SIZE = 100;

const getAllBooks = async (page = 1, limit = 10) => {
  const db = getDb();
  const collection = db.collection('books');

  const pageNumber = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const requestedLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const pageSize = Math.min(requestedLimit, MAX_PAGE_SIZE);
  const skip = (pageNumber - 1) * pageSize;
  const filter = { _id: { $exists: true } };

  const books = await collection
    .find(filter)
    .sort({ _id: 1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

export { getAllBooks, getBookById };