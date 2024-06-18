const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const { Schema, model } = mongoose;

const roles = { ADMIN: 'ADMIN', SUPER_ADMIN: 'SUPER_ADMIN', USER: 'USER' };

const UserSchema = new Schema(
  {
    role: { type: String, default: roles.USER },
    profileImageUrl: { type: String, default: '' },
    emailValidated: { type: Boolean, default: false },
    password: { type: String, trim: true, required: [true, 'is required'] },
    name: { type: String, required: [true, 'is required'], minlength: 2, trim: true },
    email: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: [true, 'is required'],
      validate: {
        validator: str => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str),
        message: props => `${props.value} is not a valid email`
      }
    }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'users' }
);
UserSchema.plugin(mongoosePaginate);

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const passwordMatches = bcrypt.compareSync(password, user.password);
  if (passwordMatches) return user;
  throw new Error('Invalid credentials');
};

/* Before returning json response to client, remove the password field */
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

/* before saving user details, hash the password */
UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

const User = model('User', UserSchema);

module.exports = { User, roles };
