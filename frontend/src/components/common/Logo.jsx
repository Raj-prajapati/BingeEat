const Logo = ({ dark = false, size = "md" }) => {
  const sizes = { sm: 32, md: 42, lg: 56 }
  const iconSize = sizes[size]

  return (
    <div className="flex items-center gap-3">
      {/* Icon mark */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 62 62">
        <rect width="62" height="62" rx="18" fill="#E8450A"/>
        <line x1="16" y1="14" x2="16" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="25" y1="14" x2="25" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="34" y1="14" x2="34" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M16 32 Q16 38 20.5 38 L29.5 38 Q34 38 34 32" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round"/>
        <line x1="25" y1="38" x2="25" y2="53" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M43 14 Q43 12 45 12 L49 12 Q51 14 51 18 L51 34 Q51 38 47 38 L43 38 Z" fill="white"/>
        <line x1="47" y1="38" x2="47" y2="53" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>

      {/* Wordmark */}
      <span style={{ fontFamily: 'Georgia, serif' }}
        className={`font-bold tracking-tight text-2xl ${dark ? 'text-white' : 'text-[#111]'}`}>
        Binge<span className="text-[#E8450A]">Eat</span>
      </span>
    </div>
  )
}

export default Logo