interface LogoProps {
  compact?: boolean
  inverse?: boolean
  variant?: 'round' | 'wide'
  name?: string
  slogan?: string
  roundSrc?: string
  wideSrc?: string
}

export function Logo({
  compact = false,
  inverse = false,
  variant = 'round',
  name = 'DTPT Shop',
  slogan = 'Giá tốt · Uy tín · Chất lượng',
  roundSrc = '/dp-lab-logo.png',
  wideSrc = '/dtpt-techs-logo.png',
}: LogoProps) {
  if (variant === 'wide') {
    return <div className={`logo logo--wide ${inverse ? 'logo--inverse' : ''}`} aria-label={name}><img src={wideSrc} alt={name} /></div>
  }

  return (
    <div className={`logo ${inverse ? 'logo--inverse' : ''}`} aria-label={name}>
      <span className="logo__mark"><img src={roundSrc} alt="" /></span>
      {!compact && <span className="logo__word"><span className="logo__name">{name}</span><small>{slogan}</small></span>}
    </div>
  )
}
