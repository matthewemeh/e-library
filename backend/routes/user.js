const router = require('express').Router();
const storage = require('../firebase-config');
const { User, roles } = require('../models/user.model');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

/* register */
router.route('/register').post(async (req, res) => {
  const { name, email, password, profileImage, role } = req.body;

  try {
    const newUser = new User({ name, email, password, role });
    const imageRef = ref(storage, `users/${newUser._id}`);
    const snapshot = await uploadBytes(imageRef, profileImage);
    const url = await getDownloadURL(snapshot.ref);
    newUser.profileImageUrl = url;

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* update specific user */
router.route('/:id').patch(async (req, res) => {
  const { id } = req.params;
  const { name, password, profileImage, role, emailValidated } = req.body;

  try {
    const user = await User.findById(id);

    if (name) user.name = name;
    if (role) user.role = role;
    if (password) user.password = password;
    if (profileImage) {
      const imageRef = ref(storage, `users/${user._id}`);
      const snapshot = await uploadBytes(imageRef, profileImage);
      const url = await getDownloadURL(snapshot.ref);
      user.profileImageUrl = url;
    }
    if (emailValidated !== undefined) user.emailValidated = emailValidated;

    const updatedUser = await user.save();
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

/* get all users */
router.route('/').get((req, res) => {
  User.find({ role: roles.USER })
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).send(err.message));
});

/* get specific user */
router.route('/:id').get((req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).send(err.message));
});

/* delete specific user */
router.route('/:id').delete((req, res) =>
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User removed.'))
    .catch(err => res.status(400).send(err.message))
);

module.exports = router;
