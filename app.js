const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.cieakpt.mongodb.net/${process.env.MONGODB_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();
var server = require('http').createServer(app);

const productRouter=require("./routes/product");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-control-Allow-Origin', '*');
    res.setHeader('Access-control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-control-Allow-Headers', 'Content-Type,Authorization,origin, x-requested-with');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


app.use(productRouter);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data,
    })

})


const port = process.env.PORT || 8080;

mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        server.listen(port, () => {
            console.log("server started");
        });

        const io = require('./socket').init(server);
        io.on('connection', socket => {
            console.log('Client connected');
            socket.on('disconnect', () => {
                console.log("disconnected:");
            });
        });
    })
    .catch(err => {
        console.log(err);
    })