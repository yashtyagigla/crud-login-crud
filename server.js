const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app =express();
app.use(cors());
app.use(express.json());

app.get ('/',(req, res)=> res.send("API is running.."));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`Backend running on http://localhost:${PORT}`));