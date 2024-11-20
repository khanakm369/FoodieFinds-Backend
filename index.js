const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to database');
  }
});

// Middleware to parse JSON
app.use(express.json());

// Get all restaurants
app.get('/restaurants', (req, res) => {
  db.all('SELECT * FROM restaurants', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ restaurants: rows });
  });
});

// Get restaurant details by ID
app.get('/restaurants/details/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM restaurants WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ restaurant: row });
  });
});

// Get restaurants by cuisine
app.get('/restaurants/cuisine/:cuisine', (req, res) => {
  const { cuisine } = req.params;
  db.all('SELECT * FROM restaurants WHERE cuisine = ?', [cuisine], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ restaurants: rows });
  });
});

// Filter restaurants by criteria
app.get('/restaurants/filter', (req, res) => {
  const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
  const filters = [];
  const values = [];

  if (isVeg) {
    filters.push('isVeg = ?');
    values.push(isVeg);
  }
  if (hasOutdoorSeating) {
    filters.push('hasOutdoorSeating = ?');
    values.push(hasOutdoorSeating);
  }
  if (isLuxury) {
    filters.push('isLuxury = ?');
    values.push(isLuxury);
  }

  const query = `SELECT * FROM restaurants${filters.length ? ' WHERE ' + filters.join(' AND ') : ''}`;
  db.all(query, values, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ restaurants: rows });
  });
});

// Sort restaurants by rating
app.get('/restaurants/sort-by-rating', (req, res) => {
  db.all('SELECT * FROM restaurants ORDER BY rating DESC', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ restaurants: rows });
  });
});

// Get all dishes
app.get('/dishes', (req, res) => {
  db.all('SELECT * FROM dishes', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ dishes: rows });
  });
});

// Get dish details by ID
app.get('/dishes/details/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM dishes WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ dish: row });
  });
});

// Filter dishes by criteria
app.get('/dishes/filter', (req, res) => {
  const { isVeg } = req.query;
  db.all('SELECT * FROM dishes WHERE isVeg = ?', [isVeg], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ dishes: rows });
  });
});

// Sort dishes by price
app.get('/dishes/sort-by-price', (req, res) => {
  db.all('SELECT * FROM dishes ORDER BY price ASC', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ dishes: rows });
  });
});

app.listen(port, () => {
  console.log(`FoodieFinds backend listening at http://localhost:${port}`);
});
