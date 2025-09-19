const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app =express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];

// CORS options with dynamic origin
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // allow this origin
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies or auth headers
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

app.use(express.json());

app.get ('/',(req, res)=> res.send("API is running.."));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 7000;
app.listen(PORT, ()=> console.log(`Backend running on http://localhost:${PORT}`));