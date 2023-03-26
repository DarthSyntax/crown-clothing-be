const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const util = require('util');
const AppError = require('./../utils/appError');
require('dotenv').config();

// The signToken function is a utility function that generates a JSON Web Token (JWT) for a given user ID.
// It takes the user ID as an argument and signs it with a secret key, setting an expiration time of 90 days.
// The function returns the signed JWT, which can be used for user authentication and authorization purposes.
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '90d' });
};

// The signup function is an asynchronous function that creates a new user in the database.
// It takes the request, response, and next middleware as arguments.
// The function first creates a new user using the request body data.
// Then, it generates a JSON Web Token (JWT) for the new user using the signToken function.
// Finally, it sends a response with a status code of 201 (Created), the JWT, and the new user data.
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

// The login function is an asynchronous function that authenticates a user based on their email and password.
// It takes the request, response, and next middleware as arguments.
// The function first checks if the email and password are provided in the request body.
// If not, it returns an error with a status code of 400 (Bad Request).
// Then, it checks if the user exists in the database and if the provided password is correct.
// If the user does not exist or the password is incorrect, it returns an error with a status code of 401 (Unauthorized).
// If the user is successfully authenticated, it generates a JSON Web Token (JWT) for the user using the signToken function.
// Finally, it sends a response with a status code of 200 (OK), the JWT, and the user data.
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Incorrect email or password', 400));
  }

  //2) Check if user exists and that the password is correct
  const user = await User.findOne({ email: email }).select('+password');
  console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) If everything is ok send the token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

// The protect function is a middleware that ensures the user is authenticated before granting access to protected routes.
// It checks if the user has a valid JWT token in the request header and verifies the token.
// If the token is valid, it checks if the user still exists and if the user's password has not been changed since the token was issued.
// If all checks pass, the user is granted access to the protected route.
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Getting token and check if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  //2) Verify token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET
  );
  //3) Check if user still exists, token might still be active but user deleted

  //console.log(decoded);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists!')
    );
  }
  //4) Check if user changed password after the token was issued

  //Grant access to the list of users
  req.user = user;
  next();
});

// The restrictedTo function is a middleware that restricts access to certain routes based on the user's role.
// It takes a list of allowed roles as arguments and returns a function that checks if the user's role is included in the allowed roles.
// If the user's role is not included in the allowed roles, it returns an error with a status code of 403 (Forbidden).
// If the user's role is included in the allowed roles, it proceeds to the next middleware or route handler.
exports.restrictedTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to access this feature!', 403)
      );
    }
    next();
  };
};
