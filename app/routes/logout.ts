import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/session.server";

export const action = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/auth", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
