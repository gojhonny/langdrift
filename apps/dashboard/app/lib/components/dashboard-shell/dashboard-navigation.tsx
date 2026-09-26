'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
  productMenuOpenAtom,
  selectedProductAtom,
  selectProductAtom,
  themeAtom
} from '@atoms'
import { Brand } from '@repo/react/ui/brand'
import {
  CaretDown,
  ChartLineUp,
  FileText,
  Gear,
  GitBranch,
  House,
  Users
} from '@repo/react/ui/icons'
import { cn } from '@template/formatters/cn.fmt'

const navigation = [
  { href: '/overview', icon: House, label: 'Overview' },
  { href: '/evolution', icon: ChartLineUp, label: 'Evolution' },
  { href: '/decisions', icon: GitBranch, label: 'Decisions' },
  { href: '/people', icon: Users, label: 'People' },
  { href: '/reports', icon: FileText, label: 'Reports' }
]

interface DashboardNavigationProps {
  mobile?: boolean
  onNavigate?: () => void
}

export function DashboardNavigation(props: DashboardNavigationProps) {
  const { mobile = false, onNavigate } = props

  const t = useTranslations('shell')
  const pathname = usePathname()
  const theme = useAtomValue(themeAtom)
  const [productMenuOpen, setProductMenuOpen] = useAtom(productMenuOpenAtom)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const selectProduct = useSetAtom(selectProductAtom)

  function chooseProduct(product: string) {
    selectProduct(product)
    if (mobile) onNavigate?.()
  }

  const linkClass = (active: boolean) =>
    cn(
      'flex items-center rounded-md text-muted no-underline hover:bg-subtle hover:text-ink',
      active && 'bg-subtle font-semibold',
      mobile
        ? 'min-h-[38px] gap-[9px] px-2.5 text-[11px]'
        : 'min-h-[30px] gap-2 px-2 text-[10px]'
    )

  return (
    <>
      <Link
        aria-label={t('overviewLink')}
        className={
          mobile
            ? 'px-1.5 pt-1 pb-4 no-underline'
            : 'px-2 pt-2 pb-3.5 no-underline'
        }
        href="/overview"
        onClick={() => onNavigate?.()}
      >
        <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
      </Link>
      <div className={cn('relative', mobile ? 'mb-3.5' : 'mb-3')}>
        <button
          aria-expanded={productMenuOpen}
          className="grid w-full min-h-11 cursor-pointer grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-[7px] rounded-lg border border-hairline bg-subtle px-2 py-1.5 text-left text-inherit"
          onClick={() => setProductMenuOpen((open) => !open)}
          type="button"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-brand-ink">
            A
          </span>
          <span className="grid min-w-0 gap-px">
            <small className="text-[8px] text-muted uppercase">
              {t('product')}
            </small>
            <strong className="truncate text-[10px]">{selectedProduct}</strong>
          </span>
          <CaretDown aria-hidden="true" size={12} />
        </button>
        {productMenuOpen ? (
          <div className="absolute inset-x-0 top-[calc(100%+5px)] z-50 grid rounded-lg border border-hairline bg-surface p-1 shadow-[0_12px_30px_rgba(0,0,0,.1)]">
            {['Atlas Home Hub', 'Atlas Checkout', 'Atlas Mobile'].map(
              (product) => (
                <button
                  className="cursor-pointer rounded-[5px] border-0 bg-transparent px-2 py-2 text-left text-[10px] text-inherit hover:bg-subtle"
                  key={product}
                  onClick={() => chooseProduct(product)}
                  type="button"
                >
                  {product}
                </button>
              )
            )}
          </div>
        ) : null}
      </div>
      <nav
        aria-label={
          mobile
            ? t('mobileProductNavigation')
            : t('executiveProductNavigation')
        }
        className={cn('grid', mobile ? 'gap-0.5' : 'gap-px')}
      >
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <Link
              aria-current={pathname === item.href ? 'page' : undefined}
              className={linkClass(pathname === item.href)}
              href={item.href}
              key={item.href}
              onClick={() => onNavigate?.()}
            >
              <Icon aria-hidden="true" size={mobile ? 16 : 15} />
              {t(`navigation.${item.label.toLowerCase()}`)}
            </Link>
          )
        })}
      </nav>
      <Link
        aria-current={pathname === '/settings' ? 'page' : undefined}
        className={cn(linkClass(pathname === '/settings'), 'mt-auto')}
        href="/settings"
        onClick={() => onNavigate?.()}
      >
        <Gear aria-hidden="true" size={mobile ? 16 : 15} />{' '}
        {t('navigation.settings')}
      </Link>
    </>
  )
}
