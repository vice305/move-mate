const db = require('../config/db');

class Inventory {
  static async create({ userId, name, quantity, category }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO inventory (user_id, name, quantity, category) VALUES (?, ?, ?, ?)',
        [userId, name, quantity, category],
        function (err) {
          if (err) reject(err);
          resolve({ id: this.lastID, userId, name, quantity, category });
        }
      );
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM inventory WHERE user_id = ?', [userId], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = Inventory;