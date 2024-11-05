export interface Translations {
  [locale: string]: string
}

export function translationsToString(translations: Translations, locale: string) {
  const lang = locale || 'en'
  return translations && translations[lang] ? translations[lang] : ''
}
