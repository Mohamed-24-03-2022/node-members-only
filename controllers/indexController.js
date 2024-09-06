require('dotenv').config();

const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { createUser, getAllMessages, createMessage, getUserById, destroyMessage, setUserAsAdmin } = require('../model/queries');
const passport = require('passport');


const validateSignup = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First Name is required')
    .isAlpha().withMessage('First Name must contain only letters')
    .isLength({ max: 50 }).withMessage('First Name must be at most 50 characters long'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last Name is required')
    .isAlpha().withMessage('Last Name must contain only letters')
    .isLength({ max: 50 }).withMessage('Last Name must be at most 50 characters long'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long'),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('confirmPassword')
    .trim()
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];
const validateMessage = [
  body('title')
    .trim()
    .notEmpty().withMessage('title is required')
    .isLength({ max: 50 }).withMessage('title must be at most 50 characters long'),

  body('text')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message must be at most 1000 characters long'),
];

const get = async (req, res, next) => {
  const messages = await getAllMessages();
  const messagesWithOwner = await Promise.all(
    messages.map(async (message) => {
      const rows = await getUserById(message.owner_id);
      const added = message.added.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return { ...message, added, owner: rows[0] };
    })
  );

  res.render('index', { messages: messagesWithOwner });
}

const signupFormGet = (req, res, next) => {
  res.render('signup-form');
}
const signupFormPost = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render('signup-form', { errors: result.array() });
  }

  const { firstName, lastName, username, password, confirmPassword } = req.body;

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }

    const rows = await createUser(firstName, lastName, username, hashedPassword);
    const user = rows[0];

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });

  });

}


const loginFormGet = (req, res, next) => {
  res.render('login-form');
}
const loginFormPost = passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });



const msgFormGet = (req, res, next) => {
  res.render('msg-form');
}
const msgFormPost = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render('msg-form', { errors: result.array() });
  }

  if (req.isAuthenticated()) {
    const { title, text } = req.body;
    const date = new Date();
    await createMessage(title, text, date, req.user.id);
    res.redirect('/');
  } else {
    res.render('msg-form', { error: { status: 400, message: 'You need to sign in to be able to post' } });
  }
}
const deleteMessage = async (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    await destroyMessage(req.params.id);
    return res.redirect('/');
  }
}

const logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err)
      return next(err);
    res.redirect('/');
  });
}


const adminGet = (req, res, next) => {
  res.render('admin');
}
const adminPost = async (req, res, next) => {
  if (req.isAuthenticated() && req.body.password === process.env.ADMIN_PW) {
    await setUserAsAdmin(req.user.id);
    res.redirect('/');
  } else {
    res.render('admin', { error: { status: 400, message: 'Please inter a valid admin password' } });
  }
}


module.exports = {
  validateSignup,
  validateMessage,
  get,
  signupFormGet,
  signupFormPost,
  loginFormGet,
  loginFormPost,
  msgFormGet,
  msgFormPost,
  deleteMessage,
  logoutGet,
  adminGet,
  adminPost,
}