import {
  require_db
} from "/build/_shared/chunk-E7TNPIXH.js";
import {
  require_auth
} from "/build/_shared/chunk-IL7AJ3GD.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useSubmit
} from "/build/_shared/chunk-SBCI5TGH.js";
import {
  createHotContext
} from "/build/_shared/chunk-KHA4OLT4.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:~/actions/expenses.server
var require_expenses = __commonJS({
  "empty-module:~/actions/expenses.server"(exports, module) {
    module.exports = {};
  }
});

// empty-module:~/actions/juntas.server
var require_juntas = __commonJS({
  "empty-module:~/actions/juntas.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);
var import_react4 = __toESM(require_react(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_db = __toESM(require_db(), 1);

// app/utils/floydWarshall.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\floydWarshall.ts"
  );
  import.meta.hot.lastModified = "1726731559766.386";
}
function floydWarshall(initialSplits) {
  console.log("Initial splits:", initialSplits);
  const participants = Array.from(new Set(initialSplits.flatMap((split) => [split.from, split.to])));
  console.log("Participants:", participants);
  const n = participants.length;
  const dist = Array(n).fill(0).map(() => Array(n).fill(0));
  initialSplits.forEach((split) => {
    const i = participants.indexOf(split.from);
    const j = participants.indexOf(split.to);
    dist[i][j] += split.amount;
    dist[j][i] -= split.amount;
  });
  console.log("Initial distance matrix:", dist);
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (Math.abs(dist[i][k] + dist[k][j]) < Math.abs(dist[i][j])) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  const optimizedSplits = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const amount = parseFloat(dist[i][j].toFixed(2));
      if (amount > 0.01) {
        optimizedSplits.push({
          from: participants[i],
          to: participants[j],
          amount
        });
      } else if (amount < -0.01) {
        optimizedSplits.push({
          from: participants[j],
          to: participants[i],
          amount: -amount
        });
      }
    }
  }
  console.log("Optimized splits:", optimizedSplits);
  return optimizedSplits;
}

