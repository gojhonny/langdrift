import type { WebsiteLocale } from '../i18n/routing'

export type IntegrationId = 'github' | 'linear' | 'slack'

export interface IntegrationsMessages {
  eyebrow: string
  title: string
  description: string
  project: {
    title: string
    label: string
    description: string
    connectionLabel: string
  }
  core: {
    title: string
    badge: string
    description: string
    supporting: string
  }
  tools: Record<
    IntegrationId,
    {
      title: string
      badge: string
      description: string
      exampleLabel: string
      example: string
    }
  >
  technical: { title: string; platform: string; connectors: string }
  closing: { description: string; cta: string }
}

export const integrationsMessages = {
  en: {
    eyebrow: 'Integrations',
    title: 'Connected to the way your team works.',
    description:
      'Bring your product context and evidence into LangDrift through the SDK connection. Connect GitHub for pull request automation, mirror specs and tickets in Linear, and send relevant updates to Slack. The platform connection is the foundation; additional tools extend the workflow your team chooses.',
    project: {
      title: 'Your project',
      label: 'LangDrift SDK',
      description:
        'Prepare and send the product context and records that help explain how your product is evolving.',
      connectionLabel: 'LangDrift MCP'
    },
    core: {
      title: 'LangDrift',
      badge: 'Required for dashboard',
      description:
        'Connect your project to bring its context and evidence into the dashboard, graph, and reports.',
      supporting:
        'This is the core connection between your project and the LangDrift platform.'
    },
    tools: {
      github: {
        title: 'GitHub',
        badge: 'Required for pull requests',
        description:
          'Enable the workflow to open pull requests automatically with the defined template and the context needed for review.',
        exampleLabel: 'Pull request context',
        example:
          'Change summary, related spec, and verification notes, organized in the pull request template.'
      },
      linear: {
        title: 'Linear',
        badge: 'Optional',
        description:
          'Replicate specs and tickets in Linear so the team can follow the work in the planning tool it already uses.',
        exampleLabel: 'Shared planning context',
        example:
          "A ticket carries the related spec context into the team's planning workflow."
      },
      slack: {
        title: 'Slack',
        badge: 'Optional',
        description:
          'Send relevant updates to Slack so the team knows when there is something worth reviewing.',
        exampleLabel: 'Team notification',
        example:
          'An update highlights a product change and points the team to its context in LangDrift.'
      }
    },
    technical: {
      title: 'How the connections work',
      platform:
        'The SDK prepares and validates project data, then uses the LangDrift MCP connection to send that context to the platform. This connection supports the dashboard experience.',
      connectors:
        'External integrations extend that workflow. GitHub is required for the pull request automation described here. Linear replication and Slack notifications are optional. Each connector follows its own integration path; choosing one does not require enabling the others.'
    },
    closing: {
      description:
        "Start with the platform connection. Add the tools that support your team's workflow.",
      cta: 'Get early access'
    }
  },
  'pt-BR': {
    eyebrow: 'Integrações',
    title: 'Conectado à forma como sua equipe trabalha.',
    description:
      'Leve o contexto e as evidências do seu produto ao LangDrift pela conexão do SDK. Conecte o GitHub para automatizar a abertura de pull requests, replique specs e tickets no Linear e envie atualizações relevantes ao Slack. A conexão com a plataforma é a base; as ferramentas adicionais ampliam o fluxo que sua equipe escolhe.',
    project: {
      title: 'Seu projeto',
      label: 'LangDrift SDK',
      description:
        'Prepare e envie o contexto e os registros que ajudam a explicar como seu produto está evoluindo.',
      connectionLabel: 'LangDrift MCP'
    },
    core: {
      title: 'LangDrift',
      badge: 'Obrigatória para o dashboard',
      description:
        'Conecte seu projeto para levar seu contexto e suas evidências ao dashboard, ao grafo e aos relatórios.',
      supporting:
        'Esta é a conexão principal entre seu projeto e a plataforma LangDrift.'
    },
    tools: {
      github: {
        title: 'GitHub',
        badge: 'Necessária para pull requests',
        description:
          'Habilite o fluxo de abertura automática de pull requests com o template definido e o contexto necessário para a revisão.',
        exampleLabel: 'Contexto do pull request',
        example:
          'Resumo da mudança, spec relacionada e notas de verificação, organizados no template do pull request.'
      },
      linear: {
        title: 'Linear',
        badge: 'Opcional',
        description:
          'Replique specs e tickets no Linear para que a equipe acompanhe o trabalho na ferramenta de planejamento que já utiliza.',
        exampleLabel: 'Contexto compartilhado de planejamento',
        example:
          'Um ticket leva o contexto da spec relacionada ao fluxo de planejamento da equipe.'
      },
      slack: {
        title: 'Slack',
        badge: 'Opcional',
        description:
          'Envie atualizações relevantes ao Slack para que a equipe saiba quando há algo que merece revisão.',
        exampleLabel: 'Notificação para a equipe',
        example:
          'Uma atualização destaca uma mudança no produto e direciona a equipe ao seu contexto no LangDrift.'
      }
    },
    technical: {
      title: 'Como as conexões funcionam',
      platform:
        'O SDK prepara e valida os dados do projeto e usa a conexão MCP do LangDrift para enviar esse contexto à plataforma. Essa conexão sustenta a experiência do dashboard.',
      connectors:
        'As integrações externas ampliam esse fluxo. O GitHub é necessário para a automação de pull requests descrita aqui. A replicação no Linear e as notificações no Slack são opcionais. Cada conector segue seu próprio caminho de integração; escolher um não exige habilitar os demais.'
    },
    closing: {
      description:
        'Comece pela conexão com a plataforma. Adicione as ferramentas que apoiam o fluxo de trabalho da sua equipe.',
      cta: 'Solicitar acesso antecipado'
    }
  },
  'zh-Hant': {
    eyebrow: '整合',
    title: '連結團隊熟悉的工作方式。',
    description:
      '透過 SDK 連線，將產品背景與證據帶入 LangDrift。連接 GitHub 以自動建立 pull request，將規格與工作項目複製至 Linear，並將相關更新傳送到 Slack。平台連線是基礎；其他工具則延伸團隊選擇的工作流程。',
    project: {
      title: '你的專案',
      label: 'LangDrift SDK',
      description: '準備並傳送產品背景與紀錄，協助解釋產品如何持續演進。',
      connectionLabel: 'LangDrift MCP'
    },
    core: {
      title: 'LangDrift',
      badge: '使用儀表板的必要連線',
      description: '連接專案，將其背景與證據帶入儀表板、圖譜及報告。',
      supporting: '這是專案與 LangDrift 平台之間的核心連線。'
    },
    tools: {
      github: {
        title: 'GitHub',
        badge: '建立 pull request 所需',
        description:
          '啟用自動建立 pull request 的流程，使用指定範本，並附上審查所需的背景。',
        exampleLabel: 'Pull request 背景',
        example: '變更摘要、相關規格及驗證筆記，整理於 pull request 範本中。'
      },
      linear: {
        title: 'Linear',
        badge: '可選',
        description:
          '將規格與工作項目複製至 Linear，讓團隊能在既有的規劃工具中追蹤工作。',
        exampleLabel: '共享的規劃背景',
        example: '工作項目將相關規格的背景帶入團隊的規劃流程。'
      },
      slack: {
        title: 'Slack',
        badge: '可選',
        description: '將相關更新傳送到 Slack，讓團隊知道何時有值得檢視的事項。',
        exampleLabel: '團隊通知',
        example: '更新突顯一項產品變更，並引導團隊前往 LangDrift 了解其背景。'
      }
    },
    technical: {
      title: '連線如何運作',
      platform:
        'SDK 會準備並驗證專案資料，再透過 LangDrift MCP 連線將這些背景傳送至平台。這條連線支援儀表板體驗。',
      connectors:
        '外部整合會延伸這個流程。此處說明的 pull request 自動化需要 GitHub。在 Linear 複製資料與透過 Slack 傳送通知則為可選。每個連接器都有各自的整合途徑；選擇其中一個並不需要啟用其他連接器。'
    },
    closing: {
      description: '先建立平台連線，再加入支援團隊工作流程的工具。',
      cta: '申請搶先體驗'
    }
  },
  ja: {
    eyebrow: '連携',
    title: 'チームの働き方につながる。',
    description:
      'SDK 接続を通じて、製品の背景と証拠を LangDrift に取り込みます。GitHub を接続してプルリクエストの作成を自動化し、仕様やチケットを Linear に複製し、関連する更新を Slack に送信します。プラットフォームとの接続を基盤に、追加のツールがチームの選ぶワークフローを広げます。',
    project: {
      title: 'あなたのプロジェクト',
      label: 'LangDrift SDK',
      description:
        '製品がどのように進化しているかを説明するための背景と記録を準備し、送信します。',
      connectionLabel: 'LangDrift MCP'
    },
    core: {
      title: 'LangDrift',
      badge: 'ダッシュボードに必要',
      description:
        'プロジェクトを接続し、その背景と証拠をダッシュボード、グラフ、レポートに取り込みます。',
      supporting:
        'プロジェクトと LangDrift プラットフォームをつなぐ基本の接続です。'
    },
    tools: {
      github: {
        title: 'GitHub',
        badge: 'プルリクエストに必要',
        description:
          '定められたテンプレートとレビューに必要な背景を添えて、プルリクエストを自動作成するワークフローを有効にします。',
        exampleLabel: 'プルリクエストの背景',
        example:
          '変更の概要、関連する仕様、検証メモをプルリクエストのテンプレートにまとめます。'
      },
      linear: {
        title: 'Linear',
        badge: '任意',
        description:
          '仕様やチケットを Linear に複製し、チームが普段使う計画ツールで作業を追えるようにします。',
        exampleLabel: '共有する計画の背景',
        example:
          'チケットが、関連する仕様の背景をチームの計画ワークフローに伝えます。'
      },
      slack: {
        title: 'Slack',
        badge: '任意',
        description:
          '関連する更新を Slack に送り、確認する価値のある出来事をチームに知らせます。',
        exampleLabel: 'チームへの通知',
        example:
          '更新は製品の変更を取り上げ、その背景を確認できる LangDrift へチームを案内します。'
      }
    },
    technical: {
      title: '接続の仕組み',
      platform:
        'SDK がプロジェクトのデータを準備・検証し、LangDrift MCP 接続を使ってその背景をプラットフォームに送信します。この接続がダッシュボードの体験を支えます。',
      connectors:
        '外部連携はこのワークフローを広げます。ここで説明するプルリクエストの自動化には GitHub が必要です。Linear への複製と Slack への通知は任意です。各コネクターはそれぞれの方法で連携するため、一つを選んでも、ほかを有効にする必要はありません。'
    },
    closing: {
      description:
        'まずプラットフォームを接続し、チームのワークフローを支えるツールを追加しましょう。',
      cta: '早期アクセスを申し込む'
    }
  }
} satisfies Record<WebsiteLocale, IntegrationsMessages>
