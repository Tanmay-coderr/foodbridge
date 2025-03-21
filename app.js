const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#Tanmay@4597',
    database: 'foodbridge'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Home Route - Serve HTML File
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Donate Now - Save Donation to Database
app.post('/donate', (req, res) => {
    const { donor_name, donor_phone, location, food_details } = req.body;

    const sql = `
        INSERT INTO donations (donor_name, donor_phone, location, food_details)
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [donor_name, donor_phone, location, food_details], (err, result) => {
        if (err) throw err;
        res.send('Donation added successfully!');
    });
});

// Nearby Donations - Retrieve Donations
app.get('/nearby', (req, res) => {
    const { location } = req.query;
    const sql = 'SELECT * FROM donations WHERE location LIKE ?';
    db.query(sql, [`%${location}%`], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
