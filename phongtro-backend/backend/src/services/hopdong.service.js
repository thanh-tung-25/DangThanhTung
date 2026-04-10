

const db = require("../config/db");
const { taoThongBao } = require("./thongbao.service");
// TAO HOP DONG (THUE PHONG)
const taoHopDong = async (data, user) => {
    const { room_id, start_date, end_date, tenant_id } = data;

    // check phong con trong
    const [room] = await db.query(
        "SELECT * FROM rooms WHERE id = ? AND status = 'AVAILABLE'",
        { replacements: [room_id] }
    );

    if (room.length === 0) {
        throw new Error("ROOM_NOT_AVAILABLE");
    }

    const owner_id = room[0].owner_id;

    let finalTenantId = user.id;
    if (user.role === "CHU_TRO") {
        finalTenantId = tenant_id; // Landlord is initiating
    }

    // tao hop dong
    await db.query(
        `INSERT INTO contracts 
        (room_id, owner_id, tenant_id, start_date, end_date) 
        VALUES (?, ?, ?, ?, ?)`,
        {
            replacements: [
                room_id,
                owner_id,
                finalTenantId,
                start_date,
                end_date
            ]
        }
    );
    await taoThongBao(
        owner_id,
        "Co yeu cau thue phong moi",
        "CONTRACT"
    );
};
// XAC NHAN HOP DONG
const xacNhanHopDong = async (id, user) => {
    const [rows] = await db.query(
        "SELECT * FROM contracts WHERE id = ?",
        { replacements: [id] }
    );

    if (rows.length === 0) throw new Error("NOT_FOUND");

    const hopdong = rows[0];

    // nguoi thue xac nhan
    if (user.id === hopdong.tenant_id) {
        await db.query(
            "UPDATE contracts SET tenant_confirmed = true WHERE id = ?",
            { replacements: [id] }
        );
    }

    // chu tro xac nhan
    if (user.id === hopdong.owner_id) {
        await db.query(
            "UPDATE contracts SET owner_confirmed = true WHERE id = ?",
            { replacements: [id] }
        );
    }

    // check neu ca 2 da confirm
    const [updated] = await db.query(
        "SELECT * FROM contracts WHERE id = ?",
        { replacements: [id] }
    );

    const hd = updated[0];

    if (hd.owner_confirmed && hd.tenant_confirmed) {
        // ACTIVE
        await db.query(
            "UPDATE contracts SET status = 'ACTIVE' WHERE id = ?",
            { replacements: [id] }
        );

        // update room
        await db.query(
            "UPDATE rooms SET status = 'OCCUPIED' WHERE id = ?",
            { replacements: [hd.room_id] }
        );
    }
    await taoThongBao(hd.owner_id, "Hop dong da duoc xac nhan", "CONTRACT");
    await taoThongBao(hd.tenant_id, "Hop dong da duoc xac nhan", "CONTRACT");
    };

// DANH SACH HOP DONG
const layDanhSachHopDong = async (user) => {
    let queryStr = "";
    let rep = [user.id];

    if (user.role === "CHU_TRO") {
        queryStr = `
            SELECT c.*, r.title as ten_phong, r.price, 
                   u.username as tenant_name, u.phone as tenant_phone
            FROM contracts c
            LEFT JOIN rooms r ON c.room_id = r.id
            LEFT JOIN users u ON c.tenant_id = u.id
            WHERE c.owner_id = ?
            ORDER BY c.created_at DESC
        `;
    } else {
        queryStr = `
            SELECT c.*, r.title as ten_phong, r.price, 
                   u.username as tenant_name, u.phone as tenant_phone
            FROM contracts c
            LEFT JOIN rooms r ON c.room_id = r.id
            LEFT JOIN users u ON c.owner_id = u.id
            WHERE c.tenant_id = ?
            ORDER BY c.created_at DESC
        `;
    }

    const [rows] = await db.query(queryStr, { replacements: rep });
    return rows;
};


// CHI TIET HOP DONG
const layChiTietHopDong = async (id, user) => {
    // Can view if they are tenant or owner
    const [rows] = await db.query(`
        SELECT c.*, r.title as ten_phong, r.price as gia_thue, 
               u.username as chu_tro_name, u2.username as nguoi_thue_name
        FROM contracts c
        JOIN rooms r ON c.room_id = r.id
        JOIN users u ON c.owner_id = u.id
        JOIN users u2 ON c.tenant_id = u2.id
        WHERE c.id = ? AND (c.owner_id = ? OR c.tenant_id = ?)
    `, { replacements: [id, user.id, user.id] });

    if (rows.length === 0) throw new Error("NOT_FOUND");
    return rows[0];
};

module.exports = {
    taoHopDong,
    xacNhanHopDong,
    layDanhSachHopDong,
    layChiTietHopDong
};


