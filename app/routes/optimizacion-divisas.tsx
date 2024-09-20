import { useState, useEffect } from 'react';
import { Form, useActionData, useSubmit, useLoaderData } from '@remix-run/react';
import { json, ActionFunction, LoaderFunction } from '@remix-run/node';
import { floydWarshallAlgorithm, ConversionResult } from '../utils/floydWarshallAlgorithm';
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
  const [showTutorial, setShowTutorial] = useState(false);

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
      
      <button
        onClick={() => setShowTutorial(!showTutorial)}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        {showTutorial ? 'Ocultar Tutorial' : 'Mostrar Tutorial'}
      </button>

      {showTutorial && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">Tutorial y Ejemplos</h2>
          <p>El algoritmo de Floyd-Warshall se utiliza para encontrar las rutas más eficientes de conversión entre divisas. Esto es útil en varios escenarios reales:</p>
          <ul className="list-disc list-inside mb-2">
            <li>Comercio internacional: Optimizar costos de conversión en transacciones multinacionales.</li>
            <li>Arbitraje de divisas: Identificar oportunidades de beneficio en el mercado FOREX.</li>
            <li>Gestión de tesorería: Minimizar pérdidas en conversiones para empresas multinacionales.</li>
          </ul>
          <p>El algoritmo funciona construyendo una matriz de todas las posibles conversiones y encontrando el camino más corto (o en este caso, la conversión más favorable) entre cada par de divisas.</p>
          <p>Es ideal porque:</p>
          <ul className="list-disc list-inside">
            <li>Considera todas las posibles rutas de conversión indirectas.</li>
            <li>Tiene una complejidad de O(n³), eficiente para un número moderado de divisas.</li>
            <li>Proporciona resultados para todas las parejas de divisas en una sola ejecución.</li>
          </ul>
        </div>
      )}

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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Desde</th>
                  <th className="px-4 py-2">Hasta</th>
                  <th className="px-4 py-2">Tasa</th>
                  <th className="px-4 py-2">Ruta</th>
                </tr>
              </thead>
              <tbody>
                {actionData.result.map((item: ConversionResult, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border px-4 py-2">{item.from}</td>
                    <td className="border px-4 py-2">{item.to}</td>
                    <td className="border px-4 py-2">{item.rate.toFixed(4)}</td>
                    <td className="border px-4 py-2">{item.path.join(' → ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleExport} className="mt-4 p-2 bg-yellow-500 text-white rounded">
            Exportar a Excel
          </button>
        </div>
      )}
    </div>
  );
}