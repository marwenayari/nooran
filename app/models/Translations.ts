export interface Translations {
  [locale: string]: string
}

export function translationsToString(translations: Translations, locale: string) {
  return translations && translations[locale] ? translations[locale] : ''
}
