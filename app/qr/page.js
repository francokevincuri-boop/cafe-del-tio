'use client'

const BASE_URL = 'https://cafe-del-tio.vercel.app'
const MESAS = Array.from({ length: 10 }, (_, i) => i + 1)

const qrUrl = (mesa) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&qzone=2&data=${encodeURIComponent(`${BASE_URL}/?mesa=${mesa}`)}`

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#F5EFE6;font-family:'Lora',serif;color:#2C1A0E}
  .page{max-width:900px;margin:0 auto;padding:32px 24px}
  .page-header{text-align:center;margin-bottom:40px}
  .page-title{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;color:#5C3D2E}
  .page-sub{font-size:14px;color:#7A5C48;font-style:italic;margin-top:6px}
  .print-btn{background:#5C3D2E;color:#E8D5B7;border:none;border-radius:10px;padding:12px 28px;font-family:'Playfair Display',serif;font-size:15px;font-weight:600;cursor:pointer;margin-top:20px;transition:background .2s}
  .print-btn:hover{background:#C8873A}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px}
  .qr-card{background:#FDF8F2;border:1.5px solid #D4B896;border-radius:16px;padding:20px;text-align:center;break-inside:avoid}
  .qr-mesa{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#5C3D2E;margin-bottom:12px}
  .qr-img{width:180px;height:180px;border-radius:8px}
  .qr-url{font-size:10px;color:#7A5C48;font-style:italic;margin-top:10px;word-break:break-all;line-height:1.4}
  .qr-icon{font-size:28px;margin-bottom:4px}
  @media print{
    .print-btn{display:none}
    .page{padding:16px}
    body{background:white}
    .qr-card{border-color:#ccc}
  }
`

export default function QRPage() {
  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div className="page-header">
          <div className="qr-icon">☕</div>
          <div className="page-title">El Rincón del Tío</div>
          <div className="page-sub">QR codes por mesa — imprimí y colocá en cada una</div>
          <button className="print-btn" onClick={() => window.print()}>🖨️ Imprimir todo</button>
        </div>

        <div className="grid">
          {MESAS.map(mesa => (
            <div key={mesa} className="qr-card">
              <div className="qr-mesa">Mesa {mesa}</div>
              <img
                className="qr-img"
                src={qrUrl(mesa)}
                alt={`QR Mesa ${mesa}`}
                loading="lazy"
              />
              <div className="qr-url">{BASE_URL}/?mesa={mesa}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
