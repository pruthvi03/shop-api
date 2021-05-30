const router = require('express').Router();
const fun = require('../controller/userController');


router.route('/')
.get(fun.findAll)
.post(fun.createOne);

router.route('/:id')
.get(fun.findById)
.delete(fun.deleteOneById)
.put(fun.updateOne);

router.get('/get/count',fun.getUserCount);
router.post('/login', fun.login);
router.post('/register', fun.register);

module.exports = router;