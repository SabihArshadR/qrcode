"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRPage() {
  return (
    <div style={{ padding: 40 }}>
      <h2 className="ml-6 mb-5">Scan to View Duc 3D Model</h2>
      {/* <QRCodeSVG value="http://localhost:3000/duc" size={256} /> */}
      <QRCodeSVG value="https://qrcode-xi-liard.vercel.app/duc" size={256} />
    </div>
  );
}
