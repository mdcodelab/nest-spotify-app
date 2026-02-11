require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('Testing connection with:');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Testăm direct cu baza de date bookmarks_db
  });

  try {
    await client.connect();
    console.log('Conexiune reușită la ' + process.env.DB_NAME + '!');
    
    // Verificăm dacă utilizatorul are drepturi
    const userResult = await client.query('SELECT current_user, current_database();');
    console.log('Utilizator curent:', userResult.rows[0]);
    
    // Verificăm toate bazele de date
    const dbResult = await client.query('SELECT datname FROM pg_database ORDER BY datname;');
    console.log('Baze de date disponibile:');
    dbResult.rows.forEach(row => console.log(' -', row.datname));
    
    await client.end();
  } catch (err) {
    console.error('Eroare de conexiune:', err.message);
    console.error('Cod eroare:', err.code);
  }
}

testConnection();