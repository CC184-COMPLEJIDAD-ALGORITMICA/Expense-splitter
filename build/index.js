var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsxDEV } from "react/jsx-dev-runtime";
var __filename = fileURLToPath(import.meta.url), __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../.env") });
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve3, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 62,
          columnNumber: 7
        },
        this
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve3(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve3, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 112,
          columnNumber: 7
        },
        this
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve3(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-ALTTEKCZ.css";

// app/auth.server.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

// app/db.server.ts
import { PrismaClient } from "@prisma/client";
import { config as config2 } from "dotenv";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname as dirname2, resolve as resolve2 } from "path";
var __filename2 = fileURLToPath2(import.meta.url), __dirname2 = dirname2(__filename2);
config2({ path: resolve2(__dirname2, "../.env") });
console.log("DATABASE_URL in db.server.ts:", process.env.DATABASE_URL);
var db;
console.log("Initializing database connection");
global.__db ? console.log("Development mode: Reusing existing PrismaClient") : (console.log("Development mode: Creating new PrismaClient"), global.__db = new PrismaClient()), db = global.__db;
try {
  console.log("Attempting to connect to the database"), db.$connect(), console.log("Database connected successfully"), console.log("Available models:", Object.keys(db));
} catch (error) {
  console.error("Failed to connect to the database:", error);
}

