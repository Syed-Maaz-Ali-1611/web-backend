const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());

const port = 3000;

const mongoURI = 'mongodb+srv://Weppso:Weppso123+@weppso.avz7iqd.mongodb.net/?retryWrites=true&w=majority&appName=Weppso';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model('Contact', ContactSchema);

app.use(bodyParser.json());

// Configure NodeMailer for Outlook
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'weppso@outlook.com',
    pass: 'Software123+'
  }
});

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, companyName, message } = req.body;

  try {
    const newContact = new Contact({
      firstName,
      lastName,
      phoneNumber,
      email,
      companyName,
      message,
    });

    await newContact.save();

    // Send email to the user
    const mailOptions = {
      from: 'weppso@outlook.com',
      to: email,
      subject: 'Thank you for contacting us',
      text: `Hello ${firstName},
THANK YOU FOR REACHING US. WE'LL CONTACT YOU SOON.
Click here to explore more:
https://web-eta-ruby.vercel.app/`,
      html: `Hello ${firstName},<br>
THANK YOU FOR REACHING US. WE'LL CONTACT YOU SOON.<br>
Click here to explore more:<br>
<a href="https://web-eta-ruby.vercel.app/">https://web-eta-ruby.vercel.app/</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error submitting contact and sending email' });
      }
      console.log('Email sent:', info.response);
      res.json({ message: 'Contact submitted successfully and email sent!' });
    });
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
