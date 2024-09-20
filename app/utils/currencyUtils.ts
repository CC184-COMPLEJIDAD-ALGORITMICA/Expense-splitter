export async function getDollarValue() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) throw new Error('API_URL is not defined');
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.conversion_rates.USD;
}