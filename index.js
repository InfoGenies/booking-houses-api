const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const PORT = process.env.PORT || "8080"

const connectDB = async() => {
    try{
        const conn = await mongoose.connect('mongodb+srv://asmahami:zakibdr123@node-shope.ucfokfe.mongodb.net/?retryWrites=true&w=majority')
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        }catch(error){
            console.log(error);
            process.exit(1);
          }

}

// getting the routing
 const houseRouter = require('./api/routes/house')
// const orderRouter = require('./api/routes/order')
const userRouter = require('./api/routes/user')

// Use Morgan middleware
// we use morgan to logg(enregitstre) the info of the req like the ip client and status req
app.use(morgan('dev'));

//  This is a middleware function in an Express.js application that handles Cross-Origin Resource Sharing (CORS)
//  for incoming HTTP requests.
//  The code sets the required HTTP headers that allow resources on a web page to be requested
 // from a different domain than the one which served the initial page.
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
if( req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT, POST,PATCH ,DELETE,GET')
    return res.status(200).json({})
}
next()
})

// make the file that contain all images is accessible  (permission)
app.use('/tmp', express.static('/tmp'));
// body-parser is a popular middleware for Node.js used to parse(analyser) incoming request bodies
// in a middleware before your handlers.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// *use()* is Middleware, which are functions that can be executed before or after a request is
// processed. Middleware can be used to handle common tasks such 
// as authentication, logging, and error handling
// Route which should handle request 
 app.use('/houses', houseRouter)
// app.use('/order', orderRouter)

app.use('/user',userRouter)

app.use((req, res, next) => {
    const error = new Error('Not found ')
    error.status = 404
    next(error)
})

// this will work with database 
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })

})

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})
