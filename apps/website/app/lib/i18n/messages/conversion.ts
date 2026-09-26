import type { WebsiteLocale } from '@i18n/routing'

interface ConversionCopy {
  roi: {
    eyebrow: string
    title: string
    description: string
    benefits: Record<
      'context' | 'tradeoff' | 'opportunity',
      { title: string; description: string }
    >
    earlyAccess: string
    explorePlans: string
    brief: {
      label: string
      context: string
      question: string
      evidence: [string, string, string]
    }
  }
  faq: {
    title: string
    description: string
    offer: string
    items: Record<
      | 'meaning'
      | 'expected'
      | 'connection'
      | 'tools'
      | 'trial'
      | 'free'
      | 'paid'
      | 'availability',
      { question: string; answer: string }
    >
  }
  plans: {
    metadataTitle: string
    metadataDescription: string
    skip: string
    eyebrow: string
    title: string
    introduction: string
    cards: Record<
      'trial' | 'plus' | 'pro',
      {
        name: string
        badge: string
        value: string
        support: string
        description: string
        listLabel: string
        items: [string, string, string]
        cta: string
      }
    >
    availability: string
    faqLink: string
  }
}

export const conversionMessages = {
  en: {
    roi: {
      eyebrow: 'Return on your product investment',
      title: 'Make your product investment go further.',
      description:
        'Every release commits time, talent, and budget. Understand the decisions behind your product’s evolution, revisit trade-offs before expanding your investment, and recognize opportunities worth pursuing.',
      benefits: {
        context: {
          title: 'Spend less time rebuilding context.',
          description:
            'Bring connected decisions, changes, and supporting records into the discussion, so your team can focus on what happens next.'
        },
        tradeoff: {
          title: 'Revisit the trade-off before investing further.',
          description:
            'See which compromises still serve your goals and which deserve another decision before a broader rollout.'
        },
        opportunity: {
          title: 'Recognize opportunities worth pursuing.',
          description:
            'Explore when a change reveals a promising direction—and which evidence you need before committing to it.'
        }
      },
      earlyAccess: 'Get early access',
      explorePlans: 'Explore plans',
      brief: {
        label: 'Product brief',
        context:
          'Manual setup helped bring the integration forward. Its effect on new customers still needs validation.',
        question:
          'Expand with the current setup, or invest in completing the guided experience first?',
        evidence: [
          'Recorded trade-off',
          'Implementation verification',
          'User feedback pending'
        ]
      }
    },
    faq: {
      title: 'A few things worth knowing.',
      description:
        'What drift means, how LangDrift fits your workflow, and what happens when you join early access.',
      offer:
        'LangDrift is preparing for early access, with a 15-day free trial starting when your access is activated.',
      items: {
        meaning: {
          question: 'What does “drift” mean?',
          answer:
            'Drift describes a change in relation to a product goal. It can reveal a gap, an intentional trade-off, a course correction, or a valuable discovery. Context and evidence help explain its meaning; a drift event is not a score of an individual’s performance.'
        },
        expected: {
          question: 'Does “Expected” mean a change was beneficial?',
          answer:
            'No. Expected and Unexpected describe whether a change was anticipated. Its effect on a Vision Target is a separate question. An intentional compromise can move away from a goal, while an unexpected discovery can reveal a better direction.'
        },
        connection: {
          question: 'What do I need to connect?',
          answer:
            'LangDrift’s core setup requires the platform’s SDK/MCP connection to bring project context and records into the dashboard. Additional integrations extend the workflow into the tools your team uses.'
        },
        tools: {
          question: 'Do I need GitHub, Obsidian, and Linear?',
          answer:
            'In the planned workflow, GitHub is required for automatically opening pull requests. Obsidian and Linear are optional: Obsidian can be used to begin PRDs and Research in the knowledge workspace your team already uses, while Linear can replicate specs and tickets into your planning workflow. Choose the additional connections that fit your team.'
        },
        trial: {
          question: 'When does the 15-day trial start?',
          answer:
            'Your trial starts when your access is activated, not when you join the early-adopter list. Early-access availability will be announced before activation.'
        },
        free: {
          question: 'Is there a permanent free plan?',
          answer:
            'The current early-adopter offer is a 15-day free trial. Plus and Pro are planned options for continuing afterward; their final features and pricing will be announced before launch.'
        },
        paid: {
          question: 'What is included in Plus and Pro?',
          answer:
            'Plus is being shaped around ongoing product tracking and review. Pro is being explored for deeper reporting and collaboration needs. The final plan comparison will be published before launch.'
        },
        availability: {
          question: 'Can I use LangDrift today?',
          answer:
            'LangDrift is preparing for early access. The interactive experience on this website shows the intended product direction. Access is not activated from this page.'
        }
      }
    },
    plans: {
      metadataTitle: 'Plans & early access — LangDrift',
      metadataDescription:
        'Explore LangDrift’s 15-day free trial and the planned Plus and Pro offerings. Your trial begins when access is activated; final pricing will be announced before launch.',
      skip: 'Skip to plans',
      eyebrow: 'Plans & early access',
      title: 'Find your starting point.',
      introduction:
        'Join early access to explore LangDrift with a 15-day trial. Discover the planned options for continuing as your product and team grow.',
      cards: {
        trial: {
          name: '15-day free trial',
          badge: 'Early adopter offer',
          value: '15 days',
          support: 'Starts when your access is activated',
          description:
            'Explore how your product vision connects to changes, decisions, and evidence.',
          listLabel: 'Explore the core experience',
          items: [
            'Vision → Loop → Evidence',
            'Changes and their context',
            'Core product review experience'
          ],
          cta: 'Join early access'
        },
        plus: {
          name: 'Plus',
          badge: 'Planned',
          value: 'Pricing to be announced',
          support: 'For ongoing product understanding',
          description:
            'For teams that want to keep product changes, decisions, and evidence in view.',
          listLabel: 'Planned focus',
          items: [
            'Product changes in context',
            'Connected decisions and evidence',
            'Ongoing product reviews'
          ],
          cta: 'Notify me at launch'
        },
        pro: {
          name: 'Pro',
          badge: 'Planned',
          value: 'Pricing to be announced',
          support: 'For deeper review and collaboration',
          description:
            'For teams exploring deeper review, reporting, and collaboration across product decisions.',
          listLabel: 'Planned focus',
          items: [
            'Deeper review and reporting',
            'Broader decision context',
            'Collaboration around evidence'
          ],
          cta: 'Notify me at launch'
        }
      },
      availability:
        'Plus and Pro are planned offerings. Final features and pricing will be announced before launch.',
      faqLink: 'Questions? Read the FAQ'
    }
  },
  'pt-BR': {
    roi: {
      eyebrow: 'Retorno sobre o investimento no produto',
      title: 'Faça seu investimento no produto ir mais longe.',
      description:
        'Cada release compromete tempo, talento e orçamento. Entenda as decisões por trás da evolução do seu produto, reveja concessões antes de ampliar o investimento e reconheça oportunidades que merecem ser exploradas.',
      benefits: {
        context: {
          title: 'Gaste menos tempo reconstruindo o contexto.',
          description:
            'Traga decisões, mudanças e registros de apoio conectados para a discussão, para que sua equipe possa se concentrar no próximo passo.'
        },
        tradeoff: {
          title: 'Reveja a concessão antes de investir mais.',
          description:
            'Veja quais compromissos ainda atendem aos seus objetivos e quais merecem uma nova decisão antes de uma expansão.'
        },
        opportunity: {
          title: 'Reconheça oportunidades que vale a pena explorar.',
          description:
            'Investigue quando uma mudança revela uma direção promissora — e quais evidências você precisa antes de se comprometer com ela.'
        }
      },
      earlyAccess: 'Quero acesso antecipado',
      explorePlans: 'Explorar planos',
      brief: {
        label: 'Resumo do produto',
        context:
          'A configuração manual ajudou a antecipar a integração. Seu efeito sobre novos clientes ainda precisa ser validado.',
        question:
          'Expandir com a configuração atual ou investir primeiro em concluir a experiência guiada?',
        evidence: [
          'Concessão registrada',
          'Verificação da implementação',
          'Feedback de usuários pendente'
        ]
      }
    },
    faq: {
      title: 'Algumas coisas que vale a pena saber.',
      description:
        'O que drift significa, como o LangDrift se encaixa no seu fluxo de trabalho e o que acontece ao participar do acesso antecipado.',
      offer:
        'O LangDrift está se preparando para o acesso antecipado, com um teste gratuito de 15 dias que começa quando seu acesso é ativado.',
      items: {
        meaning: {
          question: 'O que “drift” significa?',
          answer:
            'Drift descreve uma mudança em relação a um objetivo do produto. Pode revelar uma lacuna, uma concessão intencional, uma correção de rumo ou uma descoberta valiosa. Contexto e evidências ajudam a explicar seu significado; um evento de drift não é uma nota de desempenho individual.'
        },
        expected: {
          question: '“Esperado” significa que a mudança foi benéfica?',
          answer:
            'Não. Esperado e Inesperado descrevem se uma mudança foi antecipada. Seu efeito sobre um Vision Target é outra questão. Uma concessão intencional pode afastar o produto de um objetivo, enquanto uma descoberta inesperada pode revelar uma direção melhor.'
        },
        connection: {
          question: 'O que preciso conectar?',
          answer:
            'A configuração principal do LangDrift exige a conexão SDK/MCP da plataforma para levar contexto e registros do projeto ao dashboard. Integrações adicionais estendem o fluxo às ferramentas usadas pela sua equipe.'
        },
        tools: {
          question: 'Preciso de GitHub, Obsidian e Linear?',
          answer:
            'No fluxo planejado, o GitHub é necessário para abrir pull requests automaticamente. Obsidian e Linear são opcionais: o Obsidian pode ser usado para começar PRDs e Research no espaço de conhecimento que sua equipe já utiliza, enquanto o Linear pode replicar specs e tickets no seu planejamento. Escolha as conexões adicionais que fazem sentido para sua equipe.'
        },
        trial: {
          question: 'Quando começa o teste de 15 dias?',
          answer:
            'Seu teste começa quando seu acesso é ativado, não ao entrar na lista de primeiros usuários. A disponibilidade do acesso antecipado será anunciada antes da ativação.'
        },
        free: {
          question: 'Existe um plano gratuito permanente?',
          answer:
            'A oferta atual para os primeiros usuários é um teste gratuito de 15 dias. Plus e Pro são opções planejadas para continuar depois; os recursos e preços finais serão anunciados antes do lançamento.'
        },
        paid: {
          question: 'O que está incluído no Plus e no Pro?',
          answer:
            'O Plus está sendo desenvolvido em torno do acompanhamento e da revisão contínuos do produto. O Pro está sendo estudado para necessidades mais aprofundadas de relatórios e colaboração. A comparação final dos planos será publicada antes do lançamento.'
        },
        availability: {
          question: 'Já posso usar o LangDrift?',
          answer:
            'O LangDrift está se preparando para o acesso antecipado. A experiência interativa deste site apresenta a direção pretendida para o produto. O acesso não é ativado por esta página.'
        }
      }
    },
    plans: {
      metadataTitle: 'Planos e acesso antecipado — LangDrift',
      metadataDescription:
        'Conheça o teste gratuito de 15 dias do LangDrift e as ofertas planejadas Plus e Pro. O teste começa na ativação do acesso; os preços finais serão anunciados antes do lançamento.',
      skip: 'Ir para os planos',
      eyebrow: 'Planos e acesso antecipado',
      title: 'Encontre seu ponto de partida.',
      introduction:
        'Participe do acesso antecipado para explorar o LangDrift com um teste de 15 dias. Conheça as opções planejadas para continuar conforme seu produto e sua equipe crescem.',
      cards: {
        trial: {
          name: 'Teste gratuito de 15 dias',
          badge: 'Oferta para primeiros usuários',
          value: '15 dias',
          support: 'Começa quando seu acesso é ativado',
          description:
            'Explore como a visão do seu produto se conecta a mudanças, decisões e evidências.',
          listLabel: 'Explore a experiência principal',
          items: [
            'Vision → Loop → Evidence',
            'Mudanças e seu contexto',
            'Experiência central de revisão do produto'
          ],
          cta: 'Quero acesso antecipado'
        },
        plus: {
          name: 'Plus',
          badge: 'Planejado',
          value: 'Preços a anunciar',
          support: 'Para entender seu produto continuamente',
          description:
            'Para equipes que querem manter mudanças, decisões e evidências do produto à vista.',
          listLabel: 'Foco planejado',
          items: [
            'Mudanças do produto em contexto',
            'Decisões e evidências conectadas',
            'Revisões contínuas do produto'
          ],
          cta: 'Avise-me no lançamento'
        },
        pro: {
          name: 'Pro',
          badge: 'Planejado',
          value: 'Preços a anunciar',
          support: 'Para revisões e colaboração mais aprofundadas',
          description:
            'Para equipes que exploram revisões, relatórios e colaboração mais aprofundados nas decisões de produto.',
          listLabel: 'Foco planejado',
          items: [
            'Revisões e relatórios mais aprofundados',
            'Contexto mais amplo para decisões',
            'Colaboração em torno de evidências'
          ],
          cta: 'Avise-me no lançamento'
        }
      },
      availability:
        'Plus e Pro são ofertas planejadas. Os recursos e preços finais serão anunciados antes do lançamento.',
      faqLink: 'Dúvidas? Leia as perguntas frequentes'
    }
  },
  'zh-Hant': {
    roi: {
      eyebrow: '產品投資的回報',
      title: '讓產品投資發揮更大價值。',
      description:
        '每次發布都投入了時間、人才與預算。了解產品演進背後的決策，在擴大投資前重新評估取捨，並找出值得探索的機會。',
      benefits: {
        context: {
          title: '減少重建脈絡所花的時間。',
          description:
            '將相互關聯的決策、變更與佐證紀錄帶入討論，讓團隊能專注於下一步。'
        },
        tradeoff: {
          title: '追加投資前，重新評估取捨。',
          description: '了解哪些妥協仍符合目標，哪些在擴大推出前值得再次決策。'
        },
        opportunity: {
          title: '找出值得探索的機會。',
          description:
            '探索變更何時揭示了有潛力的方向，以及在投入前需要哪些證據。'
        }
      },
      earlyAccess: '登記搶先體驗',
      explorePlans: '探索方案',
      brief: {
        label: '產品摘要',
        context: '手動設定讓整合得以提早推出，但對新客戶的影響仍需要驗證。',
        question: '沿用目前設定擴大推出，還是先投入資源完成引導式體驗？',
        evidence: ['已記錄的取捨', '實作驗證', '待收集使用者回饋']
      }
    },
    faq: {
      title: '幾件值得了解的事。',
      description:
        '了解 drift 的意義、LangDrift 如何融入工作流程，以及參與搶先體驗後會發生什麼。',
      offer:
        'LangDrift 正在準備搶先體驗，提供自存取權限啟用時開始的 15 天免費試用。',
      items: {
        meaning: {
          question: '「drift」是什麼意思？',
          answer:
            'Drift 描述相對於產品目標的變化。它可能揭示落差、有意識的取捨、方向調整或有價值的發現。脈絡與證據有助於解釋其意義；drift 事件不是個人績效評分。'
        },
        expected: {
          question: '「預期內」代表變更有益嗎？',
          answer:
            '不是。預期內與預期外描述變更是否在預料之中；對 Vision Target 的影響是另一個問題。有意識的妥協可能使產品偏離目標，而意外的發現也可能揭示更好的方向。'
        },
        connection: {
          question: '需要連接什麼？',
          answer:
            'LangDrift 的核心設定需要透過平台的 SDK/MCP 連線，將專案脈絡與紀錄帶入儀表板。其他整合則將工作流程延伸到團隊使用的工具。'
        },
        tools: {
          question: '一定要使用 GitHub、Obsidian 和 Linear 嗎？',
          answer:
            '在規劃中的流程裡，自動建立 pull request 需要 GitHub。Obsidian 與 Linear 為選用：Obsidian 可用來在團隊熟悉的知識工作空間開始撰寫 PRD 與 Research，Linear 則可將規格與工單複製到規劃流程。請選擇適合團隊的額外連接。'
        },
        trial: {
          question: '15 天試用何時開始？',
          answer:
            '試用從存取權限啟用時開始，而非加入早期使用者名單時。搶先體驗的開放資訊會在啟用前公布。'
        },
        free: {
          question: '有永久免費方案嗎？',
          answer:
            '目前給早期使用者的優惠是 15 天免費試用。Plus 與 Pro 是後續使用的規劃選項；最終功能與價格將於正式推出前公布。'
        },
        paid: {
          question: 'Plus 和 Pro 包含什麼？',
          answer:
            'Plus 正以持續追蹤與檢視產品為方向規劃。Pro 則在探索更深入的報告與協作需求。最終方案比較將於正式推出前公布。'
        },
        availability: {
          question: '現在就能使用 LangDrift 嗎？',
          answer:
            'LangDrift 正在準備搶先體驗。本網站的互動體驗呈現產品預定發展的方向。此頁面不會啟用存取權限。'
        }
      }
    },
    plans: {
      metadataTitle: '方案與搶先體驗 — LangDrift',
      metadataDescription:
        '探索 LangDrift 的 15 天免費試用，以及規劃中的 Plus 和 Pro 方案。試用從存取權限啟用時開始；最終價格將於正式推出前公布。',
      skip: '跳至方案',
      eyebrow: '方案與搶先體驗',
      title: '找到適合您的起點。',
      introduction:
        '參與搶先體驗，以 15 天試用探索 LangDrift。了解隨產品與團隊成長、持續使用的規劃選項。',
      cards: {
        trial: {
          name: '15 天免費試用',
          badge: '早期使用者優惠',
          value: '15 天',
          support: '從存取權限啟用時開始',
          description: '探索產品願景如何與變更、決策及證據連結。',
          listLabel: '探索核心體驗',
          items: [
            'Vision → Loop → Evidence',
            '變更與其脈絡',
            '核心產品檢視體驗'
          ],
          cta: '登記搶先體驗'
        },
        plus: {
          name: 'Plus',
          badge: '規劃中',
          value: '價格將另行公布',
          support: '持續掌握產品',
          description: '適合希望持續掌握產品變更、決策與證據的團隊。',
          listLabel: '規劃重點',
          items: ['產品變更的脈絡', '相互關聯的決策與證據', '持續的產品檢視'],
          cta: '推出時通知我'
        },
        pro: {
          name: 'Pro',
          badge: '規劃中',
          value: '價格將另行公布',
          support: '更深入的檢視與協作',
          description: '適合探索更深入的產品決策檢視、報告與協作的團隊。',
          listLabel: '規劃重點',
          items: ['更深入的檢視與報告', '更完整的決策脈絡', '圍繞證據展開協作'],
          cta: '推出時通知我'
        }
      },
      availability:
        'Plus 與 Pro 是規劃中的方案。最終功能與價格將於正式推出前公布。',
      faqLink: '有疑問？閱讀常見問題'
    }
  },
  ja: {
    roi: {
      eyebrow: 'プロダクト投資の価値',
      title: 'プロダクトへの投資を、より大きな価値へ。',
      description:
        'リリースには時間、人材、予算が投入されます。プロダクトの進化を支える意思決定を理解し、投資を拡大する前にトレードオフを見直し、追求する価値のある機会を見つけましょう。',
      benefits: {
        context: {
          title: '背景の再構築にかかる時間を減らす。',
          description:
            '関連する意思決定、変更、裏付けとなる記録を議論に持ち込み、チームが次の行動に集中できるようにします。'
        },
        tradeoff: {
          title: '追加投資の前にトレードオフを見直す。',
          description:
            'どの妥協点が今も目標にかなっているのか、広く展開する前にどれを再判断すべきかを確認できます。'
        },
        opportunity: {
          title: '追求する価値のある機会を見つける。',
          description:
            '変更が有望な方向を示す場面と、その方向に進む前に必要な根拠を探ります。'
        }
      },
      earlyAccess: '先行アクセスに登録',
      explorePlans: 'プランを見る',
      brief: {
        label: 'プロダクトブリーフ',
        context:
          '手動セットアップにより、連携を早く提供できました。新規顧客への影響は、引き続き検証が必要です。',
        question:
          '現在のセットアップで展開を広げるか、先にガイド付き体験の完成に投資するか？',
        evidence: [
          '記録されたトレードオフ',
          '実装の検証',
          'ユーザーの声は収集待ち'
        ]
      }
    },
    faq: {
      title: '知っておきたいこと。',
      description:
        'driftの意味、LangDriftと業務のつながり、先行アクセスに参加した後の流れをご案内します。',
      offer:
        'LangDriftは先行アクセスを準備中です。15日間無料トライアルは、アクセスが有効になった時点から始まります。',
      items: {
        meaning: {
          question: '「drift」とは何ですか？',
          answer:
            'Driftはプロダクトの目標に対する変化を表します。目標との隔たり、意図的なトレードオフ、軌道修正、価値ある発見が見えてくることがあります。背景と根拠がその意味の理解を支えます。driftイベントは、個人の業績を採点するものではありません。'
        },
        expected: {
          question: '「想定どおり」なら、その変更は有益ですか？',
          answer:
            'いいえ。「想定どおり」と「想定外」は、その変更を予期していたかを表します。Vision Targetへの影響は別の問いです。意図的な妥協によって目標から離れる場合もあれば、予期しない発見がより良い方向を示す場合もあります。'
        },
        connection: {
          question: '何を接続する必要がありますか？',
          answer:
            'LangDriftの基本設定には、プロジェクトの背景情報や記録をダッシュボードに届けるため、プラットフォームのSDK/MCP接続が必要です。追加の連携により、チームが使うツールへ業務を広げられます。'
        },
        tools: {
          question: 'GitHub、Obsidian、Linearはすべて必要ですか？',
          answer:
            '計画中のワークフローでは、pull requestを自動作成するためにGitHubが必要です。ObsidianとLinearは任意です。Obsidianではチームが普段使う知識のワークスペースでPRDやResearchを書き始められ、Linearでは仕様やチケットを計画業務に複製できます。チームに合う追加接続を選べます。'
        },
        trial: {
          question: '15日間のトライアルはいつ始まりますか？',
          answer:
            'トライアルは、先行ユーザーのリストへの登録時ではなく、アクセスが有効になった時点で始まります。先行アクセスの提供については、有効化の前にお知らせします。'
        },
        free: {
          question: '永続的な無料プランはありますか？',
          answer:
            '現在の先行ユーザー向けオファーは、15日間無料トライアルです。その後の継続利用にはPlusとProを計画しています。最終的な機能と料金は、正式提供前に発表します。'
        },
        paid: {
          question: 'PlusとProには何が含まれますか？',
          answer:
            'Plusは、プロダクトを継続的に把握しレビューするためのプランとして検討しています。Proは、より深いレポートと共同作業のニーズに向けて検討中です。最終的なプラン比較は、正式提供前に公開します。'
        },
        availability: {
          question: '今すぐLangDriftを利用できますか？',
          answer:
            'LangDriftは先行アクセスを準備中です。このサイトのインタラクティブな体験では、プロダクトが目指す方向を確認できます。このページからアクセスが有効になることはありません。'
        }
      }
    },
    plans: {
      metadataTitle: 'プランと先行アクセス — LangDrift',
      metadataDescription:
        'LangDriftの15日間無料トライアルと、計画中のPlus・Proをご案内します。トライアルはアクセス有効化時に開始し、最終料金は正式提供前に発表します。',
      skip: 'プランへ移動',
      eyebrow: 'プランと先行アクセス',
      title: 'あなたに合う出発点を。',
      introduction:
        '先行アクセスに参加して、15日間のトライアルでLangDriftを体験しましょう。プロダクトとチームの成長に合わせて継続するための、計画中の選択肢をご紹介します。',
      cards: {
        trial: {
          name: '15日間無料トライアル',
          badge: '先行ユーザー向けオファー',
          value: '15日間',
          support: 'アクセスが有効になった時点で開始',
          description:
            'プロダクトのビジョンが、変更、意思決定、根拠とどのようにつながるかを確認できます。',
          listLabel: '基本の体験を探索',
          items: [
            'Vision → Loop → Evidence',
            '変更とその背景',
            'プロダクトレビューの基本体験'
          ],
          cta: '先行アクセスに登録'
        },
        plus: {
          name: 'Plus',
          badge: '計画中',
          value: '料金は後日発表',
          support: 'プロダクトの継続的な理解に',
          description:
            'プロダクトの変更、意思決定、根拠を継続的に把握したいチーム向けです。',
          listLabel: '計画中の重点',
          items: [
            '背景とともに捉えるプロダクトの変更',
            'つながる意思決定と根拠',
            '継続的なプロダクトレビュー'
          ],
          cta: '提供開始のお知らせを受け取る'
        },
        pro: {
          name: 'Pro',
          badge: '計画中',
          value: '料金は後日発表',
          support: 'より深いレビューと共同作業に',
          description:
            'プロダクトの意思決定について、より深いレビュー、レポート、共同作業を求めるチーム向けです。',
          listLabel: '計画中の重点',
          items: [
            'より深いレビューとレポート',
            '意思決定の背景を広く把握',
            '根拠を軸にした共同作業'
          ],
          cta: '提供開始のお知らせを受け取る'
        }
      },
      availability:
        'PlusとProは計画中のプランです。最終的な機能と料金は、正式提供前に発表します。',
      faqLink: 'ご質問はFAQをご覧ください'
    }
  }
} satisfies Record<WebsiteLocale, ConversionCopy>
