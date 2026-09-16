'use client'

import { Check } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { GlowHoverCard } from './glow-hover-card'

export interface PricingPlan {
  description: string
  features: string[]
  id: string
  name: string
  price: string
}

export interface Pricing2Props {
  annual: boolean
  onBillingChange: (annual: boolean) => void
  onSelectPlan: (planId: string) => void
  plans: PricingPlan[]
  selectedPlan?: string
}

export function Pricing2({
  annual,
  onBillingChange,
  onSelectPlan,
  plans,
  selectedPlan
}: Pricing2Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="pricing-two" id="pricing">
      <div className="pricing-two-heading">
        <span>Plans</span>
        <h2>Scale visibility with the organization.</h2>
        <p>Role depth and team coverage expand without changing the underlying truth.</p>
        <fieldset
          aria-label="Billing period"
          className="pricing-toggle"
          style={{ border: 0, minInlineSize: 0 }}
        >
          <button
            data-active={!annual}
            onClick={() => onBillingChange(false)}
            type="button"
          >
            Monthly
          </button>
          <button
            data-active={annual}
            onClick={() => onBillingChange(true)}
            type="button"
          >
            Annually
          </button>
        </fieldset>
      </div>
      <div className="pricing-two-grid">
        {plans.map((plan, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            key={plan.id}
            transition={{ delay: reduceMotion ? 0 : index * 0.06 }}
          >
            <GlowHoverCard selected={selectedPlan === plan.id}>
              <div className="pricing-card">
                <div>
                  <span>{plan.name}</span>
                  <strong>{plan.price}</strong>
                  <p>{plan.description}</p>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" size={14} weight="bold" /> {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => onSelectPlan(plan.id)} type="button">
                  {selectedPlan === plan.id ? 'Selected' : 'Choose plan'}
                </button>
              </div>
            </GlowHoverCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
