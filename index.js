const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors library

const mongoose = require('mongoose');

const app = express();
app.use(cors()); // Apply CORS middleware to all routes

const port = 3000; // Explicitly set the port to 3000

// Replace with your actual MongoDB connection string
const mongoURI = 'mongodb+srv://Weppso:Weppso123+@weppso.avz7iqd.mongodb.net/?retryWrites=true&w=majority&appName=Weppso';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the contact schema for MongoDB
const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model('Contact', ContactSchema);

// Body parser middleware to handle form data
app.use(bodyParser.json());

// API endpoint to receive contact form data (POST request)
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, companyName, message } = req.body;

  try {
    // Create a new contact document
    const newContact = new Contact({
      firstName,
      lastName,
      phoneNumber,
      email,
      companyName,
      message,
    });

    // Save the contact to MongoDB
    await newContact.save();

    res.json({ message: 'Contact submitted successfully!' });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ message: 'Error submitting contact' });
  }
});

// API endpoint to get all contact data (GET request)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// Simple route to show "Hello" when accessing the root URL
app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
