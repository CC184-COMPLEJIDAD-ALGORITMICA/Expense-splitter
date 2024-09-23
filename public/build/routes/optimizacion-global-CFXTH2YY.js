import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useFetcher,
  useLoaderData
} from "/build/_shared/chunk-SNZIFTKA.js";
import {
  createHotContext
} from "/build/_shared/chunk-KHA4OLT4.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:~/server/kruskalMST.server
var require_kruskalMST = __commonJS({
  "empty-module:~/server/kruskalMST.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/optimizacion-global.tsx
var import_react = __toESM(require_react(), 1);
var import_node = __toESM(require_node(), 1);
var import_kruskalMST = __toESM(require_kruskalMST(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\optimizacion-global.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\optimizacion-global.tsx"
  );
  import.meta.hot.lastModified = "1727059936235.157";
}
function OptimizacionGlobal() {
  _s();
  const {
    exchangeRates
  } = useLoaderData();
  const [nodes, setNodes] = (0, import_react.useState)([]);
  const [exchangeHouses, setExchangeHouses] = (0, import_react.useState)([]);
  const [optimizedTransactions, setOptimizedTransactions] = (0, import_react.useState)([]);
  const [newNodeName, setNewNodeName] = (0, import_react.useState)("");
  const [newNodeBalance, setNewNodeBalance] = (0, import_react.useState)("");
  const [newNodeCurrency, setNewNodeCurrency] = (0, import_react.useState)("USD");
  const fetcher = useFetcher();
  const [updatedNodes, setUpdatedNodes] = (0, import_react.useState)([]);
  const [balanceOption, setBalanceOption] = (0, import_react.useState)({
    type: "equalize"
  });
  const [algorithmLogs, setAlgorithmLogs] = (0, import_react.useState)([]);
  const generateRandomNodes = (count) => {
    const companyNames = ["Acme Corp", "Globex", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises"];
    const currencies = Object.keys(exchangeRates);
    const newNodes = Array.from({
      length: count
    }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      name: companyNames[Math.floor(Math.random() * companyNames.length)] + " " + Math.random().toString(36).substring(7),
      balance: Math.random() * 1e4,
      // Balance between 0 and 10000
      currency: currencies[Math.floor(Math.random() * currencies.length)]
    }));
    setNodes([...nodes, ...newNodes]);
  };
  const addNode = (e) => {
    e.preventDefault();
    const dollarBalance = parseFloat(newNodeBalance) / exchangeRates[newNodeCurrency];
    setNodes([...nodes, {
      id: Math.random().toString(36).substr(2, 9),
      name: newNodeName,
      balance: Math.max(0, dollarBalance),
      // Ensure balance is not negative
      currency: newNodeCurrency
    }]);
    setNewNodeName("");
    setNewNodeBalance("");
    setNewNodeCurrency("USD");
  };
  const deleteNode = (id) => {
    setNodes(nodes.filter((node) => node.id !== id));
  };
  const deleteAllNodes = () => {
    setNodes([]);
  };
  const optimizeTransactions = () => {
    fetcher.submit({
      nodes: JSON.stringify(nodes),
      exchangeHouses: JSON.stringify(exchangeHouses),
      balanceOption: JSON.stringify(balanceOption)
    }, {
      method: "post"
    });
  };
  (0, import_react.useEffect)(() => {
    if (fetcher.data && !fetcher.data.error) {
      setOptimizedTransactions(fetcher.data.mst);
      setUpdatedNodes(fetcher.data.updatedNodes);
      setAlgorithmLogs(fetcher.data.logs);
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-4xl mx-auto p-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold mb-6 text-center text-blue-600", children: "Optimizaci\xF3n Global de Transacciones" }, void 0, false, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 119,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg mb-8 text-center text-gray-600", children: "Esta herramienta te ayuda a optimizar las transferencias entre cuentas en diferentes monedas para minimizar los costos de transacci\xF3n." }, void 0, false, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 120,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Generar o Importar Nodos" }, void 0, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 125,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => generateRandomNodes(5), className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-4", children: "Generar 5 Nodos Aleatorios" }, void 0, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: deleteAllNodes, className: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300", children: "Borrar Todos los Nodos" }, void 0, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: addNode, className: "mt-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", value: newNodeName, onChange: (e) => setNewNodeName(e.target.value), placeholder: "Nombre del nodo", className: "border p-2 mr-2", required: true }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 133,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", value: newNodeBalance, onChange: (e) => setNewNodeBalance(e.target.value), placeholder: "Balance", className: "border p-2 mr-2", required: true }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { value: newNodeCurrency, onChange: (e) => setNewNodeCurrency(e.target.value), className: "border p-2 mr-2", children: Object.keys(exchangeRates).map((currency) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: currency, children: currency }, currency, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 136,
          columnNumber: 57
        }, this)) }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300", children: "A\xF1adir Nodo" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 138,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 132,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 124,
      columnNumber: 7
    }, this),
    nodes.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Nodos Actuales" }, void 0, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 145,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "space-y-2", children: nodes.map((node) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "flex justify-between items-center border-b pb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: node.name }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 148,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-green-600", children: [
            node.balance.toFixed(2),
            " USD"
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 150,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-500 ml-2", children: [
            "(Original: ",
            (node.balance * exchangeRates[node.currency]).toFixed(2),
            " ",
            node.currency,
            ")"
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 151,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => deleteNode(node.id), className: "ml-2 text-red-500 hover:text-red-600", children: "Borrar" }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 154,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 149,
          columnNumber: 17
        }, this)
      ] }, node.id, true, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 147,
        columnNumber: 32
      }, this)) }, void 0, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 146,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 144,
      columnNumber: 28
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Opciones de Balance" }, void 0, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 163,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "radio", id: "equalize", name: "balanceOption", checked: balanceOption.type === "equalize", onChange: () => setBalanceOption({
          type: "equalize"
        }), className: "mr-2" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 165,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "equalize", children: "Equilibrar todas las cuentas" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 168,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 164,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "radio", id: "empty", name: "balanceOption", checked: balanceOption.type === "empty", onChange: () => setBalanceOption({
          type: "empty",
          targetAccount: nodes[0]?.name
        }), className: "mr-2" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "empty", children: "Vaciar una cuenta y repartir entre las dem\xE1s" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 175,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 170,
        columnNumber: 9
      }, this),
      balanceOption.type === "empty" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { value: balanceOption.targetAccount, onChange: (e) => setBalanceOption({
        ...balanceOption,
        targetAccount: e.target.value
      }), className: "border p-2 mb-4", children: nodes.map((node) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: node.name, children: node.name }, node.id, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 181,
        columnNumber: 32
      }, this)) }, void 0, false, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 177,
        columnNumber: 44
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 162,
      columnNumber: 7
    }, this),
    nodes.length > 1 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: optimizeTransactions, className: "bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105", children: "Optimizar Transacciones" }, void 0, false, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 186,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 185,
      columnNumber: 28
    }, this),
    optimizedTransactions.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Plan de Transferencias Optimizado" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4", children: [
          "Hemos analizado tus ",
          nodes.length,
          " cuentas en ",
          new Set(nodes.map((n) => n.currency)).size,
          " monedas diferentes para crear un plan eficiente de transferencias:"
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 194,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
            "En lugar de hacer ",
            nodes.length * (nodes.length - 1) / 2,
            " transferencias individuales, te sugerimos hacer solo ",
            optimizedTransactions.length,
            "."
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 199,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
            "El monto total involucrado en estas transferencias es de ",
            optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2),
            " USD."
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 200,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Este plan reduce la complejidad y potencialmente las comisiones bancarias al minimizar el n\xFAmero de transacciones." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 201,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 198,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4", children: "Beneficios de este plan:" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 203,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Simplificaci\xF3n: Reduces el n\xFAmero de transferencias que necesitas gestionar." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 207,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Potencial ahorro en comisiones: Menos transferencias podr\xEDan significar menos comisiones bancarias totales." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 208,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Eficiencia: Este plan conecta todas tus cuentas de la manera m\xE1s eficiente posible." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 209,
            columnNumber: 15
          }, this),
          nodes.some((n) => n.currency !== "USD") && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Manejo de m\xFAltiples divisas: El plan considera las diferentes monedas involucradas." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 210,
            columnNumber: 57
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 206,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4", children: "Plan de transferencias sugerido:" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 212,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { className: "w-full", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "bg-gray-100", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-left", children: "Desde" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 218,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-left", children: "Hacia" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 219,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-right", children: "Monto a Transferir" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 220,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 217,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 216,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: optimizedTransactions.map((transaction, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "border-b", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "p-2", children: transaction.from }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 225,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "p-2", children: transaction.to }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 226,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "p-2 text-right text-blue-600 font-semibold", children: [
              transaction.weight.toFixed(2),
              " USD"
            ] }, void 0, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 227,
              columnNumber: 21
            }, this)
          ] }, index, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 224,
            columnNumber: 68
          }, this)) }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 223,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 215,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Explicaci\xF3n:" }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 234,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5 mt-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Desde y Hacia:" }, void 0, false, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 236,
                columnNumber: 21
              }, this),
              " Indican las cuentas entre las que se sugiere realizar la transferencia."
            ] }, void 0, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 236,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Monto a Transferir:" }, void 0, false, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 237,
                columnNumber: 21
              }, this),
              ' Es la cantidad sugerida para transferir de la cuenta "Desde" a la cuenta "Hacia".'
            ] }, void 0, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 237,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 235,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 233,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mt-4", children: "Nota: Este plan sugiere las transferencias \xF3ptimas para conectar todas tus cuentas." }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 240,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 192,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow-md rounded-lg p-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Resultados y Beneficios" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 246,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4", children: "Despu\xE9s de aplicar el plan de transferencias optimizado, estos son los resultados y beneficios esperados:" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 247,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
            "N\xFAmero de transacciones reducidas: de ",
            nodes.length * (nodes.length - 1) / 2,
            " a ",
            optimizedTransactions.length
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 251,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
            "Monto total transferido: ",
            optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2),
            " USD"
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 252,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
            "Eficiencia de transferencia: ",
            (100 * optimizedTransactions.length / (nodes.length * (nodes.length - 1) / 2)).toFixed(2),
            "%"
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 253,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 250,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Nodos actualizados despu\xE9s de las transferencias:" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 256,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 255,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { className: "w-full mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "bg-gray-100", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-left", children: "Nombre" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 261,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-right", children: "Balance Original (USD)" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 262,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-right", children: "Balance Final Real (USD)" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 263,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-right", children: "Balance Equilibrado (USD)" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 264,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "p-2 text-right", children: "Diferencia" }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 265,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 260,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 259,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: updatedNodes.map((node, index) => {
            const originalNode = nodes.find((n) => n.id === node.id);
            const difference = (node.final_balance ?? node.balance) - (originalNode?.balance || 0);
            return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "border-b", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "p-2", children: node.name }, void 0, false, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 273,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "p-2 text-right", children: originalNode?.balance.toFixed(2) }, void 0, false, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 274,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "p-2 text-right", children: (node.final_balance ?? node.balance).toFixed(2) }, void 0, false, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 275,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "p-2 text-right", children: node.balance.toFixed(2) }, void 0, false, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 276,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: `p-2 text-right ${difference > 0 ? "text-green-600" : "text-red-600"}`, children: [
                difference > 0 ? "+" : "",
                difference.toFixed(2)
              ] }, void 0, true, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 277,
                columnNumber: 23
              }, this)
            ] }, node.id, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 272,
              columnNumber: 22
            }, this);
          }) }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 268,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 258,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "\xBFPor qu\xE9 optar por este plan?" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 285,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 284,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Minimiza el n\xFAmero de transacciones, reduciendo la complejidad operativa y los posibles errores." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 288,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Optimiza el flujo de dinero entre cuentas, mejorando la liquidez general." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 289,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Reduce potencialmente los costos de transacci\xF3n al minimizar el n\xFAmero de transferencias internacionales." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 290,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Proporciona una visi\xF3n clara y estructurada de las transferencias necesarias, facilitando la planificaci\xF3n financiera." }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 291,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 287,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 245,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-900 text-green-400 shadow-md rounded-lg p-6 mt-8 font-mono", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-semibold mb-4 text-white", children: "Consola de Algoritmo" }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 296,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4 text-yellow-300", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-semibold mb-2", children: "Uso del Algoritmo de Kruskal" }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 298,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "El algoritmo de Kruskal se utiliza para encontrar el \xC1rbol de Expansi\xF3n M\xEDnima (MST) en un grafo ponderado. En nuestro caso:" }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 299,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5 mt-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Cada cuenta es un nodo en el grafo." }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 301,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Las posibles transferencias entre cuentas son las aristas." }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 302,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "El peso de cada arista es la cantidad de dinero a transferir." }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 303,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 300,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2", children: "El algoritmo de Kruskal nos ayuda a:" }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 305,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5 mt-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Minimizar el n\xFAmero total de transferencias necesarias." }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 307,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Encontrar la ruta m\xE1s eficiente para mover el dinero entre todas las cuentas." }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 308,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Reducir los costos potenciales asociados con m\xFAltiples transferencias." }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 309,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 306,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 297,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-96 overflow-y-auto bg-black p-4 rounded-lg", children: algorithmLogs.map((log, index) => {
          let logClass = "mb-1";
          let prefix = ">";
          if (log.includes("Iniciando")) {
            logClass += " text-yellow-300 font-bold";
            prefix = "\u{1F680}";
          } else if (log.includes("Opci\xF3n de balance")) {
            logClass += " text-blue-300";
            prefix = "\u2696\uFE0F";
          } else if (log.includes("Transferencias calculadas")) {
            logClass += " text-purple-300";
            prefix = "\u{1F4B1}";
          } else if (log.includes("Aristas")) {
            logClass += " text-cyan-300";
            prefix = "\u{1F517}";
          } else if (log.includes("A\xF1adida arista")) {
            logClass += " text-green-300";
            prefix = "\u2705";
          } else if (log.includes("descartada")) {
            logClass += " text-red-300";
            prefix = "\u274C";
          } else if (log.includes("Transferencia:")) {
            logClass += " text-orange-300";
            prefix = "\u{1F4B8}";
          } else if (log.includes("completado")) {
            logClass += " text-green-300 font-bold";
            prefix = "\u{1F3C1}";
          }
          return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: logClass, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mr-2", children: prefix }, void 0, false, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 342,
              columnNumber: 21
            }, this),
            log
          ] }, index, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 341,
            columnNumber: 20
          }, this);
        }) }, void 0, false, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 312,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 text-white", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-semibold mb-2", children: "Resumen del Proceso" }, void 0, false, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 348,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc pl-5", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
              "Nodos procesados: ",
              nodes.length
            ] }, void 0, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 350,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
              "Transferencias optimizadas: ",
              optimizedTransactions.length
            ] }, void 0, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 351,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
              "Monto total transferido: ",
              optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2),
              " USD"
            ] }, void 0, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 352,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
              "Eficiencia de transferencia: ",
              (100 * optimizedTransactions.length / (nodes.length * (nodes.length - 1) / 2)).toFixed(2),
              "%"
            ] }, void 0, true, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 353,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 349,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 347,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 295,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 191,
      columnNumber: 44
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/optimizacion-global.tsx",
    lineNumber: 118,
    columnNumber: 10
  }, this);
}
_s(OptimizacionGlobal, "eyyqqqohctVcoio2rpG5baWLvUg=", false, function() {
  return [useLoaderData, useFetcher];
});
_c = OptimizacionGlobal;
var _c;
$RefreshReg$(_c, "OptimizacionGlobal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  OptimizacionGlobal as default
};
//# sourceMappingURL=/build/routes/optimizacion-global-CFXTH2YY.js.map
