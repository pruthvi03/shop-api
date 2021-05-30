const express = require("express");
const app = express();
require('dotenv').config({path:'./config/.env'});
require('./src/db/mongoose');
const port = process.env.PORT || 3000;
const api = process.env.API_URL;
const cors = require('cors');
const categoryRouter = require('./src/routers/categoryRoute');
const productRouter = require('./src/routers/productRoute');
const userRouter = require('./src/routers/userRoute'); 
const orderRouter = require('./src/routers/orderRoute');
const authJwt = require('./src/helpers/jwt');
const errorHandler = require('./src/helpers/error-handler');

const morgan = require('morgan');

app.use(cors());
app.options('*',cors());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
// app.use(errorHandler());
app.use(function errorHandler(err, req, res, next) {
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

app.use(`${api}/category`, categoryRouter);
app.use(`${api}/product`, productRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);

app.get(`${api}/`,(req,res)=>{
    res.send("<h1>Hello World</h1>");
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})