import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(
  "mysql://amicompk_masuser:%246118114Faran%24@s23.hosterpk.com:3306/amicompk_masmarine"
);

try {
  await connection.execute("ALTER TABLE User ADD COLUMN allowedPages TEXT NOT NULL DEFAULT '[]'");
  console.log('Added allowedPages column');
} catch (e) {
  if (e.code === 'ER_DUP_FIELDNAME') {
    console.log('Column already exists, skipping');
  } else {
    throw e;
  }
}

// Admin users get all pages by default
const allPages = JSON.stringify(['dashboard','students','courses','certificates','reports','campaigns','risk-score','exam','proctoring','settings']);
await connection.execute("UPDATE User SET allowedPages = ? WHERE role = 'admin'", [allPages]);
console.log('Set admin users to have all pages');

const [rows] = await connection.execute("SELECT username, role, allowedPages FROM User");
console.log('Users:', rows);

await connection.end();
