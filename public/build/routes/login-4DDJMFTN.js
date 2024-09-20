import {
  require_auth
} from "/build/_shared/chunk-IL7AJ3GD.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  useActionData
} from "/build/_shared/chunk-SNZIFTKA.js";
import {
  createHotContext
} from "/build/_shared/chunk-KHA4OLT4.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/login.tsx
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\login.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\login.tsx"
  );
  import.meta.hot.lastModified = "1726698900590.6636";
}
function Login() {
  _s();
  const actionData = useActionData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto w-full max-w-md px-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700", children: "Username" }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 66,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "username", required: true, autoFocus: true, name: "username", type: "text", className: "w-full rounded border border-gray-500 px-2 py-1 text-lg" }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 70,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 69,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login.tsx",
        lineNumber: 65,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 75,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, className: "w-full rounded border border-gray-500 px-2 py-1 text-lg" }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 79,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/login.tsx",
          lineNumber: 78,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login.tsx",
        lineNumber: 74,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400", children: "Log in" }, void 0, false, {
        fileName: "app/routes/login.tsx",
        lineNumber: 83,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "remember", name: "remember", type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/login.tsx",
            lineNumber: 88,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "remember", className: "ml-2 block text-sm text-gray-900", children: "Remember me" }, void 0, false, {
            fileName: "app/routes/login.tsx",
            lineNumber: 89,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login.tsx",
          lineNumber: 87,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center text-sm text-gray-500", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { className: "text-blue-500 underline", href: "/register", children: "Sign up" }, void 0, false, {
            fileName: "app/routes/login.tsx",
            lineNumber: 95,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login.tsx",
          lineNumber: 93,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login.tsx",
        lineNumber: 86,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/login.tsx",
      lineNumber: 64,
      columnNumber: 11
    }, this),
    actionData?.error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.error }, void 0, false, {
      fileName: "app/routes/login.tsx",
      lineNumber: 101,
      columnNumber: 32
    }, this) : null
  ] }, void 0, true, {
    fileName: "app/routes/login.tsx",
    lineNumber: 63,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/login.tsx",
    lineNumber: 62,
    columnNumber: 10
  }, this);
}
_s(Login, "fHVw5pq0Zwd2gXh2gyrnVdHnLCc=", false, function() {
  return [useActionData];
});
_c = Login;
var _c;
$RefreshReg$(_c, "Login");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Login as default
};
//# sourceMappingURL=/build/routes/login-4DDJMFTN.js.map
