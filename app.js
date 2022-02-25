const express = require("express");
const app = express();
require('dotenv').config({path:'./config/.env'});
require('./src/db/mongoose');
const serverless = require('serverless-http');
const port = process.env.PORT || 3000;
const api = process.env.API_URL || '/api/v1';
const cors = require('cors');
const categoryRouter = require('./src/routers/categoryRoute');
const productRouter = require('./src/routers/productRoute');
const userRouter = require('./src/routers/userRoute'); 
const orderRouter = require('./src/routers/orderRoute');
const authJwt = require('./src/helpers/jwt');
const errorHandler = require('./src/helpers/error-handler');
const router = express.Router();

const morgan = require('morgan');

router.use(cors());
router.options('*',cors());
router.use('/public/uploads', express.static(__dirname + '/public/uploads'));

router.use(express.json());
router.use(morgan('tiny'));
router.use(authJwt());
// router.use(errorHandler());
router.use(function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: "The user is not authorized"})
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).json({message: err})
    }

    // default to 500 server error
    return res.status(500).json(err);
})

router.use(`${api}/category`, categoryRouter);
router.use(`${api}/product`, productRouter);
router.use(`${api}/users`, userRouter);
router.use(`${api}/orders`, orderRouter);

router.get(`${api}/`,(req,res)=>{
    res.send("<h1>Hello World</h1>");
});

app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});