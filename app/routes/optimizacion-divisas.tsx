import { useState, useEffect } from 'react';
import { Form, useActionData, useSubmit, useLoaderData } from '@remix-run/react';
import { json, ActionFunction, LoaderFunction } from '@remix-run/node';
import { floydWarshallAlgorithm, ConversionResult, Transaction } from '../utils/floydWarshallAlgorithm';
import { exportToExcel } from '../utils/excelExport';
import { currencieslist } from '~/types/currencies';
import { getExchangeRates } from '../utils/currencyUtils';

export const loader: LoaderFunction = async () => {
  try {
    const { rates, fromApi } = await getExchangeRates();
    return json({ exchangeRates: rates, fromApi, error: null });
  } catch (error) {
    console.error('Error loading exchange rates:', error);
    return json({ 
      exchangeRates: null, 
      fromApi: false,
      error: 'Failed to load exchange rates. Please try again.' 
    }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const transactions = JSON.parse(formData.get('transactions') as string);
    
    const { rates, fromApi } = await getExchangeRates();
    console.log('Exchange rates:', rates);
    
    const result = floydWarshallAlgorithm(transactions, rates);
    console.log('Floyd-Warshall result:', result);
    
    return json({ result, exchangeRates: rates, fromApi });
  } catch (error) {
    console.error('Error calculating optimal routes:', error);
    return json({ error: 'Failed to calculate optimal routes. Please try again.' }, { status: 500 });
  }
};

export default function OptimizacionDivisas() {
  const actionData = useActionData<{ result: ConversionResult[], exchangeRates: Record<string, number>, fromApi: boolean, error?: string }>();
  const loaderData = useLoaderData<{ exchangeRates: Record<string, number> | null, fromApi: boolean, error: string | null }>();
  const submit = useSubmit();
  const [currencies] = useState(currencieslist);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loaderData.error) {
      setError(loaderData.error);
    } else {
      setError(null);
    }
  }, [loaderData]);

  useEffect(() => {
    if (actionData?.error) {
      setError(actionData.error);
    } else if (actionData?.result) {
      setError(null);
    }
  }, [actionData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTransaction.from && currentTransaction.to && currentTransaction.amount && currentTransaction.name) {
      setTransactions(prev => [...prev, currentTransaction as Transaction]);
      setCurrentTransaction({});
    }
  };

  const handleCalculateOptimalRoutes = () => {
    if (transactions.length > 0) {
      submit({ transactions: JSON.stringify(transactions) }, { method: 'post' });
    } else {
      setError('Please add at least one transaction before calculating optimal routes.');
    }
  };

  const handleExport = () => {
    if (actionData?.result) {
      exportToExcel(actionData.result, 'Optimizacion_Divisas');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Optimización de Rutas de Conversión de Divisas</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {(loaderData.fromApi || actionData?.fromApi) && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">Tasas de cambio obtenidas exitosamente de la API.</span>
        </div>
      )}

      <form onSubmit={handleAddTransaction} className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <select
            name="from"
            value={currentTransaction.from || ''}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Desde</option>
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
            ))}
          </select>
          <select
            name="to"
            value={currentTransaction.to || ''}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Hasta</option>
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
            ))}
          </select>
        </div>
        <input
          type="number"
          name="amount"
          value={currentTransaction.amount || ''}
          onChange={handleInputChange}
          placeholder="Monto"
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="name"
          value={currentTransaction.name || ''}
          onChange={handleInputChange}
          placeholder="Nombre de la transacción"
          className="p-2 border rounded w-full"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
          Agregar Transacción
        </button>
      </form>

      {transactions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Transacciones Agregadas</h2>
          <ul>
            {transactions.map((t, index) => (
              <li key={index}>{t.name}: {t.amount} {t.from} a {t.to}</li>
            ))}
          </ul>
        </div>
      )}

      <button 
        onClick={handleCalculateOptimalRoutes}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition mb-8"
      >
        Calcular Rutas Óptimas
      </button>

      {actionData?.result && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Resultados</h2>
          <ul>
            {actionData.result.map((r, index) => (
              <li key={index}>{r.from} a {r.to}: Tasa = {r.rate.toFixed(4)}, Ruta: {r.path.join(' -> ')}</li>
            ))}
          </ul>
          <button
            onClick={handleExport}
            className="mt-4 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
          >
            Exportar a Excel
          </button>
        </div>
      )}
    </div>
  );
}