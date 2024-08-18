const multer = require('multer');
const router = require('express').Router();
const Book = require('../models/book.model');
const storage = require('../firebase-config');
const { User, roles } = require('../models/user.model');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const upload = multer();

/* Multipart key information */
const { USER_PAYLOAD_KEY, COVER_IMAGE_KEY, IMAGE_CONTENTS_KEY } = require('../Constants');

/* get books */
router.route('/').get(async (req, res) => {
  try {
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    let result;

    if (isNaN(page) || isNaN(limit)) {
      result = await Book.find();
    } else {
      result = await Book.paginate({}, { page, limit });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* create book */
router.route('/').post(upload.any(), async (req, res) => {
  try {
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { authors, content, pages, title, userID, category, isPDF } = userPayload;
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);

    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const imageContents = req.files.filter(({ fieldname }) =>
      fieldname.includes(IMAGE_CONTENTS_KEY)
    );
    const newBook = new Book({ authors, content, pages, title, category, isPDF });
    for (let i = 0; i < imageContents.length; i++) {
      const imageRef = ref(storage, `books/${newBook._id}/${newBook._id}_${i + 1}`);
      const snapshot = await uploadBytes(imageRef, imageContents[i].buffer);
      const url = await getDownloadURL(snapshot.ref);
      newBook.imageContentUrls.push(url);
    }

    const coverImageFile = req.files.find(({ fieldname }) => fieldname === COVER_IMAGE_KEY);
    const coverImage = coverImageFile?.buffer;
    if (coverImage) {
      const imageRef = ref(storage, `books/${newBook._id}/${newBook._id}_cover-image`);
      const snapshot = await uploadBytes(imageRef, coverImage);
      const url = await getDownloadURL(snapshot.ref);
      newBook.coverImageUrl = url;
    }

    await newBook.save();

    let books;
    if (isNaN(page) || isNaN(limit)) {
      books = await Book.find();
    } else {
      books = await Book.paginate({}, { page, limit });
    }
    res.status(201).json(books);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* update book */
router.route('/:id').patch(upload.any(), async (req, res) => {
  try {
    const { id } = req.params;
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { reads, pages, title, authors, content, category, bookmarks, isPDF } = userPayload;

    const { userID } = userPayload;
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }
    const book = await Book.findById(id);

    if (reads) book.reads = reads;
    if (pages) book.pages = pages;
    if (title) book.title = title;
    if (isPDF) book.isPDF = isPDF;
    if (authors) book.authors = authors;
    if (content) book.content = content;
    if (category) book.category = category;
    if (bookmarks) book.bookmarks = bookmarks;

    const imageContents = req.files.filter(({ fieldname }) =>
      fieldname.includes(IMAGE_CONTENTS_KEY)
    );
    if (imageContents.length > 0) {
      book.imageContentUrls = [];

      for (let i = 0; i < imageContents.length; i++) {
        const imageRef = ref(storage, `books/${book._id}/${book._id}_${i + 1}`);
        const snapshot = await uploadBytes(imageRef, imageContents[i].buffer);
        const url = await getDownloadURL(snapshot.ref);
        book.imageContentUrls.push(url);
      }
    }

    const coverImageFile = req.files.find(({ fieldname }) => fieldname === COVER_IMAGE_KEY);
    const coverImage = coverImageFile?.buffer;
    if (coverImage) {
      const imageRef = ref(storage, `books/${book._id}/${book._id}_cover-image`);
      const snapshot = await uploadBytes(imageRef, coverImage);
      const url = await getDownloadURL(snapshot.ref);
      book.coverImageUrl = url;
    }

    await book.save();

    let books;
    if (isNaN(page) || isNaN(limit)) {
      books = await Book.find();
    } else {
      books = await Book.paginate({}, { page, limit });
    }
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
  const page = Number(req.query['page']);
  const limit = Number(req.query['limit']);

  try {
    const { userID } = req.body;
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    await Book.findByIdAndDelete(id);

    let result;
    if (isNaN(page) || isNaN(limit)) {
      result = await Book.find();
    } else {
      result = await Book.paginate({}, { page, limit });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
