import {
  exportToExcel
} from "/build/_shared/chunk-QGBU2JQV.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  useActionData,
  useSubmit
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
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/minimizacion-transacciones.tsx
var import_react = __toESM(require_react(), 1);
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\minimizacion-transacciones.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\minimizacion-transacciones.tsx"
  );
  import.meta.hot.lastModified = "1726800926434.5134";
}
function MinimizacionTransacciones() {
  _s();
  const actionData = useActionData();
  const submit = useSubmit();
  const [accounts, setAccounts] = (0, import_react.useState)([{
    name: "",
    balance: 0
  }]);
  const handleSubmit = (event) => {
    event.preventDefault();
    submit({
      accounts: JSON.stringify(accounts)
    }, {
      method: "post"
    });
  };
  const handleAddAccount = () => {
    setAccounts([...accounts, {
      name: "",
      balance: 0
    }]);
  };
  const handleAccountChange = (index, field, value) => {
    const newAccounts = [...accounts];
    newAccounts[index] = {
      ...newAccounts[index],
      [field]: field === "balance" ? parseFloat(value) : value
    };
    setAccounts(newAccounts);
  };
  const handleExport = () => {
    if (actionData?.result) {
      exportToExcel(actionData.result, "Minimizacion_Transacciones");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold mb-4", children: "Minimizaci\xF3n de Costos de Transacciones Bancarias" }, void 0, false, {
      fileName: "app/routes/minimizacion-transacciones.tsx",
      lineNumber: 73,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", onSubmit: handleSubmit, children: [
      accounts.map((account, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", placeholder: "Nombre de la cuenta", value: account.name, onChange: (e) => handleAccountChange(index, "name", e.target.value), className: "mr-2 p-2 border rounded" }, void 0, false, {
          fileName: "app/routes/minimizacion-transacciones.tsx",
          lineNumber: 76,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", placeholder: "Balance", value: account.balance, onChange: (e) => handleAccountChange(index, "balance", e.target.value), className: "p-2 border rounded" }, void 0, false, {
          fileName: "app/routes/minimizacion-transacciones.tsx",
          lineNumber: 77,
          columnNumber: 13
        }, this)
      ] }, index, true, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 75,
        columnNumber: 43
      }, this)),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: handleAddAccount, className: "mb-4 p-2 bg-blue-500 text-white rounded", children: "Agregar Cuenta" }, void 0, false, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 79,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "p-2 bg-green-500 text-white rounded", children: "Calcular" }, void 0, false, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 82,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/minimizacion-transacciones.tsx",
      lineNumber: 74,
      columnNumber: 7
    }, this),
    actionData?.result && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold mb-2", children: "Resultados" }, void 0, false, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 87,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pre", { children: JSON.stringify(actionData.result, null, 2) }, void 0, false, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 88,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleExport, className: "mt-2 p-2 bg-yellow-500 text-white rounded", children: "Exportar a Excel" }, void 0, false, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 89,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/minimizacion-transacciones.tsx",
      lineNumber: 86,
      columnNumber: 30
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/minimizacion-transacciones.tsx",
    lineNumber: 72,
    columnNumber: 10
  }, this);
}
_s(MinimizacionTransacciones, "z7cil0QRC/f2FFcX9ZYyouVXuWI=", false, function() {
  return [useActionData, useSubmit];
});
_c = MinimizacionTransacciones;
var _c;
$RefreshReg$(_c, "MinimizacionTransacciones");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  MinimizacionTransacciones as default
};
//# sourceMappingURL=/build/routes/minimizacion-transacciones-5V32LAUF.js.map
