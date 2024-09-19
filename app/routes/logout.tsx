import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader = async () => {
  return redirect("/");
};