"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRPage() {
  return (
    <div style={{ padding: 40 }}>
      <h2 className="ml-3 mb-5">Scan to View Esquirol 3D Model</h2>
      {/* <QRCodeSVG value="http://localhost:3000/esquirol" size={256} /> */}
      <QRCodeSVG value="https://qrcode-xi-liard.vercel.app/esquirol" size={256} />
    </div>
  );
}
