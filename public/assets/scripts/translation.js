function TranslateInit() {
  if (!globalThis.__GOOGLE_TRANSLATION_CONFIG__) {
    return
  }
  new google.translate.TranslateElement({
    pageLanguage: globalThis.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage
  })
}
