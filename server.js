const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const port = 5000;
const MONGO_URI = 'mongodb+srv://krsaurv11033:cclKumar@1@cluster0.qy9pg2x.mongodb.net/?retryWrites=true&w=majority'

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB URL)
mongoose.connect(MONGO_URI);

// Create a Mongoose schema for user credentials
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Create a Mongoose model for user credentials
const User = mongoose.model('TestUser', userSchema);

// Create a Mongoose schema for contact form entries
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

// Create a Mongoose model for contact form entries
const Contact = mongoose.model('Contact', contactSchema);

// Middleware for parsing JSON and URL-encoded data
app.use(express.static('public'))
app.use(express.json());
app.use(require('morgan')('dev'))

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ username, password });
        
        if (user) {
            // Successful login
            return res.send('Login successful');
        } else {
            // Invalid credentials
            return res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Registration route
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            // Username is already taken
            return res.status(400).send('Username is already taken');
        }

        // Create a new user in the database
        await User.create({ username, password });

        // Successful registration
        return res.send('Registration successful');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Contact Us route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save the contact form entry to the database
        await Contact.create({ name, email, message });

        // Successful submission
        return res.send('Contact form submitted successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
