const sqlite3 = require('sqlite3').verbose(); // Import SQLite library

// Open or create an SQLite database
let db = new sqlite3.Database('./5506.db', (err) => {
  if (err) {
    console.error('Failed to open database: ' + err.message);
  } else {
    console.log('Connected to the SQLite database successfully');
  }
});

// SQL statement to insert data
const sql = `INSERT INTO basic_table (id, image, sound, pressure, warning, temperature, timestamp) VALUES (?,?,?,?,?,?,?)`;

// Values to be inserted
const values = [];

// Execute the insert operation
db.run(sql, values, function (err) {
  if (err) {
    return console.error('Failed to insert data: ' + err.message);
  }
  console.log(`Data inserted successfully, inserted row ID: ${this.lastID}`);

  // Query all data from the table
  db.all(`SELECT * FROM basic_table`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row); // Print each row
    });
  });

  // Query a specific row by ID
  db.get(`SELECT * FROM basic_table WHERE id = ?`, [1], (err, row) => {
    if (err) {
      return console.error('Failed to query data: ' + err.message);
    }
    console.log(row); // Print the row with ID 1
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Failed to close database: ' + err.message);
  } else {
    console.log('SQLite database closed successfully');
  }
});
