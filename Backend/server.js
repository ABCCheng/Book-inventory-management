const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const port = 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create MySQL connector
const db = mysql.createConnection({
    host: 'www.onikumo.com',
    port: '3306',
    user: 'job',
    password: 'ETcxCpicYdcpPTKj',
    database: 'job'
});

// connect mysql
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to the database');
  }
});

// search book
app.get('/bookinventory/api/books', (req, res) => {
  let query = 'SELECT * FROM inventory';
  const filters = req.query;

  // add WHERE filter
  const filterConditions = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      filterConditions.push(`${key} LIKE '%${value}%'`);
    }
  }

  if (filterConditions.length > 0) {
    query += ' WHERE ' + filterConditions.join(' AND ');
  }

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch books', detail: err.message  });
    }
    res.json(results);
  });
});

// add book
app.post('/bookinventory/api/books', (req, res) => {
  const { title, author, genre, publication_date, isbn } = req.body;

  const query = 'INSERT INTO inventory (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)';
  const values = [title, author, genre, publication_date, isbn];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add book', detail: err.message });
    }
    res.status(201).json({ message: 'Book added successfully', data: { title, author, genre, publication_date, isbn } });
  });
});

// export CSV or JSON 
app.get('/bookinventory/api/export-books', (req, res) => {
  const format = req.query.format || 'json'; // default JSON 
  let query = 'SELECT * FROM books';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch books', detail: err.message });
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=books_inventory.json');
      res.send(JSON.stringify(results, null, 2));
    } else if (format === 'csv') {
      const csvData = results.map((book) => [
        book.title, book.author, book.genre, book.publication_date, book.isbn
      ]);
      csvData.unshift(['Title', 'Author', 'Genre', 'Publication Date', 'ISBN']); // 

      const csvContent = csvData.map((row) => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=books_inventory.csv');
      res.send(csvContent);
    } else if (format === 'xlsx') {
      const ws = xlsx.utils.aoa_to_sheet(results.map((book) => [
        book.title, book.author, book.genre, book.publication_date, book.isbn
      ]));
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Books');
      const filePath = path.join(__dirname, 'books_inventory.xlsx');
      xlsx.writeFile(wb, filePath);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=books_inventory.xlsx');
      res.sendFile(filePath, (err) => {
        if (err) {
          console.log('Error sending file:', err);
        }
      });
    }
  });
});

// use Express provide frontend static files
app.use('/bookinventory', express.static(path.join(__dirname, './dist')));

app.get('/bookinventory/*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

// start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/bookinventory`);
});
