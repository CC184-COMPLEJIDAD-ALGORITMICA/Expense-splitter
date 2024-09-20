import {
  exportToExcel
} from "/build/_shared/chunk-QGBU2JQV.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  useActionData,
  useNavigation,
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

// app/routes/optimizacion-divisas.tsx
var import_react = __toESM(require_react(), 1);
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\optimizacion-divisas.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\optimizacion-divisas.tsx"
  );
  import.meta.hot.lastModified = "1726823580437.1206";
}
function OptimizacionDivisas() {
  _s();
  const [amount, setAmount] = (0, import_react.useState)(1e3);
  const [currency, setCurrency] = (0, import_react.useState)("USD");
  const [exchangeHouses, setExchangeHouses] = (0, import_react.useState)([]);
  const [maxSteps, setMaxSteps] = (0, import_react.useState)(5);
  const [allowRepetitions, setAllowRepetitions] = (0, import_react.useState)(false);
  const actionData = useActionData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("amount", amount.toString());
    formData.append("currency", currency);
    formData.append("exchangeHouses", JSON.stringify(exchangeHouses));
    formData.append("maxSteps", maxSteps.toString());
    formData.append("allowRepetitions", allowRepetitions.toString());
    submit(formData, {
      method: "post"
    });
  };
  const addExchangeHouse = () => {
    setExchangeHouses([...exchangeHouses, {
      name: "",
      exchanges: []
    }]);
  };
  const updateExchangeHouse = (index, house) => {
    const newHouses = [...exchangeHouses];
    newHouses[index] = house;
    setExchangeHouses(newHouses);
  };
  const handleExportToExcel = () => {
    if (actionData?.result) {
      const data = [{
        Step: "Initial",
        Amount: actionData.result.initialAmount,
        Currency: currency
      }, ...actionData.result.path.map((step, index) => ({
        Step: index + 1,
        Amount: step.toAmount,
        Currency: step.to,
        ExchangeHouse: step.exchangeHouse,
        Rate: step.rate,
        Operation: step.isBuy ? "Compra" : "Venta"
      })), {
        Step: "Final",
        Amount: actionData.result.finalAmountInUSD,
        Currency: actionData.result.path[actionData.result.path.length - 1].to
      }];
      exportToExcel(data, "OptimalConversionPath");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-4 max-w-4xl bg-gray-100 rounded-lg shadow-lg", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold mb-6 text-center text-blue-600", children: "Optimizaci\xF3n de Conversi\xF3n de Divisas" }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 82,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { onSubmit: handleSubmit, className: "mb-8 space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "amount", className: "block text-sm font-medium text-gray-700 mb-2", children: "Cantidad inicial:" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 87,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", id: "amount", value: amount, onChange: (e) => setAmount(Number(e.target.value)), className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 88,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-gray-500", children: "Ingrese la cantidad de dinero con la que desea iniciar la operaci\xF3n." }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 89,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 86,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "currency", className: "block text-sm font-medium text-gray-700 mb-2", children: "Moneda inicial:" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 92,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", id: "currency", value: currency, onChange: (e) => setCurrency(e.target.value), className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 93,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-gray-500", children: "Ingrese el c\xF3digo de la moneda inicial (ej. USD, EUR, PEN)." }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 94,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 91,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 85,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-4 rounded-lg shadow", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "maxSteps", className: "block text-sm font-medium text-gray-700 mb-2", children: "M\xE1ximo de pasos:" }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 98,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", id: "maxSteps", value: maxSteps, onChange: (e) => setMaxSteps(Number(e.target.value)), className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-gray-500", children: "N\xFAmero m\xE1ximo de conversiones permitidas en la ruta." }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 100,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 97,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-4 rounded-lg shadow", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold mb-4 text-blue-600", children: "Casas de Cambio" }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 103,
          columnNumber: 11
        }, this),
        exchangeHouses.map((house, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExchangeHouseInput, { house, onChange: (updatedHouse) => updateExchangeHouse(index, updatedHouse) }, index, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 104,
          columnNumber: 49
        }, this)),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: addExchangeHouse, className: "mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300", children: "Agregar Casa de Cambio" }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 105,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 102,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", id: "allowRepetitions", checked: allowRepetitions, onChange: (e) => setAllowRepetitions(e.target.checked), className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 110,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "allowRepetitions", className: "ml-2 block text-sm text-gray-900", children: "Permitir repeticiones de monedas en la ruta" }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 111,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 109,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300", children: "Calcular ruta \xF3ptima" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 115,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this),
    actionData?.result && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 bg-white p-6 rounded-lg shadow", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-bold mb-4 text-blue-600", children: "Resultado \xD3ptimo" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 121,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg", children: [
        "Ganancia: ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `font-bold ${actionData.result.profit >= 0 ? "text-green-600" : "text-red-600"}`, children: [
          "$",
          actionData.result.profit.toFixed(2),
          " USD"
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 122,
          columnNumber: 44
        }, this),
        " (",
        actionData.result.profitPercentage.toFixed(2),
        "%)"
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 122,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg", children: [
        "Cantidad inicial: $",
        actionData.result.initialAmount.toFixed(2),
        " ",
        currency
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 123,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg", children: [
        "Cantidad final: $",
        actionData.result.finalAmountInUSD.toFixed(2),
        " USD"
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 124,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-bold mt-6 mb-2 text-blue-600", children: "Pasos:" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 125,
        columnNumber: 11
      }, this),
      actionData.result.path.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", { className: "list-decimal list-inside space-y-2", children: actionData.result.path.map((step, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "bg-gray-100 p-2 rounded", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-bold", children: [
          step.exchangeHouse,
          ":"
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 128,
          columnNumber: 19
        }, this),
        " ",
        step.fromAmount.toFixed(2),
        " ",
        step.from,
        " \u2192 ",
        step.toAmount.toFixed(2),
        " ",
        step.to,
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-600 ml-2", children: [
          "(",
          step.isBuy ? "Compra" : "Venta",
          ", Tasa: ",
          step.rate.toFixed(4),
          ")"
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 129,
          columnNumber: 19
        }, this)
      ] }, index, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 127,
        columnNumber: 60
      }, this)) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 126,
        columnNumber: 48
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-red-500", children: "No se encontr\xF3 una ruta de conversi\xF3n v\xE1lida." }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 131,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-bold mt-6 mb-2 text-blue-600", children: "Otras rutas posibles:" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 132,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc list-inside space-y-1", children: actionData.result.allPaths.slice(0, 5).map((path, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: path.profit !== null && path.profitPercentage !== null ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
        "Ganancia: $",
        path.profit.toFixed(2),
        " USD (",
        path.profitPercentage.toFixed(2),
        "%)"
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 135,
        columnNumber: 75
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
        "No hay conversi\xF3n disponible para ",
        path.currency
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 135,
        columnNumber: 160
      }, this) }, index, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 134,
        columnNumber: 74
      }, this)) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 133,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleExportToExcel, className: "mt-6 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300", children: "Exportar a Excel" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 138,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 120,
      columnNumber: 30
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 81,
    columnNumber: 10
  }, this);
}
_s(OptimizacionDivisas, "bPfwxGCUSdi2MxA2X0DFUvp3jw8=", false, function() {
  return [useActionData, useNavigation, useSubmit];
});
_c = OptimizacionDivisas;
function ExchangeHouseInput({
  house,
  onChange
}) {
  const addExchange = () => {
    onChange({
      ...house,
      exchanges: [...house.exchanges, {
        fromCurrency: "",
        toCurrency: "",
        buyRate: 0,
        sellRate: 0
      }]
    });
  };
  const updateExchange = (index, exchange) => {
    const newExchanges = [...house.exchanges];
    newExchanges[index] = exchange;
    onChange({
      ...house,
      exchanges: newExchanges
    });
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border p-4 rounded mb-4 bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", value: house.name, onChange: (e) => onChange({
      ...house,
      name: e.target.value
    }), placeholder: "Nombre de la casa de cambio", className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2" }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 172,
      columnNumber: 7
    }, this),
    house.exchanges.map((exchange, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap -mx-2 mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", value: exchange.fromCurrency, onChange: (e) => updateExchange(index, {
        ...exchange,
        fromCurrency: e.target.value
      }), placeholder: "De", className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 178,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 177,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", value: exchange.toCurrency, onChange: (e) => updateExchange(index, {
        ...exchange,
        toCurrency: e.target.value
      }), placeholder: "A", className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 184,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 183,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", value: exchange.buyRate || "", onChange: (e) => updateExchange(index, {
        ...exchange,
        buyRate: Number(e.target.value)
      }), placeholder: "Tasa de compra", className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 190,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 189,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", value: exchange.sellRate || "", onChange: (e) => updateExchange(index, {
        ...exchange,
        sellRate: Number(e.target.value)
      }), placeholder: "Tasa de venta", className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 196,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 195,
        columnNumber: 11
      }, this)
    ] }, index, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 176,
      columnNumber: 49
    }, this)),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: addExchange, className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300", children: "Agregar Cambio" }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 202,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 171,
    columnNumber: 10
  }, this);
}
_c2 = ExchangeHouseInput;
var _c;
var _c2;
$RefreshReg$(_c, "OptimizacionDivisas");
$RefreshReg$(_c2, "ExchangeHouseInput");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  OptimizacionDivisas as default
};
//# sourceMappingURL=/build/routes/optimizacion-divisas-PUUZ4EBK.js.map
