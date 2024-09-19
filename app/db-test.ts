import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import { db } from './db.server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, '../.env');
console.log('Trying to load .env from:', envPath);

if (fs.existsSync(envPath)) {
    console.log('.env file exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('.env file content:', envContent);
    
    config({ path: envPath });
} else {
    console.log('.env file does not exist');
}

console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL);

// Usar una ruta absoluta para la base de datos
const dbPath = resolve(__dirname, '../prisma/dev.db');
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = `file:${dbPath}`;
}
console.log('DATABASE_URL set to:', process.env.DATABASE_URL);

async function testDbConnection() {
    try {
        // Verificar si el archivo de la base de datos existe
        if (!fs.existsSync(dbPath)) {
            console.error('Database file does not exist at:', dbPath);
            return;
        }

        await db.$connect();
        console.log('Database connection successful');
        const userCount = await db.user.count();
        console.log(`Number of users in the database: ${userCount}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        await db.$disconnect();
    }
}

testDbConnection();
