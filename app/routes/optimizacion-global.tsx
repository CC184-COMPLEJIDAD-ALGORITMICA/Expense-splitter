import { useState, useEffect } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import { executeKruskalMST } from '~/server/kruskalMST.server';
import { BACKUP_EXCHANGE_RATES } from '~/utils/backupExchangeRates';

export const loader = async () => {
  return json({ exchangeRates: BACKUP_EXCHANGE_RATES.conversion_rates });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const nodes = JSON.parse(formData.get('nodes') as string);
  const exchangeHouses = JSON.parse(formData.get('exchangeHouses') as string);
  const balanceOption = JSON.parse(formData.get('balanceOption') as string);

  try {
    const result = await executeKruskalMST(nodes, exchangeHouses, balanceOption);
    return json(result);
  } catch (error) {
    console.error('Error optimizing transactions:', error);
    return json({ error: 'Error optimizing transactions' }, { status: 500 });
  }
};

type ExchangeRates = typeof BACKUP_EXCHANGE_RATES.conversion_rates;

interface Node {
  id: string;
  name: string;
  balance: number;
  currency: string;
  preferredExchangeHouse?: string;
  final_balance?: number;
}

interface ExchangeHouse {
  name: string;
  rates: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }[];
}

interface Edge {
  from: string;
  to: string;
  weight: number;
  cost?: number;
}

interface OptimizationResult {
  mst: Edge[];
  totalWeight: number;
  totalCost: number;
  updatedNodes: Node[];
  logs: string[];
  error?: string;
}

interface TransferRequirement {
  from: string;
  to: string;
  amount: number;
  cost: number;
}

interface BalanceOption {
  type: 'equalize' | 'empty';
  targetAccount?: string;
}

