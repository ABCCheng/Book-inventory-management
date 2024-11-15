const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const pool = require('./db'); // 引入数据库模块

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 查询书籍
app.get('/bookinventory/api/books', async (req, res) => {
  const filters = req.query;
  let query = 'SELECT * FROM inventory';
  const params = [];

  // 动态添加筛选条件
  const filterConditions = Object.entries(filters).map(([key, value]) => {
    params.push(`%${value}%`);
    return `${key} LIKE ?`;
  });

  if (filterConditions.length > 0) {
    query += ' WHERE ' + filterConditions.join(' AND ');
  }

  try {
    const [results] = await pool.query(query, params);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books', detail: err.message });
  }
});

// 添加书籍
app.post('/bookinventory/api/books', async (req, res) => {
  const { title, author, genre, publication_date, isbn } = req.body;
  const query = 'INSERT INTO inventory (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)';
  const values = [title, author, genre, publication_date, isbn];

  try {
    const [result] = await pool.query(query, values);
    res.status(201).json({
      message: 'Book added successfully',
      data: { id: result.insertId, title, author, genre, publication_date, isbn },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book', detail: err.message });
  }
});

// 导出书籍
app.get('/bookinventory/api/export-books', async (req, res) => {
  const format = req.query.format || 'json';
  const query = 'SELECT * FROM inventory';

  try {
    const [results] = await pool.query(query);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=books_inventory.json');
      res.send(JSON.stringify(results, null, 2));
    } else if (format === 'csv') {
      const csvData = results.map((book) => [
        book.title, book.author, book.genre, book.publication_date, book.isbn,
      ]);
      csvData.unshift(['Title', 'Author', 'Genre', 'Publication Date', 'ISBN']);
      const csvContent = csvData.map((row) => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=books_inventory.csv');
      res.send(csvContent);
    } else if (format === 'xlsx') {
      const ws = xlsx.utils.aoa_to_sheet(results.map((book) => [
        book.title, book.author, book.genre, book.publication_date, book.isbn,
      ]));
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Books');
      const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=books_inventory.xlsx');
      res.send(buffer);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to export books', detail: err.message });
  }
});

// 静态资源
app.use('/bookinventory', express.static(path.join(__dirname, './dist')));

app.get('/bookinventory/*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/bookinventory`);
});
