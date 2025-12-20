import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";


const app = express();
const port = 3000;

await connectDB()

// middleware
app.use(express.json()); // Add parentheses here
app.use(cors());
app.use(clerkMiddleware())

// api routes
app.get('/', (req, res) => {
    res.send('Server is Live');
});
app.use('/api/inngest',serve({ client: inngest, functions }))



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});