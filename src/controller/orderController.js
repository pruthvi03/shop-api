const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

const findAll = async (req, res) =>{
    try {
        const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered':-1});
    
        if(!orderList) {
            return res.status(404).json({success: false, "message":"Could not find any orders"})
        } 
        res.status(200).json({"success":true,"message":orderList});
        
    } catch (error) {
        res.status(500).json({success: false, "error":error.message});
    }
}

const findById = async (req, res) =>{
    try {
        const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path:'orderItems', populate:{
                path:'product', populate:'category'
            }});
        if(!order) {
            return res.status(404).json({success: false, "message":"Could not find order"})
        } 
        res.status(200).json({"success":true,"message":order});
        
    } catch (error) {
        res.status(500).json({success: false, "error":error.message});
    }
}

const createOne = async (req, res) =>{

    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))

    const orderItemsIdsResolved = await orderItemsIds;
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product','price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }))

    const totalPrice = totalPrices.reduce((a,b)=>a+b, 0)
    try {
        let order = new Order({...req.body, orderItems: orderItemsIdsResolved, totalPrice:totalPrice, user: req.body.user});
        order = await order.save();
        if(!order) {
            return res.status(404).json({success: false, "message":"Could not create an orders"})
        } 
        res.status(200).json({"success":true,"message":order});
        
    } catch (error) {
        res.status(500).json({success: false, "error":error.message});
    }
}

const updateOne = async (req, res)=> {

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {status: req.body.status},
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be updated!')

    res.send(order);
}

const deleteOneById = (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem=>{
                await OrderItem.findByIdAndRemove(orderItem);
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
}

const getTotalSales = async (req, res)=>{
    const totalSales = await Order.aggregate([
        {$group:{_id:null, totalSales:{$sum:'$totalPrice'}}}
    ])

    if(!totalSales)
    return res.status(400).send('the total Sales cannot be generated!')

    res.send({totalSales:totalSales.pop().totalSales});
}

const orderCount = async (req, res)=>{
    const count = await Order.countDocuments(count=>count)

    if(!count)
    return res.status(400).send('the total order cannot be counted!')

    res.send({orderCount:count});
} 

const getUserOrders = async (req, res)=>{
    try {
        const userOrderList = await Order.find({user: req.params.userid})
        .populate('user', 'name')
        .populate({
            path:'orderItems', populate:{
                path:'product', populate:'category'
            }});
    
        if(!userOrderList) {
            return res.status(404).json({success: false, "message":"Could not find any orders"})
        } 
        res.status(200).json({"success":true,"message":userOrderList});
        
    } catch (error) {
        res.status(500).json({success: false, "error":error.message});
    }
} 

module.exports = {
    findAll,
    findById,
    createOne,
    updateOne,
    deleteOneById,
    getTotalSales,
    orderCount,
    getUserOrders
}