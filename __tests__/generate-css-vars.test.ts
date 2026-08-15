/**
 * Unit tests for the token -> CSS custom property generator.
 *
 * These matter more than most: the naming rule decides the public name of every
 * CSS variable in two apps, and a silent mistake here is exactly how the two
 * repos drifted apart (design-tokens.json was migrated kebab -> camel and the
 * generator kept emitting a mix of both, producing ~47 name mismatches).
 */

import { describe, it, expect } from 'vitest'
import { kebab } from '../scripts/generate-css-vars.mts'

describe('kebab', () => {
  it('splits camelCase', () => {
    expect(kebab('midGray')).toBe('mid-gray')
    expect(kebab('peachText')).toBe('peach-text')
    expect(kebab('lineHeight')).toBe('line-height')
    expect(kebab('warningAmber')).toBe('warning-amber')
    expect(kebab('terminalChrome')).toBe('terminal-chrome')
  })

  it('splits a trailing digit off a word', () => {
    expect(kebab('deep2')).toBe('deep-2')
    expect(kebab('chart1')).toBe('chart-1')
    expect(kebab('tailwindGreen400')).toBe('tailwind-green-400')
  })

  it('does NOT split a single letter from its digit', () => {
    // h1/h2 are heading sizes, not word-plus-index. `--font-size-h-2` would be
    // a silent rename of a shipped variable.
    expect(kebab('h1')).toBe('h1')
    expect(kebab('h2')).toBe('h2')
  })

  it('handles consecutive capitals the same way as single ones', () => {
    // githubDarkBg is the real token; the emitted name must be stable.
    expect(kebab('githubDarkBg')).toBe('github-dark-bg')
    expect(kebab('trafficGreenAlt')).toBe('traffic-green-alt')
  })

  it('passes through purely numeric segments', () => {
    expect(kebab('0')).toBe('0')
    expect(kebab('1')).toBe('1')
    expect(kebab('32')).toBe('32')
  })

  it('converts a decimal segment into a CSS-safe name', () => {
    // `--spacing-0.5` would parse as a number and break tokenisation.
    expect(kebab('0.5')).toBe('0-5')
  })

  it('leaves an already-kebab segment untouched', () => {
    expect(kebab('mid-gray')).toBe('mid-gray')
    expect(kebab('surface')).toBe('surface')
  })

  it('keeps breakpoint-style names usable', () => {
    // Must not become `2-xl`.
    expect(kebab('2xl')).toBe('2xl')
  })

  it('is idempotent', () => {
    for (const s of ['midGray', 'deep2', 'github-dark-bg', '0.5', '2xl']) {
      expect(kebab(kebab(s))).toBe(kebab(s))
    }
  })
})
