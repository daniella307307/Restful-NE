const pool = require("../config/DbPool");

class User {
  // ------ CRUD OPERATIONS -------
  //CREATE A NEW USER

  static async create({ name, email, password, role = "user" }) {
    const [result] = await pool.query(
      "INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)",
      [name, email, password, role]
    );
    return result.insertId; // returns new user's id
  }

  //Update roles(userID,newRole) ---ADMIN ONLY ----
  static async updateRole(userID, newRole) {
    await pool.query("UPDATE users SET role = ? WHERE id = ? ", [
      newRole,
      userID,
    ]);
  }
  //read a user by id
  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id= ?", [id]);
    return rows[0]; //returns user object or undefined
  }
  // --- Check User's Role ---
  static async getRole(userId) {
    const [rows] = await pool.query("SELECT role FROM users WHERE id = ?", [
      userId,
    ]);
    return rows[0]?.role;
  }
  // --- Role-Based Helper Methods ---
  static async isAdmin(userId) {
    const role = await this.getRole(userId);
    return role === "admin";
  }

  //READ a user by email( for login)
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email= ?", [
      email,
    ]);
    return rows[0];
  }
  //READ a user by email or name( for login)
  static async findbyEmailOrName(identifier) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email= ? OR name= ?",
      [identifier, identifier]
    );
    return rows[0];
  }
  //UPDATE a usee
  static async update(id, { name, email }) {
    await pool.query("UPDATE users SET name=? , email= ? WHERE id = ?", [
      name,
      email,
      id,
    ]);
  }
  //GETTINg ALL users
  /**
   *
   * @param {number} page - Current page(default:1)
   * @param {number} limit - Users per page (default:10)
   * @returns {Promise<{users:Array,pagination:Object>}
   */
  static async getAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [users] = await pool.query(
      "Select id, name,email, role,created_at from users LIMIT ? OFFSET ?",
      [limit, offset]
    );
    //Get total count for users
    const [totalRows] = await pool.query("SELECT COUNT(*) AS count FROM users");
    const total = totalRows[0].count;
    const totalPages = Math.ceil(total / limit);
    return {
      users,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }
  //DELETE USER
  static async delete(id) {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result; // you can check affectedRows here if you want
  }
  // -----Helper methods -----
  //check if email exists(for validation)
  static async emailExists(email) {
    const [rows] = await pool.query("SELECT 1 FROM users WHERE email=? ", [
      email,
    ]);
    return rows.length > 0;
  }
  // ------ update password ----
  static async updatePassword(password, userId) {
    await pool.query("UPDATE users SET password =? WHERE id= ?", [
      password,
      userId,
    ]);
  }
}

module.exports = User;
