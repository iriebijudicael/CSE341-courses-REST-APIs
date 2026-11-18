// src/models/books.js
import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
}

//week02 code for relationship between books and authors
const getBooksByAuthorId = async (authorId) => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({ authorId }).toArray();

  return books;
};

// Week02
const createBook = async (bookData) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne(bookData);
  return bookData;
};

const updateBook = async (bookId, updateData) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.updateOne({ id: bookId }, { $set: updateData });
  if (result.matchedCount === 0) return null;
  return await collection.findOne({ id: bookId });
};

const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id: bookId });
  return result;
};



export { getAllBooks, getBookById, createBook, updateBook, deleteBook, getBooksByAuthorId };