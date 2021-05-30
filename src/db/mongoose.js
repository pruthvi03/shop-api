const mongoose = require('mongoose');

console.log("db connecting.......")
mongoose.connect(process.env.DB_URL,
    {
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true,
        useNewUrlParser:true
    }
).then(conn =>{
    console.log("Database connected");
}).catch(err =>{console.log(err)});