// app/auth.server.ts
async function register({ username, password }) {
  let passwordHash = await bcrypt.hash(password, 10);
  return { id: (await db.user.create({
    data: { username, passwordHash }
  })).id, username };
}
async function login({ username, password }) {
  let user = await db.user.findUnique({
    where: { username }
  });
  return !user || !await bcrypt.compare(password, user.passwordHash) ? null : { id: user.id, username };
}
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set");
var storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: !1,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: !0
  }
});
async function createUserSession(userId, redirectTo, isNewUser = !1) {
  let session = await storage.getSession();
  return session.set("userId", userId), session.set("isNewUser", isNewUser), redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUserId(request) {
  let userId = (await getUserSession(request)).get("userId");
  return !userId || typeof userId != "string" ? null : userId;
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = (await getUserSession(request)).get("userId");
  if (!userId || typeof userId != "string") {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (typeof userId != "string")
    return null;
  try {
    let user = await db.user.findUnique({
      where: { id: userId },
      select: { id: !0, username: !0 }
    }), isNewUser = (await getUserSession(request)).get("isNewUser");
    return user ? { ...user, isNewUser } : null;
  } catch {
    throw logout(request);
  }
}
async function logout(request) {
  let session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

// app/components/Nav.tsx
import { Link } from "@remix-run/react";
import { Fragment, jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
function Nav({ user }) {
  return /* @__PURE__ */ jsxDEV2("nav", { className: "bg-gray-800 p-4", children: /* @__PURE__ */ jsxDEV2("div", { className: "container mx-auto flex justify-between items-center", children: [
    /* @__PURE__ */ jsxDEV2(Link, { to: "/", className: "text-white text-xl font-bold", children: "Expense Splitter" }, void 0, !1, {
      fileName: "app/components/Nav.tsx",
      lineNumber: 7,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV2("div", { children: user ? /* @__PURE__ */ jsxDEV2(Fragment, { children: [
      /* @__PURE__ */ jsxDEV2("span", { className: "text-white mr-4", children: [
        "Welcome, ",
        user.username,
        "!"
      ] }, void 0, !0, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 13,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV2(Link, { to: "/minimizacion-transacciones", className: "text-white mr-4", children: "Optimizaci\xF3n de Transferencias" }, void 0, !1, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 14,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV2(Link, { to: "/optimizacion-divisas", className: "text-white mr-4", children: "Optimizaci\xF3n de Divisas" }, void 0, !1, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 17,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Nav.tsx",
      lineNumber: 12,
      columnNumber: 13
    }, this) : /* @__PURE__ */ jsxDEV2(Fragment, { children: [
      /* @__PURE__ */ jsxDEV2(Link, { to: "/login", className: "text-white mr-4", children: "Login" }, void 0, !1, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 23,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV2(Link, { to: "/register", className: "text-white", children: "Register" }, void 0, !1, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 26,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Nav.tsx",
      lineNumber: 22,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/components/Nav.tsx",
      lineNumber: 10,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/Nav.tsx",
    lineNumber: 6,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/components/Nav.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/root.tsx
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
var links = () => [
  { rel: "stylesheet", href: tailwind_default }
], meta = () => [
  { charset: "utf-8" },
  { title: "Expense Splitter" },
  { name: "viewport", content: "width=device-width,initial-scale=1" }
], loader = async ({ request }) => {
  let user = await getUser(request);
  return json({ user });
};
function App() {
  let { user } = useLoaderData();
  return /* @__PURE__ */ jsxDEV3("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxDEV3("head", { children: [
      /* @__PURE__ */ jsxDEV3(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 36,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 37,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV3("body", { className: "h-full", children: [
      /* @__PURE__ */ jsxDEV3(Nav, { user }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3("main", { className: "container mx-auto p-4 mt-8", children: /* @__PURE__ */ jsxDEV3(Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 42,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 41,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 46,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}

// app/routes/minimizacion-transacciones.tsx
var minimizacion_transacciones_exports = {};
__export(minimizacion_transacciones_exports, {
  action: () => action,
  default: () => MinimizacionTransacciones
});
import { useState } from "react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { json as json2 } from "@remix-run/node";

// app/utils/primAlgorithm.ts
function primAlgorithm(accounts) {
  let transfers = [], n = accounts.length, visited = new Array(n).fill(!1), averageBalance = accounts.reduce((sum, account) => sum + account.balance, 0) / n;
  visited[0] = !0;
  for (let i = 0; i < n - 1; i++) {
    let minCost = 1 / 0, fromIndex = -1, toIndex = -1;
    for (let j = 0; j < n; j++)
      if (visited[j]) {
        for (let k = 0; k < n; k++)
          if (!visited[k]) {
            let amount = Math.min(
              Math.abs(accounts[j].balance - averageBalance),
              Math.abs(accounts[k].balance - averageBalance)
            );
            amount < minCost && (minCost = amount, fromIndex = j, toIndex = k);
          }
      }
    if (fromIndex !== -1 && toIndex !== -1) {
      let amount = minCost;
      transfers.push({
        from: accounts[fromIndex].name,
        to: accounts[toIndex].name,
        amount: Number(amount.toFixed(2))
      }), accounts[fromIndex].balance -= amount, accounts[toIndex].balance += amount, visited[toIndex] = !0;
    }
  }
  return transfers;
}

// app/utils/excelExport.ts
import * as XLSX from "xlsx";
function exportToExcel(data, fileName) {
  let ws = XLSX.utils.json_to_sheet(data), wb = XLSX.utils.book_new(), headerStyle = {
    font: { bold: !0, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F81BD" } }
  }, evenRowStyle = {
    fill: { fgColor: { rgb: "E9EDF1" } }
  }, oddRowStyle = {
    fill: { fgColor: { rgb: "D3DFEE" } }
  }, range = XLSX.utils.decode_range(ws["!ref"]);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let address = XLSX.utils.encode_col(C) + "1";
    ws[address] && (ws[address].s = headerStyle);
  }
  for (let R = range.s.r + 1; R <= range.e.r; ++R)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let address = XLSX.utils.encode_cell({ r: R, c: C });
      ws[address] && (ws[address].s = R % 2 === 0 ? evenRowStyle : oddRowStyle);
    }
  let colWidths = data.reduce((acc, row) => (Object.keys(row).forEach((key, i) => {
    let cellValue = row[key] ? row[key].toString() : "";
    acc[i] = Math.max(acc[i] || 0, cellValue.length);
  }), acc), {});
  ws["!cols"] = Object.keys(colWidths).map((i) => ({ wch: colWidths[i] })), XLSX.utils.book_append_sheet(wb, ws, "Optimal Conversion Path"), XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// app/routes/minimizacion-transacciones.tsx
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
var action = async ({ request }) => {
  let formData = await request.formData(), accounts = JSON.parse(formData.get("accounts")), result = primAlgorithm(accounts);
  return json2({ result });
};
function MinimizacionTransacciones() {
  let actionData = useActionData(), submit = useSubmit(), [accounts, setAccounts] = useState([{ name: "", balance: 0 }]), handleSubmit = (event) => {
    event.preventDefault(), submit({ accounts: JSON.stringify(accounts) }, { method: "post" });
  }, handleAddAccount = () => {
    setAccounts([...accounts, { name: "", balance: 0 }]);
  }, handleAccountChange = (index, field, value) => {
    let newAccounts = [...accounts];
    newAccounts[index] = {
      ...newAccounts[index],
      [field]: field === "balance" ? parseFloat(value) : value
    }, setAccounts(newAccounts);
  }, handleExport = () => {
    actionData?.result && exportToExcel(actionData.result, "Minimizacion_Transacciones");
  };
  return /* @__PURE__ */ jsxDEV4("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsxDEV4("h1", { className: "text-2xl font-bold mb-4", children: "Minimizaci\xF3n de Costos de Transacciones Bancarias" }, void 0, !1, {
      fileName: "app/routes/minimizacion-transacciones.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4(Form, { method: "post", onSubmit: handleSubmit, children: [
      accounts.map((account, index) => /* @__PURE__ */ jsxDEV4("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxDEV4(
          "input",
          {
            type: "text",
            placeholder: "Nombre de la cuenta",
            value: account.name,
            onChange: (e) => handleAccountChange(index, "name", e.target.value),
            className: "mr-2 p-2 border rounded"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/minimizacion-transacciones.tsx",
            lineNumber: 49,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV4(
          "input",
          {
            type: "number",
            placeholder: "Balance",
            value: account.balance,
            onChange: (e) => handleAccountChange(index, "balance", e.target.value),
            className: "p-2 border rounded"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/minimizacion-transacciones.tsx",
            lineNumber: 56,
            columnNumber: 13
          },
          this
        )
      ] }, index, !0, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 48,
        columnNumber: 11
      }, this)),
      /* @__PURE__ */ jsxDEV4("button", { type: "button", onClick: handleAddAccount, className: "mb-4 p-2 bg-blue-500 text-white rounded", children: "Agregar Cuenta" }, void 0, !1, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("button", { type: "submit", className: "p-2 bg-green-500 text-white rounded", children: "Calcular" }, void 0, !1, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 68,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/minimizacion-transacciones.tsx",
      lineNumber: 46,
      columnNumber: 7
    }, this),
    actionData?.result && /* @__PURE__ */ jsxDEV4("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxDEV4("h2", { className: "text-xl font-bold mb-2", children: "Resultados" }, void 0, !1, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 74,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("pre", { children: JSON.stringify(actionData.result, null, 2) }, void 0, !1, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 75,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("button", { onClick: handleExport, className: "mt-2 p-2 bg-yellow-500 text-white rounded", children: "Exportar a Excel" }, void 0, !1, {
        fileName: "app/routes/minimizacion-transacciones.tsx",
        lineNumber: 76,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/minimizacion-transacciones.tsx",
      lineNumber: 73,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/minimizacion-transacciones.tsx",
    lineNumber: 44,
    columnNumber: 5
  }, this);
}

// app/routes/optimizacion-divisas.tsx
var optimizacion_divisas_exports = {};
__export(optimizacion_divisas_exports, {
  action: () => action2,
  default: () => OptimizacionDivisas
});
import { useState as useState2 } from "react";
import { Form as Form2, useActionData as useActionData2, useNavigation, useSubmit as useSubmit2 } from "@remix-run/react";
import { json as json3 } from "@remix-run/node";

// app/types/currencyExchange.ts
function buildGraph(exchangeHouses) {
  let graph = {};
  return exchangeHouses.forEach((house) => {
    house.exchanges.forEach((exchange) => {
      graph[exchange.fromCurrency] || (graph[exchange.fromCurrency] = {}), graph[exchange.toCurrency] || (graph[exchange.toCurrency] = {}), graph[exchange.fromCurrency][exchange.toCurrency] = {
        rate: exchange.buyRate,
        exchangeHouse: house.name,
        isBuy: !0
      }, graph[exchange.toCurrency][exchange.fromCurrency] = {
        rate: 1 / exchange.sellRate,
        exchangeHouse: house.name,
        isBuy: !1
      };
    });
  }), graph;
}
function bellmanFord(graph, start, amount, maxSteps, allowRepetitions) {
  let distances = {}, predecessors = {}, exchangeHouses = {}, isBuy = {};
  Object.keys(graph).forEach((node) => {
    distances[node] = new Array(maxSteps + 1).fill(node === start ? amount : -1 / 0), predecessors[node] = new Array(maxSteps + 1).fill(null), exchangeHouses[node] = new Array(maxSteps + 1).fill(""), isBuy[node] = new Array(maxSteps + 1).fill(!1);
  });
  for (let step = 1; step <= maxSteps; step++) {
    let updated = !1;
    if (Object.keys(graph).forEach((from) => {
      Object.keys(graph[from]).forEach((to) => {
        let rate = graph[from][to].rate, newAmount = distances[from][step - 1] * rate;
        newAmount > distances[to][step] && (allowRepetitions || from !== predecessors[to][step - 1]) && (distances[to][step] = newAmount, predecessors[to][step] = from, exchangeHouses[to][step] = graph[from][to].exchangeHouse, isBuy[to][step] = graph[from][to].isBuy, updated = !0);
      });
    }), !updated)
      break;
  }
  let maxCurrency = Object.keys(distances).reduce((a, b) => distances[a][maxSteps] > distances[b][maxSteps] ? a : b), path = [], current = maxCurrency;
  for (let step = maxSteps; step > 0; step--) {
    let prev = predecessors[current][step];
    if (prev === null)
      break;
    path.unshift({
      exchangeHouse: exchangeHouses[current][step],
      from: prev,
      to: current,
      fromAmount: distances[prev][step - 1],
      toAmount: distances[current][step],
      rate: graph[prev][current].rate,
      isBuy: isBuy[current][step]
    }), current = prev;
  }
  let finalAmount = distances[maxCurrency][maxSteps], profit = finalAmount - amount, profitPercentage = profit / amount * 100, allPaths = Object.keys(distances).map((currency) => ({
    currency,
    profit: distances[currency][maxSteps] - amount,
    profitPercentage: (distances[currency][maxSteps] - amount) / amount * 100
  })).sort((a, b) => b.profit - a.profit);
  return {
    initialAmount: amount,
    finalAmountInUSD: finalAmount,
    // Assuming USD as the base currency
    profit,
    profitPercentage,
    path,
    allPaths
  };
}
function findBestConversionPath(amount, startCurrency, exchangeHouses, maxSteps, allowRepetitions) {
  let graph = buildGraph(exchangeHouses), result = bellmanFord(graph, startCurrency, amount, maxSteps, allowRepetitions);
  return result.path.length === 0 ? {
    initialAmount: amount,
    finalAmountInUSD: amount,
    profit: 0,
    profitPercentage: 0,
    path: [],
    allPaths: Object.keys(graph).map((currency) => ({
      currency,
      profit: currency === startCurrency ? 0 : null,
      profitPercentage: currency === startCurrency ? 0 : null
    }))
  } : result;
}

// app/routes/optimizacion-divisas.tsx
import { Fragment as Fragment2, jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
function OptimizacionDivisas() {
  let [amount, setAmount] = useState2(1e3), [currency, setCurrency] = useState2("USD"), [exchangeHouses, setExchangeHouses] = useState2([]), [maxSteps, setMaxSteps] = useState2(5), [allowRepetitions, setAllowRepetitions] = useState2(!1), actionData = useActionData2(), navigation = useNavigation(), submit = useSubmit2(), handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("amount", amount.toString()), formData.append("currency", currency), formData.append("exchangeHouses", JSON.stringify(exchangeHouses)), formData.append("maxSteps", maxSteps.toString()), formData.append("allowRepetitions", allowRepetitions.toString()), submit(formData, { method: "post" });
  }, addExchangeHouse = () => {
    setExchangeHouses([...exchangeHouses, { name: "", exchanges: [] }]);
  }, updateExchangeHouse = (index, house) => {
    let newHouses = [...exchangeHouses];
    newHouses[index] = house, setExchangeHouses(newHouses);
  }, handleExportToExcel = () => {
    if (actionData?.result) {
      let data = [
        { Step: "Initial", Amount: actionData.result.initialAmount, Currency: currency },
        ...actionData.result.path.map((step, index) => ({
          Step: index + 1,
          Amount: step.toAmount,
          Currency: step.to,
          ExchangeHouse: step.exchangeHouse,
          Rate: step.rate,
          Operation: step.isBuy ? "Compra" : "Venta"
        })),
        { Step: "Final", Amount: actionData.result.finalAmountInUSD, Currency: actionData.result.path[actionData.result.path.length - 1].to }
      ];
      exportToExcel(data, "OptimalConversionPath");
    }
  };
  return /* @__PURE__ */ jsxDEV5("div", { className: "container mx-auto p-4 max-w-4xl bg-gray-100 rounded-lg shadow-lg", children: [
    /* @__PURE__ */ jsxDEV5("h1", { className: "text-3xl font-bold mb-6 text-center text-blue-600", children: "Optimizaci\xF3n de Conversi\xF3n de Divisas" }, void 0, !1, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV5(Form2, { onSubmit: handleSubmit, className: "mb-8 space-y-6", children: [
      /* @__PURE__ */ jsxDEV5("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxDEV5("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsxDEV5("label", { htmlFor: "amount", className: "block text-sm font-medium text-gray-700 mb-2", children: "Cantidad inicial:" }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 65,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5(
            "input",
            {
              type: "number",
              id: "amount",
              value: amount,
              onChange: (e) => setAmount(Number(e.target.value)),
              className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/optimizacion-divisas.tsx",
              lineNumber: 66,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-sm text-gray-500", children: "Ingrese la cantidad de dinero con la que desea iniciar la operaci\xF3n." }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 73,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 64,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsxDEV5("label", { htmlFor: "currency", className: "block text-sm font-medium text-gray-700 mb-2", children: "Moneda inicial:" }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 76,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5(
            "input",
            {
              type: "text",
              id: "currency",
              value: currency,
              onChange: (e) => setCurrency(e.target.value),
              className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/optimizacion-divisas.tsx",
              lineNumber: 77,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-sm text-gray-500", children: "Ingrese el c\xF3digo de la moneda inicial (ej. USD, EUR, PEN)." }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 84,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 75,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "bg-white p-4 rounded-lg shadow", children: [
        /* @__PURE__ */ jsxDEV5("label", { htmlFor: "maxSteps", className: "block text-sm font-medium text-gray-700 mb-2", children: "M\xE1ximo de pasos:" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 88,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5(
          "input",
          {
            type: "number",
            id: "maxSteps",
            value: maxSteps,
            onChange: (e) => setMaxSteps(Number(e.target.value)),
            className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 89,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-sm text-gray-500", children: "N\xFAmero m\xE1ximo de conversiones permitidas en la ruta." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 96,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 87,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "bg-white p-4 rounded-lg shadow", children: [
        /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-bold mb-4 text-blue-600", children: "Casas de Cambio" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this),
        exchangeHouses.map((house, index) => /* @__PURE__ */ jsxDEV5(
          ExchangeHouseInput,
          {
            house,
            onChange: (updatedHouse) => updateExchangeHouse(index, updatedHouse)
          },
          index,
          !1,
          {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 101,
            columnNumber: 13
          },
          this
        )),
        /* @__PURE__ */ jsxDEV5("button", { type: "button", onClick: addExchangeHouse, className: "mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300", children: "Agregar Casa de Cambio" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 107,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 98,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxDEV5(
          "input",
          {
            type: "checkbox",
            id: "allowRepetitions",
            checked: allowRepetitions,
            onChange: (e) => setAllowRepetitions(e.target.checked),
            className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 112,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5("label", { htmlFor: "allowRepetitions", className: "ml-2 block text-sm text-gray-900", children: "Permitir repeticiones de monedas en la ruta" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 119,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("button", { type: "submit", className: "w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300", children: "Calcular ruta \xF3ptima" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 123,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, this),
    actionData?.result && /* @__PURE__ */ jsxDEV5("div", { className: "mt-8 bg-white p-6 rounded-lg shadow", children: [
      /* @__PURE__ */ jsxDEV5("h2", { className: "text-2xl font-bold mb-4 text-blue-600", children: "Resultado \xD3ptimo" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 130,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { className: "text-lg", children: [
        "Ganancia: ",
        /* @__PURE__ */ jsxDEV5("span", { className: `font-bold ${actionData.result.profit >= 0 ? "text-green-600" : "text-red-600"}`, children: [
          "$",
          actionData.result.profit.toFixed(2),
          " USD"
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 131,
          columnNumber: 44
        }, this),
        " (",
        actionData.result.profitPercentage.toFixed(2),
        "%)"
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 131,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { className: "text-lg", children: [
        "Cantidad inicial: $",
        actionData.result.initialAmount.toFixed(2),
        " ",
        currency
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 132,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { className: "text-lg", children: [
        "Cantidad final: $",
        actionData.result.finalAmountInUSD.toFixed(2),
        " USD"
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 133,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("h3", { className: "text-xl font-bold mt-6 mb-2 text-blue-600", children: "Pasos:" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 134,
        columnNumber: 11
      }, this),
      actionData.result.path.length > 0 ? /* @__PURE__ */ jsxDEV5("ol", { className: "list-decimal list-inside space-y-2", children: actionData.result.path.map((step, index) => /* @__PURE__ */ jsxDEV5("li", { className: "bg-gray-100 p-2 rounded", children: [
        /* @__PURE__ */ jsxDEV5("span", { className: "font-bold", children: [
          step.exchangeHouse,
          ":"
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 139,
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
        /* @__PURE__ */ jsxDEV5("span", { className: "text-sm text-gray-600 ml-2", children: [
          "(",
          step.isBuy ? "Compra" : "Venta",
          ", Tasa: ",
          step.rate.toFixed(4),
          ")"
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 140,
          columnNumber: 19
        }, this)
      ] }, index, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 138,
        columnNumber: 17
      }, this)) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 136,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV5("p", { className: "text-red-500", children: "No se encontr\xF3 una ruta de conversi\xF3n v\xE1lida." }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 145,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV5("h3", { className: "text-xl font-bold mt-6 mb-2 text-blue-600", children: "Otras rutas posibles:" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 147,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc list-inside space-y-1", children: actionData.result.allPaths.slice(0, 5).map((path, index) => /* @__PURE__ */ jsxDEV5("li", { children: path.profit !== null && path.profitPercentage !== null ? /* @__PURE__ */ jsxDEV5(Fragment2, { children: [
        "Ganancia: $",
        path.profit.toFixed(2),
        " USD (",
        path.profitPercentage.toFixed(2),
        "%)"
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 152,
        columnNumber: 19
      }, this) : /* @__PURE__ */ jsxDEV5(Fragment2, { children: [
        "No hay conversi\xF3n disponible para ",
        path.currency
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 154,
        columnNumber: 19
      }, this) }, index, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 150,
        columnNumber: 15
      }, this)) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 148,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("button", { onClick: handleExportToExcel, className: "mt-6 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300", children: "Exportar a Excel" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 159,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 129,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 59,
    columnNumber: 5
  }, this);
}
function ExchangeHouseInput({ house, onChange }) {
  let addExchange = () => {
    onChange({ ...house, exchanges: [...house.exchanges, { fromCurrency: "", toCurrency: "", buyRate: 0, sellRate: 0 }] });
  }, updateExchange = (index, exchange) => {
    let newExchanges = [...house.exchanges];
    newExchanges[index] = exchange, onChange({ ...house, exchanges: newExchanges });
  };
  return /* @__PURE__ */ jsxDEV5("div", { className: "border p-4 rounded mb-4 bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV5(
      "input",
      {
        type: "text",
        value: house.name,
        onChange: (e) => onChange({ ...house, name: e.target.value }),
        placeholder: "Nombre de la casa de cambio",
        className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 181,
        columnNumber: 7
      },
      this
    ),
    house.exchanges.map((exchange, index) => /* @__PURE__ */ jsxDEV5("div", { className: "flex flex-wrap -mx-2 mb-2", children: [
      /* @__PURE__ */ jsxDEV5("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV5(
        "input",
        {
          type: "text",
          value: exchange.fromCurrency,
          onChange: (e) => updateExchange(index, { ...exchange, fromCurrency: e.target.value }),
          placeholder: "De",
          className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 191,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 190,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV5(
        "input",
        {
          type: "text",
          value: exchange.toCurrency,
          onChange: (e) => updateExchange(index, { ...exchange, toCurrency: e.target.value }),
          placeholder: "A",
          className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 200,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 199,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV5(
        "input",
        {
          type: "number",
          value: exchange.buyRate || "",
          onChange: (e) => updateExchange(index, { ...exchange, buyRate: Number(e.target.value) }),
          placeholder: "Tasa de compra",
          className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 209,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 208,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV5(
        "input",
        {
          type: "number",
          value: exchange.sellRate || "",
          onChange: (e) => updateExchange(index, { ...exchange, sellRate: Number(e.target.value) }),
          placeholder: "Tasa de venta",
          className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 218,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 217,
        columnNumber: 11
      }, this)
    ] }, index, !0, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 189,
      columnNumber: 9
    }, this)),
    /* @__PURE__ */ jsxDEV5("button", { type: "button", onClick: addExchange, className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300", children: "Agregar Cambio" }, void 0, !1, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 228,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 180,
    columnNumber: 5
  }, this);
}
var action2 = async ({ request }) => {
  let formData = await request.formData(), amount = Number(formData.get("amount")), currency = formData.get("currency"), exchangeHouses = JSON.parse(formData.get("exchangeHouses")), maxSteps = Number(formData.get("maxSteps")), allowRepetitions = formData.get("allowRepetitions") === "true";
  console.log("Input data:", JSON.stringify({ amount, currency, exchangeHouses, maxSteps, allowRepetitions }, null, 2));
  let result = findBestConversionPath(amount, currency, exchangeHouses, maxSteps, allowRepetitions);
  return console.log("Result:", JSON.stringify(result, null, 2)), json3({ result });
};

// app/routes/register.tsx
var register_exports = {};
__export(register_exports, {
  action: () => action3,
  default: () => Register,
  loader: () => loader2
});
import { json as json4, redirect as redirect2 } from "@remix-run/node";
import { Form as Form3, useActionData as useActionData3 } from "@remix-run/react";
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
var loader2 = async ({ request }) => await getUser(request) ? redirect2("/") : json4({}), action3 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return json4({ error: "Invalid form data" }, { status: 400 });
  if (await db.user.findUnique({ where: { username } }))
    return json4({ error: "A user with this username already exists" }, { status: 400 });
  let user = await register({ username, password });
  return user ? createUserSession(user.id, redirectTo, !0) : json4({ error: "Unable to create user" }, { status: 400 });
};
function Register() {
  let actionData = useActionData3();
  return /* @__PURE__ */ jsxDEV6("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ jsxDEV6("div", { className: "mx-auto w-full max-w-md px-8", children: [
    /* @__PURE__ */ jsxDEV6(Form3, { method: "post", className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV6("div", { children: [
        /* @__PURE__ */ jsxDEV6("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700", children: "Username" }, void 0, !1, {
          fileName: "app/routes/register.tsx",
          lineNumber: 47,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV6(
          "input",
          {
            id: "username",
            required: !0,
            autoFocus: !0,
            name: "username",
            type: "text",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/register.tsx",
            lineNumber: 51,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/register.tsx",
          lineNumber: 50,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/register.tsx",
        lineNumber: 46,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6("div", { children: [
        /* @__PURE__ */ jsxDEV6("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }, void 0, !1, {
          fileName: "app/routes/register.tsx",
          lineNumber: 63,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV6(
          "input",
          {
            id: "password",
            name: "password",
            type: "password",
            autoComplete: "new-password",
            required: !0,
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/register.tsx",
            lineNumber: 67,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/register.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/register.tsx",
        lineNumber: 62,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6(
        "button",
        {
          type: "submit",
          className: "w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
          children: "Create Account"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/register.tsx",
          lineNumber: 78,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV6("div", { className: "text-center text-sm text-gray-500", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxDEV6("a", { className: "text-blue-500 underline", href: "/login", children: "Log in" }, void 0, !1, {
          fileName: "app/routes/register.tsx",
          lineNumber: 86,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/register.tsx",
        lineNumber: 84,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/register.tsx",
      lineNumber: 45,
      columnNumber: 9
    }, this),
    actionData?.error ? /* @__PURE__ */ jsxDEV6("div", { className: "pt-1 text-red-700", id: "error-message", children: actionData.error }, void 0, !1, {
      fileName: "app/routes/register.tsx",
      lineNumber: 92,
      columnNumber: 11
    }, this) : null
  ] }, void 0, !0, {
    fileName: "app/routes/register.tsx",
    lineNumber: 44,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/register.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, this);
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action4,
  loader: () => loader3
});
import { redirect as redirect3 } from "@remix-run/node";
var action4 = async ({ request }) => logout(request), loader3 = async () => redirect3("/");

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  action: () => action5,
  default: () => Index,
  loader: () => loader4
});
import { json as json7 } from "@remix-run/node";
import { useLoaderData as useLoaderData3, useActionData as useActionData4, Form as Form4, useFetcher, useSubmit as useSubmit3 } from "@remix-run/react";
import { useState as useState4, useEffect as useEffect2, useCallback } from "react";

// app/utils/floydWarshall.ts
function floydWarshall(initialSplits) {
  console.log("Initial splits:", initialSplits);
  let participants = Array.from(new Set(initialSplits.flatMap((split) => [split.from, split.to])));
  console.log("Participants:", participants);
  let n = participants.length, dist = Array(n).fill(0).map(() => Array(n).fill(0));
  initialSplits.forEach((split) => {
    let i = participants.indexOf(split.from), j = participants.indexOf(split.to);
    dist[i][j] += split.amount, dist[j][i] -= split.amount;
  }), console.log("Initial distance matrix:", dist);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        Math.abs(dist[i][k] + dist[k][j]) < Math.abs(dist[i][j]) && (dist[i][j] = dist[i][k] + dist[k][j]);
  let optimizedSplits = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      let amount = parseFloat(dist[i][j].toFixed(2));
      amount > 0.01 ? optimizedSplits.push({
        from: participants[i],
        to: participants[j],
        amount
      }) : amount < -0.01 && optimizedSplits.push({
        from: participants[j],
        to: participants[i],
        amount: -amount
      });
    }
  return console.log("Optimized splits:", optimizedSplits), optimizedSplits;
}

// app/utils/calculateIndividualSplits.ts
function calculateIndividualSplits(expenses, participants) {
  let balances = {};
  participants.forEach((p) => balances[p.id] = 0);
  let averageExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0) / participants.length;
  expenses.forEach((expense) => {
    balances[expense.paidBy] += expense.amount;
  }), participants.forEach((p) => {
    balances[p.id] -= averageExpense;
  }), console.log("Balances iniciales:", balances);
  let splits = [], debtors = participants.filter((p) => balances[p.id] < 0), creditors = participants.filter((p) => balances[p.id] > 0);
  return debtors.forEach((debtor) => {
    let remainingDebt = -balances[debtor.id];
    creditors.forEach((creditor) => {
      if (remainingDebt > 0 && balances[creditor.id] > 0) {
        let amount = Math.min(remainingDebt, balances[creditor.id]);
        amount > 0.01 && splits.push({
          from: debtor.username,
          to: creditor.username,
          amount: parseFloat(amount.toFixed(2))
        }), remainingDebt -= amount, balances[creditor.id] -= amount;
      }
    });
  }), console.log("Splits calculados:", splits), splits;
}

// app/utils/calculateSplits.ts
function calculateEqualSplits(expenses, participants) {
  let balances = calculateBalances(expenses, participants);
  console.log("Calculated balances:", balances);
  let initialSplits = [];
  Object.entries(balances).forEach(([payer, balance]) => {
    balance > 0 && Object.entries(balances).forEach(([receiver, receiverBalance]) => {
      if (receiverBalance < 0) {
        let amount = Math.min(balance, -receiverBalance);
        amount > 0.01 && initialSplits.push({
          from: payer,
          to: receiver,
          amount: parseFloat(amount.toFixed(2))
        });
      }
    });
  }), console.log("Initial splits:", initialSplits);
  let optimizedSplits = floydWarshall(initialSplits);
  return console.log("Optimized splits:", optimizedSplits), optimizedSplits;
}
function calculateBalances(expenses, participants) {
  let balances = {};
  participants.forEach((p) => balances[p.username] = 0);
  let sharePerPerson = expenses.reduce((sum, expense) => sum + expense.amount, 0) / participants.length;
  return expenses.forEach((expense) => {
    let paidByUser = participants.find((p) => p.id === expense.paidBy), paidBy = paidByUser ? paidByUser.username : expense.paidBy;
    balances[paidBy] = (balances[paidBy] || 0) + expense.amount;
  }), participants.forEach((person) => {
    balances[person.username] -= sharePerPerson;
  }), balances;
}

// app/utils/translations.ts
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
    generalSplitsIndividual: "Divisiones Generales (Basadas en Gastos Individuales)",
    invitationAccepted: "Invitaci\xF3n aceptada con \xE9xito",
    operationFailed: "La operaci\xF3n fall\xF3 o devolvi\xF3 datos inesperados"
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
    generalSplitsIndividual: "General Splits (Based on Individual Expenses)",
    invitationAccepted: "Invitation accepted successfully",
    operationFailed: "The operation failed or returned unexpected data"
  }
};

// app/actions/expenses.server.ts
import { json as json5 } from "@remix-run/node";
async function addLocalExpense(userId, expenseData) {
  try {
    let expense = await db.expense.create({
      data: {
        ...expenseData,
        userId,
        isLocal: !0
      }
    });
    return json5({ success: !0, expense });
  } catch (error) {
    return console.error("Error adding local expense:", error), json5({ success: !1, error: "Failed to add local expense" }, { status: 500 });
  }
}
async function addJuntaExpense(userId, data) {
  let { juntaId, description, amount, splitAmong } = data;
  return await db.juntaExpense.create({
    data: {
      description,
      amount,
      paidBy: userId,
      splitAmong,
      junta: { connect: { id: juntaId } }
    }
  });
}
async function deleteExpense(expenseId) {
  try {
    return await db.expense.delete({
      where: { id: expenseId }
    }).catch(() => null) || await db.juntaExpense.delete({
      where: { id: expenseId }
    }), json5({ success: !0 });
  } catch (error) {
    return console.error("Error deleting expense:", error), json5({ success: !1, error: "Failed to delete expense" }, { status: 500 });
  }
}

// app/utils/invitations.ts
async function inviteUserToJunta(juntaId, invitedUserId, inviterId) {
  try {
    if (invitedUserId === inviterId)
      return { success: !1, message: "You cannot invite yourself" };
    if (await db.invitation.findFirst({
      where: {
        juntaId,
        invitedUserId,
        status: "PENDING"
      }
    }))
      return { success: !1, message: "An invitation for this user is already pending" };
    if ((await db.junta.findUnique({
      where: { id: juntaId },
      include: { members: !0 }
    }))?.members.some((member) => member.id === invitedUserId))
      return { success: !1, message: "This user is already a member of the junta" };
    let invitation = await db.invitation.create({
      data: {
        juntaId,
        invitedUserId,
        inviterId,
        status: "PENDING"
      },
      include: {
        junta: { select: { name: !0 } },
        inviter: { select: { username: !0 } },
        invitedUser: { select: { username: !0 } }
      }
    });
    return console.log("Created invitation:", invitation), { success: !0, message: "Invitation sent successfully", invitation };
  } catch (error) {
    return console.error("Error creating invitation:", error), { success: !1, message: "Failed to create invitation" };
  }
}
async function getInvitations(userId) {
  try {
    if (console.log("Fetching invitations for user:", userId), console.log("DB object:", db), !db)
      return console.error("Database not initialized"), [];
    if (!db.invitation)
      return console.error("Invitation model not available"), [];
    let invitations = await db.invitation.findMany({
      where: {
        invitedUserId: userId,
        status: "PENDING"
      },
      include: {
        junta: {
          select: {
            id: !0,
            name: !0
          }
        },
        inviter: {
          select: {
            id: !0,
            username: !0
          }
        }
      }
    });
    return console.log("Fetched invitations:", JSON.stringify(invitations, null, 2)), invitations;
  } catch (error) {
    return console.error("Error fetching invitations:", error), [];
  }
}
async function respondToInvitation(invitationId, accept) {
  try {
    console.log("Responding to invitation:", { invitationId, accept });
    let invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      include: { junta: { include: { members: !0 } }, invitedUser: !0 }
    });
    if (!invitation)
      return { success: !1, message: "Invitation not found" };
    if (invitation.status !== "PENDING")
      return { success: !1, message: "This invitation has already been processed" };
    if (invitation.junta.members.some((member) => member.id === invitation.invitedUserId))
      return await db.invitation.delete({ where: { id: invitationId } }), { success: !0, message: "You are already a member of this junta" };
    if (accept) {
      let result = await db.$transaction(async (tx) => (await tx.invitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" }
      }), await tx.junta.update({
        where: { id: invitation.juntaId },
        data: { members: { connect: { id: invitation.invitedUserId } } },
        include: { members: !0, expenses: !0 }
      })));
      return console.log("Invitation accepted and user added to junta"), {
        success: !0,
        message: "Invitation accepted",
        juntaId: invitation.juntaId,
        junta: result
      };
    } else
      return await db.invitation.update({
        where: { id: invitationId },
        data: { status: "REJECTED" }
      }), console.log("Invitation rejected"), { success: !0, message: "Invitation rejected" };
  } catch (error) {
    return console.error("Error responding to invitation:", error), { success: !1, message: "Failed to respond to invitation. Please try again." };
  }
}

// app/actions/juntas.server.ts
import { json as json6 } from "@remix-run/node";
async function createJunta(userId, juntaName) {
  try {
    let junta = await db.junta.create({
      data: {
        name: juntaName,
        ownerId: userId,
        members: {
          connect: { id: userId }
        }
      },
      include: {
        members: !0,
        expenses: !0
      }
    }), formattedJunta = {
      ...junta,
      expenses: junta.expenses.map((expense) => ({
        ...expense,
        createdAt: expense.createdAt.toISOString()
      }))
    };
    return json6({ success: !0, junta: formattedJunta });
  } catch (error) {
    return console.error("Error creating junta:", error), json6({ success: !1, error: "Failed to create junta" }, { status: 500 });
  }
}
async function clearJunta(juntaId) {
  try {
    return await db.juntaExpense.deleteMany({
      where: { juntaId }
    }), json6({ success: !0, message: "Junta cleared successfully" });
  } catch (error) {
    return console.error("Error clearing junta:", error), json6({ success: !1, error: "Failed to clear junta" }, { status: 500 });
  }
}
async function inviteToJunta(juntaId, invitedUsername, inviterId) {
  try {
    let invitedUser = await db.user.findUnique({ where: { username: invitedUsername } });
    if (!invitedUser)
      return json6({ success: !1, message: "User not found" });
    let result = await inviteUserToJunta(juntaId, invitedUser.id, inviterId);
    return json6({ success: !0, message: "Invitation sent successfully" });
  } catch (error) {
    return console.error("Error inviting user:", error), json6({ success: !1, error: "An error occurred while sending the invitation" });
  }
}

// app/components/NotificationInbox.tsx
import { useState as useState3 } from "react";
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
function NotificationInbox({
  userId,
  initialInvitations,
  onInvitationResponse
}) {
  let [invitations, setInvitations] = useState3(initialInvitations), [responseMessages, setResponseMessages] = useState3({}), [isProcessing, setIsProcessing] = useState3({}), handleInvitationResponse = async (invitationId, accept) => {
    if (!isProcessing[invitationId]) {
      setIsProcessing((prev) => ({ ...prev, [invitationId]: !0 }));
      try {
        let result = await onInvitationResponse(invitationId, accept);
        setResponseMessages((prev) => ({ ...prev, [invitationId]: result.message })), result.success && setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId)), setTimeout(() => {
          setResponseMessages((prev) => {
            let newMessages = { ...prev };
            return delete newMessages[invitationId], newMessages;
          });
        }, 5e3);
      } catch (error) {
        console.error("Error processing invitation response:", error), setResponseMessages((prev) => ({ ...prev, [invitationId]: "An error occurred. Please try again. (Maybe just need to reload the page and look for your groups)" }));
      } finally {
        setIsProcessing((prev) => ({ ...prev, [invitationId]: !1 }));
      }
    }
  };
  return invitations.length === 0 && Object.keys(responseMessages).length === 0 ? /* @__PURE__ */ jsxDEV7("p", { className: "text-gray-500 italic", children: "No pending invitations. Try refreshing the page to check for new invitations." }, void 0, !1, {
    fileName: "app/components/NotificationInbox.tsx",
    lineNumber: 47,
    columnNumber: 7
  }, this) : /* @__PURE__ */ jsxDEV7("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxDEV7("h2", { className: "text-xl font-semibold text-blue-600", children: "Invitations" }, void 0, !1, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, this),
    invitations.map((invitation) => /* @__PURE__ */ jsxDEV7("div", { className: "bg-white shadow-md rounded-lg p-4 border border-gray-200", children: [
      /* @__PURE__ */ jsxDEV7("p", { className: "text-lg mb-2", children: [
        /* @__PURE__ */ jsxDEV7("span", { className: "font-semibold text-blue-500", children: invitation.inviter.username }, void 0, !1, {
          fileName: "app/components/NotificationInbox.tsx",
          lineNumber: 59,
          columnNumber: 13
        }, this),
        " invited you to join",
        /* @__PURE__ */ jsxDEV7("span", { className: "font-semibold text-green-500", children: [
          " ",
          invitation.junta.name
        ] }, void 0, !0, {
          fileName: "app/components/NotificationInbox.tsx",
          lineNumber: 60,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 58,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV7("div", { className: "flex space-x-2 mt-2", children: [
        /* @__PURE__ */ jsxDEV7(
          "button",
          {
            onClick: () => handleInvitationResponse(invitation.id, !0),
            className: `bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${isProcessing[invitation.id] ? "opacity-50 cursor-not-allowed" : ""}`,
            disabled: isProcessing[invitation.id],
            children: isProcessing[invitation.id] ? "Processing..." : "Accept"
          },
          void 0,
          !1,
          {
            fileName: "app/components/NotificationInbox.tsx",
            lineNumber: 63,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV7(
          "button",
          {
            onClick: () => handleInvitationResponse(invitation.id, !1),
            className: `bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ${isProcessing[invitation.id] ? "opacity-50 cursor-not-allowed" : ""}`,
            disabled: isProcessing[invitation.id],
            children: isProcessing[invitation.id] ? "Processing..." : "Reject"
          },
          void 0,
          !1,
          {
            fileName: "app/components/NotificationInbox.tsx",
            lineNumber: 70,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 62,
        columnNumber: 11
      }, this),
      responseMessages[invitation.id] && /* @__PURE__ */ jsxDEV7("p", { className: `mt-2 text-sm ${isProcessing[invitation.id] ? "text-yellow-600" : "text-green-600"}`, children: responseMessages[invitation.id] }, void 0, !1, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 79,
        columnNumber: 13
      }, this)
    ] }, invitation.id, !0, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 57,
      columnNumber: 9
    }, this)),
    Object.entries(responseMessages).map(([invitationId, message]) => /* @__PURE__ */ jsxDEV7("div", { className: "bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4", role: "alert", children: [
      /* @__PURE__ */ jsxDEV7("p", { className: "font-bold", children: "Response:" }, void 0, !1, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 87,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV7("p", { children: message }, void 0, !1, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 88,
        columnNumber: 11
      }, this)
    ] }, invitationId, !0, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 86,
      columnNumber: 9
    }, this))
  ] }, void 0, !0, {
    fileName: "app/components/NotificationInbox.tsx",
    lineNumber: 54,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
import { Fragment as Fragment3, jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
var loader4 = async ({ request }) => {
  let user = await getUser(request);
  if (!user)
    return json7({ user: null, juntas: [], localExpenses: [], invitations: [] });
  try {
    let juntas = await db.junta.findMany({
      where: { OR: [{ ownerId: user.id }, { members: { some: { id: user.id } } }] },
      include: {
        members: !0,
        expenses: !0
      }
    }), localExpenses = await db.expense.findMany({
      where: { userId: user.id, isLocal: !0 }
    }), invitations = await getInvitations(user.id);
    return json7({ user, juntas, localExpenses, invitations });
  } catch (error) {
    return console.error("Error in loader:", error), json7({ error: "An error occurred while loading data" }, { status: 500 });
  }
}, action5 = async ({ request }) => {
  let form = await request.formData();
  switch (form.get("action")) {
    case "addLocalExpense": {
      let userId = await requireUserId(request), description = form.get("description"), amount = parseFloat(form.get("amount")), splitAmong = form.get("splitAmong");
      return await addLocalExpense(userId, { description, amount, paidBy: userId, splitAmong });
    }
    case "addJuntaExpense": {
      let userId = await requireUserId(request), juntaId = form.get("juntaId"), description = form.get("description"), amount = parseFloat(form.get("amount")), splitAmong = form.get("splitAmong");
      return console.log("Action received splitAmong:", splitAmong), splitAmong ? await addJuntaExpense(userId, { juntaId, description, amount, splitAmong }) : json7({ error: "splitAmong is required" }, { status: 400 });
    }
    case "createJunta": {
      let userId = await requireUserId(request), juntaName = form.get("juntaName");
      return await createJunta(userId, juntaName);
    }
    case "inviteToJunta": {
      let userId = await requireUserId(request), juntaId = form.get("juntaId"), invitedUsername = form.get("invitedUsername");
      return await inviteToJunta(juntaId, invitedUsername, userId);
    }
    case "deleteExpense": {
      let expenseId = form.get("expenseId");
      return await deleteExpense(expenseId);
    }
    case "clearJunta": {
      let juntaId = form.get("juntaId");
      return await clearJunta(juntaId);
    }
    case "respondToInvitation": {
      let invitationId = form.get("invitationId"), accept = form.get("accept") === "true", result = await respondToInvitation(invitationId, accept);
      if (result.success && accept) {
        let updatedJunta = await db.junta.findUnique({
          where: { id: result.juntaId },
          include: { members: !0, expenses: !0 }
        });
        return json7({ ...result, junta: updatedJunta });
      }
      return json7(result);
    }
    case "logout":
      return await logout(request);
    default:
      return json7({ error: "Invalid action" }, { status: 400 });
  }
};
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
  let { user, juntas: initialJuntas, localExpenses: initialLocalExpenses, invitations: initialInvitations } = useLoaderData3(), actionData = useActionData4(), [language, setLanguage] = useState4("es"), [showTutorial, setShowTutorial] = useState4(user?.isNewUser ?? !1), [selectedJunta, setSelectedJunta] = useState4(null), [showNotifications, setShowNotifications] = useState4(!1), [splits, setSplits] = useState4([]), [splitAmongAll, setSplitAmongAll] = useState4(!1), [juntas, setJuntas] = useState4(initialJuntas.map(convertDates)), [localExpenses, setLocalExpenses] = useState4(initialLocalExpenses), [invitations, setInvitations] = useState4(initialInvitations), fetcher = useFetcher(), submit = useSubmit3(), t = translations[language], toggleLanguage = () => {
    setLanguage((prev) => prev === "es" ? "en" : "es");
  }, [splitType, setSplitType] = useState4("equal"), handleCalculateSplits = useCallback(() => {
    if (selectedJunta) {
      let calculatedSplits = splitType === "equal" ? calculateEqualSplits(selectedJunta.expenses, selectedJunta.members) : calculateIndividualSplits(selectedJunta.expenses, selectedJunta.members);
      setSplits(calculatedSplits);
    } else if (user) {
      let calculatedSplits = splitType === "equal" ? calculateEqualSplits(localExpenses, [user]) : calculateIndividualSplits(localExpenses, [user]);
      setSplits(calculatedSplits);
    }
  }, [selectedJunta, localExpenses, user, splitType]);
  useEffect2(() => {
    handleCalculateSplits();
  }, [selectedJunta, localExpenses, handleCalculateSplits]);
  let updateJuntas = (newJunta) => {
    setJuntas((prevJuntas) => {
      let index = prevJuntas.findIndex((j) => j.id === newJunta.id);
      if (index !== -1) {
        let updatedJuntas = [...prevJuntas];
        return updatedJuntas[index] = convertDates(newJunta), updatedJuntas;
      } else
        return [...prevJuntas, convertDates(newJunta)];
    });
  }, handleInvitationResponse = async (invitationId, accept) => {
    let formData = new FormData();
    formData.append("action", "respondToInvitation"), formData.append("invitationId", invitationId), formData.append("accept", accept.toString()), fetcher.submit(formData, { method: "post" });
    let [fetcherCompleted, setFetcherCompleted] = useState4(!1);
    for (useEffect2(() => {
      fetcher.state === "idle" && fetcher.data && setFetcherCompleted(!0);
    }, [fetcher.state, fetcher.data]); !fetcherCompleted; )
      await new Promise((resolve3) => setTimeout(resolve3, 100));
    return fetcher.data && "success" in fetcher.data ? (fetcher.data.success && "junta" in fetcher.data && fetcher.data.junta && updateJuntas(fetcher.data.junta), {
      success: fetcher.data.success,
      message: fetcher.data.message || "",
      junta: fetcher.data.junta
    }) : {
      success: !1,
      message: "An error occurred while processing the invitation"
    };
  }, handleInviteUser = async (event) => {
    event.preventDefault();
    let form = event.currentTarget, formData = new FormData(form);
    fetcher.submit(formData, { method: "post" });
  }, handleAddExpense = (event) => {
    event.preventDefault();
    let form = event.currentTarget, formData = new FormData(form), action7 = formData.get("action");
    if (action7 === "addLocalExpense")
      fetcher.submit(formData, { method: "post" });
    else if (action7 === "addJuntaExpense") {
      let splitAmong = formData.get("splitAmong");
      if (splitAmongAll && selectedJunta && (splitAmong = selectedJunta.members.map((member) => member.username).join(",")), !splitAmong) {
        alert(t.pleaseSpecifySplitAmong);
        return;
      }
      formData.set("splitAmong", splitAmong), formData.set("juntaId", selectedJunta.id), fetcher.submit(formData, { method: "post" });
    }
    form.reset();
  }, handleDeleteExpense = (expenseId) => {
    fetcher.submit(
      { action: "deleteExpense", expenseId },
      { method: "post" }
    );
  };
  return useEffect2(() => {
    if (fetcher.data && fetcher.state === "idle")
      if (fetcher.data.success)
        if ("expense" in fetcher.data && fetcher.data.expense) {
          let newExpense = {
            ...fetcher.data.expense,
            createdAt: new Date(fetcher.data.expense.createdAt)
          };
          setLocalExpenses((prevExpenses) => [...prevExpenses, newExpense]);
        } else if ("deletedExpenseId" in fetcher.data && fetcher.data.deletedExpenseId) {
          let deletedId = fetcher.data.deletedExpenseId;
          selectedJunta ? setSelectedJunta((prevJunta) => prevJunta ? {
            ...prevJunta,
            expenses: prevJunta.expenses.filter((expense) => expense.id !== deletedId)
          } : null) : setLocalExpenses(
            (prevExpenses) => prevExpenses.filter((expense) => expense.id !== deletedId)
          );
        } else
          "junta" in fetcher.data && fetcher.data.junta && updateJuntas(fetcher.data.junta);
      else
        "error" in fetcher.data && fetcher.data.error && console.error("Error:", fetcher.data.error);
  }, [fetcher.data, fetcher.state, selectedJunta]), useEffect2(() => {
    actionData?.junta && setSelectedJunta(convertDates(actionData.junta));
  }, [actionData]), /* @__PURE__ */ jsxDEV8("div", { className: "container mx-auto p-4 bg-gray-100 min-h-screen", children: [
    user ? /* @__PURE__ */ jsxDEV8(Fragment3, { children: [
      /* @__PURE__ */ jsxDEV8("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h1", { className: "text-3xl font-bold text-blue-600", children: [
          t.welcome,
          ", ",
          user.username,
          "!"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 311,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV8(
            "button",
            {
              onClick: () => setLanguage((lang) => lang === "es" ? "en" : "es"),
              className: "bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition mr-2",
              children: language === "es" ? "EN" : "ES"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 313,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8(Form4, { method: "post", children: [
            /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "logout" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 320,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.logout }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 321,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 319,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 312,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 310,
        columnNumber: 11
      }, this),
      showTutorial && /* @__PURE__ */ jsxDEV8("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-bold mb-4", children: t.tutorial.welcome }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 330,
          columnNumber: 15
        }, this),
        t.tutorial.algorithms.map((algo, index) => /* @__PURE__ */ jsxDEV8("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("h3", { className: "text-xl font-semibold", children: algo.name }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 333,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV8("p", { children: algo.description }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 334,
            columnNumber: 19
          }, this)
        ] }, index, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 332,
          columnNumber: 17
        }, this)),
        /* @__PURE__ */ jsxDEV8(
          "button",
          {
            onClick: () => setShowTutorial(!1),
            className: "mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition",
            children: t.tutorial.close
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 337,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 329,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.createJunta }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 347,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8(Form4, { method: "post", className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "createJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 349,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "input",
            {
              type: "text",
              name: "juntaName",
              placeholder: t.juntaName,
              className: "flex-grow border p-2 rounded",
              required: !0
            },
            void 0,
            !1,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 350,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.create }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 357,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 348,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 346,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.yourJuntas }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 364,
          columnNumber: 13
        }, this),
        Array.isArray(juntas) && juntas.length > 0 ? /* @__PURE__ */ jsxDEV8(
          "select",
          {
            onChange: (e) => {
              let selected = juntas.find((j) => j.id === e.target.value);
              setSelectedJunta(selected || null);
            },
            className: "w-full p-2 border rounded mb-4",
            children: [
              /* @__PURE__ */ jsxDEV8("option", { value: "", children: t.selectJunta }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 373,
                columnNumber: 17
              }, this),
              juntas.map((j) => /* @__PURE__ */ jsxDEV8("option", { value: j.id, children: j.name }, j.id, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 375,
                columnNumber: 19
              }, this))
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 366,
            columnNumber: 15
          },
          this
        ) : /* @__PURE__ */ jsxDEV8("p", { children: t.noJuntas }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 381,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 363,
        columnNumber: 11
      }, this),
      selectedJunta && /* @__PURE__ */ jsxDEV8("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h3", { className: "text-xl font-semibold mb-4 text-blue-700", children: selectedJunta.name }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 387,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8(Form4, { method: "post", onSubmit: handleInviteUser, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "inviteToJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 390,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 391,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsxDEV8(
              "input",
              {
                type: "text",
                name: "invitedUsername",
                placeholder: t.inviteUser,
                className: "flex-grow border p-2 rounded",
                required: !0
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 393,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.invite }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 400,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 392,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 389,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8(Form4, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "addJuntaExpense" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 407,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 408,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxDEV8(
              "input",
              {
                type: "text",
                name: "description",
                placeholder: t.description,
                className: "border p-2 rounded",
                required: !0
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 410,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV8(
              "input",
              {
                type: "number",
                name: "amount",
                placeholder: t.amount,
                className: "border p-2 rounded",
                required: !0
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 417,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxDEV8(
                "input",
                {
                  type: "text",
                  name: "splitAmong",
                  placeholder: t.splitAmong,
                  className: "border p-2 rounded flex-grow",
                  required: !splitAmongAll,
                  disabled: splitAmongAll
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 425,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV8("label", { className: "ml-2 flex items-center", children: [
                /* @__PURE__ */ jsxDEV8(
                  "input",
                  {
                    type: "checkbox",
                    checked: splitAmongAll,
                    onChange: () => setSplitAmongAll(!splitAmongAll),
                    className: "mr-1"
                  },
                  void 0,
                  !1,
                  {
                    fileName: "app/routes/_index.tsx",
                    lineNumber: 434,
                    columnNumber: 23
                  },
                  this
                ),
                t.splitAmongAll
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 433,
                columnNumber: 21
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 424,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 409,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addExpense }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 444,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 406,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: t.juntaExpenses }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 451,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: selectedJunta.expenses.map((expense) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV8("span", { children: [
              expense.description,
              " - ",
              expense.amount.toFixed(2),
              "(",
              t.paidBy,
              " ",
              selectedJunta.members.find((m) => m.id === expense.paidBy)?.username,
              ")"
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 455,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV8(
              "button",
              {
                onClick: () => handleDeleteExpense(expense.id),
                className: "bg-red-500 text-white p-1 rounded hover:bg-red-600 transition",
                children: t.deleteExpense
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 459,
                columnNumber: 23
              },
              this
            )
          ] }, expense.id, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 454,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 452,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 450,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: t.myExpenses }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 472,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: selectedJunta.expenses.filter((e) => e.paidBy === user?.id).map((expense) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV8("span", { children: [
              expense.description,
              " - ",
              expense.amount.toFixed(2)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 476,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV8(
              "button",
              {
                onClick: () => handleDeleteExpense(expense.id),
                className: "bg-red-500 text-white p-1 rounded hover:bg-red-600 transition",
                children: t.deleteExpense
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 477,
                columnNumber: 23
              },
              this
            )
          ] }, expense.id, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 475,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 473,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 471,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "mt-4 space-x-2", children: [
          /* @__PURE__ */ jsxDEV8(
            "button",
            {
              onClick: () => {
                setSplitType("equal"), handleCalculateSplits();
              },
              className: "bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition",
              children: t.equalizeMoneyButton
            },
            void 0,
            !1,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 489,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8(
            "button",
            {
              onClick: () => {
                setSplitType("individual"), handleCalculateSplits();
              },
              className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition",
              children: t.calculateDivisionsButton
            },
            void 0,
            !1,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 498,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 488,
          columnNumber: 15
        }, this),
        splits.length > 0 && /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: splitType === "equal" ? t.generalSplitsEqual : t.generalSplitsIndividual }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 512,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 517,
            columnNumber: 23
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 515,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 511,
          columnNumber: 17
        }, this),
        splits.length > 0 && /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: t.mySplits }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 528,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: splits.filter((split) => split.from === user?.username || split.to === user?.username).map((split, index) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded", children: split.from === user?.username ? `${t.youOwe} ${split.to}: ${split.amount.toFixed(2)}` : `${split.from} ${t.owesYou}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 531,
            columnNumber: 23
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 529,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 527,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV8(Form4, { method: "post", className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "clearJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 542,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 543,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.clearJunta }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 544,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 541,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 386,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.localExpenses }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 552,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8(Form4, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "addLocalExpense" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 554,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV8("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxDEV8(
              "input",
              {
                type: "text",
                name: "description",
                placeholder: t.description,
                className: "border p-2 rounded",
                required: !0
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 556,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV8(
              "input",
              {
                type: "number",
                name: "amount",
                placeholder: t.amount,
                className: "border p-2 rounded",
                required: !0
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 563,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV8(
              "input",
              {
                type: "text",
                name: "splitAmong",
                placeholder: t.splitAmong,
                className: "border p-2 rounded",
                required: !0
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 570,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 555,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addLocalExpense }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 578,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 553,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: localExpenses.map((expense) => /* @__PURE__ */ jsxDEV8("li", { className: "flex justify-between items-center bg-gray-100 p-2 rounded", children: [
          /* @__PURE__ */ jsxDEV8("span", { children: [
            expense.description,
            " - ",
            expense.amount.toFixed(2)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 586,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "button",
            {
              onClick: () => handleDeleteExpense(expense.id),
              className: "text-red-500 hover:text-red-700 transition",
              children: t.deleteExpense
            },
            void 0,
            !1,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 587,
              columnNumber: 19
            },
            this
          )
        ] }, expense.id, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 585,
          columnNumber: 17
        }, this)) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 583,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8(
          "button",
          {
            onClick: handleCalculateSplits,
            className: "mt-4 bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition",
            children: t.calculateSplits
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 597,
            columnNumber: 13
          },
          this
        ),
        splits.length > 0 && /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("h3", { className: "text-lg font-semibold text-blue-600", children: t.splits }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 606,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 609,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 607,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 605,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 551,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV8(
        "button",
        {
          onClick: () => setShowNotifications(!showNotifications),
          className: "bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition",
          children: t.notifications
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 618,
          columnNumber: 11
        },
        this
      ),
      showNotifications && user.id && /* @__PURE__ */ jsxDEV8(
        NotificationInbox,
        {
          userId: user.id,
          initialInvitations: invitations,
          onInvitationResponse: handleInvitationResponse
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 625,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 309,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV8("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV8("p", { className: "mb-4 text-xl", children: t.pleaseLogin }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 634,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "space-x-4", children: [
        /* @__PURE__ */ jsxDEV8("a", { href: "/login", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.login }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 636,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8("a", { href: "/register", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.register }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 639,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 635,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 633,
      columnNumber: 9
    }, this),
    actionData?.error && /* @__PURE__ */ jsxDEV8("div", { className: "text-red-500 mt-4 p-2 bg-red-100 rounded", children: actionData.error }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 647,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 307,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action6,
  default: () => Login,
  loader: () => loader5
});
import { json as json8, redirect as redirect4 } from "@remix-run/node";
import { Form as Form5, useActionData as useActionData5 } from "@remix-run/react";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
var loader5 = async ({ request }) => await getUser(request) ? redirect4("/") : json8({}), action6 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return json8({ error: "Invalid form data" }, { status: 400 });
  let user = await login({ username, password });
  return user ? createUserSession(user.id, redirectTo) : json8({ error: "Invalid username or password" }, { status: 400 });
};
function Login() {
  let actionData = useActionData5();
  return /* @__PURE__ */ jsxDEV9("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ jsxDEV9("div", { className: "mx-auto w-full max-w-md px-8", children: [
    /* @__PURE__ */ jsxDEV9(Form5, { method: "post", className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV9("div", { children: [
        /* @__PURE__ */ jsxDEV9("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700", children: "Username" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 41,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV9("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV9(
          "input",
          {
            id: "username",
            required: !0,
            autoFocus: !0,
            name: "username",
            type: "text",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/login.tsx",
            lineNumber: 45,
            columnNumber: 17
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 44,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 40,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV9("div", { children: [
        /* @__PURE__ */ jsxDEV9("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 57,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV9("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV9(
          "input",
          {
            id: "password",
            name: "password",
            type: "password",
            autoComplete: "current-password",
            required: !0,
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/login.tsx",
            lineNumber: 61,
            columnNumber: 17
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 60,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 56,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV9(
        "button",
        {
          type: "submit",
          className: "w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
          children: "Log in"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/login.tsx",
          lineNumber: 72,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV9("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV9("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV9(
            "input",
            {
              id: "remember",
              name: "remember",
              type: "checkbox",
              className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/login.tsx",
              lineNumber: 80,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV9("label", { htmlFor: "remember", className: "ml-2 block text-sm text-gray-900", children: "Remember me" }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 86,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/login.tsx",
          lineNumber: 79,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV9("div", { className: "text-center text-sm text-gray-500", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsxDEV9("a", { className: "text-blue-500 underline", href: "/register", children: "Sign up" }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 92,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/login.tsx",
          lineNumber: 90,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 78,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/login.tsx",
      lineNumber: 39,
      columnNumber: 11
    }, this),
    actionData?.error ? /* @__PURE__ */ jsxDEV9("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.error }, void 0, !1, {
      fileName: "app/routes/login.tsx",
      lineNumber: 99,
      columnNumber: 13
    }, this) : null
  ] }, void 0, !0, {
    fileName: "app/routes/login.tsx",
    lineNumber: 38,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/login.tsx",
    lineNumber: 37,
    columnNumber: 7
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-4BIYH5ID.js", imports: ["/build/_shared/chunk-O4BRYNJ4.js", "/build/_shared/chunk-SNZIFTKA.js", "/build/_shared/chunk-KHA4OLT4.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-U4FRFQSK.js", "/build/_shared/chunk-XGOTYLZ5.js", "/build/_shared/chunk-7M6SC7J5.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-II2EJ4IF.js", imports: ["/build/_shared/chunk-G7CHZRZX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-GHR6GA6X.js", imports: ["/build/_shared/chunk-E7TNPIXH.js", "/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-4DDJMFTN.js", imports: ["/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-GGSXPJWV.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/minimizacion-transacciones": { id: "routes/minimizacion-transacciones", parentId: "root", path: "minimizacion-transacciones", index: void 0, caseSensitive: void 0, module: "/build/routes/minimizacion-transacciones-5V32LAUF.js", imports: ["/build/_shared/chunk-QGBU2JQV.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/optimizacion-divisas": { id: "routes/optimizacion-divisas", parentId: "root", path: "optimizacion-divisas", index: void 0, caseSensitive: void 0, module: "/build/routes/optimizacion-divisas-PUUZ4EBK.js", imports: ["/build/_shared/chunk-QGBU2JQV.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/register": { id: "routes/register", parentId: "root", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/register-SCMYMTNU.js", imports: ["/build/_shared/chunk-E7TNPIXH.js", "/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "c62e6ece", hmr: { runtime: "/build/_shared\\chunk-KHA4OLT4.js", timestamp: 1726823589907 }, url: "/build/manifest-C62E6ECE.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, unstable_singleFetch: !1, unstable_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/minimizacion-transacciones": {
    id: "routes/minimizacion-transacciones",
    parentId: "root",
    path: "minimizacion-transacciones",
    index: void 0,
    caseSensitive: void 0,
    module: minimizacion_transacciones_exports
  },
  "routes/optimizacion-divisas": {
    id: "routes/optimizacion-divisas",
    parentId: "root",
    path: "optimizacion-divisas",
    index: void 0,
    caseSensitive: void 0,
    module: optimizacion_divisas_exports
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: register_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
