import {
  exportToExcel
} from "/build/_shared/chunk-VS4ZVN4Y.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
  useLoaderData,
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

// app/types/currencies.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\types\\currencies.ts"
  );
  import.meta.hot.lastModified = "1726800926435.5137";
}
var currencieslist = [
  { code: "USD", name: "US Dollar" },
  { code: "AED", name: "United Arab Emirates Dirham" },
  { code: "AFN", name: "Afghan Afghani" },
  { code: "ALL", name: "Albanian Lek" },
  { code: "AMD", name: "Armenian Dram" },
  { code: "ANG", name: "Netherlands Antillean Guilder" },
  { code: "AOA", name: "Angolan Kwanza" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "AWG", name: "Aruban Florin" },
  { code: "AZN", name: "Azerbaijani Manat" },
  { code: "BAM", name: "Bosnia and Herzegovina Convertible Mark" },
  { code: "BBD", name: "Barbadian Dollar" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "BGN", name: "Bulgarian Lev" },
  { code: "BHD", name: "Bahraini Dinar" },
  { code: "BIF", name: "Burundian Franc" },
  { code: "BMD", name: "Bermudian Dollar" },
  { code: "BND", name: "Brunei Dollar" },
  { code: "BOB", name: "Bolivian Boliviano" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "BSD", name: "Bahamian Dollar" },
  { code: "BTN", name: "Bhutanese Ngultrum" },
  { code: "BWP", name: "Botswana Pula" },
  { code: "BYN", name: "Belarusian Ruble" },
  { code: "BZD", name: "Belize Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CDF", name: "Congolese Franc" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "COP", name: "Colombian Peso" },
  { code: "CRC", name: "Costa Rican Col\xF3n" },
  { code: "CUP", name: "Cuban Peso" },
  { code: "CVE", name: "Cape Verdean Escudo" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "DJF", name: "Djiboutian Franc" },
  { code: "DKK", name: "Danish Krone" },
  { code: "DOP", name: "Dominican Peso" },
  { code: "DZD", name: "Algerian Dinar" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "ERN", name: "Eritrean Nakfa" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "EUR", name: "Euro" },
  { code: "FJD", name: "Fijian Dollar" },
  { code: "FKP", name: "Falkland Islands Pound" },
  { code: "FOK", name: "Faroese Kr\xF3na" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "GEL", name: "Georgian Lari" },
  { code: "GGP", name: "Guernsey Pound" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "GIP", name: "Gibraltar Pound" },
  { code: "GMD", name: "Gambian Dalasi" },
  { code: "GNF", name: "Guinean Franc" },
  { code: "GTQ", name: "Guatemalan Quetzal" },
  { code: "GYD", name: "Guyanese Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "HNL", name: "Honduran Lempira" },
  { code: "HRK", name: "Croatian Kuna" },
  { code: "HTG", name: "Haitian Gourde" },
  { code: "HUF", name: "Hungarian Forint" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "ILS", name: "Israeli New Shekel" },
  { code: "IMP", name: "Isle of Man Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "IQD", name: "Iraqi Dinar" },
  { code: "IRR", name: "Iranian Rial" },
  { code: "ISK", name: "Icelandic Kr\xF3na" },
  { code: "JEP", name: "Jersey Pound" },
  { code: "JMD", name: "Jamaican Dollar" },
  { code: "JOD", name: "Jordanian Dinar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "KGS", name: "Kyrgystani Som" },
  { code: "KHR", name: "Cambodian Riel" },
  { code: "KID", name: "Kiribati Dollar" },
  { code: "KMF", name: "Comorian Franc" },
  { code: "KRW", name: "South Korean Won" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "KYD", name: "Cayman Islands Dollar" },
  { code: "KZT", name: "Kazakhstani Tenge" },
  { code: "LAK", name: "Laotian Kip" },
  { code: "LBP", name: "Lebanese Pound" },
  { code: "LKR", name: "Sri Lankan Rupee" },
  { code: "LRD", name: "Liberian Dollar" },
  { code: "LSL", name: "Lesotho Loti" },
  { code: "LYD", name: "Libyan Dinar" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "MDL", name: "Moldovan Leu" },
  { code: "MGA", name: "Malagasy Ariary" },
  { code: "MKD", name: "Macedonian Denar" },
  { code: "MMK", name: "Myanma Kyat" },
  { code: "MNT", name: "Mongolian Tugrik" },
  { code: "MOP", name: "Macanese Pataca" },
  { code: "MRU", name: "Mauritanian Ouguiya" },
  { code: "MUR", name: "Mauritian Rupee" },
  { code: "MVR", name: "Maldivian Rufiyaa" },
  { code: "MWK", name: "Malawian Kwacha" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "MZN", name: "Mozambican Metical" },
  { code: "NAD", name: "Namibian Dollar" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "NIO", name: "Nicaraguan C\xF3rdoba" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NPR", name: "Nepalese Rupee" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "OMR", name: "Omani Rial" },
  { code: "PAB", name: "Panamanian Balboa" },
  { code: "PEN", name: "Peruvian Nuevo Sol" },
  { code: "PGK", name: "Papua New Guinean Kina" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "PLN", name: "Polish Zloty" },
  { code: "PYG", name: "Paraguayan Guarani" },
  { code: "QAR", name: "Qatari Rial" },
  { code: "RON", name: "Romanian Leu" },
  { code: "RSD", name: "Serbian Dinar" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "SBD", name: "Solomon Islands Dollar" },
  { code: "SCR", name: "Seychellois Rupee" },
  { code: "SDG", name: "Sudanese Pound" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "SHP", name: "Saint Helena Pound" },
  { code: "SLE", name: "Sierra Leonean Leone" },
  { code: "SLL", name: "Sierra Leonean Leone" },
  { code: "SOS", name: "Somali Shilling" },
  { code: "SRD", name: "Surinamese Dollar" },
  { code: "SSP", name: "South Sudanese Pound" },
  { code: "STN", name: "S\xE3o Tom\xE9 and Pr\xEDncipe Dobra" },
  { code: "SYP", name: "Syrian Pound" },
  { code: "SZL", name: "Swazi Lilangeni" },
  { code: "THB", name: "Thai Baht" },
  { code: "TJS", name: "Tajikistani Somoni" },
  { code: "TMT", name: "Turkmenistani Manat" },
  { code: "TND", name: "Tunisian Dinar" },
  { code: "TOP", name: "Tongan Pa\u02BBanga" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "TTD", name: "Trinidad and Tobago Dollar" },
  { code: "TVD", name: "Tuvaluan Dollar" },
  { code: "TWD", name: "New Taiwan Dollar" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "UAH", name: "Ukrainian Hryvnia" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "UYU", name: "Uruguayan Peso" },
  { code: "UZS", name: "Uzbekistani Som" },
  { code: "VES", name: "Venezuelan Bol\xEDvar Soberano" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "VUV", name: "Vanuatu Vatu" },
  { code: "WST", name: "Samoan Tala" },
  { code: "XAF", name: "Central African CFA Franc" },
  { code: "XCD", name: "East Caribbean Dollar" },
  { code: "XDR", name: "Special Drawing Rights" },
  { code: "XOF", name: "West African CFA Franc" },
  { code: "XPF", name: "CFP Franc" },
  { code: "YER", name: "Yemeni Rial" },
  { code: "ZAR", name: "South African Rand" },
  { code: "ZMW", name: "Zambian Kwacha" },
  { code: "ZWL", name: "Zimbabwean Dollar" }
];

// app/routes/optimizacion-divisas.tsx
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
  import.meta.hot.lastModified = "1726811196309.6792";
}
function OptimizacionDivisas() {
  _s();
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const submit = useSubmit();
  const [currencies] = (0, import_react.useState)(currencieslist);
  const [transactions, setTransactions] = (0, import_react.useState)([]);
  const [currentTransaction, setCurrentTransaction] = (0, import_react.useState)({});
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (loaderData.error) {
      setError(loaderData.error);
    } else {
      setError(null);
    }
  }, [loaderData]);
  (0, import_react.useEffect)(() => {
    if (actionData?.error) {
      setError(actionData.error);
    } else if (actionData?.result) {
      setError(null);
    }
  }, [actionData]);
  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setCurrentTransaction((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (currentTransaction.from && currentTransaction.to && currentTransaction.amount && currentTransaction.name) {
      setTransactions((prev) => [...prev, currentTransaction]);
      setCurrentTransaction({});
    }
  };
  const handleCalculateOptimalRoutes = () => {
    if (transactions.length > 0) {
      submit({
        transactions: JSON.stringify(transactions)
      }, {
        method: "post"
      });
    } else {
      setError("Please add at least one transaction before calculating optimal routes.");
    }
  };
  const handleExport = () => {
    if (actionData?.result) {
      exportToExcel(actionData.result, "Optimizacion_Divisas");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-4 max-w-4xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold mb-8 text-center text-blue-600", children: "Optimizaci\xF3n de Rutas de Conversi\xF3n de Divisas" }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 135,
      columnNumber: 7
    }, this),
    error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4", role: "alert", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { className: "font-bold", children: "Error:" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 138,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block sm:inline", children: [
        " ",
        error
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 139,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 137,
      columnNumber: 17
    }, this),
    (loaderData.fromApi || actionData?.fromApi) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4", role: "alert", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block sm:inline", children: "Tasas de cambio obtenidas exitosamente de la API." }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 143,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 142,
      columnNumber: 55
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: handleAddTransaction, className: "space-y-4 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "from", value: currentTransaction.from || "", onChange: handleInputChange, className: "p-2 border rounded", required: true, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Desde" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 149,
            columnNumber: 13
          }, this),
          currencies.map((currency) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: currency.code, children: [
            currency.code,
            " - ",
            currency.name
          ] }, currency.code, true, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 150,
            columnNumber: 41
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 148,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "to", value: currentTransaction.to || "", onChange: handleInputChange, className: "p-2 border rounded", required: true, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Hasta" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 153,
            columnNumber: 13
          }, this),
          currencies.map((currency) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: currency.code, children: [
            currency.code,
            " - ",
            currency.name
          ] }, currency.code, true, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 154,
            columnNumber: 41
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 152,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 147,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "amount", value: currentTransaction.amount || "", onChange: handleInputChange, placeholder: "Monto", className: "p-2 border rounded w-full", required: true }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 157,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "name", value: currentTransaction.name || "", onChange: handleInputChange, placeholder: "Nombre de la transacci\xF3n", className: "p-2 border rounded w-full", required: true }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 158,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: "Agregar Transacci\xF3n" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 159,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 146,
      columnNumber: 7
    }, this),
    transactions.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-bold mb-4", children: "Transacciones Agregadas" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 165,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { children: transactions.map((t, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
        t.name,
        ": ",
        t.amount,
        " ",
        t.from,
        " a ",
        t.to
      ] }, index, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 167,
        columnNumber: 45
      }, this)) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 166,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 164,
      columnNumber: 35
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleCalculateOptimalRoutes, className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition mb-8", children: "Calcular Rutas \xD3ptimas" }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 171,
      columnNumber: 7
    }, this),
    actionData?.result && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-bold mb-4", children: "Resultados" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 176,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { children: actionData.result.map((r, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
        r.from,
        " a ",
        r.to,
        ": Tasa = ",
        r.rate.toFixed(4),
        ", Ruta: ",
        r.path.join(" -> ")
      ] }, index, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 178,
        columnNumber: 50
      }, this)) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 177,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleExport, className: "mt-4 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition", children: "Exportar a Excel" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 180,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 175,
      columnNumber: 30
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 134,
    columnNumber: 10
  }, this);
}
_s(OptimizacionDivisas, "jdBjhyJ0OrnuKl445l2rv25UBSM=", false, function() {
  return [useActionData, useLoaderData, useSubmit];
});
_c = OptimizacionDivisas;
var _c;
$RefreshReg$(_c, "OptimizacionDivisas");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  OptimizacionDivisas as default
};
//# sourceMappingURL=/build/routes/optimizacion-divisas-YKSZT3HY.js.map
