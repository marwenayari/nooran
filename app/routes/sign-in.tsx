import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/session.server"; // Adjust the path as needed
import { Form, useActionData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/services/upabase.server";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (user) {
    return redirect("/");
  }

  return json({ success: true });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const { supabase, headers } = createSupabaseServerClient(request);

  // First, try to sign in the user
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    // If sign-in fails because the user doesn't exist, attempt sign-up
    if (signInError.message.includes("Invalid login credentials")) {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        return json({ success: false, error: signUpError.message });
      }

      // Optionally: Set the user in session after sign-up
      const session = await getSession(request.headers.get("Cookie"));
      session.set("user", signUpData.user);
      return redirect("/", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    } else {
      return json({ success: false, error: signInError.message });
    }
  }

  // If sign-in is successful, store the user in the session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", signInData.user);

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export default function SignIn() {
  const actionData = useActionData();

  return (
    <div className="flex items-center justify-center h-screen">
      <Form method="post" className="p-8 bg-white shadow-md rounded">
        <h2 className="text-lg font-bold">Sign In / Sign Up</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="block my-4 p-2 border"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          className="block my-4 p-2 border"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign In
        </button>
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}
      </Form>
    </div>
  );
}
