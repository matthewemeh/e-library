const multer = require('multer');
const router = require('express').Router();
const storage = require('../firebase-config');
const { User, roles } = require('../models/user.model');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

async function checkIfFileExists(filePath) {
  const storageRef = ref(storage, filePath);
  try {
    await getDownloadURL(storageRef);
    return Promise.resolve(true);
  } catch (err) {
    if (err.code === 'storage/object-not-found') {
      return Promise.resolve(false);
    } else {
      return Promise.reject(err);
    }
  }
}

const upload = multer();

/* Multipart key information */
const { USER_PAYLOAD_KEY, PROFILE_IMAGE_KEY } = require('../Constants');

/* register */
router.route('/register').post(upload.any(), async (req, res) => {
  try {
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { name, email, password, role } = userPayload;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send('This email has already been used');
    }
    const superAdminExists = await User.findOne({ role: roles.SUPER_ADMIN });
    const isInvalidRole = role !== undefined && !Object.values(roles).includes(role);
    if (isInvalidRole) {
      return res.status(400).send('Invalid role');
    } else if (role === roles.SUPER_ADMIN && superAdminExists) {
      return res.status(400).send('A SUPER ADMIN already exists');
    }

    const profileImageFile = req.files.find(({ fieldname }) => fieldname === PROFILE_IMAGE_KEY);
    const profileImage = profileImageFile?.buffer;
    const newUser = new User({ name, email, password, role });
    if (profileImage) {
      const imageRef = ref(storage, `users/${newUser._id}`);
      const snapshot = await uploadBytes(imageRef, profileImage);
      const url = await getDownloadURL(snapshot.ref);
      newUser.profileImageUrl = url;
    }

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* update specific user */
router.route('/:id').patch(upload.any(), async (req, res) => {
  try {
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { id } = req.params;
    const { name, password, role, emailValidated, userID, bookRead, bookmarkedBookID } =
      userPayload;

    const user = await User.findById(userID);
    const isOwner = user && user._id == id;
    const isAdmin = user && user.role !== roles.USER;
    if (!(isAdmin || isOwner)) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const userToBeUpdated = await User.findById(id);
    if (!userToBeUpdated) {
      return res.status(500).send('User does not exist');
    }

    if (isAdmin) {
      if (role) userToBeUpdated.role = role;
    }
    if (isOwner) {
      if (name) userToBeUpdated.name = name;
      if (password) userToBeUpdated.password = password;
      if (bookmarkedBookID) {
        const { bookmarkedBookIDs } = userToBeUpdated;
        if (bookmarkedBookIDs.includes(bookmarkedBookID)) {
          userToBeUpdated.bookmarkedBookIDs = bookmarkedBookIDs.filter(
            id => id !== bookmarkedBookID
          );
        } else {
          userToBeUpdated.bookmarkedBookIDs.push(bookmarkedBookID);
        }
      }
      if (bookRead) {
        const bookReadToBeUpdatedIndex = userToBeUpdated.booksRead.findIndex(
          ({ bookID }) => bookID === bookRead.bookID
        );
        if (bookReadToBeUpdatedIndex > -1) {
          userToBeUpdated.booksRead[bookReadToBeUpdatedIndex] = bookRead;
        } else {
          userToBeUpdated.booksRead.push(bookRead);
        }
      }

      const profileImageFile = req.files.find(({ fieldname }) => fieldname === PROFILE_IMAGE_KEY);
      const profileImage = profileImageFile?.buffer;
      if (profileImage) {
        const imageRef = ref(storage, `users/${userToBeUpdated._id}`);
        const snapshot = await uploadBytes(imageRef, profileImage);
        const url = await getDownloadURL(snapshot.ref);
        userToBeUpdated.profileImageUrl = url;
      }
    }

    if (emailValidated !== undefined) userToBeUpdated.emailValidated = emailValidated;

    const updatedUser = await userToBeUpdated.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* delete specific user's profile picture */
router.route('/delete-profile-image/:id').patch(async (req, res) => {
  try {
    const { id } = req.params;
    const { userID } = req.body;

    const user = await User.findById(userID);
    const isOwner = user && user._id == id;
    if (!isOwner) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const userToBeUpdated = await User.findById(id);
    if (!userToBeUpdated) {
      return res.status(500).send('User does not exist');
    }

    /* delete user image */
    const fileExists = await checkIfFileExists(`users/${userToBeUpdated._id}`);
    if (fileExists) {
      const fileRef = ref(storage, `users/${userToBeUpdated._id}`);
      await deleteObject(fileRef);
      userToBeUpdated.profileImageUrl = '';
    }

    const updatedUser = await userToBeUpdated.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* login */
router.route('/login').post((req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then(user => res.json(user))
    .catch(err => res.status(400).send(err.message));
});

/* get users */
router.route('/fetch/:userID').get(async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    let result;

    if (isNaN(page) || isNaN(limit)) {
      result = await User.find();
    } else {
      result = await User.paginate({}, { page, limit });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get specific user */
router.route('/:id').get((req, res) => {
  const { id } = req.params;
  const email = req.query['email'];

  if (email) {
    return User.findOne({ email })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(400).send(err.message));
  }

  User.findById(id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).send(err.message));
});

/* delete specific user */
router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;

  try {
    const { userID } = req.body;
    const user = await User.findById(userID);
    const isOwnerOrAdmin = user && (user.role !== roles.USER || user._id == id);
    if (!isOwnerOrAdmin) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    await User.findByIdAndDelete(id);

    /* delete user image */
    const fileExists = await checkIfFileExists(`users/${id}`);
    if (fileExists) {
      const fileRef = ref(storage, `users/${id}`);
      await deleteObject(fileRef);
    }

    res.status(200).send('User removed');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
