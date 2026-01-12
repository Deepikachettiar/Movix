import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { syncUserToDB } from './middleware/syncUser.js';



const app = express();
const port = 3000;

await connectDB()

// middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

// Sync authenticated Clerk user into MongoDB (non-blocking)
app.use(syncUserToDB);


app.use('/api/show', showRouter);
app.get('/', (req, res) => {
    res.send('Server is Live');
});
app.use('/api/inngest',serve({ client: inngest, functions }))
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});