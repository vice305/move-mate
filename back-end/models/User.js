const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findOne({ username, email }) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ? AND email = ?', [username, email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async create({ username, email, password }) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function (err) {
          if (err) reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = User;