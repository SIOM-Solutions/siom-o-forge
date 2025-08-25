import React from 'react'

type Tone = 'active' | 'blocked' | 'info'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ tone = 'info', className = '', ...props }: BadgeProps) {
  const toneClass =
    tone === 'active' ? 'badge-active' : tone === 'blocked' ? 'badge-blocked' : 'badge-info'
  const classes = ['badge', toneClass, className].filter(Boolean).join(' ')
  return <span className={classes} {...props} />
}


