import { BACKUP_EXCHANGE_RATES } from '../utils/backupExchangeRates';

export function getExchangeRates(): { rates: Record<string, number>, fromApi: boolean } {
    console.log('Getting exchange rates');
    const backupRates = filterValidRates(BACKUP_EXCHANGE_RATES.conversion_rates);
    console.log('Filtered rates:', backupRates);
    return { rates: backupRates, fromApi: false };
}

export function filterValidRates(rates: Record<string, number>): Record<string, number> {
    console.log('Filtering rates:', rates);
    return Object.entries(rates).reduce((acc, [currency, rate]) => {
        if (isFinite(rate) && rate > 0 && !isNaN(rate)) {
            acc[currency] = rate;
        } else {
            console.warn(`Filtered out invalid rate for ${currency}: ${rate}`);
        }
        return acc;
    }, {} as Record<string, number>);
}

export function convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>): number {
    console.log(`Converting ${amount} from ${from} to ${to}`);
    if (from === to) return amount;
    
    const fromRate = rates[from];
    const toRate = rates[to];
    
    if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) {
        console.warn(`Invalid currency code or rate: ${from} (${fromRate}) or ${to} (${toRate})`);
        return 0;
    }
    
    const result = (amount / fromRate) * toRate;
    console.log(`Conversion result: ${result}`);
    return result;
}