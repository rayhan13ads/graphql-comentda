const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
require("dotenv").config({ path: ".env" });

const { jwtGenerate } = require("../../utils/jwtUtils");

const {
  validationRegisterInput,
  validationLoginInput,
} = require("../../utils/validators");

module.exports = {
  Mutation: {
    //===========================Register
    register: async (
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) => {
      const { valid, errors } = validationRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //validation
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = jwtGenerate(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    //========================= login
    login: async (parent, { username, password }, context, info) => {
      console.log(username);

      const { valid, errors } = validationLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Wrong Crendentials", { errors });
      }

      const user = await User.findOne({ username });

      console.log(user);

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong Crendentials";
        throw new UserInputError("Wrong Crendentials", { errors });
      }

      const token =  jwtGenerate(user);

      console.log(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
