const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput } = require('../../utils/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // TODO: validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // TODO: make sure user doenst already exist
      console.log(username);
      const user = await User.findOne({ username });
      console.log(user);
      if (user) {
        throw new UserInputError(`${username} is taken`, {
          error: {
            username: 'This username is taken',
          },
        });
      }
      // Hash password and  create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
