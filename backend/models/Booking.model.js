const pool = require('../config/DbPool');

class Booking {
  static async book({ user_id, slot_id, start_time, end_time, status = "booked" }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO book(user_id,slot_id,start_time,end_time,status) VALUES (?,?,?,?,?)",
        [user_id, slot_id, start_time, end_time, status]
      );
      return result;
    } catch (error) {
      console.error("Booking error:", error);
      throw error;
    }
  }
}

module.exports = Booking;
