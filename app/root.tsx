import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "remixicon/fonts/remixicon.css";

import "./tailwind.css";
import { useChangeLanguage } from "remix-i18next/react";
import i18next from "~/i18n/i18next.server";
import { useTranslation } from "react-i18next";
import SideBar from "./components/SideBar";
import SideMenu from "./components/SideMenu";

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

export async function loader({ request }: LoaderArgs) {
  let storedLanguage =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  let locale = storedLanguage || (await i18next.getLocale(request));

  return json({ locale });
}

export let handle = {
  i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  let { locale } = useLoaderData<typeof loader>();
  let { i18n } = useTranslation();

  useChangeLanguage("locale");

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <section
          className="
          flex flex-col-reverse md:flex-row lg-flex-row items-center
          w-screen h-screen p-4 md:p-8 lg:p-8 overflow-hidden"
        >
          <SideMenu />
          <section className="h-full w-full pb-4 md:p-8 lg:p-8 overflow-y-scroll">
            {children}
          </section>
          <SideBar />
        </section>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
