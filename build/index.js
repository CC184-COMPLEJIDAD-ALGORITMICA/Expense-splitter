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
      /* @__PURE__ */ jsxDEV2(Link, { to: "/optimizacion-divisas", className: "text-white mr-4", children: "Optimizaci\xF3n de Divisas" }, void 0, !1, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 14,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV2(Link, { to: "/optimizacion-global", className: "text-white mr-4", children: "Optimizaci\xF3n Global" }, void 0, !1, {
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

// app/routes/optimizacion-divisas.tsx
var optimizacion_divisas_exports = {};
__export(optimizacion_divisas_exports, {
  action: () => action,
  default: () => OptimizacionDivisas
});
import { useState } from "react";
import { Form, useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { json as json2 } from "@remix-run/node";

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
  let maxCurrency = Object.keys(distances).reduce((a, b) => distances[a][maxSteps] > distances[b][maxSteps] ? a : b), path2 = [], current = maxCurrency;
  for (let step = maxSteps; step > 0; step--) {
    let prev = predecessors[current][step];
    if (prev === null)
      break;
    path2.unshift({
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
    initialCurrency: start,
    finalAmount,
    finalCurrency: maxCurrency,
    profit,
    profitPercentage,
    path: path2,
    allPaths
  };
}
function findBestConversionPath(amount, startCurrency, exchangeHouses, maxSteps, allowRepetitions) {
  let graph = buildGraph(exchangeHouses), result = bellmanFord(graph, startCurrency, amount, maxSteps, allowRepetitions);
  return result.path.length === 0 ? {
    initialAmount: amount,
    initialCurrency: startCurrency,
    finalAmount: amount,
    finalCurrency: startCurrency,
    profit: 0,
    profitPercentage: 0,
    path: [],
    allPaths: []
  } : result;
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

// app/types/currencies.ts
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
import { Fragment as Fragment2, jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
function OptimizacionDivisas() {
  let [amount, setAmount] = useState(1e3), [currency, setCurrency] = useState("USD"), [exchangeHouses, setExchangeHouses] = useState([]), [maxSteps, setMaxSteps] = useState(5), [allowRepetitions, setAllowRepetitions] = useState(!1), actionData = useActionData(), navigation = useNavigation(), submit = useSubmit(), handleSubmit = (e) => {
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
        { Step: "Final", Amount: actionData.result.finalAmount, Currency: actionData.result.finalCurrency }
      ];
      exportToExcel(data, "OptimalConversionPath");
    }
  };
  return /* @__PURE__ */ jsxDEV4("div", { className: "container mx-auto p-4 max-w-4xl bg-gray-100 rounded-lg shadow-lg", children: [
    /* @__PURE__ */ jsxDEV4("h1", { className: "text-3xl font-bold mb-6 text-center text-blue-600", children: "Optimizaci\xF3n de Conversi\xF3n de Divisas" }, void 0, !1, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4("div", { className: "bg-white p-6 rounded-lg shadow mb-8", children: [
      /* @__PURE__ */ jsxDEV4("h2", { className: "text-2xl font-bold mb-4 text-blue-600", children: "Tutorial" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("p", { className: "mb-4", children: "Esta herramienta te ayuda a encontrar la ruta \xF3ptima para convertir divisas a trav\xE9s de diferentes casas de cambio, maximizando tus ganancias." }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("ol", { className: "list-decimal list-inside space-y-2", children: [
        /* @__PURE__ */ jsxDEV4("li", { children: "Ingresa la cantidad inicial y la moneda con la que deseas comenzar." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 67,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV4("li", { children: "Establece el n\xFAmero m\xE1ximo de pasos (conversiones) permitidos." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 68,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV4("li", { children: "Agrega las casas de cambio y sus tasas de conversi\xF3n." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV4("li", { children: "Decide si quieres permitir repeticiones de monedas en la ruta." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 70,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV4("li", { children: 'Haz clic en "Calcular ruta \xF3ptima" para obtener el mejor resultado.' }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 71,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4(Form, { onSubmit: handleSubmit, className: "mb-8 space-y-6", children: [
      /* @__PURE__ */ jsxDEV4("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxDEV4("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsxDEV4("label", { htmlFor: "amount", className: "block text-sm font-medium text-gray-700 mb-2", children: "Cantidad inicial:" }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 78,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV4(
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
              lineNumber: 79,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV4("p", { className: "mt-2 text-sm text-gray-500", children: "Ingrese la cantidad de dinero con la que desea iniciar la operaci\xF3n." }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 86,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 77,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV4("div", { className: "bg-white p-4 rounded-lg shadow", children: [
          /* @__PURE__ */ jsxDEV4("label", { htmlFor: "currency", className: "block text-sm font-medium text-gray-700 mb-2", children: "Moneda inicial:" }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 89,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV4(
            "select",
            {
              id: "currency",
              value: currency,
              onChange: (e) => setCurrency(e.target.value),
              className: "w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500",
              children: currencieslist.map((curr) => /* @__PURE__ */ jsxDEV4("option", { value: curr.code, children: [
                curr.code,
                " - ",
                curr.name
              ] }, curr.code, !0, {
                fileName: "app/routes/optimizacion-divisas.tsx",
                lineNumber: 97,
                columnNumber: 17
              }, this))
            },
            void 0,
            !1,
            {
              fileName: "app/routes/optimizacion-divisas.tsx",
              lineNumber: 90,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV4("p", { className: "mt-2 text-sm text-gray-500", children: "Seleccione la moneda inicial para la conversi\xF3n." }, void 0, !1, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 102,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 88,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 76,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "bg-white p-4 rounded-lg shadow", children: [
        /* @__PURE__ */ jsxDEV4("label", { htmlFor: "maxSteps", className: "block text-sm font-medium text-gray-700 mb-2", children: "M\xE1ximo de pasos:" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 106,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV4(
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
            lineNumber: 107,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV4("p", { className: "mt-2 text-sm text-gray-500", children: "N\xFAmero m\xE1ximo de conversiones permitidas en la ruta." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 114,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 105,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "bg-white p-4 rounded-lg shadow", children: [
        /* @__PURE__ */ jsxDEV4("h2", { className: "text-xl font-bold mb-4 text-blue-600", children: "Casas de Cambio" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 117,
          columnNumber: 11
        }, this),
        exchangeHouses.map((house, index) => /* @__PURE__ */ jsxDEV4(
          ExchangeHouseInput,
          {
            house,
            onChange: (updatedHouse) => updateExchangeHouse(index, updatedHouse)
          },
          index,
          !1,
          {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 119,
            columnNumber: 13
          },
          this
        )),
        /* @__PURE__ */ jsxDEV4("button", { type: "button", onClick: addExchangeHouse, className: "mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300", children: "Agregar Casa de Cambio" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 125,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxDEV4(
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
            lineNumber: 130,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV4("label", { htmlFor: "allowRepetitions", className: "ml-2 block text-sm text-gray-900", children: "Permitir repeticiones de monedas en la ruta" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 137,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 129,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("button", { type: "submit", className: "w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300", children: "Calcular ruta \xF3ptima" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 141,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 75,
      columnNumber: 7
    }, this),
    actionData?.result && /* @__PURE__ */ jsxDEV4("div", { className: "mt-8 bg-white p-6 rounded-lg shadow", children: [
      /* @__PURE__ */ jsxDEV4("h2", { className: "text-2xl font-bold mb-4 text-blue-600", children: "Resultado \xD3ptimo" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 148,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("p", { className: "text-lg", children: [
        "Ganancia: ",
        /* @__PURE__ */ jsxDEV4("span", { className: `font-bold ${actionData.result.profit >= 0 ? "text-green-600" : "text-red-600"}`, children: [
          actionData.result.profit.toFixed(2),
          " ",
          actionData.result.finalCurrency
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 150,
          columnNumber: 23
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 149,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("p", { className: "text-sm text-gray-600", children: [
        "(",
        actionData.result.profitPercentage.toFixed(2),
        "% comparado con ",
        actionData.result.initialAmount.toFixed(2),
        " ",
        actionData.result.initialCurrency,
        ")"
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 154,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("p", { className: "text-lg", children: [
        "Cantidad inicial: ",
        actionData.result.initialAmount.toFixed(2),
        " ",
        actionData.result.initialCurrency
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 157,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("p", { className: "text-lg", children: [
        "Cantidad final: ",
        actionData.result.finalAmount.toFixed(2),
        " ",
        actionData.result.finalCurrency
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 158,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("h3", { className: "text-xl font-bold mt-6 mb-2 text-blue-600", children: "Pasos:" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 159,
        columnNumber: 11
      }, this),
      actionData.result.path.length > 0 ? /* @__PURE__ */ jsxDEV4("ol", { className: "list-decimal list-inside space-y-2", children: actionData.result.path.map((step, index) => /* @__PURE__ */ jsxDEV4("li", { className: "bg-gray-100 p-2 rounded", children: [
        /* @__PURE__ */ jsxDEV4("span", { className: "font-bold", children: [
          step.exchangeHouse,
          ":"
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 164,
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
        /* @__PURE__ */ jsxDEV4("span", { className: "text-sm text-gray-600 ml-2", children: [
          "(",
          step.isBuy ? "Compra" : "Venta",
          ", Tasa: ",
          step.rate.toFixed(4),
          ")"
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 165,
          columnNumber: 19
        }, this)
      ] }, index, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 163,
        columnNumber: 17
      }, this)) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 161,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV4("p", { className: "text-red-500", children: "No se encontr\xF3 una ruta de conversi\xF3n v\xE1lida." }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 170,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV4("h3", { className: "text-xl font-bold mt-6 mb-2 text-blue-600", children: "Otras rutas posibles:" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 172,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("ul", { className: "list-disc list-inside space-y-1", children: actionData.result.allPaths.slice(0, 5).map((path2, index) => /* @__PURE__ */ jsxDEV4("li", { children: path2.profit !== null && path2.profitPercentage !== null ? /* @__PURE__ */ jsxDEV4(Fragment2, { children: [
        "Ganancia: $",
        path2.profit.toFixed(2),
        " USD (",
        path2.profitPercentage.toFixed(2),
        "%)"
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 177,
        columnNumber: 19
      }, this) : /* @__PURE__ */ jsxDEV4(Fragment2, { children: [
        "No hay conversi\xF3n disponible para ",
        path2.currency
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 179,
        columnNumber: 19
      }, this) }, index, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 175,
        columnNumber: 15
      }, this)) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 173,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("button", { onClick: handleExportToExcel, className: "mt-6 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300", children: "Exportar a Excel" }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 184,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "mt-6 bg-blue-100 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxDEV4("h3", { className: "text-xl font-bold mb-2 text-blue-600", children: "Algoritmo Utilizado" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 189,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("p", { children: "Para encontrar la ruta \xF3ptima de conversi\xF3n, se utiliz\xF3 el siguiente enfoque:" }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 190,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("ul", { className: "list-disc list-inside mt-2", children: [
          /* @__PURE__ */ jsxDEV4("li", { children: [
            /* @__PURE__ */ jsxDEV4("strong", { children: "B\xFAsqueda en Profundidad (DFS) con Backtracking:" }, void 0, !1, {
              fileName: "app/routes/optimizacion-divisas.tsx",
              lineNumber: 192,
              columnNumber: 19
            }, this),
            " Se explora el espacio de soluciones utilizando una b\xFAsqueda en profundidad, construyendo rutas de conversi\xF3n paso a paso."
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 192,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV4("li", { children: [
            /* @__PURE__ */ jsxDEV4("strong", { children: "Poda (Pruning):" }, void 0, !1, {
              fileName: "app/routes/optimizacion-divisas.tsx",
              lineNumber: 193,
              columnNumber: 19
            }, this),
            " Se descartan rutas parciales que exceden el n\xFAmero m\xE1ximo de pasos o violan la restricci\xF3n de repetici\xF3n de monedas."
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 193,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV4("li", { children: [
            /* @__PURE__ */ jsxDEV4("strong", { children: "Optimizaci\xF3n Greedy:" }, void 0, !1, {
              fileName: "app/routes/optimizacion-divisas.tsx",
              lineNumber: 194,
              columnNumber: 19
            }, this),
            " En cada paso, se selecciona la mejor conversi\xF3n disponible basada en las tasas de cambio actuales."
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-divisas.tsx",
            lineNumber: 194,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 191,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("p", { className: "mt-2", children: "El algoritmo construye un \xE1rbol de decisiones, donde cada nodo representa una conversi\xF3n de moneda. Se exploran todas las rutas posibles hasta el l\xEDmite de pasos especificado, manteniendo un registro de la mejor ruta encontrada. La poda ayuda a reducir el espacio de b\xFAsqueda, mientras que la heur\xEDstica greedy gu\xEDa la exploraci\xF3n hacia soluciones potencialmente \xF3ptimas." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 196,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("p", { className: "mt-2", children: "Complejidad: En el peor caso, la complejidad temporal es exponencial O(b^d), donde b es el factor de ramificaci\xF3n (n\xFAmero promedio de conversiones posibles en cada paso) y d es la profundidad m\xE1xima (n\xFAmero m\xE1ximo de pasos). Sin embargo, las t\xE9cnicas de poda y la heur\xEDstica greedy ayudan a reducir significativamente el tiempo de ejecuci\xF3n en la pr\xE1ctica." }, void 0, !1, {
          fileName: "app/routes/optimizacion-divisas.tsx",
          lineNumber: 197,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 188,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 147,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 60,
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
  return /* @__PURE__ */ jsxDEV4("div", { className: "border p-4 rounded mb-4 bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV4(
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
        lineNumber: 218,
        columnNumber: 7
      },
      this
    ),
    house.exchanges.map((exchange, index) => /* @__PURE__ */ jsxDEV4("div", { className: "flex flex-wrap -mx-2 mb-2", children: [
      /* @__PURE__ */ jsxDEV4("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV4(
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
          lineNumber: 228,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 227,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV4(
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
          lineNumber: 237,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 236,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV4(
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
          lineNumber: 246,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 245,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "px-2 w-1/4", children: /* @__PURE__ */ jsxDEV4(
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
          lineNumber: 255,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/optimizacion-divisas.tsx",
        lineNumber: 254,
        columnNumber: 11
      }, this)
    ] }, index, !0, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 226,
      columnNumber: 9
    }, this)),
    /* @__PURE__ */ jsxDEV4("button", { type: "button", onClick: addExchange, className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300", children: "Agregar Cambio" }, void 0, !1, {
      fileName: "app/routes/optimizacion-divisas.tsx",
      lineNumber: 265,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/optimizacion-divisas.tsx",
    lineNumber: 217,
    columnNumber: 5
  }, this);
}
var action = async ({ request }) => {
  let formData = await request.formData(), amount = Number(formData.get("amount")), currency = formData.get("currency"), exchangeHouses = JSON.parse(formData.get("exchangeHouses")), maxSteps = Number(formData.get("maxSteps")), allowRepetitions = formData.get("allowRepetitions") === "true";
  console.log("Input data:", JSON.stringify({ amount, currency, exchangeHouses, maxSteps, allowRepetitions }, null, 2));
  let result = findBestConversionPath(amount, currency, exchangeHouses, maxSteps, allowRepetitions);
  return console.log("Result:", JSON.stringify(result, null, 2)), json2({ result });
};

// app/routes/optimizacion-global.tsx
var optimizacion_global_exports = {};
__export(optimizacion_global_exports, {
  action: () => action2,
  default: () => OptimizacionGlobal,
  loader: () => loader2
});
import { useState as useState2, useEffect } from "react";
import { useLoaderData as useLoaderData2, useFetcher } from "@remix-run/react";
import { json as json3 } from "@remix-run/node";

// app/server/kruskalMST.server.ts
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile as writeFile2 } from "fs/promises";
import path from "path";
var execAsync = promisify(exec);
async function executeKruskalMST(nodes, exchangeHouses, balanceOption) {
  try {
    console.log("Ejecutando Kruskal MST con:", { nodes, exchangeHouses, balanceOption });
    let tempFilePath = path.join(process.cwd(), "temp_data.json");
    await writeFile2(tempFilePath, JSON.stringify({
      nodes,
      exchangeHouses,
      balanceOption
    }));
    let pythonScriptPath = path.join(process.cwd(), "kruskal_mst.py"), { stdout, stderr } = await execAsync(`python "${pythonScriptPath}" "${tempFilePath}"`);
    stderr && console.log("Informaci\xF3n de depuraci\xF3n del script Python:", stderr);
    let result = JSON.parse(stdout);
    return console.log("Resultado de Kruskal MST:", result), result;
  } catch (error) {
    throw console.error("Error executing Kruskal MST:", error), error;
  }
}

// app/utils/backupExchangeRates.ts
var BACKUP_EXCHANGE_RATES = {
  conversion_rates: {
    USD: 1,
    AED: 3.6725,
    AFN: 69.4932,
    ALL: 89.2308,
    AMD: 387.4298,
    ANG: 1.79,
    AOA: 943.6016,
    ARS: 963.75,
    AUD: 1.4682,
    AWG: 1.79,
    AZN: 1.7021,
    BAM: 1.7542,
    BBD: 2,
    BDT: 119.5699,
    BGN: 1.7541,
    BHD: 0.376,
    BIF: 2905.0535,
    BMD: 1,
    BND: 1.2925,
    BOB: 6.9338,
    BRL: 5.4253,
    BSD: 1,
    BTN: 83.658,
    BWP: 13.2132,
    BYN: 3.2441,
    BZD: 2,
    CAD: 1.3562,
    CDF: 2842.5431,
    CHF: 0.8477,
    CLP: 930.274,
    CNY: 7.0707,
    COP: 4190.0115,
    CRC: 518.5392,
    CUP: 24,
    CVE: 98.8963,
    CZK: 22.4854,
    DJF: 177.721,
    DKK: 6.6887,
    DOP: 60.1358,
    DZD: 132.3145,
    EGP: 48.5229,
    ERN: 15,
    ETB: 115.6282,
    EUR: 0.8969,
    FJD: 2.1981,
    FKP: 0.7536,
    FOK: 6.6887,
    GBP: 0.7536,
    GEL: 2.7209,
    GGP: 0.7536,
    GHS: 15.7755,
    GIP: 0.7536,
    GMD: 70.6554,
    GNF: 8668.1157,
    GTQ: 7.7418,
    GYD: 209.3503,
    HKD: 7.7942,
    HNL: 24.8621,
    HRK: 6.7577,
    HTG: 131.8006,
    HUF: 353.4699,
    IDR: 15217.9064,
    ILS: 3.7544,
    IMP: 0.7536,
    INR: 83.6635,
    IQD: 1310.1927,
    IRR: 42101.8026,
    ISK: 136.8102,
    JEP: 0.7536,
    JMD: 157.3488,
    JOD: 0.709,
    JPY: 142.833,
    KES: 129.0121,
    KGS: 84.4989,
    KHR: 4065.7833,
    KID: 1.4681,
    KMF: 441.2444,
    KRW: 1327.5731,
    KWD: 0.3051,
    KYD: 0.8333,
    KZT: 479.0194,
    LAK: 22033.7301,
    LBP: 89500,
    LKR: 303.8844,
    LRD: 199.9872,
    LSL: 17.4912,
    LYD: 4.7644,
    MAD: 9.7132,
    MDL: 17.4425,
    MGA: 4529.4094,
    MKD: 55.3224,
    MMK: 2102.7084,
    MNT: 3403.3025,
    MOP: 8.0282,
    MRU: 39.6378,
    MUR: 45.8329,
    MVR: 15.4516,
    MWK: 1741.5706,
    MXN: 19.298,
    MYR: 4.2161,
    MZN: 63.9376,
    NAD: 17.4912,
    NGN: 1635.4764,
    NIO: 36.8609,
    NOK: 10.4968,
    NPR: 133.8528,
    NZD: 1.6023,
    OMR: 0.3845,
    PAB: 1,
    PEN: 3.7581,
    PGK: 3.9302,
    PHP: 55.5287,
    PKR: 278.1398,
    PLN: 3.8293,
    PYG: 7809.8435,
    QAR: 3.64,
    RON: 4.4589,
    RSD: 104.999,
    RUB: 92.4788,
    RWF: 1348.9769,
    SAR: 3.75,
    SBD: 8.4919,
    SCR: 13.6888,
    SDG: 511.9404,
    SEK: 10.1605,
    SGD: 1.2925,
    SHP: 0.7536,
    SLE: 22.6876,
    SLL: 22687.613,
    SOS: 571.623,
    SRD: 30.0488,
    SSP: 2924.5675,
    STN: 21.974,
    SYP: 12912.0434,
    SZL: 17.4912,
    THB: 33.1548,
    TJS: 10.6323,
    TMT: 3.5011,
    TND: 3.0303,
    TOP: 2.3246,
    TRY: 34.0869,
    TTD: 6.7854,
    TVD: 1.4681,
    TWD: 31.8996,
    TZS: 2718.5753,
    UAH: 41.4641,
    UGX: 3720.5374,
    UYU: 41.1208,
    UZS: 12728.9681,
    VES: 36.8013,
    VND: 24605.2329,
    VUV: 118.2698,
    WST: 2.7074,
    XAF: 588.3258,
    XCD: 2.7,
    XDR: 0.7386,
    XOF: 588.3258,
    XPF: 107.0285,
    YER: 250.4722,
    ZAR: 17.4902,
    ZMW: 26.3613,
    ZWL: 13.9711
  }
};

// app/routes/optimizacion-global.tsx
import { Fragment as Fragment3, jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
var loader2 = async () => json3({ exchangeRates: BACKUP_EXCHANGE_RATES.conversion_rates }), action2 = async ({ request }) => {
  let formData = await request.formData(), nodes = JSON.parse(formData.get("nodes")), exchangeHouses = JSON.parse(formData.get("exchangeHouses")), balanceOption = JSON.parse(formData.get("balanceOption"));
  try {
    let result = await executeKruskalMST(nodes, exchangeHouses, balanceOption);
    return json3(result);
  } catch (error) {
    return console.error("Error optimizing transactions:", error), json3({ error: "Error optimizing transactions" }, { status: 500 });
  }
};
function OptimizacionGlobal() {
  let { exchangeRates } = useLoaderData2(), [nodes, setNodes] = useState2([]), [exchangeHouses, setExchangeHouses] = useState2([]), [optimizedTransactions, setOptimizedTransactions] = useState2([]), [newNodeName, setNewNodeName] = useState2(""), [newNodeBalance, setNewNodeBalance] = useState2(""), [newNodeCurrency, setNewNodeCurrency] = useState2("USD"), fetcher = useFetcher(), [updatedNodes, setUpdatedNodes] = useState2([]), [balanceOption, setBalanceOption] = useState2({ type: "equalize" }), [algorithmLogs, setAlgorithmLogs] = useState2([]), generateRandomNodes = (count) => {
    let companyNames = ["Acme Corp", "Globex", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises"], currencies = Object.keys(exchangeRates), newNodes = Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      name: companyNames[Math.floor(Math.random() * companyNames.length)] + " " + Math.random().toString(36).substring(7),
      balance: Math.random() * 1e4,
      // Balance between 0 and 10000
      currency: currencies[Math.floor(Math.random() * currencies.length)]
    }));
    setNodes([...nodes, ...newNodes]);
  }, addNode = (e) => {
    e.preventDefault();
    let dollarBalance = parseFloat(newNodeBalance) / exchangeRates[newNodeCurrency];
    setNodes([...nodes, {
      id: Math.random().toString(36).substr(2, 9),
      name: newNodeName,
      balance: Math.max(0, dollarBalance),
      // Ensure balance is not negative
      currency: newNodeCurrency
    }]), setNewNodeName(""), setNewNodeBalance(""), setNewNodeCurrency("USD");
  }, deleteNode = (id) => {
    setNodes(nodes.filter((node) => node.id !== id));
  }, deleteAllNodes = () => {
    setNodes([]);
  }, optimizeTransactions = () => {
    fetcher.submit(
      {
        nodes: JSON.stringify(nodes),
        exchangeHouses: JSON.stringify(exchangeHouses),
        balanceOption: JSON.stringify(balanceOption)
      },
      { method: "post" }
    );
  };
  return useEffect(() => {
    fetcher.data && !fetcher.data.error && (setOptimizedTransactions(fetcher.data.mst), setUpdatedNodes(fetcher.data.updatedNodes), setAlgorithmLogs(fetcher.data.logs));
  }, [fetcher.data]), /* @__PURE__ */ jsxDEV5("div", { className: "max-w-4xl mx-auto p-6", children: [
    /* @__PURE__ */ jsxDEV5("h1", { className: "text-3xl font-bold mb-6 text-center text-blue-600", children: "Optimizaci\xF3n Global de Transacciones" }, void 0, !1, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 144,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV5("p", { className: "text-lg mb-8 text-center text-gray-600", children: "Esta herramienta te ayuda a optimizar las transferencias entre cuentas en diferentes monedas para minimizar los costos de transacci\xF3n." }, void 0, !1, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 145,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV5("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-semibold mb-4", children: "Generar o Importar Nodos" }, void 0, !1, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 150,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5(
        "button",
        {
          onClick: () => generateRandomNodes(5),
          className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-4",
          children: "Generar 5 Nodos Aleatorios"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 151,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV5(
        "button",
        {
          onClick: deleteAllNodes,
          className: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300",
          children: "Borrar Todos los Nodos"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 157,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV5("form", { onSubmit: addNode, className: "mt-4", children: [
        /* @__PURE__ */ jsxDEV5(
          "input",
          {
            type: "text",
            value: newNodeName,
            onChange: (e) => setNewNodeName(e.target.value),
            placeholder: "Nombre del nodo",
            className: "border p-2 mr-2",
            required: !0
          },
          void 0,
          !1,
          {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 164,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5(
          "input",
          {
            type: "number",
            value: newNodeBalance,
            onChange: (e) => setNewNodeBalance(e.target.value),
            placeholder: "Balance",
            className: "border p-2 mr-2",
            required: !0
          },
          void 0,
          !1,
          {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 172,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5(
          "select",
          {
            value: newNodeCurrency,
            onChange: (e) => setNewNodeCurrency(e.target.value),
            className: "border p-2 mr-2",
            children: Object.keys(exchangeRates).map((currency) => /* @__PURE__ */ jsxDEV5("option", { value: currency, children: currency }, currency, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 186,
              columnNumber: 15
            }, this))
          },
          void 0,
          !1,
          {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 180,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5("button", { type: "submit", className: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300", children: "A\xF1adir Nodo" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 189,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 163,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 149,
      columnNumber: 7
    }, this),
    nodes.length > 0 && /* @__PURE__ */ jsxDEV5("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-semibold mb-4", children: "Nodos Actuales" }, void 0, !1, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 197,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("ul", { className: "space-y-2", children: nodes.map((node) => /* @__PURE__ */ jsxDEV5("li", { className: "flex justify-between items-center border-b pb-2", children: [
        /* @__PURE__ */ jsxDEV5("span", { className: "font-medium", children: node.name }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 201,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV5("span", { children: [
          /* @__PURE__ */ jsxDEV5("span", { className: "text-green-600", children: [
            node.balance.toFixed(2),
            " USD"
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 203,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV5("span", { className: "text-gray-500 ml-2", children: [
            "(Original: ",
            (node.balance * exchangeRates[node.currency]).toFixed(2),
            " ",
            node.currency,
            ")"
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 204,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV5(
            "button",
            {
              onClick: () => deleteNode(node.id),
              className: "ml-2 text-red-500 hover:text-red-600",
              children: "Borrar"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 207,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 202,
          columnNumber: 17
        }, this)
      ] }, node.id, !0, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 200,
        columnNumber: 15
      }, this)) }, void 0, !1, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 198,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 196,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV5("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-semibold mb-4", children: "Opciones de Balance" }, void 0, !1, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 221,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ jsxDEV5(
          "input",
          {
            type: "radio",
            id: "equalize",
            name: "balanceOption",
            checked: balanceOption.type === "equalize",
            onChange: () => setBalanceOption({ type: "equalize" }),
            className: "mr-2"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 223,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5("label", { htmlFor: "equalize", children: "Equilibrar todas las cuentas" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 231,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 222,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ jsxDEV5(
          "input",
          {
            type: "radio",
            id: "empty",
            name: "balanceOption",
            checked: balanceOption.type === "empty",
            onChange: () => setBalanceOption({ type: "empty", targetAccount: nodes[0]?.name }),
            className: "mr-2"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 234,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5("label", { htmlFor: "empty", children: "Vaciar una cuenta y repartir entre las dem\xE1s" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 242,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 233,
        columnNumber: 9
      }, this),
      balanceOption.type === "empty" && /* @__PURE__ */ jsxDEV5(
        "select",
        {
          value: balanceOption.targetAccount,
          onChange: (e) => setBalanceOption({ ...balanceOption, targetAccount: e.target.value }),
          className: "border p-2 mb-4",
          children: nodes.map((node) => /* @__PURE__ */ jsxDEV5("option", { value: node.name, children: node.name }, node.id, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 251,
            columnNumber: 15
          }, this))
        },
        void 0,
        !1,
        {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 245,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 220,
      columnNumber: 7
    }, this),
    nodes.length > 1 && /* @__PURE__ */ jsxDEV5("div", { className: "text-center mb-8", children: /* @__PURE__ */ jsxDEV5(
      "button",
      {
        onClick: optimizeTransactions,
        className: "bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105",
        children: "Optimizar Transacciones"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 259,
        columnNumber: 11
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 258,
      columnNumber: 9
    }, this),
    optimizedTransactions.length > 0 && /* @__PURE__ */ jsxDEV5(Fragment3, { children: [
      /* @__PURE__ */ jsxDEV5("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [
        /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-semibold mb-4", children: "Plan de Transferencias Optimizado" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 271,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mb-4", children: [
          "Hemos analizado tus ",
          nodes.length,
          " cuentas en ",
          new Set(nodes.map((n) => n.currency)).size,
          " monedas diferentes para crear un plan eficiente de transferencias:"
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 272,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ jsxDEV5("li", { children: [
            "En lugar de hacer ",
            nodes.length * (nodes.length - 1) / 2,
            " transferencias individuales, te sugerimos hacer solo ",
            optimizedTransactions.length,
            "."
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 277,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: [
            "El monto total involucrado en estas transferencias es de ",
            optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2),
            " USD."
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 278,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: "Este plan reduce la complejidad y potencialmente las comisiones bancarias al minimizar el n\xFAmero de transacciones." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 279,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 276,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mb-4", children: "Beneficios de este plan:" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 281,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ jsxDEV5("li", { children: "Simplificaci\xF3n: Reduces el n\xFAmero de transferencias que necesitas gestionar." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 285,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: "Potencial ahorro en comisiones: Menos transferencias podr\xEDan significar menos comisiones bancarias totales." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 286,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: "Eficiencia: Este plan conecta todas tus cuentas de la manera m\xE1s eficiente posible." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 287,
            columnNumber: 15
          }, this),
          nodes.some((n) => n.currency !== "USD") && /* @__PURE__ */ jsxDEV5("li", { children: "Manejo de m\xFAltiples divisas: El plan considera las diferentes monedas involucradas." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 289,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 284,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mb-4", children: "Plan de transferencias sugerido:" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 292,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxDEV5("thead", { children: /* @__PURE__ */ jsxDEV5("tr", { className: "bg-gray-100", children: [
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-left", children: "Desde" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 298,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-left", children: "Hacia" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 299,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-right", children: "Monto a Transferir" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 300,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 297,
            columnNumber: 17
          }, this) }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 296,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("tbody", { children: optimizedTransactions.map((transaction, index) => /* @__PURE__ */ jsxDEV5("tr", { className: "border-b", children: [
            /* @__PURE__ */ jsxDEV5("td", { className: "p-2", children: transaction.from }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 306,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV5("td", { className: "p-2", children: transaction.to }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 307,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV5("td", { className: "p-2 text-right text-blue-600 font-semibold", children: [
              transaction.weight.toFixed(2),
              " USD"
            ] }, void 0, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 308,
              columnNumber: 21
            }, this)
          ] }, index, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 305,
            columnNumber: 19
          }, this)) }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 303,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 295,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mt-4", children: [
          /* @__PURE__ */ jsxDEV5("strong", { children: "Explicaci\xF3n:" }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 316,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5 mt-2", children: [
            /* @__PURE__ */ jsxDEV5("li", { children: [
              /* @__PURE__ */ jsxDEV5("strong", { children: "Desde y Hacia:" }, void 0, !1, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 318,
                columnNumber: 21
              }, this),
              " Indican las cuentas entre las que se sugiere realizar la transferencia."
            ] }, void 0, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 318,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: [
              /* @__PURE__ */ jsxDEV5("strong", { children: "Monto a Transferir:" }, void 0, !1, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 319,
                columnNumber: 21
              }, this),
              ' Es la cantidad sugerida para transferir de la cuenta "Desde" a la cuenta "Hacia".'
            ] }, void 0, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 319,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 317,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 315,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mt-4", children: "Nota: Este plan sugiere las transferencias \xF3ptimas para conectar todas tus cuentas." }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 322,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 270,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "bg-white shadow-md rounded-lg p-6", children: [
        /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-semibold mb-4", children: "Resultados y Beneficios" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 328,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mb-4", children: "Despu\xE9s de aplicar el plan de transferencias optimizado, estos son los resultados y beneficios esperados:" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 329,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ jsxDEV5("li", { children: [
            "N\xFAmero de transacciones reducidas: de ",
            nodes.length * (nodes.length - 1) / 2,
            " a ",
            optimizedTransactions.length
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 333,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: [
            "Monto total transferido: ",
            optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2),
            " USD"
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 334,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: [
            "Eficiencia de transferencia: ",
            (100 * optimizedTransactions.length / (nodes.length * (nodes.length - 1) / 2)).toFixed(2),
            "%"
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 335,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 332,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mb-4", children: /* @__PURE__ */ jsxDEV5("strong", { children: "Nodos actualizados despu\xE9s de las transferencias:" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 338,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 337,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("table", { className: "w-full mb-4", children: [
          /* @__PURE__ */ jsxDEV5("thead", { children: /* @__PURE__ */ jsxDEV5("tr", { className: "bg-gray-100", children: [
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-left", children: "Nombre" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 343,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-right", children: "Balance Original (USD)" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 344,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-right", children: "Balance Final Real (USD)" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 345,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-right", children: "Balance Equilibrado (USD)" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 346,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV5("th", { className: "p-2 text-right", children: "Diferencia" }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 347,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 342,
            columnNumber: 17
          }, this) }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 341,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("tbody", { children: updatedNodes.map((node, index) => {
            let originalNode = nodes.find((n) => n.id === node.id), difference = (node.final_balance ?? node.balance) - (originalNode?.balance || 0);
            return /* @__PURE__ */ jsxDEV5("tr", { className: "border-b", children: [
              /* @__PURE__ */ jsxDEV5("td", { className: "p-2", children: node.name }, void 0, !1, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 356,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV5("td", { className: "p-2 text-right", children: originalNode?.balance.toFixed(2) }, void 0, !1, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 357,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV5("td", { className: "p-2 text-right", children: (node.final_balance ?? node.balance).toFixed(2) }, void 0, !1, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 358,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV5("td", { className: "p-2 text-right", children: node.balance.toFixed(2) }, void 0, !1, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 359,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV5("td", { className: `p-2 text-right ${difference > 0 ? "text-green-600" : "text-red-600"}`, children: [
                difference > 0 ? "+" : "",
                difference.toFixed(2)
              ] }, void 0, !0, {
                fileName: "app/routes/optimizacion-global.tsx",
                lineNumber: 360,
                columnNumber: 23
              }, this)
            ] }, node.id, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 355,
              columnNumber: 21
            }, this);
          }) }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 350,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 340,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "text-gray-600 mb-4", children: /* @__PURE__ */ jsxDEV5("strong", { children: "\xBFPor qu\xE9 optar por este plan?" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 369,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 368,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5 mb-4 text-gray-600", children: [
          /* @__PURE__ */ jsxDEV5("li", { children: "Minimiza el n\xFAmero de transacciones, reduciendo la complejidad operativa y los posibles errores." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 372,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: "Optimiza el flujo de dinero entre cuentas, mejorando la liquidez general." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 373,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: "Reduce potencialmente los costos de transacci\xF3n al minimizar el n\xFAmero de transferencias internacionales." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 374,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("li", { children: "Proporciona una visi\xF3n clara y estructurada de las transferencias necesarias, facilitando la planificaci\xF3n financiera." }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 375,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 371,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 327,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "bg-gray-900 text-green-400 shadow-md rounded-lg p-6 mt-8 font-mono", children: [
        /* @__PURE__ */ jsxDEV5("h2", { className: "text-2xl font-semibold mb-4 text-white", children: "Consola de Algoritmo" }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 380,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "mb-4 text-yellow-300", children: [
          /* @__PURE__ */ jsxDEV5("h3", { className: "text-xl font-semibold mb-2", children: "Uso del Algoritmo de Kruskal" }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 382,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { children: "El algoritmo de Kruskal se utiliza para encontrar el \xC1rbol de Expansi\xF3n M\xEDnima (MST) en un grafo ponderado. En nuestro caso:" }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 383,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5 mt-2", children: [
            /* @__PURE__ */ jsxDEV5("li", { children: "Cada cuenta es un nodo en el grafo." }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 385,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: "Las posibles transferencias entre cuentas son las aristas." }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 386,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: "El peso de cada arista es la cantidad de dinero a transferir." }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 387,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 384,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-2", children: "El algoritmo de Kruskal nos ayuda a:" }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 389,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5 mt-2", children: [
            /* @__PURE__ */ jsxDEV5("li", { children: "Minimizar el n\xFAmero total de transferencias necesarias." }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 391,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: "Encontrar la ruta m\xE1s eficiente para mover el dinero entre todas las cuentas." }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 392,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: "Reducir los costos potenciales asociados con m\xFAltiples transferencias." }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 393,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 390,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 381,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "h-96 overflow-y-auto bg-black p-4 rounded-lg", children: algorithmLogs.map((log, index) => {
          let logClass = "mb-1", prefix = ">";
          return log.includes("Iniciando") ? (logClass += " text-yellow-300 font-bold", prefix = "\u{1F680}") : log.includes("Opci\xF3n de balance") ? (logClass += " text-blue-300", prefix = "\u2696\uFE0F") : log.includes("Transferencias calculadas") ? (logClass += " text-purple-300", prefix = "\u{1F4B1}") : log.includes("Aristas") ? (logClass += " text-cyan-300", prefix = "\u{1F517}") : log.includes("A\xF1adida arista") ? (logClass += " text-green-300", prefix = "\u2705") : log.includes("descartada") ? (logClass += " text-red-300", prefix = "\u274C") : log.includes("Transferencia:") ? (logClass += " text-orange-300", prefix = "\u{1F4B8}") : log.includes("completado") && (logClass += " text-green-300 font-bold", prefix = "\u{1F3C1}"), /* @__PURE__ */ jsxDEV5("p", { className: logClass, children: [
            /* @__PURE__ */ jsxDEV5("span", { className: "mr-2", children: prefix }, void 0, !1, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 429,
              columnNumber: 21
            }, this),
            log
          ] }, index, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 428,
            columnNumber: 19
          }, this);
        }) }, void 0, !1, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 396,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "mt-4 text-white", children: [
          /* @__PURE__ */ jsxDEV5("h3", { className: "text-xl font-semibold mb-2", children: "Resumen del Proceso" }, void 0, !1, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 436,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV5("ul", { className: "list-disc pl-5", children: [
            /* @__PURE__ */ jsxDEV5("li", { children: [
              "Nodos procesados: ",
              nodes.length
            ] }, void 0, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 438,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: [
              "Transferencias optimizadas: ",
              optimizedTransactions.length
            ] }, void 0, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 439,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: [
              "Monto total transferido: ",
              optimizedTransactions.reduce((sum, t) => sum + t.weight, 0).toFixed(2),
              " USD"
            ] }, void 0, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 440,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("li", { children: [
              "Eficiencia de transferencia: ",
              (100 * optimizedTransactions.length / (nodes.length * (nodes.length - 1) / 2)).toFixed(2),
              "%"
            ] }, void 0, !0, {
              fileName: "app/routes/optimizacion-global.tsx",
              lineNumber: 441,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/optimizacion-global.tsx",
            lineNumber: 437,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/optimizacion-global.tsx",
          lineNumber: 435,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/optimizacion-global.tsx",
        lineNumber: 379,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/optimizacion-global.tsx",
      lineNumber: 269,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/optimizacion-global.tsx",
    lineNumber: 143,
    columnNumber: 5
  }, this);
}

// app/routes/register.tsx
var register_exports = {};
__export(register_exports, {
  action: () => action3,
  default: () => Register,
  loader: () => loader3
});
import { json as json4, redirect as redirect2 } from "@remix-run/node";
import { Form as Form2, useActionData as useActionData2 } from "@remix-run/react";
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
var loader3 = async ({ request }) => await getUser(request) ? redirect2("/") : json4({}), action3 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return json4({ error: "Invalid form data" }, { status: 400 });
  if (await db.user.findUnique({ where: { username } }))
    return json4({ error: "A user with this username already exists" }, { status: 400 });
  let user = await register({ username, password });
  return user ? createUserSession(user.id, redirectTo, !0) : json4({ error: "Unable to create user" }, { status: 400 });
};
function Register() {
  let actionData = useActionData2();
  return /* @__PURE__ */ jsxDEV6("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ jsxDEV6("div", { className: "mx-auto w-full max-w-md px-8", children: [
    /* @__PURE__ */ jsxDEV6(Form2, { method: "post", className: "space-y-6", children: [
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
  loader: () => loader4
});
import { redirect as redirect3 } from "@remix-run/node";
var action4 = async ({ request }) => logout(request), loader4 = async () => redirect3("/");

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  action: () => action5,
  default: () => Index,
  loader: () => loader5
});
import { json as json7 } from "@remix-run/node";
import { useLoaderData as useLoaderData4, useActionData as useActionData3, Form as Form3, useFetcher as useFetcher2, useSubmit as useSubmit2 } from "@remix-run/react";
import { useState as useState4, useEffect as useEffect3, useCallback } from "react";

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
    operationFailed: "La operaci\xF3n fall\xF3 o devolvi\xF3 datos inesperados",
    equalSplitExplanation: "Para el c\xE1lculo de divisiones iguales, se utiliz\xF3 un algoritmo de Fuerza Bruta. Este m\xE9todo suma todos los gastos, divide el total entre el n\xFAmero de participantes y luego calcula las diferencias individuales.",
    individualSplitExplanation: "Para el c\xE1lculo de divisiones individuales, se aplic\xF3 un algoritmo de Programaci\xF3n Din\xE1mica. Este m\xE9todo optimiza las transferencias considerando los gastos individuales y las deudas acumuladas.",
    floydWarshallExplanation: "Adicionalmente, se aplic\xF3 el algoritmo de Floyd-Warshall para optimizar las transferencias. Este algoritmo de grafos encuentra las rutas m\xE1s cortas entre todos los pares de nodos, minimizando el n\xFAmero de transferencias necesarias.",
    algorithmExplanationTitle: "Explicaci\xF3n del Algoritmo"
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
    operationFailed: "The operation failed or returned unexpected data",
    equalSplitExplanation: "For equal split calculations, a Brute Force algorithm was used. This method sums up all expenses, divides the total by the number of participants, and then calculates individual differences.",
    individualSplitExplanation: "For individual split calculations, a Dynamic Programming algorithm was applied. This method optimizes transfers considering individual expenses and accumulated debts.",
    floydWarshallExplanation: "Additionally, the Floyd-Warshall algorithm was applied to optimize transfers. This graph algorithm finds the shortest paths between all pairs of nodes, minimizing the number of necessary transfers.",
    algorithmExplanationTitle: "Algorithm Explanation"
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
import { Fragment as Fragment4, jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
var loader5 = async ({ request }) => {
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
  let { user, juntas: initialJuntas, localExpenses: initialLocalExpenses, invitations: initialInvitations } = useLoaderData4(), actionData = useActionData3(), [language, setLanguage] = useState4("es"), [showTutorial, setShowTutorial] = useState4(user?.isNewUser ?? !1), [selectedJunta, setSelectedJunta] = useState4(null), [showNotifications, setShowNotifications] = useState4(!1), [splits, setSplits] = useState4([]), [splitAmongAll, setSplitAmongAll] = useState4(!1), [juntas, setJuntas] = useState4(initialJuntas.map(convertDates)), [localExpenses, setLocalExpenses] = useState4(initialLocalExpenses), [invitations, setInvitations] = useState4(initialInvitations), fetcher = useFetcher2(), submit = useSubmit2(), t = translations[language], toggleLanguage = () => {
    setLanguage((prev) => prev === "es" ? "en" : "es");
  }, [splitType, setSplitType] = useState4("equal"), [algorithmExplanation, setAlgorithmExplanation] = useState4(""), handleCalculateSplits = useCallback(() => {
    if (selectedJunta) {
      let calculatedSplits = splitType === "equal" ? calculateEqualSplits(selectedJunta.expenses, selectedJunta.members) : calculateIndividualSplits(selectedJunta.expenses, selectedJunta.members);
      setSplits(calculatedSplits), setAlgorithmExplanation(splitType === "equal" ? t.equalSplitExplanation : t.individualSplitExplanation);
      let optimizedSplits = floydWarshall(calculatedSplits);
      setSplits(optimizedSplits), setAlgorithmExplanation(
        (prevExplanation) => `${prevExplanation}

${t.floydWarshallExplanation}`
      );
    } else if (user) {
      let calculatedSplits = splitType === "equal" ? calculateEqualSplits(localExpenses, [user]) : calculateIndividualSplits(localExpenses, [user]);
      setSplits(calculatedSplits);
    }
  }, [selectedJunta, localExpenses, user, splitType, t]);
  useEffect3(() => {
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
    for (useEffect3(() => {
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
  return useEffect3(() => {
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
  }, [fetcher.data, fetcher.state, selectedJunta]), useEffect3(() => {
    actionData?.junta && setSelectedJunta(convertDates(actionData.junta));
  }, [actionData]), /* @__PURE__ */ jsxDEV8("div", { className: "container mx-auto p-4 bg-gray-100 min-h-screen", children: [
    user ? /* @__PURE__ */ jsxDEV8(Fragment4, { children: [
      /* @__PURE__ */ jsxDEV8("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h1", { className: "text-3xl font-bold text-blue-600", children: [
          t.welcome,
          ", ",
          user.username,
          "!"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 329,
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
              lineNumber: 331,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8(Form3, { method: "post", children: [
            /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "logout" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 338,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.logout }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 339,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 337,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 330,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 328,
        columnNumber: 11
      }, this),
      showTutorial && /* @__PURE__ */ jsxDEV8("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-bold mb-4", children: t.tutorial.welcome }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 348,
          columnNumber: 15
        }, this),
        t.tutorial.algorithms.map((algo, index) => /* @__PURE__ */ jsxDEV8("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("h3", { className: "text-xl font-semibold", children: algo.name }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 351,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV8("p", { children: algo.description }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 352,
            columnNumber: 19
          }, this)
        ] }, index, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 350,
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
            lineNumber: 355,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 347,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.createJunta }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 365,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8(Form3, { method: "post", className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "createJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 367,
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
              lineNumber: 368,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.create }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 375,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 366,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 364,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.yourJuntas }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 382,
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
                lineNumber: 391,
                columnNumber: 17
              }, this),
              juntas.map((j) => /* @__PURE__ */ jsxDEV8("option", { value: j.id, children: j.name }, j.id, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 393,
                columnNumber: 19
              }, this))
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 384,
            columnNumber: 15
          },
          this
        ) : /* @__PURE__ */ jsxDEV8("p", { children: t.noJuntas }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 399,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 381,
        columnNumber: 11
      }, this),
      selectedJunta && /* @__PURE__ */ jsxDEV8("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h3", { className: "text-xl font-semibold mb-4 text-blue-700", children: selectedJunta.name }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 405,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8(Form3, { method: "post", onSubmit: handleInviteUser, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "inviteToJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 408,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 409,
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
                lineNumber: 411,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.invite }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 418,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 410,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 407,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8(Form3, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "addJuntaExpense" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 425,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 426,
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
                lineNumber: 428,
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
                lineNumber: 435,
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
                  lineNumber: 443,
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
                    lineNumber: 452,
                    columnNumber: 23
                  },
                  this
                ),
                t.splitAmongAll
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 451,
                columnNumber: 21
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 442,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 427,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addExpense }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 462,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 424,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: t.juntaExpenses }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 469,
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
              lineNumber: 473,
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
            lineNumber: 472,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 470,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 468,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: t.myExpenses }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 490,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: selectedJunta.expenses.filter((e) => e.paidBy === user?.id).map((expense) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV8("span", { children: [
              expense.description,
              " - ",
              expense.amount.toFixed(2)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 494,
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
                lineNumber: 495,
                columnNumber: 23
              },
              this
            )
          ] }, expense.id, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 493,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 491,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 489,
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
              lineNumber: 507,
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
              lineNumber: 516,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 506,
          columnNumber: 15
        }, this),
        splits.length > 0 && /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: splitType === "equal" ? t.generalSplitsEqual : t.generalSplitsIndividual }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 530,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 535,
            columnNumber: 23
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 533,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 529,
          columnNumber: 17
        }, this),
        splits.length > 0 && /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("h4", { className: "text-lg font-semibold text-blue-600", children: t.mySplits }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 546,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: splits.filter((split) => split.from === user?.username || split.to === user?.username).map((split, index) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded", children: split.from === user?.username ? `${t.youOwe} ${split.to}: ${split.amount.toFixed(2)}` : `${split.from} ${t.owesYou}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 549,
            columnNumber: 23
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 547,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 545,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV8(Form3, { method: "post", className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "clearJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 560,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 561,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.clearJunta }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 562,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 559,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 404,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV8("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.localExpenses }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 570,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8(Form3, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV8("input", { type: "hidden", name: "action", value: "addLocalExpense" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 572,
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
                lineNumber: 574,
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
                lineNumber: 581,
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
                lineNumber: 588,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 573,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV8("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addLocalExpense }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 596,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 571,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: localExpenses.map((expense) => /* @__PURE__ */ jsxDEV8("li", { className: "flex justify-between items-center bg-gray-100 p-2 rounded", children: [
          /* @__PURE__ */ jsxDEV8("span", { children: [
            expense.description,
            " - ",
            expense.amount.toFixed(2)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 604,
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
              lineNumber: 605,
              columnNumber: 19
            },
            this
          )
        ] }, expense.id, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 603,
          columnNumber: 17
        }, this)) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 601,
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
            lineNumber: 615,
            columnNumber: 13
          },
          this
        ),
        splits.length > 0 && /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV8("h3", { className: "text-lg font-semibold text-blue-600", children: t.splits }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 624,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV8("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ jsxDEV8("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 627,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 625,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 623,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 569,
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
          lineNumber: 636,
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
          lineNumber: 643,
          columnNumber: 13
        },
        this
      ),
      algorithmExplanation && /* @__PURE__ */ jsxDEV8("div", { className: "mt-4 bg-white p-4 rounded-lg shadow", children: [
        /* @__PURE__ */ jsxDEV8("h3", { className: "text-lg font-semibold mb-2", children: t.algorithmExplanationTitle }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 652,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8("p", { className: "whitespace-pre-line", children: algorithmExplanation }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 653,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 651,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 327,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV8("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV8("p", { className: "mb-4 text-xl", children: t.pleaseLogin }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 661,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "space-x-4", children: [
        /* @__PURE__ */ jsxDEV8("a", { href: "/login", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.login }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 663,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV8("a", { href: "/register", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.register }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 666,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 662,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 660,
      columnNumber: 9
    }, this),
    actionData?.error && /* @__PURE__ */ jsxDEV8("div", { className: "text-red-500 mt-4 p-2 bg-red-100 rounded", children: actionData.error }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 674,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 325,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action6,
  default: () => Login,
  loader: () => loader6
});
import { json as json8, redirect as redirect4 } from "@remix-run/node";
import { Form as Form4, useActionData as useActionData4 } from "@remix-run/react";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
var loader6 = async ({ request }) => await getUser(request) ? redirect4("/") : json8({}), action6 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return json8({ error: "Invalid form data" }, { status: 400 });
  let user = await login({ username, password });
  return user ? createUserSession(user.id, redirectTo) : json8({ error: "Invalid username or password" }, { status: 400 });
};
function Login() {
  let actionData = useActionData4();
  return /* @__PURE__ */ jsxDEV9("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ jsxDEV9("div", { className: "mx-auto w-full max-w-md px-8", children: [
    /* @__PURE__ */ jsxDEV9(Form4, { method: "post", className: "space-y-6", children: [
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
var assets_manifest_default = { entry: { module: "/build/entry.client-4BIYH5ID.js", imports: ["/build/_shared/chunk-O4BRYNJ4.js", "/build/_shared/chunk-SNZIFTKA.js", "/build/_shared/chunk-KHA4OLT4.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-U4FRFQSK.js", "/build/_shared/chunk-XGOTYLZ5.js", "/build/_shared/chunk-7M6SC7J5.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-5F6IQVT2.js", imports: ["/build/_shared/chunk-G7CHZRZX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-UILKNJYL.js", imports: ["/build/_shared/chunk-E7TNPIXH.js", "/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-4DDJMFTN.js", imports: ["/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-GGSXPJWV.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/optimizacion-divisas": { id: "routes/optimizacion-divisas", parentId: "root", path: "optimizacion-divisas", index: void 0, caseSensitive: void 0, module: "/build/routes/optimizacion-divisas-UJ5MIPVN.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/optimizacion-global": { id: "routes/optimizacion-global", parentId: "root", path: "optimizacion-global", index: void 0, caseSensitive: void 0, module: "/build/routes/optimizacion-global-CFXTH2YY.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/register": { id: "routes/register", parentId: "root", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/register-SCMYMTNU.js", imports: ["/build/_shared/chunk-E7TNPIXH.js", "/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "c6f64b75", hmr: { runtime: "/build/_shared\\chunk-KHA4OLT4.js", timestamp: 1727060875399 }, url: "/build/manifest-C6F64B75.js" };

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
  "routes/optimizacion-divisas": {
    id: "routes/optimizacion-divisas",
    parentId: "root",
    path: "optimizacion-divisas",
    index: void 0,
    caseSensitive: void 0,
    module: optimizacion_divisas_exports
  },
  "routes/optimizacion-global": {
    id: "routes/optimizacion-global",
    parentId: "root",
    path: "optimizacion-global",
    index: void 0,
    caseSensitive: void 0,
    module: optimizacion_global_exports
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
