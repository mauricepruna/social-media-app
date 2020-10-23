const User = require("../../models/User");
module.exports = {
  Mutation: {
    register(_, args, context, info) {
      // TODO: validate user data
      // TODO: make sure user doenst already exist
      // TODO: hash password and  create an auth token
    },
  },
};
