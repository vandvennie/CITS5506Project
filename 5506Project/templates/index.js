const sqlite3 = require('sqlite3').verbose();

// 打开或创建 SQLite 数据库
let db = new sqlite3.Database('./5506.db', (err) => {
  if (err) {
    console.error('打开数据库失败: ' + err.message);
  } else {
    console.log('连接到 SQLite 数据库成功');
  }
});

// 插入数据
const sql = `INSERT INTO basic_table (id, image, sound, pressure, warning, temperature, timestamp) VALUES (?,?,?,?,?,?,?)`;
const values = [2,1,1,1,1,1,1];

db.run(sql, values, function(err) {
  if (err) {
    return console.error('插入数据失败: ' + err.message);
  }
  console.log(`插入数据成功，插入的行 ID: ${this.lastID}`);

  db.all(`SELECT * FROM basic_table`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });

  db.get(`SELECT * FROM basic_table WHERE id = ?`, [1], (err, row) => {
    if (err) {
      return console.error('查询数据失败: ' + err.message);
    }
    console.log(row);
  });
  
});

// 关闭数据库
db.close((err) => {
  if (err) {
    console.error('关闭数据库失败: ' + err.message);
  } else {
    console.log('关闭 SQLite 数据库成功');
  }
});
