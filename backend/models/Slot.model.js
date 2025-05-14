const pool = require('../config/DbPool');

class Slot{
    /**
     * create a new slot
     */
    static async createSlot({userId,plateNumber,slotStatus="unavailable"}){
        const [result] = await pool.query("INSERT INTO slot (plateNumber,userId,slotStatus) VALUES(?,?,?)",[plateNumber,userId,slotStatus]);
        return result.insertId;
    }
    /**
     * delete a slot
     */
    static async deleteSlot(slotId){
      await pool.query("DELETE * FROM slot WHERE id=?",[slotId]);
    }
    /**
     * get all slots
     */
    //GETTINg ALL users
  /**
   * 
   * @param {number} page - Current page(default:1) 
   * @param {number} limit - slots per page (default:10)
   * @returns {Promise<{users:Array,pagination:Object>}
   */ 
  static async getAllPaginated(page=1, limit= 10){
    const offset = (page -1)*limit;

    const [slots] = await pool.query(
        "Select * from slot LIMIT ? OFFSET ?",
        [limit,offset]
    );
    //Get total count for users
    const [totalRows] = await pool.query("SELECT COUNT(*) AS count FROM slot");
    const total = totalRows[0].count;
    const totalPages = Math.ceil(total/limit);
    return{
        slots,
        pagination:{
            total,totalPages,currentPage:page, limit,
        },
    };
  }
  static async updateSlot(slotId,status){
    await pool.query('Update slot set slotStatus=?',[status])
  }
  static async findById(slotId){
    await pool.query("Select * from users where id= ?",[slotId]);
  }
}

module.exports=Slot;