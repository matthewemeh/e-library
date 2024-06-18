const router = require('express').Router();
const Book = require('../models/book.model');
const storage = require('../firebase-config');
const { User, roles } = require('../models/user.model');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

/* get books */
router.route('/').get(async (req, res) => {
  try {
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);

    const result = await Book.paginate({}, { page, limit });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* create book */
router.route('/').post(async (req, res) => {
  const { authors, content, pages, imageContents, title, userID } = req.body;
  const page = Number(req.query['page'] ?? 1);
  const limit = Number(req.query['limit'] ?? 10);

  try {
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const newBook = new Book({ authors, content, pages, title });
    const imageContentsLength = imageContents?.length ?? 0;
    for (let i = 0; i < imageContentsLength; i++) {
      const imageRef = ref(storage, `books/${newBook._id}/${newBook._id}_${i + 1}`);
      const snapshot = await uploadBytes(imageRef, imageContents[i]);
      const url = await getDownloadURL(snapshot.ref);
      newBook.imageContentUrls.push(url);
    }

    await newBook.save();
    const books = await Book.paginate({}, { page, limit });
    res.status(201).json(books);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* update book */
router.route('/:id').patch(async (req, res) => {
  const { id } = req.params;
  const page = Number(req.query['page'] ?? 1);
  const limit = Number(req.query['limit'] ?? 10);
  const { reads, pages, title, authors, content, category, bookmarks, isDeleted, imageContents } =
    req.body;

  try {
    const { userID } = req.body;
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }
    const book = await Book.findById(id);

    if (reads) book.reads = reads;
    if (pages) book.pages = pages;
    if (title) book.title = title;
    if (authors) book.authors = authors;
    if (content) book.content = content;
    if (category) book.category = category;
    if (bookmarks) book.bookmarks = bookmarks;
    if (isDeleted !== undefined) book.isDeleted = isDeleted;
    if (imageContents) {
      /* delete book images folder with id */
      const folderRef = ref(storage, `books/${id}`);
      await deleteObject(folderRef);
      book.imageContentUrls = [];

      for (let i = 0; i < imageContents.length; i++) {
        const imageRef = ref(storage, `books/${id}/${id}_${i + 1}`);
        const snapshot = await uploadBytes(imageRef, imageContents[i]);
        const url = await getDownloadURL(snapshot.ref);
        book.imageContentUrls.push(url);
      }
    }

    await book.save();
    const books = await Book.paginate({}, { page, limit });
    res.status(200).json(books);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get a specific book alongside an array of similar books */
router.route('/:id').get(async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query['limit'] ?? 5);

  try {
    const book = await Book.findById(id);
    const similarBooks = await Book.find({ category: book.category, _id: { $ne: id } }).limit(
      limit
    );
    res.status(200).json({ book, similarBooks });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get a specific category of books */
router.route('/category/:category').get(async (req, res) => {
  const { category } = req.params;

  try {
    let books;
    if (category === 'all') {
      books = await Book.find().sort({ updatedAt: -1 });
    } else {
      books = await Book.find({ category });
    }
    res.status(200).json(books);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/increase-reads/:id').post(async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    book.reads += 1;
    book.markModified('reads');
    await book.save();
    res.status(200).json(book);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/increase-bookmarks/:id').post(async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    book.bookmarks += 1;
    book.markModified('bookmarks');
    await book.save();
    res.status(200).json(book);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* delete specific book */
router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;

  try {
    const { userID } = req.body;
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const book = await Book.findById(id);
    book.isDeleted = true;
    await book.save();
    res.status(200).send('Book removed');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
