"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRPage() {
  return (
    <div style={{ padding: 40 }}>
      <h2 className="ml-4 mb-5">Scan to View Llebre 3D Model</h2>
      {/* <QRCodeSVG value="http://localhost:3000/llebre" size={256} /> */}
      <QRCodeSVG value="https://qrcode-xi-liard.vercel.app/llebre" size={256} />
    </div>
  );
}
