"use client"

import { QRCodeSVG } from "qrcode.react"

export default function QRPage() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Scan to View 3D Model</h2>
      <QRCodeSVG value="https://qrcode-xi-liard.vercel.app/model" size={256} />
    </div>
  )
}
