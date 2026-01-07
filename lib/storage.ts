const LANG_KEY = "drashort_lang"

export function getLang(def = "en") {
  if (typeof window === "undefined") return def
  return localStorage.getItem(LANG_KEY) ?? def
}
export function setLang(lang: string) {
  localStorage.setItem(LANG_KEY, lang)
}