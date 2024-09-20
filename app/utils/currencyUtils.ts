import fs from 'fs';
import path from 'path';

const RATES_FILE = path.join(process.cwd(), 'app', 'data', 'exchange_rates.json');
const ONE_DAY = 24 * 60 * 60 * 1000; // milliseconds in a day

export async function getExchangeRates(): Promise<{ rates: Record<string, number>, fromApi: boolean }> {
    try {
        const apiUrl = process.env.API_URL;
        if (!apiUrl) {
            throw new Error('API_URL is not defined in environment variables');
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.conversion_rates) {
            console.error('Unexpected API response:', data);
            throw new Error('Unexpected API response format');
        }
        console.log('Exchange rates fetched from API');
        return { rates: data.conversion_rates, fromApi: true };
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Proporcionar tasas de cambio de respaldo en caso de error
        return {
            rates: {
                USD: 1,
                EUR: 0.85,
                GBP: 0.75,
                JPY: 110,
                // Añade más tasas de cambio de respaldo según sea necesario
            },
            fromApi: false
        };
    }
}

function shouldFetchNewRates(): boolean {
    if (!fs.existsSync(RATES_FILE)) {
        return true;
    }
    const stats = fs.statSync(RATES_FILE);
    const now = new Date();
    const fileAge = now.getTime() - stats.mtime.getTime();
    return fileAge > ONE_DAY;
}

async function saveRatesToFile(rates: Record<string, number>): Promise<void> {
    await fs.promises.writeFile(RATES_FILE, JSON.stringify(rates, null, 2));
}

async function readRatesFromFile(): Promise<Record<string, number>> {
    const data = await fs.promises.readFile(RATES_FILE, 'utf-8');
    return JSON.parse(data);
}