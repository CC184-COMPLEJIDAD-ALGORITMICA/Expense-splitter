import { useState, useEffect } from 'react';
import { Form, useActionData, useSubmit, useLoaderData } from '@remix-run/react';
import { json, ActionFunction, LoaderFunction } from '@remix-run/node';
import { floydWarshallAlgorithm } from '../utils/floydWarshallAlgorithm';
import { exportToExcel } from '../utils/excelExport';
import { currencieslist } from '~/types/currencies';
import { getDollarValue } from '../utils/currencyUtils';

export const loader: LoaderFunction = async () => {
  const dollarValue = await getDollarValue();
  return json({ dollarValue });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const exchangeRates = JSON.parse(formData.get('exchangeRates') as string);
  const result = floydWarshallAlgorithm(exchangeRates);
  return json({ result });
};

export default function OptimizacionDivisas() {
  const actionData = useActionData<{ result: any } | undefined>();
  const loaderData = useLoaderData<{ dollarValue: number }>();
  const submit = useSubmit();
  const [currencies, setCurrencies] = useState(currencieslist);
  const [exchangeRates, setExchangeRates] = useState<Array<{ from: string; to: string; rate: number }>>([]);

  useEffect(() => {
    // Initialize exchange rates with USD as base
    const initialRates = currencies.map(currency => ({
      from: 'USD',
      to: currency.code,
      rate: currency.code === 'USD' ? 1 : 0
    }));
    setExchangeRates(initialRates);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit({ exchangeRates: JSON.stringify(exchangeRates) }, { method: 'post' });
  };

  const handleExchangeRateChange = (index: number, value: string) => {
    const newRates = [...exchangeRates];
    newRates[index].rate = parseFloat(value);
    setExchangeRates(newRates);
  };

  const handleExport = () => {
    if (actionData?.result) {
      exportToExcel(actionData.result, 'Optimizacion_Divisas');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Optimización de Rutas de Conversión de Divisas</h1>
      <p className="mb-4">Valor actual del dólar: {loaderData.dollarValue}</p>
      <Form method="post" onSubmit={handleSubmit}>
        {exchangeRates.map((rate, index) => (
          <div key={index} className="mb-2">
            <span className="mr-2">{rate.from} a {rate.to}:</span>
            <input
              type="number"
              step="0.0001"
              value={rate.rate}
              onChange={(e) => handleExchangeRateChange(index, e.target.value)}
              className="p-1 border rounded"
            />
          </div>
        ))}
        <button type="submit" className="mt-4 p-2 bg-green-500 text-white rounded">
          Calcular Rutas Óptimas
        </button>
      </Form>
      {actionData?.result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Resultados</h2>
          <pre>{JSON.stringify(actionData.result, null, 2)}</pre>
          <button onClick={handleExport} className="mt-2 p-2 bg-yellow-500 text-white rounded">
            Exportar a Excel
          </button>
        </div>
      )}
    </div>
  );
}