// app/utils/calculateIndividualSplits.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\calculateIndividualSplits.ts"
  );
  import.meta.hot.lastModified = "1726732256253.3955";
}
function calculateIndividualSplits(expenses, participants) {
  const balances = {};
  participants.forEach((p) => balances[p.id] = 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = totalExpense / participants.length;
  expenses.forEach((expense) => {
    balances[expense.paidBy] += expense.amount;
  });
  participants.forEach((p) => {
    balances[p.id] -= averageExpense;
  });
  console.log("Balances iniciales:", balances);
  const splits = [];
  const debtors = participants.filter((p) => balances[p.id] < 0);
  const creditors = participants.filter((p) => balances[p.id] > 0);
  debtors.forEach((debtor) => {
    let remainingDebt = -balances[debtor.id];
    creditors.forEach((creditor) => {
      if (remainingDebt > 0 && balances[creditor.id] > 0) {
        const amount = Math.min(remainingDebt, balances[creditor.id]);
        if (amount > 0.01) {
          splits.push({
            from: debtor.username,
            to: creditor.username,
            amount: parseFloat(amount.toFixed(2))
          });
        }
        remainingDebt -= amount;
        balances[creditor.id] -= amount;
      }
    });
  });
  console.log("Splits calculados:", splits);
  return splits;
}

// app/utils/calculateSplits.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\calculateSplits.ts"
  );
  import.meta.hot.lastModified = "1726732133062.3928";
}
function calculateEqualSplits(expenses, participants) {
  const balances = calculateBalances(expenses, participants);
  console.log("Calculated balances:", balances);
  const initialSplits = [];
  Object.entries(balances).forEach(([payer, balance]) => {
    if (balance > 0) {
      Object.entries(balances).forEach(([receiver, receiverBalance]) => {
        if (receiverBalance < 0) {
          const amount = Math.min(balance, -receiverBalance);
          if (amount > 0.01) {
            initialSplits.push({
              from: payer,
              to: receiver,
              amount: parseFloat(amount.toFixed(2))
            });
          }
        }
      });
    }
  });
  console.log("Initial splits:", initialSplits);
  const optimizedSplits = floydWarshall(initialSplits);
  console.log("Optimized splits:", optimizedSplits);
  return optimizedSplits;
}
function calculateBalances(expenses, participants) {
  const balances = {};
  participants.forEach((p) => balances[p.username] = 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const sharePerPerson = totalExpense / participants.length;
  expenses.forEach((expense) => {
    const paidByUser = participants.find((p) => p.id === expense.paidBy);
    const paidBy = paidByUser ? paidByUser.username : expense.paidBy;
    balances[paidBy] = (balances[paidBy] || 0) + expense.amount;
  });
  participants.forEach((person) => {
    balances[person.username] -= sharePerPerson;
  });
  return balances;
}

// app/utils/translations.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\translations.ts"
  );
  import.meta.hot.lastModified = "1726732485631.3865";
}
var translations = {
  es: {
    title: "Divisor de Gastos",
    welcome: "Bienvenido",
    addExpense: "Agregar Gasto",
    description: "Descripci\xF3n",
    amount: "Monto",
    splitAmong: "Dividir Entre (separado por comas)",
    expenses: "Gastos",
    calculateSplits: "Calcular Divisiones",
    splits: "Divisiones",
    logout: "Cerrar Sesi\xF3n",
    login: "Iniciar Sesi\xF3n",
    register: "Registrarse",
    pleaseLogin: "Por favor inicia sesi\xF3n para usar el Divisor de Gastos.",
    owes: "debe a",
    changeLanguage: "Change to English",
    tutorial: {
      welcome: "Algoritmos utilizados en el Divisor de Gastos",
      algorithms: [
        {
          name: "Floyd-Warshall",
          description: "Utilizado en la funci\xF3n 'Igualar Dinero'. Este algoritmo de programaci\xF3n din\xE1mica optimiza las transferencias de dinero entre los participantes. Funciona creando una matriz de distancias (deudas) entre todos los participantes y luego iterando sobre esta matriz para encontrar las rutas m\xE1s eficientes para saldar deudas. En nuestra implementaci\xF3n, inicializamos la matriz con las deudas directas y luego aplicamos el algoritmo para minimizar el n\xFAmero de transacciones necesarias."
        },
        {
          name: "T\xE9cnicas de recorrido en grafos",
          description: "Utilizadas en la funci\xF3n 'Calcular Divisiones'. Tratamos a los participantes como nodos de un grafo y sus deudas como aristas. Recorremos este grafo para calcular los balances individuales y luego determinar las transferencias \xF3ptimas. Este enfoque nos permite manejar eficientemente las relaciones de deuda complejas entre m\xFAltiples participantes."
        },
        {
          name: "Programaci\xF3n Din\xE1mica",
          description: "Aplicada en ambas funciones de c\xE1lculo de divisiones. En 'Igualar Dinero', la usamos dentro del algoritmo Floyd-Warshall para optimizar las transferencias. En 'Calcular Divisiones', la utilizamos para calcular eficientemente los balances acumulados de cada participante, evitando c\xE1lculos redundantes al procesar m\xFAltiples gastos."
        }
      ],
      close: "Cerrar Tutorial"
    },
    juntas: "Juntas",
    createJunta: "Crear Nueva Junta",
    localExpenses: "Gastos Locales",
    addLocalExpense: "A\xF1adir Gasto Local",
    deleteExpense: "Eliminar Gasto",
    clearJunta: "Vaciar Junta",
    paidBy: "Pagado por",
    notifications: "Notificaciones",
    inviteUser: "Invitar usuario",
    invite: "Invitar",
    closeTutorial: "Cerrar tutorial",
    juntaName: "Nombre de la junta",
    create: "Crear",
    yourJuntas: "Tus juntas",
    selectJunta: "Seleccionar junta",
    noJuntas: "No tienes juntas creadas a\xFAn.",
    splitAmongAll: "Dividir entre todos",
    pleaseSpecifySplitAmong: "Por favor, especifica entre qui\xE9nes se divide el gasto.",
    juntaExpenses: "Gastos de la Junta",
    myExpenses: "Mis Gastos",
    generalSplits: "Divisiones Generales",
    mySplits: "Mis Divisiones",
    youOwe: "Debes a",
    owesYou: "te debe",
    equalizeMoneyButton: "Igualar Dinero",
    calculateDivisionsButton: "Calcular Divisiones",
    generalSplitsEqual: "Divisiones Generales (Igualadas)",
    generalSplitsIndividual: "Divisiones Generales (Basadas en Gastos Individuales)"
  },
  en: {
    title: "Expense Splitter",
    welcome: "Welcome",
    addExpense: "Add Expense",
    description: "Description",
    amount: "Amount",
    splitAmong: "Split Among (comma-separated)",
    expenses: "Expenses",
    calculateSplits: "Calculate Splits",
    splits: "Splits",
    logout: "Logout",
    login: "Login",
    register: "Register",
    pleaseLogin: "Please log in to use the Expense Splitter.",
    owes: "owes",
    changeLanguage: "Cambiar a Espa\xF1ol",
    tutorial: {
      welcome: "Algorithms used in the Expense Splitter",
      algorithms: [
        {
          name: "Floyd-Warshall",
          description: "Used in the 'Equalize Money' function. This dynamic programming algorithm optimizes money transfers between participants. It works by creating a distance (debt) matrix between all participants and then iterating over this matrix to find the most efficient routes to settle debts. In our implementation, we initialize the matrix with direct debts and then apply the algorithm to minimize the number of necessary transactions."
        },
        {
          name: "Graph traversal techniques",
          description: "Used in the 'Calculate Divisions' function. We treat participants as nodes in a graph and their debts as edges. We traverse this graph to calculate individual balances and then determine optimal transfers. This approach allows us to efficiently handle complex debt relationships between multiple participants."
        },
        {
          name: "Dynamic Programming",
          description: "Applied in both division calculation functions. In 'Equalize Money', we use it within the Floyd-Warshall algorithm to optimize transfers. In 'Calculate Divisions', we use it to efficiently calculate the accumulated balances of each participant, avoiding redundant calculations when processing multiple expenses."
        }
      ],
      close: "Close Tutorial"
    },
    juntas: "Groups",
    createJunta: "Create New Group",
    localExpenses: "Local Expenses",
    addLocalExpense: "Add Local Expense",
    deleteExpense: "Delete Expense",
    clearJunta: "Clear Group",
    paidBy: "Paid by",
    notifications: "Notifications",
    inviteUser: "Invite user",
    invite: "Invite",
    closeTutorial: "Close tutorial",
    juntaName: "Group name",
    create: "Create",
    yourJuntas: "Your groups",
    selectJunta: "Select group",
    noJuntas: "You don't have any juntas created yet.",
    splitAmongAll: "Split among all",
    pleaseSpecifySplitAmong: "Please specify who to split the expense among.",
    juntaExpenses: "Group Expenses",
    myExpenses: "My Expenses",
    generalSplits: "General Splits",
    mySplits: "My Splits",
    youOwe: "You owe",
    owesYou: "owes you",
    equalizeMoneyButton: "Equalize Money",
    calculateDivisionsButton: "Calculate Divisions",
    generalSplitsEqual: "General Splits (Equalized)",
    generalSplitsIndividual: "General Splits (Based on Individual Expenses)"
  }
};

