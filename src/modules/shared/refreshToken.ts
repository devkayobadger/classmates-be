import { createHash, timingSafeEqual } from 'node:crypto'

export const hashRefreshToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex')
}

export const compareRefreshToken = (token: string, tokenHash: string) => {
  const incomingHash = hashRefreshToken(token)
  const incomingBuffer = Buffer.from(incomingHash, 'hex')
  const storedBuffer = Buffer.from(tokenHash, 'hex')

  if (incomingBuffer.length !== storedBuffer.length) {
    return false
  }

  return timingSafeEqual(incomingBuffer, storedBuffer)
}
