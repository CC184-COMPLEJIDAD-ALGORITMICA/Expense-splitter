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
var tailwind_default = "/build/_assets/tailwind-437ZUKAG.css";

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
    /* @__PURE__ */ jsxDEV2("div", { children: user ? /* @__PURE__ */ jsxDEV2("span", { className: "text-white mr-4", children: [
      "Welcome, ",
      user.username,
      "!"
    ] }, void 0, !0, {
      fileName: "app/components/Nav.tsx",
      lineNumber: 12,
      columnNumber: 13
    }, this) : /* @__PURE__ */ jsxDEV2(Fragment, { children: [
      /* @__PURE__ */ jsxDEV2(Link, { to: "/login", className: "text-white mr-4", children: "Login" }, void 0, !1, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 15,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV2(Link, { to: "/register", className: "text-white", children: "Register" }, void 0, !1, {
        fileName: "app/components/Nav.tsx",
        lineNumber: 18,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Nav.tsx",
      lineNumber: 14,
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

// app/routes/register.tsx
var register_exports = {};
__export(register_exports, {
  action: () => action,
  default: () => Register,
  loader: () => loader2
});
import { json as json2, redirect as redirect2 } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
var loader2 = async ({ request }) => await getUser(request) ? redirect2("/") : json2({}), action = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return json2({ error: "Invalid form data" }, { status: 400 });
  if (await db.user.findUnique({ where: { username } }))
    return json2({ error: "A user with this username already exists" }, { status: 400 });
  let user = await register({ username, password });
  return user ? createUserSession(user.id, redirectTo, !0) : json2({ error: "Unable to create user" }, { status: 400 });
};
function Register() {
  let actionData = useActionData();
  return /* @__PURE__ */ jsxDEV4("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ jsxDEV4("div", { className: "mx-auto w-full max-w-md px-8", children: [
    /* @__PURE__ */ jsxDEV4(Form, { method: "post", className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV4("div", { children: [
        /* @__PURE__ */ jsxDEV4("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700", children: "Username" }, void 0, !1, {
          fileName: "app/routes/register.tsx",
          lineNumber: 47,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV4(
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
      /* @__PURE__ */ jsxDEV4("div", { children: [
        /* @__PURE__ */ jsxDEV4("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }, void 0, !1, {
          fileName: "app/routes/register.tsx",
          lineNumber: 63,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV4(
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
      /* @__PURE__ */ jsxDEV4(
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
      /* @__PURE__ */ jsxDEV4("div", { className: "text-center text-sm text-gray-500", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxDEV4("a", { className: "text-blue-500 underline", href: "/login", children: "Log in" }, void 0, !1, {
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
    actionData?.error ? /* @__PURE__ */ jsxDEV4("div", { className: "pt-1 text-red-700", id: "error-message", children: actionData.error }, void 0, !1, {
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
  action: () => action2,
  loader: () => loader3
});
import { redirect as redirect3 } from "@remix-run/node";
var action2 = async ({ request }) => logout(request), loader3 = async () => redirect3("/");

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  action: () => action3,
  default: () => Index,
  loader: () => loader4
});
import { json as json4 } from "@remix-run/node";
import { useLoaderData as useLoaderData3, useActionData as useActionData2, Form as Form2, useFetcher as useFetcher2, useSubmit } from "@remix-run/react";
import { useState as useState2, useEffect, useCallback } from "react";

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

// app/actions/expenses.server.ts
async function addLocalExpense(userId, data) {
  let { description, amount, paidBy, splitAmong } = data;
  return await db.expense.create({
    data: {
      description,
      amount,
      paidBy,
      splitAmong,
      isLocal: !0,
      userId
    }
  });
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
  return await db.expense.delete({
    where: { id: expenseId }
  }), { success: !0 };
}

// app/utils/invitations.ts
async function inviteUserToJunta(juntaId, invitedUserId, inviterId) {
  try {
    console.log("Creating invitation with:", { juntaId, invitedUserId, inviterId });
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
    if (console.log("Responding to invitation:", { invitationId, accept }), accept) {
      let invitation = await db.invitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
        include: { junta: !0, invitedUser: !0 }
      });
      await db.junta.update(
        {
          where: { id: invitation.juntaId },
          data: { members: { connect: { id: invitation.invitedUserId } } }
        }
      ), console.log("Invitation accepted and user added to junta");
    } else
      await db.invitation.update({
        where: { id: invitationId },
        data: { status: "REJECTED" }
      }), console.log("Invitation rejected");
    return { success: !0, message: accept ? "Invitation accepted" : "Invitation rejected" };
  } catch (error) {
    return console.error("Error responding to invitation:", error), { success: !1, message: "Failed to respond to invitation" };
  }
}

// app/actions/juntas.server.ts
import { json as json3 } from "@remix-run/node";
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
    });
    return json3({ success: !0, junta });
  } catch (error) {
    return console.error("Error creating junta:", error), json3({ success: !1, error: "Failed to create junta" }, { status: 500 });
  }
}
async function clearJunta(juntaId) {
  try {
    return await db.juntaExpense.deleteMany({
      where: { juntaId }
    }), json3({ success: !0 });
  } catch (error) {
    return console.error("Error clearing junta:", error), json3({ success: !1, error: "Failed to clear junta" }, { status: 500 });
  }
}
async function inviteToJunta(juntaId, invitedUsername, inviterId) {
  try {
    let invitedUser = await db.user.findUnique({ where: { username: invitedUsername } });
    if (!invitedUser)
      return json3({ success: !1, message: "User not found" });
    let result = await inviteUserToJunta(juntaId, invitedUser.id, inviterId);
    return json3({ success: !0, message: "Invitation sent successfully" });
  } catch (error) {
    return console.error("Error inviting user:", error), json3({ success: !1, message: "An error occurred while sending the invitation" });
  }
}

// app/components/NotificationInbox.tsx
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
function NotificationInbox({
  userId,
  initialInvitations,
  onInvitationResponse
}) {
  let [invitations, setInvitations] = useState(initialInvitations), fetcher = useFetcher(), handleInvitationResponse = (invitationId, accept) => {
    onInvitationResponse(invitationId, accept), setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
  };
  return invitations.length === 0 ? /* @__PURE__ */ jsxDEV5("p", { children: "No pending invitations" }, void 0, !1, {
    fileName: "app/components/NotificationInbox.tsx",
    lineNumber: 22,
    columnNumber: 40
  }, this) : /* @__PURE__ */ jsxDEV5("div", { children: [
    /* @__PURE__ */ jsxDEV5("h2", { children: "Invitations" }, void 0, !1, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    invitations.map((invitation) => /* @__PURE__ */ jsxDEV5("div", { className: "mb-4 p-4 border rounded", children: [
      /* @__PURE__ */ jsxDEV5("p", { children: [
        invitation.inviter.username,
        " invited you to ",
        invitation.junta.name
      ] }, void 0, !0, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 29,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("button", { onClick: () => handleInvitationResponse(invitation.id, !0), children: "Accept" }, void 0, !1, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 30,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("button", { onClick: () => handleInvitationResponse(invitation.id, !1), children: "Reject" }, void 0, !1, {
        fileName: "app/components/NotificationInbox.tsx",
        lineNumber: 31,
        columnNumber: 11
      }, this)
    ] }, invitation.id, !0, {
      fileName: "app/components/NotificationInbox.tsx",
      lineNumber: 28,
      columnNumber: 9
    }, this))
  ] }, void 0, !0, {
    fileName: "app/components/NotificationInbox.tsx",
    lineNumber: 25,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
import { Fragment as Fragment2, jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
var loader4 = async ({ request }) => {
  let user = await getUser(request);
  if (!user)
    return json4({ user: null, juntas: [], localExpenses: [], invitations: [] });
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
    return json4({ user, juntas, localExpenses, invitations });
  } catch (error) {
    return console.error("Error in loader:", error), json4({ error: "An error occurred while loading data" }, { status: 500 });
  }
}, action3 = async ({ request }) => {
  let form = await request.formData();
  switch (form.get("action")) {
    case "addLocalExpense": {
      let userId = await requireUserId(request), description = form.get("description"), amount = parseFloat(form.get("amount")), splitAmong = form.get("splitAmong");
      return await addLocalExpense(userId, { description, amount, paidBy: userId, splitAmong });
    }
    case "addJuntaExpense": {
      let userId = await requireUserId(request), juntaId = form.get("juntaId"), description = form.get("description"), amount = parseFloat(form.get("amount")), splitAmong = form.get("splitAmong");
      return console.log("Action received splitAmong:", splitAmong), splitAmong ? await addJuntaExpense(userId, { juntaId, description, amount, splitAmong }) : json4({ error: "splitAmong is required" }, { status: 400 });
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
      let invitationId = form.get("invitationId"), accept = form.get("accept") === "true";
      return await respondToInvitation(invitationId, accept), json4({ success: !0 });
    }
    case "logout":
      return await logout(request);
    default:
      return json4({ error: "Invalid action" }, { status: 400 });
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
  let { user, juntas: initialJuntas, localExpenses: initialLocalExpenses, invitations: initialInvitations } = useLoaderData3(), actionData = useActionData2(), [language, setLanguage] = useState2("es"), [showTutorial, setShowTutorial] = useState2(user?.isNewUser ?? !1), [selectedJunta, setSelectedJunta] = useState2(null), [showNotifications, setShowNotifications] = useState2(!1), [splits, setSplits] = useState2([]), [splitAmongAll, setSplitAmongAll] = useState2(!1), [juntas, setJuntas] = useState2(initialJuntas.map(convertDates)), [localExpenses, setLocalExpenses] = useState2(initialLocalExpenses), [invitations, setInvitations] = useState2(initialInvitations), fetcher = useFetcher2(), submit = useSubmit(), t = translations[language], toggleLanguage = () => {
    setLanguage((prev) => prev === "es" ? "en" : "es");
  }, [splitType, setSplitType] = useState2("equal"), handleCalculateSplits = useCallback(() => {
    if (selectedJunta) {
      let calculatedSplits = splitType === "equal" ? calculateEqualSplits(selectedJunta.expenses, selectedJunta.members) : calculateIndividualSplits(selectedJunta.expenses, selectedJunta.members);
      setSplits(calculatedSplits);
    } else if (user) {
      let calculatedSplits = splitType === "equal" ? calculateEqualSplits(localExpenses, [user]) : calculateIndividualSplits(localExpenses, [user]);
      setSplits(calculatedSplits);
    }
  }, [selectedJunta, localExpenses, user, splitType]);
  useEffect(() => {
    handleCalculateSplits();
  }, [selectedJunta, localExpenses, handleCalculateSplits]);
  let handleInviteUser = async (event) => {
    event.preventDefault();
    let form = event.currentTarget, formData = new FormData(form);
    fetcher.submit(formData, { method: "post" });
  }, handleAddExpense = (event) => {
    event.preventDefault();
    let form = event.currentTarget, formData = new FormData(form), splitAmong = formData.get("splitAmong");
    if (splitAmongAll && selectedJunta && (splitAmong = selectedJunta.members.map((member) => member.username).join(",")), !splitAmong) {
      alert(t.pleaseSpecifySplitAmong);
      return;
    }
    formData.set("splitAmong", splitAmong), selectedJunta ? (formData.set("action", "addJuntaExpense"), formData.set("juntaId", selectedJunta.id)) : formData.set("action", "addLocalExpense"), fetcher.submit(formData, { method: "post" }), form.reset();
  }, handleInvitationResponse = (invitationId, accept) => {
    if (fetcher.submit(
      { action: "respondToInvitation", invitationId, accept: accept.toString() },
      { method: "post" }
    ), setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId)), accept) {
      let acceptedInvitation = invitations.find((inv) => inv.id === invitationId);
      acceptedInvitation && acceptedInvitation.junta && setJuntas((prev) => [...prev, {
        id: acceptedInvitation.junta.id,
        name: acceptedInvitation.junta.name,
        ownerId: acceptedInvitation.inviter.id,
        members: [acceptedInvitation.inviter],
        expenses: []
      }]);
    }
  };
  useEffect(() => {
    fetcher.data && "success" in fetcher.data && (fetcher.data.success ? alert(fetcher.data.message || "Invitation sent successfully") : alert(fetcher.data.message || "Failed to invite user"));
  }, [fetcher.data]), useEffect(() => {
    actionData?.junta && setSelectedJunta(convertDates(actionData.junta));
  }, [actionData]);
  let handleDeleteExpense = (expenseId) => {
    fetcher.submit(
      { action: "deleteExpense", expenseId },
      { method: "post" }
    ), selectedJunta ? setSelectedJunta((prevJunta) => prevJunta && {
      ...prevJunta,
      expenses: prevJunta.expenses.filter((expense) => expense.id !== expenseId)
    }) : setLocalExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
  };
  return /* @__PURE__ */ jsxDEV6("div", { className: "container mx-auto p-4 bg-gray-100 min-h-screen", children: [
    user ? /* @__PURE__ */ jsxDEV6(Fragment2, { children: [
      /* @__PURE__ */ jsxDEV6("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsxDEV6("h1", { className: "text-3xl font-bold text-blue-600", children: [
          t.welcome,
          ", ",
          user.username,
          "!"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 261,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6(Form2, { method: "post", children: [
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "action", value: "logout" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 263,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.logout }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 264,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 262,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 260,
        columnNumber: 11
      }, this),
      showTutorial && /* @__PURE__ */ jsxDEV6("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ jsxDEV6("h2", { className: "text-2xl font-bold mb-4", children: t.tutorial.welcome }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 272,
          columnNumber: 15
        }, this),
        t.tutorial.algorithms.map((algo, index) => /* @__PURE__ */ jsxDEV6("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV6("h3", { className: "text-xl font-semibold", children: algo.name }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 275,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { children: algo.description }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 276,
            columnNumber: 19
          }, this)
        ] }, index, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 274,
          columnNumber: 17
        }, this)),
        /* @__PURE__ */ jsxDEV6(
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
            lineNumber: 279,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 271,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV6("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV6("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.createJunta }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 289,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6(Form2, { method: "post", className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "action", value: "createJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 291,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6(
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
              lineNumber: 292,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV6("button", { type: "submit", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.create }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 299,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 290,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 288,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV6("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.yourJuntas }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 306,
          columnNumber: 13
        }, this),
        Array.isArray(juntas) && juntas.length > 0 ? /* @__PURE__ */ jsxDEV6(
          "select",
          {
            onChange: (e) => {
              let selected = juntas.find((j) => j.id === e.target.value);
              setSelectedJunta(selected || null);
            },
            className: "w-full p-2 border rounded mb-4",
            children: [
              /* @__PURE__ */ jsxDEV6("option", { value: "", children: t.selectJunta }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 315,
                columnNumber: 17
              }, this),
              juntas.map((j) => /* @__PURE__ */ jsxDEV6("option", { value: j.id, children: j.name }, j.id, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 317,
                columnNumber: 19
              }, this))
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 308,
            columnNumber: 15
          },
          this
        ) : /* @__PURE__ */ jsxDEV6("p", { children: t.noJuntas }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 323,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 305,
        columnNumber: 11
      }, this),
      selectedJunta && /* @__PURE__ */ jsxDEV6("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [
        /* @__PURE__ */ jsxDEV6("h3", { className: "text-xl font-semibold mb-4 text-blue-700", children: selectedJunta.name }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 329,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6(Form2, { method: "post", onSubmit: handleInviteUser, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "action", value: "inviteToJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 332,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 333,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 335,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV6("button", { type: "submit", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.invite }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 342,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 334,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 331,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6(Form2, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "action", value: "addJuntaExpense" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 349,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 350,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 352,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 359,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV6("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxDEV6(
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
                  lineNumber: 367,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV6("label", { className: "ml-2 flex items-center", children: [
                /* @__PURE__ */ jsxDEV6(
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
                    lineNumber: 376,
                    columnNumber: 23
                  },
                  this
                ),
                t.splitAmongAll
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 375,
                columnNumber: 21
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 366,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 351,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addExpense }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 386,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 348,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxDEV6("h4", { className: "text-lg font-semibold text-blue-600", children: t.juntaExpenses }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 393,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("ul", { className: "space-y-2", children: selectedJunta.expenses.map((expense) => /* @__PURE__ */ jsxDEV6("li", { className: "bg-gray-100 p-2 rounded flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV6("span", { children: [
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
              lineNumber: 397,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 401,
                columnNumber: 23
              },
              this
            )
          ] }, expense.id, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 396,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 394,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 392,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxDEV6("h4", { className: "text-lg font-semibold text-blue-600", children: t.myExpenses }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 414,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("ul", { className: "space-y-2", children: selectedJunta.expenses.filter((e) => e.paidBy === user?.id).map((expense) => /* @__PURE__ */ jsxDEV6("li", { className: "bg-gray-100 p-2 rounded flex justify-between items-center", children: [
            /* @__PURE__ */ jsxDEV6("span", { children: [
              expense.description,
              " - ",
              expense.amount.toFixed(2)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 418,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 419,
                columnNumber: 23
              },
              this
            )
          ] }, expense.id, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 417,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 415,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 413,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { className: "mt-4 space-x-2", children: [
          /* @__PURE__ */ jsxDEV6(
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
              lineNumber: 431,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV6(
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
              lineNumber: 440,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 430,
          columnNumber: 15
        }, this),
        splits.length > 0 && /* @__PURE__ */ jsxDEV6("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV6("h4", { className: "text-lg font-semibold text-blue-600", children: splitType === "equal" ? t.generalSplitsEqual : t.generalSplitsIndividual }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 454,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV6("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ jsxDEV6("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 459,
            columnNumber: 23
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 457,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 453,
          columnNumber: 17
        }, this),
        splits.length > 0 && /* @__PURE__ */ jsxDEV6("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV6("h4", { className: "text-lg font-semibold text-blue-600", children: t.mySplits }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 470,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV6("ul", { className: "space-y-2", children: splits.filter((split) => split.from === user?.username || split.to === user?.username).map((split, index) => /* @__PURE__ */ jsxDEV6("li", { className: "bg-gray-100 p-2 rounded", children: split.from === user?.username ? `${t.youOwe} ${split.to}: ${split.amount.toFixed(2)}` : `${split.from} ${t.owesYou}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 473,
            columnNumber: 23
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 471,
            columnNumber: 19
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 469,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV6(Form2, { method: "post", className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "action", value: "clearJunta" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 484,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "juntaId", value: selectedJunta.id }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 485,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("button", { type: "submit", className: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition", children: t.clearJunta }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 486,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 483,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 328,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV6("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV6("h2", { className: "text-2xl font-semibold mb-4 text-blue-800", children: t.localExpenses }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 494,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6(Form2, { method: "post", onSubmit: handleAddExpense, className: "mb-4", children: [
          /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "action", value: "addLocalExpense" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 496,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 498,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 505,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV6(
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
                lineNumber: 512,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 497,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("button", { type: "submit", className: "mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.addLocalExpense }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 520,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 495,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6("ul", { className: "space-y-2", children: Array.isArray(localExpenses) && localExpenses.map((expense) => /* @__PURE__ */ jsxDEV6("li", { className: "flex justify-between items-center bg-gray-100 p-2 rounded", children: [
          /* @__PURE__ */ jsxDEV6("span", { children: [
            expense.description,
            " - ",
            expense.amount
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 528,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV6(Form2, { method: "post", children: [
            /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "action", value: "deleteExpense" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 530,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV6("input", { type: "hidden", name: "expenseId", value: expense.id }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 531,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV6("button", { type: "submit", className: "text-red-500 hover:text-red-700 transition", children: t.deleteExpense }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 532,
              columnNumber: 21
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 529,
            columnNumber: 19
          }, this)
        ] }, expense.id, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 527,
          columnNumber: 17
        }, this)) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 525,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6(
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
            lineNumber: 540,
            columnNumber: 13
          },
          this
        ),
        splits.length > 0 && /* @__PURE__ */ jsxDEV6("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV6("h3", { className: "text-lg font-semibold text-blue-600", children: t.splits }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 549,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("ul", { className: "space-y-2", children: splits.map((split, index) => /* @__PURE__ */ jsxDEV6("li", { className: "bg-gray-100 p-2 rounded", children: `${split.from} ${t.owes} ${split.to}: ${split.amount.toFixed(2)}` }, index, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 552,
            columnNumber: 21
          }, this)) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 550,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 548,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 493,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6(
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
          lineNumber: 561,
          columnNumber: 11
        },
        this
      ),
      showNotifications && user.id && /* @__PURE__ */ jsxDEV6(NotificationInbox, { userId: user.id, initialInvitations: invitations, onInvitationResponse: handleInvitationResponse }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 568,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 259,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV6("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV6("p", { className: "mb-4 text-xl", children: t.pleaseLogin }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 573,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6("div", { className: "space-x-4", children: [
        /* @__PURE__ */ jsxDEV6("a", { href: "/login", className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition", children: t.login }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 575,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6("a", { href: "/register", className: "bg-green-500 text-white p-2 rounded hover:bg-green-600 transition", children: t.register }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 578,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 574,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 572,
      columnNumber: 9
    }, this),
    actionData?.error && /* @__PURE__ */ jsxDEV6("div", { className: "text-red-500 mt-4 p-2 bg-red-100 rounded", children: actionData.error }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 586,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 257,
    columnNumber: 5
  }, this);
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action4,
  default: () => Login,
  loader: () => loader5
});
import { json as json5, redirect as redirect4 } from "@remix-run/node";
import { Form as Form3, useActionData as useActionData3 } from "@remix-run/react";
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
var loader5 = async ({ request }) => await getUser(request) ? redirect4("/") : json5({}), action4 = async ({ request }) => {
  let form = await request.formData(), username = form.get("username"), password = form.get("password"), redirectTo = form.get("redirectTo") || "/";
  if (typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return json5({ error: "Invalid form data" }, { status: 400 });
  let user = await login({ username, password });
  return user ? createUserSession(user.id, redirectTo) : json5({ error: "Invalid username or password" }, { status: 400 });
};
function Login() {
  let actionData = useActionData3();
  return /* @__PURE__ */ jsxDEV7("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ jsxDEV7("div", { className: "mx-auto w-full max-w-md px-8", children: [
    /* @__PURE__ */ jsxDEV7(Form3, { method: "post", className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV7("div", { children: [
        /* @__PURE__ */ jsxDEV7("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700", children: "Username" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 41,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV7("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV7(
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
      /* @__PURE__ */ jsxDEV7("div", { children: [
        /* @__PURE__ */ jsxDEV7("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 57,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV7("div", { className: "mt-1", children: /* @__PURE__ */ jsxDEV7(
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
      /* @__PURE__ */ jsxDEV7(
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
      /* @__PURE__ */ jsxDEV7("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV7("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV7(
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
          /* @__PURE__ */ jsxDEV7("label", { htmlFor: "remember", className: "ml-2 block text-sm text-gray-900", children: "Remember me" }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 86,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/login.tsx",
          lineNumber: 79,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV7("div", { className: "text-center text-sm text-gray-500", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsxDEV7("a", { className: "text-blue-500 underline", href: "/register", children: "Sign up" }, void 0, !1, {
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
    actionData?.error ? /* @__PURE__ */ jsxDEV7("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.error }, void 0, !1, {
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
var assets_manifest_default = { entry: { module: "/build/entry.client-WNOF6HJJ.js", imports: ["/build/_shared/chunk-O4BRYNJ4.js", "/build/_shared/chunk-SBCI5TGH.js", "/build/_shared/chunk-KHA4OLT4.js", "/build/_shared/chunk-U4FRFQSK.js", "/build/_shared/chunk-XGOTYLZ5.js", "/build/_shared/chunk-7M6SC7J5.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-2L4M7XVG.js", imports: ["/build/_shared/chunk-G7CHZRZX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-OVVI2W3J.js", imports: ["/build/_shared/chunk-E7TNPIXH.js", "/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-TTUKGLUY.js", imports: ["/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-GGSXPJWV.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/register": { id: "routes/register", parentId: "root", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/register-WRG62OVP.js", imports: ["/build/_shared/chunk-E7TNPIXH.js", "/build/_shared/chunk-IL7AJ3GD.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "1c0a01ef", hmr: { runtime: "/build/_shared\\chunk-KHA4OLT4.js", timestamp: 1726732492508 }, url: "/build/manifest-1C0A01EF.js" };

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
