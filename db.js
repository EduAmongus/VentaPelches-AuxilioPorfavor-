import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export const db = pool;
export default pool;

pool.getConnection()
  .then(conn => {
    console.log('Conexión a base de datos establecida correctamente.');
    conn.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos (pool):', err);
  });
