const router = require('express').Router();
const fun = require('../controller/productController');
const Product = require('../models/product');


router.route('/')
.get(fun.findAll)
.post(fun.uploadOptions.single('image'),fun.createOne);

router.route('/:id')
.get(fun.findById)
.delete(fun.deleteOneById)
.put(fun.uploadOptions.single('image'), fun.updateOne);

router.put('/galeery-images/:id',fun.uploadOptions.array('images',10), fun.uploadImages);

router.get('/get/count',fun.getProductCount);
router.get('/get/featured/:count?', fun.getFeaturedProducts);

module.exports = router;