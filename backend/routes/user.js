const router = require('express').Router();
const storage = require('../firebase-config');
const { User, roles } = require('../models/user.model');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

/* register */
router.route('/register').post(async (req, res) => {
  const { name, email, password, profileImage, role } = req.body;

  try {
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
router.route('/:id').patch(async (req, res) => {
  const { id } = req.params;
  const { name, password, profileImage, role, emailValidated, userID } = req.body;

  try {
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

/* login */
router.route('/login').post((req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then(user => res.json(user))
    .catch(err => res.status(400).send(err.message));
});

/* get users */
router.route('/').get(async (req, res) => {
  const { userID } = req.body;

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
    res.status(200).send('User removed');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
