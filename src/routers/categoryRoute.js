const router = require('express').Router();
const fun = require('../controller/categoryController');


router.route('/')
.get(fun.findAll)
.post(fun.createOne)

router.route('/:id')
.get(fun.findById)
.delete(fun.deleteOneById)
.put(fun.updateOne)
module.exports = router;