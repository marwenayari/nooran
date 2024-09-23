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

import "./tailwind.css";
import { useChangeLanguage } from "remix-i18next/react";
import i18next from "~/i18n/i18next.server";
import { useTranslation } from "react-i18next";
import Sidebar from "./components/Sidebar";

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
  const menu = [
    { label: "Home", icon: "🛖", href: "/" },
    { label: "About", icon: "👩‍🦰", href: "/about" },
    { label: "Stories", icon: "📖", href: "/stories" },
  ];
  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex w-screen h-screen items-center p-8 overflow-hidden">
          <ul className="side-menu mr-2 h-full rounded-2xl">
            {menu.map((item) => (
              <li className="" key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center justify-center w-10 h-10 my-2"
                >
                  <span>{item.icon}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="h-full w-full p-8 overflow-y-scroll">{children}</div>
          <Sidebar />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
