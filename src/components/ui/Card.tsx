import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = true, className = '', ...props }: CardProps) {
  const classes = ['card', hover && 'card-hover', className].filter(Boolean).join(' ')
  return <div className={classes} {...props} />
}


