import { useState } from 'react';
import { Form, useActionData, useNavigation, useSubmit } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import { findBestConversionPath } from '../types/currencyExchange';
import { ExchangeHouse, ConversionResult } from '../types/exchangeTypes';
import { exportToExcel } from '../utils/excelExport';
import { currencieslist } from '../types/currencies';

export default function OptimizacionDivisas() {
  const [amount, setAmount] = useState<number>(1000);
  const [currency, setCurrency] = useState<string>('USD');
  const [exchangeHouses, setExchangeHouses] = useState<ExchangeHouse[]>([]);
  const [maxSteps, setMaxSteps] = useState<number>(5);
  const [allowRepetitions, setAllowRepetitions] = useState<boolean>(false);

  const actionData = useActionData<{ result: ConversionResult }>();
  const navigation = useNavigation();
  const submit = useSubmit();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('amount', amount.toString());
    formData.append('currency', currency);
    formData.append('exchangeHouses', JSON.stringify(exchangeHouses));
    formData.append('maxSteps', maxSteps.toString());
    formData.append('allowRepetitions', allowRepetitions.toString());
    submit(formData, { method: 'post' });
  };

  const addExchangeHouse = () => {
    setExchangeHouses([...exchangeHouses, { name: '', exchanges: [] }]);
  };

  const updateExchangeHouse = (index: number, house: ExchangeHouse) => {
    const newHouses = [...exchangeHouses];
    newHouses[index] = house;
    setExchangeHouses(newHouses);
  };

  const handleExportToExcel = () => {
    if (actionData?.result) {
      const data = [
        { Step: 'Initial', Amount: actionData.result.initialAmount, Currency: currency },
        ...actionData.result.path.map((step, index) => ({
          Step: index + 1,
          Amount: step.toAmount,
          Currency: step.to,
          ExchangeHouse: step.exchangeHouse,
          Rate: step.rate,
          Operation: step.isBuy ? 'Compra' : 'Venta'
        })),
        { Step: 'Final', Amount: actionData.result.finalAmount, Currency: actionData.result.finalCurrency }
      ];
      exportToExcel(data, 'OptimalConversionPath');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Optimización de Conversión de Divisas</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Tutorial</h2>
        <p className="mb-4">Esta herramienta te ayuda a encontrar la ruta óptima para convertir divisas a través de diferentes casas de cambio, maximizando tus ganancias.</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Ingresa la cantidad inicial y la moneda con la que deseas comenzar.</li>
          <li>Establece el número máximo de pasos (conversiones) permitidos.</li>
          <li>Agrega las casas de cambio y sus tasas de conversión.</li>
          <li>Decide si quieres permitir repeticiones de monedas en la ruta.</li>
          <li>Haz clic en "Calcular ruta óptima" para obtener el mejor resultado.</li>
        </ol>
      </div>

      <Form onSubmit={handleSubmit} className="mb-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Cantidad inicial:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-2 text-sm text-gray-500">Ingrese la cantidad de dinero con la que desea iniciar la operación.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">Moneda inicial:</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {currencieslist.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">Seleccione la moneda inicial para la conversión.</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <label htmlFor="maxSteps" className="block text-sm font-medium text-gray-700 mb-2">Máximo de pasos:</label>
          <input
            type="number"
            id="maxSteps"
            value={maxSteps}
            onChange={(e) => setMaxSteps(Number(e.target.value))}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-sm text-gray-500">Número máximo de conversiones permitidas en la ruta.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Casas de Cambio</h2>
          {exchangeHouses.map((house, index) => (
            <ExchangeHouseInput
              key={index}
              house={house}
              onChange={(updatedHouse) => updateExchangeHouse(index, updatedHouse)}
            />
          ))}
          <button type="button" onClick={addExchangeHouse} className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300">
            Agregar Casa de Cambio
          </button>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowRepetitions"
            checked={allowRepetitions}
            onChange={(e) => setAllowRepetitions(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="allowRepetitions" className="ml-2 block text-sm text-gray-900">
            Permitir repeticiones de monedas en la ruta
          </label>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300">
          Calcular ruta óptima
        </button>
      </Form>

      {actionData?.result && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Resultado Óptimo</h2>
          <p className="text-lg">
            Ganancia: <span className={`font-bold ${actionData.result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {actionData.result.profit.toFixed(2)} {actionData.result.finalCurrency}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            ({actionData.result.profitPercentage.toFixed(2)}% comparado con {actionData.result.initialAmount.toFixed(2)} {actionData.result.initialCurrency})
          </p>
          <p className="text-lg">Cantidad inicial: {actionData.result.initialAmount.toFixed(2)} {actionData.result.initialCurrency}</p>
          <p className="text-lg">Cantidad final: {actionData.result.finalAmount.toFixed(2)} {actionData.result.finalCurrency}</p>
          <h3 className="text-xl font-bold mt-6 mb-2 text-blue-600">Pasos:</h3>
          {actionData.result.path.length > 0 ? (
            <ol className="list-decimal list-inside space-y-2">
              {actionData.result.path.map((step, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  <span className="font-bold">{step.exchangeHouse}:</span> {step.fromAmount.toFixed(2)} {step.from} → {step.toAmount.toFixed(2)} {step.to}
                  <span className="text-sm text-gray-600 ml-2">({step.isBuy ? 'Compra' : 'Venta'}, Tasa: {step.rate.toFixed(4)})</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-red-500">No se encontró una ruta de conversión válida.</p>
          )}
          <h3 className="text-xl font-bold mt-6 mb-2 text-blue-600">Otras rutas posibles:</h3>
          <ul className="list-disc list-inside space-y-1">
            {actionData.result.allPaths.slice(0, 5).map((path, index) => (
              <li key={index}>
                {path.profit !== null && path.profitPercentage !== null ? (
                  <>Ganancia: ${path.profit.toFixed(2)} USD ({path.profitPercentage.toFixed(2)}%)</>
                ) : (
                  <>No hay conversión disponible para {path.currency}</>
                )}
              </li>
            ))}
          </ul>
          <button onClick={handleExportToExcel} className="mt-6 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300">
            Exportar a Excel
          </button>

          <div className="mt-6 bg-blue-100 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-blue-600">Algoritmo Utilizado</h3>
            <p>Para encontrar la ruta óptima de conversión, se utilizó el siguiente enfoque:</p>
            <ul className="list-disc list-inside mt-2">
              <li><strong>Búsqueda en Profundidad (DFS) con Backtracking:</strong> Se explora el espacio de soluciones utilizando una búsqueda en profundidad, construyendo rutas de conversión paso a paso.</li>
              <li><strong>Poda (Pruning):</strong> Se descartan rutas parciales que exceden el número máximo de pasos o violan la restricción de repetición de monedas.</li>
              <li><strong>Optimización Greedy:</strong> En cada paso, se selecciona la mejor conversión disponible basada en las tasas de cambio actuales.</li>
            </ul>
            <p className="mt-2">El algoritmo construye un árbol de decisiones, donde cada nodo representa una conversión de moneda. Se exploran todas las rutas posibles hasta el límite de pasos especificado, manteniendo un registro de la mejor ruta encontrada. La poda ayuda a reducir el espacio de búsqueda, mientras que la heurística greedy guía la exploración hacia soluciones potencialmente óptimas.</p>
            <p className="mt-2">Complejidad: En el peor caso, la complejidad temporal es exponencial O(b^d), donde b es el factor de ramificación (número promedio de conversiones posibles en cada paso) y d es la profundidad máxima (número máximo de pasos). Sin embargo, las técnicas de poda y la heurística greedy ayudan a reducir significativamente el tiempo de ejecución en la práctica.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExchangeHouseInput({ house, onChange }: { house: ExchangeHouse, onChange: (house: ExchangeHouse) => void }) {
  const addExchange = () => {
    onChange({ ...house, exchanges: [...house.exchanges, { fromCurrency: '', toCurrency: '', buyRate: 0, sellRate: 0 }] });
  };

  const updateExchange = (index: number, exchange: { fromCurrency: string; toCurrency: string; buyRate: number; sellRate: number }) => {
    const newExchanges = [...house.exchanges];
    newExchanges[index] = exchange;
    onChange({ ...house, exchanges: newExchanges });
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <input
        type="text"
        value={house.name}
        onChange={(e) => onChange({ ...house, name: e.target.value })}
        placeholder="Nombre de la casa de cambio"
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2"
      />
      {house.exchanges.map((exchange, index) => (
        <div key={index} className="flex flex-wrap -mx-2 mb-2">
          <div className="px-2 w-1/4">
            <input
              type="text"
              value={exchange.fromCurrency}
              onChange={(e) => updateExchange(index, { ...exchange, fromCurrency: e.target.value })}
              placeholder="De"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="px-2 w-1/4">
            <input
              type="text"
              value={exchange.toCurrency}
              onChange={(e) => updateExchange(index, { ...exchange, toCurrency: e.target.value })}
              placeholder="A"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="px-2 w-1/4">
            <input
              type="number"
              value={exchange.buyRate || ''}
              onChange={(e) => updateExchange(index, { ...exchange, buyRate: Number(e.target.value) })}
              placeholder="Tasa de compra"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="px-2 w-1/4">
            <input
              type="number"
              value={exchange.sellRate || ''}
              onChange={(e) => updateExchange(index, { ...exchange, sellRate: Number(e.target.value) })}
              placeholder="Tasa de venta"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addExchange} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">
        Agregar Cambio
      </button>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const amount = Number(formData.get('amount'));
  const currency = formData.get('currency') as string;
  const exchangeHouses = JSON.parse(formData.get('exchangeHouses') as string) as ExchangeHouse[];
  const maxSteps = Number(formData.get('maxSteps'));
  const allowRepetitions = formData.get('allowRepetitions') === 'true';

  console.log('Input data:', JSON.stringify({ amount, currency, exchangeHouses, maxSteps, allowRepetitions }, null, 2));

  const result = findBestConversionPath(amount, currency, exchangeHouses, maxSteps, allowRepetitions);
  
  console.log('Result:', JSON.stringify(result, null, 2));

  return json({ result });
};