import {json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import type {LinksFunction, LoaderFunctionArgs} from "@remix-run/node";
import {commitSession, getSession} from "./services/session.server";

import "remixicon/fonts/remixicon.css";
import "./tailwind.css";
import {useChangeLanguage} from "remix-i18next/react";
import {useSSR, useTranslation} from "react-i18next";
import SideBar from "./components/SideBar";
import SideMenu from "./components/SideMenu";
import {ShouldRevalidateFunction, useLocation} from "react-router-dom";
import {createSupabaseServerClient} from "./services/upabase.server";
import {ProfileProvider} from "./context/ProfileContext";
import {Profile, toProfile} from "~/models/Profile";
import i18next from "~/i18n/i18next.server";
import {useEffect} from "react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const shouldRevalidate: ShouldRevalidateFunction = ({}) => {
  return false;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const { supabase } = createSupabaseServerClient(request);
  const user = session.get("user");

  let profile = null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .single();

  profile = toProfile(data);
  console.log('profile.locale', profile.locale)

  if (!error) {
    session.set("profileId", profile?.id);
  }

  const storedLanguage =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const locale = storedLanguage || (await i18next.getLocale(request));
  return json(
      {userProfile: profile, user, locale},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};


// export const handle = {
//   i18n: "common",
// };
export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const {userProfile, locale} = useLoaderData<{
    userProfile: Profile,
    locale: string,
    user: any
  }>();

  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  // On component mount, check if a language is saved in localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const fullScreenPaths = ["/lessons", "/plans", "/read"];
  const isFullScreen = fullScreenPaths.some((value) =>
    location.pathname.startsWith(value)
  );

  return (
      <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {isAuthPage ? (
            <ProfileProvider userProfile={userProfile}>
              <main className="flex items-center justify-center h-screen">
                {children}
              </main>
            </ProfileProvider>

        ) : (
            <ProfileProvider userProfile={userProfile}>
              {isFullScreen && (
                  <section className="h-full w-full">{children}</section>
            )}
            {!isFullScreen && (
              <section
                className="
            flex flex-col-reverse md:flex-row lg:flex-row items-center
            w-screen h-screen p-4 md:p-8 lg:p-8 overflow-hidden"
              >
                <SideMenu />
                <section className="h-full w-full pb-4 md:p-8 lg:p-8 overflow-y-scroll">
                  {children}
                </section>
                <SideBar />
              </section>
            )}
            </ProfileProvider>
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
