const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const BookSchema = new Schema(
  {
    reads: { type: Number, default: 0 },
    pages: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    isPDF: { type: Boolean, default: false },
    authors: { type: [String], default: [] },
    category: { type: String, default: 'all' },
    coverImageUrl: { type: String, default: '' },
    imageContentUrls: { type: [String], default: [] },
    content: { type: String, default: '', trim: true },
    title: { type: String, required: [true, 'is required'], minlength: 1, trim: true }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'books' }
);
BookSchema.plugin(mongoosePaginate);

const Book = model('Book', BookSchema);

module.exports = Book;
