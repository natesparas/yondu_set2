const { check } = require('express-validator');
exports.addValidation = [
    check('username', 'Username is requied').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
exports.editValidation = [
    check('id', 'user id must be provided').not().isEmpty(),
    // check('username', 'Username is requied').not().isEmpty(),
    // check('email', 'Please include a valid email').isEmail(),
    // check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
exports.loginValidation = [
     check('username', 'Username is requied').not().isEmpty(),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
exports.getUserValidation = [
    check('id').not().isEmpty()
]