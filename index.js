const express = require('express')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.o1cg3.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', function (req, res)
{
    res.send('hello ema jhon')
})

client.connect(err =>
{
    const productsCollection = client.db("emajhondb").collection("products");
    const ordersCollection = client.db("emajhondb").collection("orders");

    app.post('/addProduct', (req, res) =>
    {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result =>
            {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/products', (req, res) =>
    {
        productsCollection.find({}).limit(20)
            .toArray((error, documents) =>
            {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) =>
    {
        productsCollection.find({ key: req.params.key })
            .toArray((error, documents) =>
            {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res) =>
    {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((error, documents) =>
            {
                res.send(documents);
            })
    })

    app.post('/addOrder', (req, res) =>
    {
        const orders = req.body;
        ordersCollection.insertOne(orders)
            .then(result =>
            {
                res.send(result.insertedCount > 0);
            })
    })
});


app.listen(5000)