import { useEffect, useState } from 'react'

const candidatesRaw = [
  '/brand/logo.png',
  '/brand/logo.svg',
  '/brand/logo-azul.png',
  '/brand/logo-blue.png',
  '/brand/O-Forge.png',
  '/brand/Pruebas Diseño Siom Solutions.pdf (2).png',
  '/brand/Pruebas Diseño Siom Solutions.pdf (2).png',
]

function encodePath(p: string) {
  // encode only the path segments that might include spaces or diacritics
  return p
    .split('/')
    .map((seg, i) => (i === 0 ? seg : encodeURI(seg)))
    .join('/')
}

const candidates = candidatesRaw.map(encodePath)

export default function Logo({ className = '' }: { className?: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const tryNext = (idx: number) => {
      if (idx >= candidates.length || cancelled) return
      const img = new Image()
      img.onload = () => {
        if (!cancelled) setSrc(candidates[idx])
      }
      img.onerror = () => tryNext(idx + 1)
      img.src = candidates[idx]
    }
    tryNext(0)
    return () => { cancelled = true }
  }, [])

  if (!src) return null
  return <img src={src} alt="Logo O‑Forge de SIOM Solutions" className={className} />
}


