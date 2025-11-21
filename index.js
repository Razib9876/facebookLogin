require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(cors({
  origin: ["https://gleaming-pie-f546f9.netlify.app/"],
  credentials: true
}));
app.use(express.json());

const port = process.env.PORT || 5000;

// --------------------------------------------------
// MONGODB CONNECTION
// --------------------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3frxmfw.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("facebookDB");
    const usersCollection = database.collection("users");

    console.log("Connected to MongoDB Successfully!");

    // --------------------------------------------------
    // POST API — Save user data to MongoDB
    // --------------------------------------------------
    app.post("/register", async (req, res) => {
      try {
        const userData = req.body;
        console.log("Received:", userData);

        const result = await usersCollection.insertOne(userData);

        res.send({
          success: true,
          message: "User saved successfully!",
          data: result,
        });

      } catch (error) {
        res.status(500).send({ success: false, error: error.message });
      }
    });

    // --------------------------------------------------
    // GET API — Fetch all users
    // --------------------------------------------------
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    // --------------------------------------------------
    // Root route
    // --------------------------------------------------
    app.get("/", (req, res) => {
      res.send("Facebook server is running!");
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.log("Database connection failed:", error);
  }
}

run().catch(console.dir);
