// Renders assets/app-icon.png (1024px) for the RelayLens Switch icon set.
// Pure Node (no deps): geometry on a 1024-unit grid with 3x3 supersampling,
// encoded as RGBA PNG. Feed the output to `tauri icon` to regenerate
// src-tauri/icons/. Source-authored, Apache-2.0.
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const SIZE = 1024
const CORNER_RADIUS = 224
const SURFACE = [0x0e, 0x1a, 0x24]
const SIGNAL = [0x22, 0xd3, 0xee]
const RING_OUTER = 240
const RING_INNER = 164
const DOT = 72
const SAMPLES_PER_AXIS = 3

function roundedRectCoverageAt(x, y) {
  const halfInner = SIZE / 2 - CORNER_RADIUS
  const dx = Math.abs(x - SIZE / 2) - halfInner
  const dy = Math.abs(y - SIZE / 2) - halfInner
  const outsideX = Math.max(dx, 0)
  const outsideY = Math.max(dy, 0)
  const distance =
    Math.min(Math.max(dx, dy), 0) + Math.hypot(outsideX, outsideY)
  return distance <= CORNER_RADIUS ? 1 : 0
}

function signalCoverageAt(x, y) {
  const dx = x - SIZE / 2
  const dy = y - SIZE / 2
  const d = Math.hypot(dx, dy)
  if (d <= DOT) return 1
  return d >= RING_INNER && d <= RING_OUTER ? 1 : 0
}

function superSample(sampler, px, py) {
  let hits = 0
  for (let sy = 0; sy < SAMPLES_PER_AXIS; sy += 1) {
    for (let sx = 0; sx < SAMPLES_PER_AXIS; sx += 1) {
      const x = px + (sx + 0.5) / SAMPLES_PER_AXIS
      const y = py + (sy + 0.5) / SAMPLES_PER_AXIS
      hits += sampler(x, y)
    }
  }
  return hits / (SAMPLES_PER_AXIS * SAMPLES_PER_AXIS)
}

function renderPixels() {
  const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1))
  for (let y = 0; y < SIZE; y += 1) {
    const rowStart = y * (SIZE * 4 + 1)
    raw[rowStart] = 0
    for (let x = 0; x < SIZE; x += 1) {
      const surfaceAlpha = superSample(roundedRectCoverageAt, x, y)
      const signalAlpha =
        surfaceAlpha > 0 ? superSample(signalCoverageAt, x, y) : 0
      const alpha = surfaceAlpha
      const offset = rowStart + 1 + x * 4
      for (let channel = 0; channel < 3; channel += 1) {
        raw[offset + channel] = Math.round(
          SURFACE[channel] * (1 - signalAlpha) + SIGNAL[channel] * signalAlpha
        )
      }
      raw[offset + 3] = Math.round(alpha * 255)
    }
  }
  return raw
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  return value >>> 0
})

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typed))
  return Buffer.concat([length, typed, crc])
}

function encodePng(raw) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(SIZE, 0)
  header.writeUInt32BE(SIZE, 4)
  header[8] = 8 // bit depth
  header[9] = 6 // truecolour with alpha
  header[10] = 0
  header[11] = 0
  header[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const target = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'assets/app-icon.png'
)
const png = encodePng(renderPixels())
writeFileSync(target, png)
process.stdout.write(
  `app icon written: ${SIZE}x${SIZE}, ${png.length} bytes\n` +
    'next: npx tauri icon assets/app-icon.png\n'
)
