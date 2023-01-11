const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  // const { name, email, password } = req.body;
  // // const salt = await bcrypt.genSalt(10);
  // // const hashedPassword = await bcrypt.hash(password, salt);
  // const hashedPassword = await bcrypt.hash(password, 10);
  // const tempUser = { name, email, password: hashedPassword };
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email: email });
  if (!user) throw new UnauthenticatedError("Please provide valid credentials");
  const passwordMatch = await user.checkPassword(password);
  if (!passwordMatch) {
    throw new UnauthenticatedError("Please provide valid credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