export default function OptimizacionGlobal() {
  const { exchangeRates } = useLoaderData<typeof loader>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [exchangeHouses, setExchangeHouses] = useState<ExchangeHouse[]>([]);
  const [optimizedTransactions, setOptimizedTransactions] = useState<Edge[]>([]);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeBalance, setNewNodeBalance] = useState('');
  const [newNodeCurrency, setNewNodeCurrency] = useState('USD');
  const fetcher = useFetcher<OptimizationResult>();
  const [updatedNodes, setUpdatedNodes] = useState<Node[]>([]);
  const [balanceOption, setBalanceOption] = useState<BalanceOption>({ type: 'equalize' });
  const [algorithmLogs, setAlgorithmLogs] = useState<string[]>([]);

  const generateRandomNodes = (count: number) => {
    const companyNames = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Corp', 'Stark Industries', 'Wayne Enterprises'];
    const currencies = Object.keys(exchangeRates);
    
    const newNodes = Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      name: companyNames[Math.floor(Math.random() * companyNames.length)] + ' ' + Math.random().toString(36).substring(7),
      balance: Math.random() * 10000, // Balance between 0 and 10000
      currency: currencies[Math.floor(Math.random() * currencies.length)]
    }));

    setNodes([...nodes, ...newNodes]);
  };

  const addNode = (e: React.FormEvent) => {
    e.preventDefault();
    const dollarBalance = parseFloat(newNodeBalance) / (exchangeRates as ExchangeRates)[newNodeCurrency as keyof ExchangeRates];
    setNodes([...nodes, { 
      id: Math.random().toString(36).substr(2, 9),
      name: newNodeName, 
      balance: Math.max(0, dollarBalance), // Ensure balance is not negative
      currency: newNodeCurrency 
    }]);
    setNewNodeName('');
    setNewNodeBalance('');
    setNewNodeCurrency('USD');
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  const deleteAllNodes = () => {
    setNodes([]);
  };

  const optimizeTransactions = () => {
    fetcher.submit(
      {
        nodes: JSON.stringify(nodes),
        exchangeHouses: JSON.stringify(exchangeHouses),
        balanceOption: JSON.stringify(balanceOption),
      },
      { method: 'post' }
    );
  };

  useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      setOptimizedTransactions(fetcher.data.mst);
      setUpdatedNodes(fetcher.data.updatedNodes);
      setAlgorithmLogs(fetcher.data.logs);
    }
  }, [fetcher.data]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Optimización Global de Transacciones</h1>
      <p className="text-lg mb-8 text-center text-gray-600">
        Esta herramienta te ayuda a optimizar las transferencias entre cuentas en diferentes monedas para minimizar los costos de transacción.
      </p>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generar o Importar Nodos</h2>
        <button 
          onClick={() => generateRandomNodes(5)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-4"
        >
          Generar 5 Nodos Aleatorios
        </button>
        <button 
          onClick={deleteAllNodes}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Borrar Todos los Nodos
        </button>
        <form onSubmit={addNode} className="mt-4">
          <input
            type="text"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            placeholder="Nombre del nodo"
            className="border p-2 mr-2"
            required
          />
          <input
            type="number"
            value={newNodeBalance}
            onChange={(e) => setNewNodeBalance(e.target.value)}
            placeholder="Balance"
            className="border p-2 mr-2"
            required
          />
          <select
            value={newNodeCurrency}
            onChange={(e) => setNewNodeCurrency(e.target.value)}
            className="border p-2 mr-2"
          >
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Añadir Nodo
          </button>
        </form>
      </div>

      {nodes.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Nodos Actuales</h2>
          <ul className="space-y-2">
            {nodes.map((node) => (
              <li key={node.id} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{node.name}</span>
                <span>
                  <span className="text-green-600">{node.balance.toFixed(2)} USD</span>
                  <span className="text-gray-500 ml-2">
                    (Original: {(node.balance * (exchangeRates as ExchangeRates)[node.currency as keyof ExchangeRates]).toFixed(2)} {node.currency})
                  </span>
                  <button 
                    onClick={() => deleteNode(node.id)}
                    className="ml-2 text-red-500 hover:text-red-600"
                  >
                    Borrar
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Opciones de Balance</h2>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="equalize"
            name="balanceOption"
            checked={balanceOption.type === 'equalize'}
            onChange={() => setBalanceOption({ type: 'equalize' })}
            className="mr-2"
          />
          <label htmlFor="equalize">Equilibrar todas las cuentas</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="empty"
            name="balanceOption"
            checked={balanceOption.type === 'empty'}
            onChange={() => setBalanceOption({ type: 'empty', targetAccount: nodes[0]?.name })}
            className="mr-2"
          />
          <label htmlFor="empty">Vaciar una cuenta y repartir entre las demás</label>
        </div>
        {balanceOption.type === 'empty' && (
          <select
            value={balanceOption.targetAccount}
            onChange={(e) => setBalanceOption({ ...balanceOption, targetAccount: e.target.value })}
            className="border p-2 mb-4"
          >
            {nodes.map(node => (
              <option key={node.id} value={node.name}>{node.name}</option>
            ))}
          </select>
        )}
      </div>

      {nodes.length > 1 && (
        <div className="text-center mb-8">
          <button 
            onClick={optimizeTransactions}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
          >
            Optimizar Transacciones
          </button>
        </div>
      )}

      {optimizedTransactions.length > 0 && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Plan de Transferencias Optimizado</h2>
            <p className="text-gray-600 mb-4">
              Hemos analizado tus {nodes.length} cuentas en {new Set(nodes.map(n => n.currency)).size} monedas diferentes 
              para crear un plan eficiente de transferencias:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>En lugar de hacer {nodes.length * (nodes.length - 1) / 2} transferencias individuales, te sugerimos hacer solo {optimizedTransactions.length}.</li>
              <li>El monto total involucrado en estas transferencias es de {optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2)} USD.</li>
              <li>Este plan reduce la complejidad y potencialmente las comisiones bancarias al minimizar el número de transacciones.</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Beneficios de este plan:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Simplificación: Reduces el número de transferencias que necesitas gestionar.</li>
              <li>Potencial ahorro en comisiones: Menos transferencias podrían significar menos comisiones bancarias totales.</li>
              <li>Eficiencia: Este plan conecta todas tus cuentas de la manera más eficiente posible.</li>
              {nodes.some(n => n.currency !== 'USD') && (
                <li>Manejo de múltiples divisas: El plan considera las diferentes monedas involucradas.</li>
              )}
            </ul>
            <p className="text-gray-600 mb-4">
              Plan de transferencias sugerido:
            </p>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Desde</th>
                  <th className="p-2 text-left">Hacia</th>
                  <th className="p-2 text-right">Monto a Transferir</th>
                </tr>
              </thead>
              <tbody>
                {optimizedTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{transaction.from}</td>
                    <td className="p-2">{transaction.to}</td>
                    <td className="p-2 text-right text-blue-600 font-semibold">
                      {transaction.weight.toFixed(2)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-gray-600 mt-4">
              <strong>Explicación:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Desde y Hacia:</strong> Indican las cuentas entre las que se sugiere realizar la transferencia.</li>
                <li><strong>Monto a Transferir:</strong> Es la cantidad sugerida para transferir de la cuenta "Desde" a la cuenta "Hacia".</li>
              </ul>
            </p>
            <p className="text-gray-600 mt-4">
              Nota: Este plan sugiere las transferencias óptimas para conectar todas tus cuentas.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Resultados y Beneficios</h2>
            <p className="text-gray-600 mb-4">
              Después de aplicar el plan de transferencias optimizado, estos son los resultados y beneficios esperados:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Número de transacciones reducidas: de {nodes.length * (nodes.length - 1) / 2} a {optimizedTransactions.length}</li>
              <li>Monto total transferido: {optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2)} USD</li>
              <li>Eficiencia de transferencia: {(100 * optimizedTransactions.length / (nodes.length * (nodes.length - 1) / 2)).toFixed(2)}%</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Nodos actualizados después de las transferencias:</strong>
            </p>
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-right">Balance Original (USD)</th>
                  <th className="p-2 text-right">Balance Final Real (USD)</th>
                  <th className="p-2 text-right">Balance Equilibrado (USD)</th>
                  <th className="p-2 text-right">Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {updatedNodes.map((node, index) => {
                  const originalNode = nodes.find(n => n.id === node.id);
                  const difference = (node.final_balance ?? node.balance) - (originalNode?.balance || 0);
                  return (
                    <tr key={node.id} className="border-b">
                      <td className="p-2">{node.name}</td>
                      <td className="p-2 text-right">{originalNode?.balance.toFixed(2)}</td>
                      <td className="p-2 text-right">{(node.final_balance ?? node.balance).toFixed(2)}</td>
                      <td className="p-2 text-right">{node.balance.toFixed(2)}</td>
                      <td className={`p-2 text-right ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {difference > 0 ? '+' : ''}{difference.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-gray-600 mb-4">
              <strong>¿Por qué optar por este plan?</strong>
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Minimiza el número de transacciones, reduciendo la complejidad operativa y los posibles errores.</li>
              <li>Optimiza el flujo de dinero entre cuentas, mejorando la liquidez general.</li>
              <li>Reduce potencialmente los costos de transacción al minimizar el número de transferencias internacionales.</li>
              <li>Proporciona una visión clara y estructurada de las transferencias necesarias, facilitando la planificación financiera.</li>
            </ul>
          </div>

          <div className="bg-gray-900 text-green-400 shadow-md rounded-lg p-6 mt-8 font-mono">
            <h2 className="text-2xl font-semibold mb-4 text-white">Consola de Algoritmo</h2>
            <div className="mb-4 text-yellow-300">
              <h3 className="text-xl font-semibold mb-2">Uso del Algoritmo de Kruskal</h3>
              <p>El algoritmo de Kruskal se utiliza para encontrar el Árbol de Expansión Mínima (MST) en un grafo ponderado. En nuestro caso:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Cada cuenta es un nodo en el grafo.</li>
                <li>Las posibles transferencias entre cuentas son las aristas.</li>
                <li>El peso de cada arista es la cantidad de dinero a transferir.</li>
              </ul>
              <p className="mt-2">El algoritmo de Kruskal nos ayuda a:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Minimizar el número total de transferencias necesarias.</li>
                <li>Encontrar la ruta más eficiente para mover el dinero entre todas las cuentas.</li>
                <li>Reducir los costos potenciales asociados con múltiples transferencias.</li>
              </ul>
            </div>
            <div className="h-96 overflow-y-auto bg-black p-4 rounded-lg">
              {algorithmLogs.map((log, index) => {
                let logClass = "mb-1";
                let prefix = ">";

                if (log.includes("Iniciando")) {
                  logClass += " text-yellow-300 font-bold";
                  prefix = "🚀";
                } else if (log.includes("Opción de balance")) {
                  logClass += " text-blue-300";
                  prefix = "⚖️";
                } else if (log.includes("Transferencias calculadas")) {
                  logClass += " text-purple-300";
                  prefix = "💱";
                } else if (log.includes("Aristas")) {
                  logClass += " text-cyan-300";
                  prefix = "🔗";
                } else if (log.includes("Añadida arista")) {
                  logClass += " text-green-300";
                  prefix = "✅";
                } else if (log.includes("descartada")) {
                  logClass += " text-red-300";
                  prefix = "❌";
                } else if (log.includes("Transferencia:")) {
                  logClass += " text-orange-300";
                  prefix = "💸";
                } else if (log.includes("completado")) {
                  logClass += " text-green-300 font-bold";
                  prefix = "🏁";
                }

                return (
                  <p key={index} className={logClass}>
                    <span className="mr-2">{prefix}</span>
                    {log}
                  </p>
                );
              })}
            </div>
            <div className="mt-4 text-white">
              <h3 className="text-xl font-semibold mb-2">Resumen del Proceso</h3>
              <ul className="list-disc pl-5">
                <li>Nodos procesados: {nodes.length}</li>
                <li>Transferencias optimizadas: {optimizedTransactions.length}</li>
                <li>Monto total transferido: {optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2)} USD</li>
                <li>Eficiencia de transferencia: {(100 * optimizedTransactions.length / (nodes.length * (nodes.length - 1) / 2)).toFixed(2)}%</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
