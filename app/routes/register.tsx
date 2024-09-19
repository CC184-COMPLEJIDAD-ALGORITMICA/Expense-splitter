import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { createUserSession, getUser, register } from "~/auth.server";
import { db } from "~/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) {
    return json({ error: "A user with this username already exists" }, { status: 400 });
  }

  const user = await register({ username, password });
  if (!user) {
    return json({ error: "Unable to create user" }, { status: 400 });
  }

  return createUserSession(user.id, redirectTo, true);
};

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                required
                autoFocus={true}
                name="username"
                type="text"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a className="text-blue-500 underline" href="/login">
              Log in
            </a>
          </div>
        </Form>
        {actionData?.error ? (
          <div className="pt-1 text-red-700" id="error-message">
            {actionData.error}
          </div>
        ) : null}
      </div>
    </div>
  );
}