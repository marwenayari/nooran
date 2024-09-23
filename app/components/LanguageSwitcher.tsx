import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  // On component mount, check if a language is saved in localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
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
  );
}
