import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { useProfile } from "~/context/ProfileContext";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const fetcher = useFetcher();
  const {profile} = useProfile();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    fetcher.submit({ lang }, { method: "patch", action: "/profile" });
  };

  // On component mount, check if a language is saved in localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    if (profile && profile?.locale) {
      i18n.changeLanguage(profile?.locale);
      localStorage.setItem("language", profile?.locale);
    }
  }, [profile]);

  return (
    // <fetcher.Form method="put">
    <div className="flex gap-1">
      <button
        className="bg-white w-12 rounded-lg"
        onClick={() => changeLanguage("en")}
      >
        🇬🇧
      </button>
      <button
        className="bg-white w-12 rounded-lg"
        onClick={() => changeLanguage("ar")}
      >
        🇸🇦
      </button>
    </div>
    // </fetcher.Form>
  );
}
