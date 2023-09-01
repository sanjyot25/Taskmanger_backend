const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('dotenv').config();
// const config = require('./config');
const authRoutes = require('./routes/auth');
const Task = require('./models/Task');

const URL = process.env.BASE_URL;
console.log(URL)

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'https://taskmanagerbeta.netlify.app',
};

app.use(cors(corsOptions));

app.post(`${URL}/api/tasks`, async (req, res) => {
    try {
      const { title, description } = req.body;
      const newTask = new Task({ title, description });
      await newTask.save();
      res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // Get all tasks
app.get(`${URL}/api/tasks`, async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use(`${URL}/api/auth`, authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
