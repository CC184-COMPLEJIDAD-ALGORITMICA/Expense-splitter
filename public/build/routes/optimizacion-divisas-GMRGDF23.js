import {
  exportToExcel
} from "/build/_shared/chunk-FUJQJE3X.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
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
  import.meta.hot.lastModified = "1726795676055.0488";
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
  import.meta.hot.lastModified = "1726797788719.1323";
}
function OptimizacionDivisas() {
  _s();
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const submit = useSubmit();
  const [currencies, setCurrencies] = (0, import_react.useState)(currencieslist);
  const [exchangeRates, setExchangeRates] = (0, import_react.useState)([]);
  const [showTutorial, setShowTutorial] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    const initialRates = currencies.map((currency) => ({
      from: "USD",
      to: currency.code,
      rate: currency.code === "USD" ? 1 : 0
    }));
    setExchangeRates(initialRates);
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    submit({
      exchangeRates: JSON.stringify(exchangeRates)
    }, {
      method: "post"
    });
  };
  const handleExchangeRateChange = (index, value) => {
    const newRates = [...exchangeRates];
    newRates[index].rate = parseFloat(value);
    setExchangeRates(newRates);
  };
  const handleExport = () => {
    if (actionData?.result) {
      exportToExcel(actionData.result, "Optimizacion_Divisas");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold mb-4", children: "Optimizaci\xF3n de Rutas de Conversi\xF3n de Divisas" }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 81,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mb-4", children: [
      "Valor actual del d\xF3lar: ",
      loaderData.dollarValue
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 82,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowTutorial(!showTutorial), className: "mb-4 p-2 bg-blue-500 text-white rounded", children: showTutorial ? "Ocultar Tutorial" : "Mostrar Tutorial" }, void 0, false, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 84,
      columnNumber: 7
    }, this),
    showTutorial && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6 p-4 bg-gray-100 rounded", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold mb-2", children: "Tutorial y Ejemplos" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 89,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "El algoritmo de Floyd-Warshall se utiliza para encontrar las rutas m\xE1s eficientes de conversi\xF3n entre divisas. Esto es \xFAtil en varios escenarios reales:" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 90,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc list-inside mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Comercio internacional: Optimizar costos de conversi\xF3n en transacciones multinacionales." }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 92,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Arbitraje de divisas: Identificar oportunidades de beneficio en el mercado FOREX." }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 93,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Gesti\xF3n de tesorer\xEDa: Minimizar p\xE9rdidas en conversiones para empresas multinacionales." }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 94,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 91,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "El algoritmo funciona construyendo una matriz de todas las posibles conversiones y encontrando el camino m\xE1s corto (o en este caso, la conversi\xF3n m\xE1s favorable) entre cada par de divisas." }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Es ideal porque:" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "list-disc list-inside", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Considera todas las posibles rutas de conversi\xF3n indirectas." }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 99,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Tiene una complejidad de O(n\xB3), eficiente para un n\xFAmero moderado de divisas." }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 100,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Proporciona resultados para todas las parejas de divisas en una sola ejecuci\xF3n." }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 101,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 98,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 88,
      columnNumber: 24
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", onSubmit: handleSubmit, children: [
      exchangeRates.map((rate, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mr-2", children: [
          rate.from,
          " a ",
          rate.to,
          ":"
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 107,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", step: "0.0001", value: rate.rate, onChange: (e) => handleExchangeRateChange(index, e.target.value), className: "p-1 border rounded" }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 108,
          columnNumber: 13
        }, this)
      ] }, index, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 106,
        columnNumber: 45
      }, this)),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "mt-4 p-2 bg-green-500 text-white rounded", children: "Calcular Rutas \xD3ptimas" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 110,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 105,
      columnNumber: 7
    }, this),
    actionData?.result && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold mb-2", children: "Resultados" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 116,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { className: "min-w-full bg-white", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-2", children: "Desde" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 121,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-2", children: "Hasta" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 122,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-2", children: "Tasa" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 123,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-4 py-2", children: "Ruta" }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 124,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 120,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 119,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: actionData.result.map((item, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: index % 2 === 0 ? "bg-gray-100" : "", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "border px-4 py-2", children: item.from }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 129,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "border px-4 py-2", children: item.to }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 130,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "border px-4 py-2", children: item.rate.toFixed(4) }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 131,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "border px-4 py-2", children: item.path.join(" \u2192 ") }, void 0, false, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 132,
            columnNumber: 21
          }, this)
        ] }, index, true, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 128,
          columnNumber: 57
        }, this)) }, void 0, false, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 127,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 118,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleExport, className: "mt-4 p-2 bg-yellow-500 text-white rounded", children: "Exportar a Excel" }, void 0, false, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 137,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 115,
      columnNumber: 30
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 80,
    columnNumber: 10
  }, this);
}
_s(OptimizacionDivisas, "1+CcnKULLIfALK1xzI/aLjHYNVs=", false, function() {
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
//# sourceMappingURL=/build/routes/optimizacion-divisas-GMRGDF23.js.map
