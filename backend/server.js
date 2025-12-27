const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const complaintRoutes = require('./src/routes/complaints');
const userRoutes = require('./src/routes/users');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('AI Complaint System API is running...');
});

app.get('/api', (req, res) => {
  res.json({ status: 'API Operational', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
