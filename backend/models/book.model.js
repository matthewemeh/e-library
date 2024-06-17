const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BookSchema = new Schema(
  {
    reads: { type: Number, default: 0 },
    pages: { type: Number, default: -1 },
    content: { type: String, default: '' },
    bookmarks: { type: Number, default: 0 },
    authors: { type: [String], default: [] },
    category: { type: String, default: 'all' },
    isDeleted: { type: Boolean, default: false },
    imageContentUrls: { type: [String], default: [] },
    title: { type: String, required: [true, 'is required'], minlength: 1, trim: true }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'books' }
);

const Book = model('Book', BookSchema);

module.exports = Book;
