import express from "express";
import cors from "cors";
import  "dotenv/config";
import connectDB from "./config/mongodb.js";



const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// Middleware

app.use(express.json());
app.use(cors());

// api endpoints
app.get('/',(req, res) => {
    res.send('API is working')
})

app.listen(PORT, () => console.log('server started at', PORT))
