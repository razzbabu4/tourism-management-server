const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szh9b4v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const touristSpotsCollection = client.db("touristSpotsDB").collection("touristSpots");

        app.get('/touristSpots', async (req, res) => {
            const cursor = touristSpotsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/myList/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const cursor = touristSpotsCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/touristSpots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotsCollection.findOne(query);
            res.send(result)
        })

        app.post('/touristSpots', async (req, res) => {
            const newTouristSpots = req.body;
            console.log(newTouristSpots);
            const result = await touristSpotsCollection.insertOne(newTouristSpots);
            res.send(result)
        })

        app.put('/touristSpots/:id', async (req, res) => {
            const id = req.params.id;
            const spot = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    image: spot.image,
                    tourists_spot_name: spot.tourists_spot_name,
                    country_Name: spot.country_Name,
                    location: spot.location,
                    average_cost: spot.average_cost,
                    seasonality: spot.seasonality,
                    travel_time: spot.travel_time,
                    totalVisitorsPerYear: spot.totalVisitorsPerYear,
                    description: spot.description,
                },
            };
            const result = await touristSpotsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.delete('/deleteSpots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotsCollection.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Tourism management is running')
})

app.listen(port, () => {
    console.log(`Tourism management server is running on port: ${port}`)
})