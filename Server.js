// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wellness', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a simple user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  wellnessScore: Number,
});

const User = mongoose.model('User', userSchema);

// Define API routes
app.get('/', (req, res) => {
  res.send('Welcome to the Employee Wellness Platform API');
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email, wellnessScore: 0 });
  user.save((err, newUser) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(newUser);
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send(err);
    res.send(users);
  });
});

// Update wellness score
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { wellnessScore } = req.body;
  User.findByIdAndUpdate(id, { wellnessScore }, { new: true }, (err, user) => {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

