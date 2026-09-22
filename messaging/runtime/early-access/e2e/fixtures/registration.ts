export interface EarlyAccessRegistration {
  email: string
  locale: 'en' | 'pt-BR' | 'zh-Hant' | 'ja'
  source: 'landing' | 'pricing'
}

export const registration: EarlyAccessRegistration = {
  email: 'e2e@example.com',
  locale: 'en',
  source: 'landing'
}

export const healthOrigins = {
  emailStore: 'http://127.0.0.1:8080',
  emailSender: 'http://127.0.0.1:8081'
}
