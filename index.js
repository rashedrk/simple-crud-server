const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://rashedrk001:5cJzlpfku6Y2xlKQ@cluster0.qrkrfrq.mongodb.net/?retryWrites=true&w=majority";

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
        const database = client.db("usersDB");
        const usersCollection = database.collection("users");

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await usersCollection.findOne(query);
            res.send(result);

        })

        app.put('/users/:id', async (req,res) => {
            const id = req.params.id;
            console.log('update req for', id);
            const user = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updateUser = {
                $set: {
                    name: user.name,
                    email : user.email
                }
            };
            const result = await usersCollection.updateOne(filter, updateUser,options);
            res.send(result);

        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log("please delete", id)
            const query = {_id : new ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("CRUD is running");
})
app.listen(port, () => {
    console.log(`server is running at ${port}`)
})