const router = require('express').Router();
const fun = require('../controller/orderController');


router.route('/')
.get(fun.findAll)
.post(fun.createOne);

router.route('/:id')
.get(fun.findById)
.put(fun.updateOne)
.delete(fun.deleteOneById)

router.get('/get/totalsales',fun.getTotalSales);
router.get('/get/count', fun.orderCount);
router.get('/get/userorders/:userid',fun.getUserOrders);

module.exports = router;