import type { WebsiteLocale } from '../i18n/routing'
import type { EmailErrorCode } from '../components/early-access/form.types'

export interface EarlyAccessMessages {
  homeHeading: string
  pricingHeading: string
  description: string
  helper: string
  emailLabel: string
  placeholder: string
  submit: string
  submitting: string
  success: string
  unavailable: string
  challengeFailed: string
  challengeLabel: string
  errors: Record<EmailErrorCode, string>
}

export const earlyAccessMessages: Record<WebsiteLocale, EarlyAccessMessages> = {
  en: {
    homeHeading: 'See what clearer product decisions could mean for your team.',
    pricingHeading: 'Join early access.',
    description:
      'Join the early-adopter list for a 15-day trial when LangDrift launches.',
    helper:
      'We’ll email you when access is available. Your trial starts when your access is activated.',
    emailLabel: 'Email address',
    placeholder: 'you@company.com',
    submit: 'Join early access',
    submitting: 'Submitting…',
    success:
      'You’re on the early-access list. We’ll email you when access is available.',
    unavailable: 'We couldn’t save your request. Please try again.',
    challengeFailed: 'Please complete the security check and try again.',
    challengeLabel: 'Security check',
    errors: {
      emailRequired: 'Enter your email address.',
      emailInvalid: 'Enter a valid email address.',
      emailTooLong: 'Use an email address with 254 characters or fewer.'
    }
  },
  'pt-BR': {
    homeHeading:
      'Veja o que decisões de produto mais claras podem significar para sua equipe.',
    pricingHeading: 'Participe do acesso antecipado.',
    description:
      'Entre na lista de acesso antecipado para testar o LangDrift por 15 dias no lançamento.',
    helper:
      'Enviaremos um e-mail quando o acesso estiver disponível. Seu teste começa quando seu acesso é ativado.',
    emailLabel: 'E-mail',
    placeholder: 'voce@empresa.com',
    submit: 'Quero acesso antecipado',
    submitting: 'Enviando…',
    success:
      'Você está na lista. Avisaremos por e-mail quando o acesso estiver disponível.',
    unavailable: 'Não foi possível salvar sua solicitação. Tente novamente.',
    challengeFailed: 'Conclua a verificação de segurança e tente novamente.',
    challengeLabel: 'Verificação de segurança',
    errors: {
      emailRequired: 'Informe seu e-mail.',
      emailInvalid: 'Informe um e-mail válido.',
      emailTooLong: 'Use um e-mail com até 254 caracteres.'
    }
  },
  'zh-Hant': {
    homeHeading: '看看更清晰的產品決策能為您的團隊帶來什麼。',
    pricingHeading: '登記搶先體驗。',
    description: '加入搶先體驗名單，在 LangDrift 推出時享有 15 天試用。',
    helper:
      '存取權限開放時，我們會寄送電子郵件通知您。您的試用將在存取權限啟用時開始。',
    emailLabel: '電子郵件地址',
    placeholder: 'you@company.com',
    submit: '登記搶先體驗',
    submitting: '正在提交…',
    success: '您已加入搶先體驗名單。存取權限開放時會以電子郵件通知您。',
    unavailable: '無法儲存您的登記，請再試一次。',
    challengeFailed: '請完成安全驗證後再試一次。',
    challengeLabel: '安全驗證',
    errors: {
      emailRequired: '請輸入您的電子郵件地址。',
      emailInvalid: '請輸入有效的電子郵件地址。',
      emailTooLong: '請使用不超過 254 個字元的電子郵件地址。'
    }
  },
  ja: {
    homeHeading: 'より明確なプロダクトの意思決定が、チームにもたらす価値を。',
    pricingHeading: '先行アクセスに登録。',
    description:
      '先行アクセスリストに登録すると、LangDrift の公開時に15日間のトライアルをご利用いただけます。',
    helper:
      'アクセスが利用可能になりましたら、メールでお知らせします。トライアルは、アクセスが有効になった時点で始まります。',
    emailLabel: 'メールアドレス',
    placeholder: 'you@company.com',
    submit: '先行アクセスに登録',
    submitting: '送信中…',
    success:
      '先行アクセスに登録されました。利用可能になりましたらメールでお知らせします。',
    unavailable: '登録を保存できませんでした。もう一度お試しください。',
    challengeFailed: 'セキュリティ確認を完了して、もう一度お試しください。',
    challengeLabel: 'セキュリティ確認',
    errors: {
      emailRequired: 'メールアドレスを入力してください。',
      emailInvalid: '有効なメールアドレスを入力してください。',
      emailTooLong: 'メールアドレスは254文字以内で入力してください。'
    }
  }
}
