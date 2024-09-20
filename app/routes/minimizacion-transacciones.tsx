import { useState } from 'react';
import { Form, useActionData, useSubmit } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import { primAlgorithm, Account, Transfer } from '../utils/primAlgorithm';
import { exportToExcel } from '../utils/excelExport';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const accounts = JSON.parse(formData.get('accounts') as string);
  const result = primAlgorithm(accounts);
  return json({ result });
};

export default function MinimizacionTransacciones() {
  const actionData = useActionData<{ result: Transfer[] } | undefined>();
  const submit = useSubmit();
  const [accounts, setAccounts] = useState<Account[]>([{ name: '', balance: 0 }]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit({ accounts: JSON.stringify(accounts) }, { method: 'post' });
  };

  const handleAddAccount = () => {
    setAccounts([...accounts, { name: '', balance: 0 }]);
  };

  const handleAccountChange = (index: number, field: 'name' | 'balance', value: string) => {
    const newAccounts = [...accounts];
    newAccounts[index] = {
      ...newAccounts[index],
      [field]: field === 'balance' ? parseFloat(value) : value
    };
    setAccounts(newAccounts);
  };

  const handleExport = () => {
    if (actionData?.result) {
      exportToExcel(actionData.result, 'Minimizacion_Transacciones');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minimización de Costos de Transacciones Bancarias</h1>
      <Form method="post" onSubmit={handleSubmit}>
        {accounts.map((account, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Nombre de la cuenta"
              value={account.name}
              onChange={(e) => handleAccountChange(index, 'name', e.target.value)}
              className="mr-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Balance"
              value={account.balance}
              onChange={(e) => handleAccountChange(index, 'balance', e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddAccount} className="mb-4 p-2 bg-blue-500 text-white rounded">
          Agregar Cuenta
        </button>
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Calcular
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
