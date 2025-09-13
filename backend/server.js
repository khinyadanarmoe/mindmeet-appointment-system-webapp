import express from "express";
import cors from "cors";
import  "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import therapistRouter from "./routes/therapistRoute.js";
import userRouter from "./routes/userRoute.js";




const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware

app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/therapist', therapistRouter);
app.use('/api/user', userRouter);


app.get('/',(req, res) => {
    res.send('API is working')
});



app.listen(PORT, () => console.log('server started at', PORT))
