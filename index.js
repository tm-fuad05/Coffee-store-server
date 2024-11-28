const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmsil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("CffeeDB");
    const coffeeCollection = database.collection("CoffeeData");

    app.post("/coffee", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffeeData = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
        },
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updatedCoffeeData,
        options
      );
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!!!I am here");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
