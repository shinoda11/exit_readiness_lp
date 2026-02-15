'use client'

import React from 'react'

// ============================================================
// YOHACK Logo System
// Y = 分岐する世界線。ゴールドノード = 意思決定の瞬間。
// ============================================================

/** Brand colors */
const COLORS = {
  fg: '#f0ece4',       // Linen — primary on dark
  accent: '#c8b89a',   // Gold — decision node
  ink: '#1a1916',      // Ink — primary on light
  bronze: '#8a7a62',   // Bronze — accent on light
  ghost: 'rgba(200,184,154,0.08)', // Ghost worldlines
  ghostLight: 'rgba(138,122,98,0.1)',
} as const

// ============================================================
// 1. Symbol Mark (Y monogram only)
// ============================================================
interface SymbolProps {
  size?: number
  theme?: 'dark' | 'light'
  showGhost?: boolean
  className?: string
}

export function YohackSymbol({
  size = 32,
  theme = 'dark',
  showGhost = false,
  className,
}: SymbolProps) {
  const fg = theme === 'dark' ? COLORS.fg : COLORS.ink
  const accent = theme === 'dark' ? COLORS.accent : COLORS.bronze
  const ghost = theme === 'dark' ? COLORS.ghost : COLORS.ghostLight

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="YOHACK logo"
    >
      {showGhost && (
        <>
          <line x1="90" y1="94" x2="24" y2="22" stroke={ghost} strokeWidth="1" strokeLinecap="round" />
          <line x1="90" y1="94" x2="156" y2="22" stroke={ghost} strokeWidth="1" strokeLinecap="round" />
        </>
      )}
      {/* Left branch */}
      <line x1="90" y1="94" x2="42" y2="34" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      {/* Right branch */}
      <line x1="90" y1="94" x2="138" y2="34" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      {/* Stem */}
      <line x1="90" y1="94" x2="90" y2="156" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      {/* Decision node */}
      <circle cx="90" cy="94" r="5" fill={accent} />
      {/* Future endpoints */}
      <circle cx="42" cy="34" r="3" fill={fg} />
      <circle cx="138" cy="34" r="3" fill={fg} />
      {/* Origin */}
      <circle cx="90" cy="156" r="2.5" fill={fg} opacity="0.5" />
    </svg>
  )
}

// ============================================================
// 2. Wordmark (text only: YO + HACK)
// ============================================================
interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'dark' | 'light'
  className?: string
}

const WORDMARK_SIZES = {
  sm: { fontSize: 16, letterSpacing: -0.3 },
  md: { fontSize: 22, letterSpacing: -0.5 },
  lg: { fontSize: 36, letterSpacing: -1.5 },
} as const

export function YohackWordmark({
  size = 'md',
  theme = 'dark',
  className,
}: WordmarkProps) {
  const fg = theme === 'dark' ? COLORS.fg : COLORS.ink
  const accent = theme === 'dark' ? COLORS.accent : COLORS.bronze
  const { fontSize, letterSpacing } = WORDMARK_SIZES[size]

  return (
    <span
      className={className}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize,
        letterSpacing,
        lineHeight: 1,
        display: 'inline-flex',
      }}
      aria-label="YOHACK"
    >
      <span style={{ color: fg }}>YO</span>
      <span style={{ color: accent }}>HACK</span>
    </span>
  )
}

// ============================================================
// 3. Horizontal Lockup (symbol + divider + wordmark)
// ============================================================
interface LockupProps {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'dark' | 'light'
  className?: string
}

const LOCKUP_CONFIG = {
  sm: { symbol: 20, gap: 8, dividerH: 18, wordmark: 'sm' as const },
  md: { symbol: 28, gap: 12, dividerH: 24, wordmark: 'md' as const },
  lg: { symbol: 36, gap: 16, dividerH: 30, wordmark: 'lg' as const },
} as const

export function YohackLockup({
  size = 'md',
  theme = 'dark',
  className,
}: LockupProps) {
  const config = LOCKUP_CONFIG[size]
  const dividerColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: config.gap,
      }}
      role="img"
      aria-label="YOHACK"
    >
      <YohackSymbol size={config.symbol} theme={theme} />
      <div
        style={{
          width: 1,
          height: config.dividerH,
          background: dividerColor,
          flexShrink: 0,
        }}
      />
      <YohackWordmark size={config.wordmark} theme={theme} />
    </div>
  )
}

// ============================================================
// 4. Stacked (symbol above wordmark + tagline)
// ============================================================
interface StackedProps {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'dark' | 'light'
  showTagline?: boolean
  className?: string
}

const STACKED_CONFIG = {
  sm: { symbol: 40, gap: 8, wordmark: 'sm' as const, tagSize: 8, tagSpacing: 3 },
  md: { symbol: 56, gap: 12, wordmark: 'md' as const, tagSize: 9, tagSpacing: 4 },
  lg: { symbol: 80, gap: 16, wordmark: 'lg' as const, tagSize: 11, tagSpacing: 5 },
} as const

export function YohackStacked({
  size = 'md',
  theme = 'dark',
  showTagline = true,
  className,
}: StackedProps) {
  const config = STACKED_CONFIG[size]
  const mutedColor = theme === 'dark' ? '#5a5550' : '#999'

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: config.gap,
      }}
      role="img"
      aria-label="YOHACK — Life Margin Simulator"
    >
      <YohackSymbol size={config.symbol} theme={theme} showGhost />
      <YohackWordmark size={config.wordmark} theme={theme} />
      {showTagline && (
        <span
          style={{
            fontSize: config.tagSize,
            letterSpacing: config.tagSpacing,
            textTransform: 'uppercase' as const,
            color: mutedColor,
            fontWeight: 300,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Life Margin Simulator
        </span>
      )}
    </div>
  )
}

// ============================================================
// Default export: all-in-one with variant prop
// ============================================================
interface YohackLogoProps {
  variant?: 'symbol' | 'wordmark' | 'lockup' | 'stacked'
  size?: 'sm' | 'md' | 'lg'
  theme?: 'dark' | 'light'
  className?: string
}

export default function YohackLogo({
  variant = 'lockup',
  size = 'md',
  theme = 'dark',
  className,
}: YohackLogoProps) {
  const symbolSize = { sm: 24, md: 32, lg: 48 } as const

  switch (variant) {
    case 'symbol':
      return <YohackSymbol size={symbolSize[size]} theme={theme} showGhost className={className} />
    case 'wordmark':
      return <YohackWordmark size={size} theme={theme} className={className} />
    case 'lockup':
      return <YohackLockup size={size} theme={theme} className={className} />
    case 'stacked':
      return <YohackStacked size={size} theme={theme} className={className} />
  }
}