// app/routes/_index.tsx
var import_expenses = __toESM(require_expenses(), 1);
var import_juntas = __toESM(require_juntas(), 1);

// app/components/NotificationInbox.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\NotificationInbox.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\NotificationInbox.tsx"
  );
  import.meta.hot.lastModified = "1726719478597.0276";
}
function NotificationInbox({
  userId,
  initialInvitations,
  onInvitationResponse
}) {
  _s();
  const [invitations, setInvitations] = (0, import_react.useState)(initialInvitations);
  const fetcher = useFetcher();
  const handleInvitationResponse = (invitationId, accept) => {
    onInvitationResponse(invitationId, accept);
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
  };
  if (invitations.length === 0)
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "No pending invitations" }, void 0, false, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 36,
      columnNumber: 40
    }, this);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { children: "Invitations" }, void 0, false, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    invitations.map((invitation) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4 p-4 border rounded", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
        invitation.inviter.username,
        " invited you to ",
        invitation.junta.name
      ] }, void 0, true, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 40,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => handleInvitationResponse(invitation.id, true), children: "Accept" }, void 0, false, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => handleInvitationResponse(invitation.id, false), children: "Reject" }, void 0, false, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 42,
        columnNumber: 11
      }, this)
    ] }, invitation.id, true, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 39,
      columnNumber: 38
    }, this))
  ] }, void 0, true, {
    fileName: "app/components/NotificationInbox.tsx",
    lineNumber: 37,
    columnNumber: 10
  }, this);
}
_s(NotificationInbox, "wVSSYL8oR+SWe+M+LCVUG4uwMHU=", false, function() {
  return [useFetcher];
});
_c = NotificationInbox;
var _c;
$RefreshReg$(_c, "NotificationInbox");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/_index.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\_index.tsx"
  );
  import.meta.hot.lastModified = "1726732484821.4475";
}
function convertDates(junta) {
  return {
    ...junta,
    expenses: junta.expenses.map((expense) => ({
      ...expense,
      createdAt: new Date(expense.createdAt)
    }))
  };
}
function Index() {
  _s2();
  const {
    user,
    juntas: initialJuntas,
    localExpenses: initialLocalExpenses,
    invitations: initialInvitations
  } = useLoaderData();
  const actionData = useActionData();
  const [language, setLanguage] = (0, import_react4.useState)("es");
  const [showTutorial, setShowTutorial] = (0, import_react4.useState)(user?.isNewUser ?? false);
  const [selectedJunta, setSelectedJunta] = (0, import_react4.useState)(null);
  const [showNotifications, setShowNotifications] = (0, import_react4.useState)(false);
  const [splits, setSplits] = (0, import_react4.useState)([]);
  const [splitAmongAll, setSplitAmongAll] = (0, import_react4.useState)(false);
  const [juntas, setJuntas] = (0, import_react4.useState)(initialJuntas.map(convertDates));
  const [localExpenses, setLocalExpenses] = (0, import_react4.useState)(initialLocalExpenses);
  const [invitations, setInvitations] = (0, import_react4.useState)(initialInvitations);
  const fetcher = useFetcher();
  const submit = useSubmit();
  const t = translations[language];
  const toggleLanguage = () => {
    setLanguage((prev) => prev === "es" ? "en" : "es");
  };
  const [splitType, setSplitType] = (0, import_react4.useState)("equal");
  const handleCalculateSplits = (0, import_react4.useCallback)(() => {
    if (selectedJunta) {
      const calculatedSplits = splitType === "equal" ? calculateEqualSplits(selectedJunta.expenses, selectedJunta.members) : calculateIndividualSplits(selectedJunta.expenses, selectedJunta.members);
      setSplits(calculatedSplits);
    } else if (user) {
      const calculatedSplits = splitType === "equal" ? calculateEqualSplits(localExpenses, [user]) : calculateIndividualSplits(localExpenses, [user]);
      setSplits(calculatedSplits);
    }
  }, [selectedJunta, localExpenses, user, splitType]);
  (0, import_react4.useEffect)(() => {
    handleCalculateSplits();
  }, [selectedJunta, localExpenses, handleCalculateSplits]);
  const handleInviteUser = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    fetcher.submit(formData, {
      method: "post"
    });
  };
  const handleAddExpense = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    let splitAmong = formData.get("splitAmong");
    if (splitAmongAll && selectedJunta) {
      splitAmong = selectedJunta.members.map((member) => member.username).join(",");
    }
    if (!splitAmong) {
      alert(t.pleaseSpecifySplitAmong);
      return;
    }
    formData.set("splitAmong", splitAmong);
    if (selectedJunta) {
      formData.set("action", "addJuntaExpense");
      formData.set("juntaId", selectedJunta.id);
    } else {
      formData.set("action", "addLocalExpense");
    }
    fetcher.submit(formData, {
      method: "post"
    });
    form.reset();
  };
  const handleInvitationResponse = (invitationId, accept) => {
    fetcher.submit({
      action: "respondToInvitation",
      invitationId,
      accept: accept.toString()
    }, {
      method: "post"
    });
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    if (accept) {
      const acceptedInvitation = invitations.find((inv) => inv.id === invitationId);
      if (acceptedInvitation && acceptedInvitation.junta) {
        setJuntas((prev) => [...prev, {
          id: acceptedInvitation.junta.id,
          name: acceptedInvitation.junta.name,
          ownerId: acceptedInvitation.inviter.id,
          members: [acceptedInvitation.inviter],
          expenses: []
        }]);
      }
    }
  };
  (0, import_react4.useEffect)(() => {
    if (fetcher.data) {
      if ("success" in fetcher.data) {
        if (fetcher.data.success) {
          alert(fetcher.data.message || "Invitation sent successfully");
        } else {
          alert(fetcher.data.message || "Failed to invite user");
        }
      }
    }
  }, [fetcher.data]);
  (0, import_react4.useEffect)(() => {
    if (actionData?.junta) {
      setSelectedJunta(convertDates(actionData.junta));
    }
  }, [actionData]);
  const handleDeleteExpense = (expenseId) => {
    fetcher.submit({
      action: "deleteExpense",
      expenseId
    }, {
      method: "post"
    });
    if (selectedJunta) {
      setSelectedJunta((prevJunta) => {
        if (prevJunta) {
          return {
            ...prevJunta,
            expenses: prevJunta.expenses.filter((expense) => expense.id !== expenseId)
          };
        }
        return prevJunta;
      });
    } else {
      setLocalExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "container mx-auto p-4 bg-gray-100 min-h-screen", children: [
    user ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h1", { className: "text-3xl font-bold text-blue-600", children: [
          t.welcome,
          ", ",
          user.username,
          "!"
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 311,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "post", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "action", value: "logout" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 313,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.logout }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 314,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 312,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 310,
        columnNumber: 11
      }, this),
      showTutorial && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h2", { className: "text-2xl font-bold mb-4", children: t.tutorial.welcome }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 321,
          columnNumber: 15
        }, this),
        t.tutorial.algorithms.map((algo, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h3", { className: "text-xl font-semibold", children: algo.name }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 323,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { children: algo.description }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 324,
            columnNumber: 19
          }, this)
        ] }, index, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 322,
          columnNumber: 59
        }, this)),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { onClick: () => setShowTutorial(false), className: "mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition", children: t.tutorial.close }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 326,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 320,
        columnNumber: 28
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.createJunta }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 332,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "post", className: "flex space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "action", value: "createJunta" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 334,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", name: "juntaName", placeholder: t.juntaName, className: "flex-grow border p-2 rounded", required: true }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 335,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.create }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 336,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 333,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 331,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.yourJuntas }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 343,
          columnNumber: 13
        }, this),
        Array.isArray(juntas) && juntas.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("select", { onChange: (e) => {
          const selected = juntas.find((j) => j.id === e.target.value);
          setSelectedJunta(selected || null);
        }, className: "w-full p-2 border rounded mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("option", { value: "", children: t.selectJunta }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 348,
            columnNumber: 17
          }, this),
          juntas.map((j) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("option", { value: j.id, children: j.name }, j.id, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 349,
            columnNumber: 34
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 344,
          columnNumber: 59
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { children: t.noJuntas }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 352,
          columnNumber: 27
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 342,
        columnNumber: 11
      }, this),
      selectedJunta && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h3", { className: "text-xl font-semibold mb-4 text-blue-700", children: selectedJunta.name }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 356,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "post", onSubmit: handleInviteUser, className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "action", value: "inviteToJunta" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 359,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 360,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", name: "invitedUsername", placeholder: t.inviteUser, className: "flex-grow border p-2 rounded", required: true }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 362,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "submit", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.invite }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 363,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 361,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 358,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "action", value: "addJuntaExpense" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 370,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 371,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", name: "description", placeholder: t.description, className: "border p-2 rounded", required: true }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 373,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "number", name: "amount", placeholder: t.amount, className: "border p-2 rounded", required: true }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 374,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", name: "splitAmong", placeholder: t.splitAmong, className: "border p-2 rounded flex-grow", required: !splitAmongAll, disabled: splitAmongAll }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 376,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("label", { className: "ml-2 flex items-center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "checkbox", checked: splitAmongAll, onChange: () => setSplitAmongAll(!splitAmongAll), className: "mr-1" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 378,
                  columnNumber: 23
                }, this),
                t.splitAmongAll
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 377,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 375,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 372,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addExpense }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 383,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 369,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h4", { className: "text-lg font-semibold text-blue-600", children: t.juntaExpenses }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 390,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: "space-y-2", children: selectedJunta.expenses.map((expense) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { className: "bg-gray-100 p-2 rounded flex justify-between items-center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { children: [
              expense.description,
              " - ",
              expense.amount.toFixed(2),
              "(",
              t.paidBy,
              " ",
              selectedJunta.members.find((m) => m.id === expense.paidBy)?.username,
              ")"
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 393,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { onClick: () => handleDeleteExpense(expense.id), className: "bg-red-500 text-white p-1 rounded hover:bg-red-600 transition", children: t.deleteExpense }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 397,
              columnNumber: 23
            }, this)
          ] }, expense.id, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 392,
            columnNumber: 58
          }, this)) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 391,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 389,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h4", { className: "text-lg font-semibold text-blue-600", children: t.myExpenses }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 406,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: "space-y-2", children: selectedJunta.expenses.filter((e) => e.paidBy === user?.id).map((expense) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { className: "bg-gray-100 p-2 rounded flex justify-between items-center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { children: [
              expense.description,
              " - ",
              expense.amount.toFixed(2)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 409,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { onClick: () => handleDeleteExpense(expense.id), className: "bg-red-500 text-white p-1 rounded hover:bg-red-600 transition", children: t.deleteExpense }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 410,
              columnNumber: 23
            }, this)
          ] }, expense.id, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 408,
            columnNumber: 93
          }, this)) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 407,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 405,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-4 space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { onClick: () => {
            setSplitType("equal");
            handleCalculateSplits();
          }, className: "bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition", children: t.equalizeMoneyButton }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 418,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { onClick: () => {
            setSplitType("individual");
            handleCalculateSplits();
          }, className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.calculateDivisionsButton }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 424,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 417,
          columnNumber: 15
        }, this),
        splits.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h4", { className: "text-lg font-semibold text-blue-600", children: splitType === "equal" ? t.generalSplitsEqual : t.generalSplitsIndividual }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 434,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 438,
            columnNumber: 51
          }, this)) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 437,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 433,
          columnNumber: 37
        }, this),
        splits.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h4", { className: "text-lg font-semibold text-blue-600", children: t.mySplits }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 446,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: "space-y-2", children: splits.filter((split) => split.from === user?.username || split.to === user?.username).map((split, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { className: "bg-gray-100 p-2 rounded", children: split.from === user?.username ? `${t.youOwe} ${split.to}: ${split.amount.toFixed(2)}` : `${split.from} ${t.owesYou}: ${split.amount.toFixed(2)}` }, index, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 448,
            columnNumber: 129
          }, this)) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 447,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 445,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "post", className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "action", value: "clearJunta" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 455,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 456,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.clearJunta }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 457,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 454,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 355,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.localExpenses }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 464,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "action", value: "addLocalExpense" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 466,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", name: "description", placeholder: t.description, className: "border p-2 rounded", required: true }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 468,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "number", name: "amount", placeholder: t.amount, className: "border p-2 rounded", required: true }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 469,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", name: "splitAmong", placeholder: t.splitAmong, className: "border p-2 rounded", required: true }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 470,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 467,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addLocalExpense }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 472,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 465,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: "space-y-2", children: Array.isArray(localExpenses) && localExpenses.map((expense) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { className: "flex justify-between items-center bg-gray-100 p-2 rounded", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { children: [
            expense.description,
            " - ",
            expense.amount
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 479,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "post", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "action", value: "deleteExpense" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 481,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "expenseId", value: expense.id }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 482,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "submit", className: "text-red-500 hover:text-red-700 transition", children: t.deleteExpense }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 483,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 480,
            columnNumber: 19
          }, this)
        ] }, expense.id, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 478,
          columnNumber: 77
        }, this)) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 477,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { onClick: handleCalculateSplits, className: "mt-4 bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition", children: t.calculateSplits }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 490,
          columnNumber: 13
        }, this),
        splits.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h3", { className: "text-lg font-semibold text-blue-600", children: t.splits }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 495,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 497,
            columnNumber: 49
          }, this)) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 496,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 494,
          columnNumber: 35
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 463,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { onClick: () => setShowNotifications(!showNotifications), className: "bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition", children: t.notifications }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 504,
        columnNumber: 11
      }, this),
      showNotifications && user.id && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(NotificationInbox, { userId: user.id, initialInvitations: invitations, onInvitationResponse: handleInvitationResponse }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 507,
        columnNumber: 44
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 309,
      columnNumber: 15
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { className: "mb-4 text-xl", children: t.pleaseLogin }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 509,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "space-x-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/login", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.login }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 511,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("a", { href: "/register", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.register }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 514,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 510,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 508,
      columnNumber: 15
    }, this),
    actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "text-red-500 mt-4 p-2 bg-red-100 rounded", children: actionData.error }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 520,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 308,
    columnNumber: 10
  }, this);
}
_s2(Index, "4cAaOB+NaWvkomS7URsntm7P/P4=", false, function() {
  return [useLoaderData, useActionData, useFetcher, useSubmit];
});
_c2 = Index;
var _c2;
$RefreshReg$(_c2, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/_index-OVVI2W3J.js.map
