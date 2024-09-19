import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useFetcher, useSubmit } from "@remix-run/react";
import { useState, useEffect, useCallback } from "react";
import { getUser, requireUserId, logout } from "~/auth.server";
import { db } from "~/db.server";
import { calculateEqualSplits, calculateIndividualSplits } from "~/utils/calculateSplits";
import { translations } from "~/utils/translations";
import { Expense, Junta, User, Invitation, JuntaExpense } from "~/types";
import { addLocalExpense, addJuntaExpense, deleteExpense } from "~/actions/expenses.server";
import { createJunta, clearJunta, inviteToJunta } from "~/actions/juntas.server";
import { respondToInvitation, getInvitations } from "~/utils/invitations";
import { NotificationInbox } from "~/components/NotificationInbox";

type ActionData = {
  success: boolean;
  error?: string;
  expense?: Expense;
  deletedExpenseId?: string;
  junta?: Junta;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return json({ user: null, juntas: [], localExpenses: [], invitations: [] });
  }
  
  try {
    const juntas = await db.junta.findMany({
      where: {  OR: [    { ownerId: user.id },    { members: { some: { id: user.id } } }  ]},
      include: { 
        members: true,
        expenses: true 
      },
    });
    
    const localExpenses = await db.expense.findMany({
      where: { userId: user.id, isLocal: true },
    });
    
    const invitations = await getInvitations(user.id);
    
    return json({ user, juntas, localExpenses, invitations });
  } catch (error) {
    console.error("Error in loader:", error);
    return json({ error: "An error occurred while loading data" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action");

  switch (action) {
    case "addLocalExpense": {
      const userId = await requireUserId(request);
      const description = form.get("description") as string;
      const amount = parseFloat(form.get("amount") as string);
      const splitAmong = form.get("splitAmong") as string;
      return await addLocalExpense(userId, { description, amount, paidBy: userId, splitAmong });
    }
    case "addJuntaExpense": {
      const userId = await requireUserId(request);
      const juntaId = form.get("juntaId") as string;
      const description = form.get("description") as string;
      const amount = parseFloat(form.get("amount") as string);
      const splitAmong = form.get("splitAmong") as string;
      
      console.log("Action received splitAmong:", splitAmong); // Add this line
      
      if (!splitAmong) {
        return json({ error: "splitAmong is required" }, { status: 400 });
      }
      
      return await addJuntaExpense(userId, { juntaId, description, amount, splitAmong });
    }
    case "createJunta": {
      const userId = await requireUserId(request);
      const juntaName = form.get("juntaName") as string;
      return await createJunta(userId, juntaName);
    }
    case "inviteToJunta": {
      const userId = await requireUserId(request);
      const juntaId = form.get("juntaId") as string;
      const invitedUsername = form.get("invitedUsername") as string;
      return await inviteToJunta(juntaId, invitedUsername, userId);
    }
    case "deleteExpense": {
      const expenseId = form.get("expenseId") as string;
      return await deleteExpense(expenseId);
    }
    case "clearJunta": {
      const juntaId = form.get("juntaId") as string;
      return await clearJunta(juntaId);
    }
    case "respondToInvitation": {
      const invitationId = form.get("invitationId") as string;
      const accept = form.get("accept") === "true";
      const result = await respondToInvitation(invitationId, accept);
      return json(result);
    }
    case "logout":
      return await logout(request);
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
};

function convertDates(junta: Junta): Junta {
  return {
    ...junta,
    expenses: junta.expenses.map(expense => ({
      ...expense,
      createdAt: new Date(expense.createdAt)
    }))
  };
}

export default function Index() {
  const { user, juntas: initialJuntas, localExpenses: initialLocalExpenses, invitations: initialInvitations } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [showTutorial, setShowTutorial] = useState(user?.isNewUser ?? false);
  const [selectedJunta, setSelectedJunta] = useState<Junta | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [splits, setSplits] = useState<{ from: string; to: string; amount: number }[]>([]);
  const [splitAmongAll, setSplitAmongAll] = useState(false);
  const [juntas, setJuntas] = useState<Junta[]>(initialJuntas.map(convertDates));
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(initialLocalExpenses);
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const fetcher = useFetcher<ActionData>();
  const submit = useSubmit();

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const [splitType, setSplitType] = useState<'equal' | 'individual'>('equal');

  const handleCalculateSplits = useCallback(() => {
    if (selectedJunta) {
      const calculatedSplits = splitType === 'equal' 
        ? calculateEqualSplits(selectedJunta.expenses, selectedJunta.members)
        : calculateIndividualSplits(selectedJunta.expenses, selectedJunta.members);
      setSplits(calculatedSplits);
    } else if (user) {
      const calculatedSplits = splitType === 'equal'
        ? calculateEqualSplits(localExpenses, [user])
        : calculateIndividualSplits(localExpenses, [user]);
      setSplits(calculatedSplits);
    }
  }, [selectedJunta, localExpenses, user, splitType]);

  useEffect(() => {
    handleCalculateSplits();
  }, [selectedJunta, localExpenses, handleCalculateSplits]);

  const handleInvitationResponse = (invitationId: string, accept: boolean) => {
    fetcher.submit(
      { action: "respondToInvitation", invitationId, accept: accept.toString() },
      { method: "post" }
    );
  };

  const handleInviteUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    fetcher.submit(formData, { method: "post" });
  };

  const handleAddExpense = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const action = formData.get("action") as string;

    if (action === "addLocalExpense") {
      fetcher.submit(formData, { method: "post" });
    } else if (action === "addJuntaExpense") {
      let splitAmong = formData.get("splitAmong") as string;
      if (splitAmongAll && selectedJunta) {
        splitAmong = selectedJunta.members.map(member => member.username).join(',');
      }
      
      if (!splitAmong) {
        alert(t.pleaseSpecifySplitAmong);
        return;
      }

      formData.set("splitAmong", splitAmong);
      formData.set("juntaId", selectedJunta!.id);
      fetcher.submit(formData, { method: "post" });
    }

    form.reset();
  };

  const handleDeleteExpense = (expenseId: string) => {
    fetcher.submit(
      { action: "deleteExpense", expenseId },
      { method: "post" }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        if ('expense' in fetcher.data && fetcher.data.expense) {
          const newExpense: Expense = {
            ...fetcher.data.expense,
            createdAt: new Date(fetcher.data.expense.createdAt)
          };
          setLocalExpenses(prevExpenses => [...prevExpenses, newExpense]);
        } else if ('deletedExpenseId' in fetcher.data && fetcher.data.deletedExpenseId) {
          const deletedId = fetcher.data.deletedExpenseId;
          if (selectedJunta) {
            setSelectedJunta(prevJunta => {
              if (prevJunta) {
                return {
                  ...prevJunta,
                  expenses: prevJunta.expenses.filter(expense => expense.id !== deletedId)
                };
              }
              return null;
            });
          } else {
            setLocalExpenses(prevExpenses => 
              prevExpenses.filter(expense => expense.id !== deletedId)
            );
          }
        } else if ('junta' in fetcher.data && fetcher.data.junta) {
          const newJunta: Junta = {
            ...fetcher.data.junta,
            expenses: fetcher.data.junta.expenses.map(expense => ({
              ...expense,
              createdAt: new Date(expense.createdAt)
            }))
          };
          setJuntas(prevJuntas => [...prevJuntas, newJunta]);
        }
      } else if ('error' in fetcher.data && fetcher.data.error) {
        console.error("Error:", fetcher.data.error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    }
  }, [fetcher.data, selectedJunta]);

  useEffect(() => {
    if (actionData?.junta) {
      setSelectedJunta(convertDates(actionData.junta));
    }
  }, [actionData]);

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      {user ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">{t.welcome}, {user.username}!</h1>
            <Form method="post">
              <input type="hidden" name="action" value="logout" />
              <button type="submit" className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
                {t.logout}
              </button>
            </Form>
          </div>
          
          {showTutorial && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">{t.tutorial.welcome}</h2>
              {t.tutorial.algorithms.map((algo, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-xl font-semibold">{algo.name}</h3>
                  <p>{algo.description}</p>
                </div>
              ))}
              <button 
                onClick={() => setShowTutorial(false)} 
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                {t.tutorial.close}
              </button>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">{t.createJunta}</h2>
            <Form method="post" className="flex space-x-2">
              <input type="hidden" name="action" value="createJunta" />
              <input
                type="text"
                name="juntaName"
                placeholder={t.juntaName}
                className="flex-grow border p-2 rounded"
                required
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                {t.create}
              </button>
            </Form>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">{t.yourJuntas}</h2>
            {Array.isArray(juntas) && juntas.length > 0 ? (
              <select
                onChange={(e) => {
                  const selected = juntas.find((j: Junta) => j.id === e.target.value);
                  setSelectedJunta(selected || null);
                }}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">{t.selectJunta}</option>
                {juntas.map((j: Junta) => (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                ))}
              </select>
            ) : (
              <p>{t.noJuntas}</p>
            )}
          </div>

          {selectedJunta && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">{selectedJunta.name}</h3>
              
              <Form method="post" onSubmit={handleInviteUser} className="mb-4">
                <input type="hidden" name="action" value="inviteToJunta" />
                <input type="hidden" name="juntaId" value={selectedJunta.id} />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="invitedUsername"
                    placeholder={t.inviteUser}
                    className="flex-grow border p-2 rounded"
                    required
                  />
                  <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                    {t.invite}
                  </button>
                </div>
              </Form>

              <Form method="post" onSubmit={handleAddExpense} className="mb-4">
                <input type="hidden" name="action" value="addJuntaExpense" />
                <input type="hidden" name="juntaId" value={selectedJunta.id} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="description"
                    placeholder={t.description}
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder={t.amount}
                    className="border p-2 rounded"
                    required
                  />
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="splitAmong"
                      placeholder={t.splitAmong}
                      className="border p-2 rounded flex-grow"
                      required={!splitAmongAll}
                      disabled={splitAmongAll}
                    />
                    <label className="ml-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={splitAmongAll}
                        onChange={() => setSplitAmongAll(!splitAmongAll)}
                        className="mr-1"
                      />
                      {t.splitAmongAll}
                    </label>
                  </div>
                </div>
                <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                  {t.addExpense}
                </button>
              </Form>

              {/* Gastos de la Junta */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-blue-600">{t.juntaExpenses}</h4>
                <ul className="space-y-2">
                  {selectedJunta.expenses.map((expense: JuntaExpense) => (
                    <li key={expense.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                      <span>
                        {expense.description} - {expense.amount.toFixed(2)} 
                        ({t.paidBy} {selectedJunta.members.find(m => m.id === expense.paidBy)?.username})
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                      >
                        {t.deleteExpense}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mis Gastos */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-blue-600">{t.myExpenses}</h4>
                <ul className="space-y-2">
                  {selectedJunta.expenses.filter(e => e.paidBy === user?.id).map((expense: JuntaExpense) => (
                    <li key={expense.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                      <span>{expense.description} - {expense.amount.toFixed(2)}</span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                      >
                        {t.deleteExpense}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-x-2">
                <button
                  onClick={() => {
                    setSplitType('equal');
                    handleCalculateSplits();
                  }}
                  className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition"
                >
                  {t.equalizeMoneyButton}
                </button>
                <button
                  onClick={() => {
                    setSplitType('individual');
                    handleCalculateSplits();
                  }}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                >
                  {t.calculateDivisionsButton}
                </button>
              </div>

              {/* Divisiones Generales */}
              {splits.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-blue-600">
                    {splitType === 'equal' ? t.generalSplitsEqual : t.generalSplitsIndividual}
                  </h4>
                  <ul className="space-y-2">
                    {splits.map((split, index) => (
                      <li key={index} className="bg-gray-100 p-2 rounded">
                        {`${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mis Divisiones */}
              {splits.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-blue-600">{t.mySplits}</h4>
                  <ul className="space-y-2">
                    {splits.filter(split => split.from === user?.username || split.to === user?.username).map((split, index) => (
                      <li key={index} className="bg-gray-100 p-2 rounded">
                        {split.from === user?.username 
                          ? `${t.youOwe} ${split.to}: ${split.amount.toFixed(2)}`
                          : `${split.from} ${t.owesYou}: ${split.amount.toFixed(2)}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Form method="post" className="mt-4">
                <input type="hidden" name="action" value="clearJunta" />
                <input type="hidden" name="juntaId" value={selectedJunta.id} />
                <button type="submit" className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
                  {t.clearJunta}
                </button>
              </Form>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">{t.localExpenses}</h2>
            <Form method="post" onSubmit={handleAddExpense} className="mb-4">
              <input type="hidden" name="action" value="addLocalExpense" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  name="description"
                  placeholder={t.description}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="amount"
                  placeholder={t.amount}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="splitAmong"
                  placeholder={t.splitAmong}
                  className="border p-2 rounded"
                  required
                />
              </div>
              <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                {t.addLocalExpense}
              </button>
            </Form>

            <ul className="space-y-2">
              {localExpenses.map((expense: Expense) => (
                <li key={expense.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{expense.description} - {expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    {t.deleteExpense}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCalculateSplits}
              className="mt-4 bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition"
            >
              {t.calculateSplits}
            </button>

            {splits.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-blue-600">{t.splits}</h3>
                <ul className="space-y-2">
                  {splits.map((split, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded">
                      {`${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition"
          >
            {t.notifications}
          </button>
          {showNotifications && user.id && (
            <NotificationInbox 
              userId={user.id} 
              initialInvitations={invitations} 
              onInvitationResponse={handleInvitationResponse} 
            />
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-xl">{t.pleaseLogin}</p>
          <div className="space-x-4">
            <a href="/login" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
              {t.login}
            </a>
            <a href="/register" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
              {t.register}
            </a>
          </div>
        </div>
      )}

      {actionData?.error && (
        <div className="text-red-500 mt-4 p-2 bg-red-100 rounded">{actionData.error}</div>
      )}
    </div>
  );
}