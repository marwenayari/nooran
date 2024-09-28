import { createServerClient } from "@supabase/ssr";
import { parse, serialize } from "cookie";

// Helper function to convert cookies from object to an array of { name, value }
const cookiesToArray = (cookies: Record<string, string>) =>
  Object.entries(cookies).map(([name, value]) => ({ name, value }));

export const createSupabaseServerClient = (request: Request) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const headers = new Headers();

  console.log("SUPABASE_URL ", process.env.SUPABASE_URL);
  console.log("SUPABASE_ANON_KEY ", process.env.SUPABASE_ANON_KEY);

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return cookiesToArray(cookies);
        },
        async setAll(newCookies) {
          newCookies.forEach(({ name, value }) => {
            headers.append(
              "Set-Cookie",
              serialize(name, value, { path: "/", httpOnly: true })
            );
          });
        },
      },
    }
  );

  return { supabase, headers };
};
