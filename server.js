// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config();

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Specify the views directory

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected!');
});

// Default route for the root URL
app.get('/', (req, res) => {
    res.render('index', { title: 'Hospital API', message: 'Welcome to the Hospital API. Use /patients or /providers to access data.' });
  });

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.render('patients', { patients: results }); // Render patients.ejs
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.render('providers', { providers: results }); // Render providers.ejs
  });
});

// Question 3: Filter patients by First Name
app.get('/patients/firstname', (req, res) => {
    const firstName = req.query.first_name; // Get first_name from query parameters
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
    db.query(query, [firstName], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No patients found with that first name' });
      }
      res.json(results);
    });
  });
  
  // Question 4: Retrieve all providers by specialty
  app.get('/providers/specialty', (req, res) => {
    const specialty = req.query.specialty; // Get specialty from query parameters
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  
    db.query(query, [specialty], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No providers found with that specialty' });
      }
      res.json(results);
    });
  });
  
// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
