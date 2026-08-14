import { describe, expect, it } from 'vitest'

import { compareRefreshToken, hashRefreshToken } from '../../src/shared/refreshToken.js'

describe('refresh token hashing', () => {
  it('hashes refresh tokens without storing the original value', () => {
    const token = 'refresh-token-value'
    const hash = hashRefreshToken(token)

    expect(hash).not.toBe(token)
    expect(hash).toHaveLength(64)
    expect(compareRefreshToken(token, hash)).toBe(true)
  })

  it('rejects mismatched refresh tokens', () => {
    const hash = hashRefreshToken('refresh-token-value')

    expect(compareRefreshToken('different-token-value', hash)).toBe(false)
  })
})
