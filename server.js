const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'u_6SClN4',
    password: 'eMHRxPrUmixp', 
    database: 'freedb_GzQcXbjd',
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to FreeDB');
});

// CONNECTION TESTER
db.query('SELECT 1', (err) => {
    if(err) console.log('DB Ping Error', err);
    else console.log('DB Ping Okay');
});



// CREATE
app.post('/api/students', (req, res) => {
    console.log("Sending data", req.body);
    const { student_id, full_name, course, year_level, email_address, contact_number } = req.body;
    const sql = 'INSERT INTO students (student_id, full_name, course, year_level, email_address, contact_number) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [student_id, full_name, course, year_level, email_address, contact_number], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Student added', id: result.insertId });
    });
});

// READ
app.get('/api/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// UPDATE 
app.put('/api/students/:id', (req, res) => {
    const { student_id, full_name, course, year_level, email_address, contact_number } = req.body;
    const sql = 'UPDATE students SET student_id = ?, full_name = ?, course = ?, year_level = ?, email_address = ?, contact_number = ? WHERE id = ?';
    db.query(sql, [student_id, full_name, course, year_level, email_address, contact_number, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Student updated' });
    });
});

// DELETE 
app.delete('/api/students/:id', (req, res) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Student deleted' });
    });
});


// SEARCH 
app.get('/api/students/search', (req, res) => {
    const { q } = req.query;
    const sql = 'SELECT * FROM students WHERE student_id = ? OR full_name LIKE ?';
    db.query(sql, [q, `%${q}%`], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
