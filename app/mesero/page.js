'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const menuData = [
  { id: 1, name: 'Espresso', price: 1200, cat: '☕ Cafés' },
  { id: 2, name: 'Cortado', price: 1400, cat: '☕ Cafés' },
  { id: 3, name: 'Café con leche', price: 1600, cat: '☕ Cafés' },
  { id: 4, name: 'Cappuccino', price: 1800, cat: '☕ Cafés' },
  { id: 5, name: 'Latte', price: 1900, cat: '☕ Cafés' },
  { id: 6, name: 'Chocolatada', price: 1700, cat: '🍫 Calientes' },
  { id: 7, name: 'Leche sola', price: 1000, cat: '🍫 Calientes' },
  { id: 8, name: 'Medialunas (x3)', price: 1500, cat: '🥐 Facturas' },
  { id: 9, name: 'Vigilante', price: 900, cat: '🥐 Facturas' },
  { id: 10, name: 'Cuernito', price: 800, cat: '🥐 Facturas' },
  { id: 11, name: 'Brownie', price: 2200, cat: '🍰 Pastelería' },
  { id: 12, name: 'Torta de zanahoria', price: 2500, cat: '🍰 Pastelería' },
  { id: 13, name: 'Cheese cake', price: 2800, cat: '🍰 Pastelería' },
]

const cats = [...new Set(menuData.map(i => i.cat))]
const fp = (p) => `$${Number(p).toLocaleString('es-AR')}`

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#F5EFE6}
  .mesero{max-width:430px;margin:0 auto;min-height:100vh;background:#F5EFE6;font-family:'Lora',serif;color:#2C1A0E}
  .header{background:#5C3D2E;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
  .header-title{font-family:'Playfair Display',serif;font-size:20px;color:#E8D5B7;font-weight:700}
  .header-sub{font-size:11px;color:#C4A882;font-style:italic;margin-top:2px}
  .back-link{color:#C4A882;font-size:13px;text-decoration:none;display:flex;align-items:center;gap:4px}
  .back-link:hover{color:#E8D5B7}
  .step-bar{display:flex;background:#FDF8F2;border-bottom:1px solid #D4B896;padding:0}
  .step{flex:1;padding:12px 6px;text-align:center;font-size:12px;color:#7A5C48;font-style:italic;border-bottom:3px solid transparent}
  .step.active{color:#5C3D2E;border-bottom-color:#C8873A;font-style:normal;font-weight:500}
  .step.done{color:#2E7D32;border-bottom-color:#2E7D32}
  .content{padding:16px 16px 100px}
  .section-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:#C8873A;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px}
  .mesas-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:24px}
  .mesa-btn{aspect-ratio:1;border-radius:12px;border:2px solid #D4B896;background:#FDF8F2;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;color:#5C3D2E}
  .mesa-btn:hover,.mesa-btn.selected{background:#5C3D2E;color:#E8D5B7;border-color:#5C3D2E}
  .cat-tabs{display:flex;gap:8px;overflow-x:auto;margin-bottom:14px;padding-bottom:4px;scrollbar-width:none}
  .cat-tabs::-webkit-scrollbar{display:none}
  .cat-tab{white-space:nowrap;padding:7px 14px;border-radius:20px;border:1.5px solid #D4B896;background:#FDF8F2;font-family:'Lora',serif;font-size:13px;cursor:pointer;transition:all .2s;color:#5C3D2E}
  .cat-tab.active{background:#5C3D2E;color:#E8D5B7;border-color:#5C3D2E}
  .menu-item{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(212,184,150,.4);gap:10px}
  .item-info{flex:1}
  .item-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:#2C1A0E}
  .item-price{font-size:12px;color:#C8873A;margin-top:2px;font-weight:500}
  .qty-ctrl{display:flex;align-items:center;gap:8px;background:#E8D5B7;border-radius:20px;padding:4px 8px}
  .qty-btn{background:#5C3D2E;border:none;border-radius:50%;width:26px;height:26px;color:white;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .qty-num{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#5C3D2E;min-width:18px;text-align:center}
  .add-btn{background:#5C3D2E;border:none;border-radius:20px;padding:6px 14px;color:#E8D5B7;font-family:'Lora',serif;font-size:13px;cursor:pointer;white-space:nowrap}
  .resumen-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px dashed rgba(212,184,150,.4);gap:10px}
  .resumen-name{font-family:'Playfair Display',serif;font-size:14px;color:#2C1A0E;flex:1}
  .resumen-qty{font-size:12px;color:#7A5C48;font-style:italic;margin:0 6px}
  .resumen-price{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#C8873A;white-space:nowrap}
  .total-row{display:flex;justify-content:space-between;align-items:center;padding:16px 0 0;border-top:2px solid #D4B896;margin-top:4px}
  .total-label{font-family:'Playfair Display',serif;font-size:17px;color:#5C3D2E}
  .total-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#C8873A}
  .notas-area{width:100%;background:#FDF8F2;border:1.5px solid #D4B896;border-radius:12px;padding:12px 14px;font-family:'Lora',serif;font-size:14px;color:#2C1A0E;outline:none;resize:none;margin-top:14px;transition:border-color .2s}
  .notas-area:focus{border-color:#C8873A}
  .notas-area::placeholder{color:#C4A882;font-style:italic}
  .cart-bar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:398px;background:#5C3D2E;border-radius:16px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 24px rgba(92,61,46,.3);cursor:pointer;z-index:100;animation:slideUp .3s ease}
  .cart-bar:hover{background:#8B5E4A}
  .cart-bar-left{display:flex;align-items:center;gap:10px}
  .cart-badge{background:#C8873A;color:white;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:13px;font-weight:700}
  .cart-bar-text{font-family:'Playfair Display',serif;font-size:14px;color:#E8D5B7;font-weight:600}
  .cart-bar-total{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#E8D5B7}
  .confirm-btn{width:100%;background:linear-gradient(135deg,#C8873A,#A0672A);color:white;border:none;border-radius:14px;padding:16px;font-family:'Playfair Display',serif;font-size:17px;font-weight:700;cursor:pointer;margin-top:20px;box-shadow:0 4px 16px rgba(200,135,58,.3);transition:all .2s}
  .confirm-btn:disabled{opacity:.5;cursor:not-allowed}
  .done-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh;padding:32px;text-align:center}
  .done-icon{font-size:64px;margin-bottom:20px;animation:popIn .5s cubic-bezier(.34,1.56,.64,1) both}
  .done-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#5C3D2E;margin-bottom:10px}
  .done-body{font-size:14px;color:#7A5C48;font-style:italic;line-height:1.6}
  .nuevo-btn{background:#FDF8F2;color:#5C3D2E;border:2px solid #D4B896;border-radius:12px;padding:14px 20px;font-family:'Playfair Display',serif;font-size:15px;font-weight:600;cursor:pointer;margin-top:20px;width:100%;transition:all .2s}
  .nuevo-btn:hover{border-color:#C8873A}
  .error-msg{background:#FFF0F0;border:1px solid #FFAAAA;border-radius:8px;padding:10px 14px;font-size:13px;color:#8B2020;margin-top:10px;text-align:center}
  @keyframes floatIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
`

export default function MeseroPanel() {
  const [paso, setPaso] = useState('mesa')
  const [mesa, setMesa] = useState(null)
  const [catActiva, setCatActiva] = useState(cats[0])
  const [cart, setCart] = useState({})
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = menuData.find(i => i.id === Number(id))
    return acc + (item ? item.price * qty : 0)
  }, 0)

  const setQty = (id, delta) => {
    setCart(prev => {
      const next = { ...prev }
      const newQty = (next[id] || 0) + delta
      if (newQty <= 0) delete next[id]
      else next[id] = newQty
      return next
    })
  }

  const enviarPedido = async () => {
    setLoading(true)
    setError(null)
    try {
      const itemsDetalle = Object.entries(cart).map(([id, qty]) => {
        const item = menuData.find(i => i.id === Number(id))
        return { id: Number(id), name: item.name, qty, price: item.price, subtotal: item.price * qty }
      })
      const { error: err } = await supabase.from('pedidos').insert([{
        mesa: `Mesa ${mesa}`,
        mesa_numero: mesa,
        items: itemsDetalle,
        total: totalPrice,
        notas,
        origen: 'mesero',
        estado: 'pendiente',
      }])
      if (err) throw err
      setPaso('done')
    } catch (e) {
      setError('Hubo un problema. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setPaso('mesa'); setMesa(null); setCart({}); setNotas(''); setError(null)
  }

  const itemsFiltrados = menuData.filter(i => i.cat === catActiva)

  return (
    <>
      <style>{css}</style>
      <div className="mesero">
        <div className="header">
          <div>
            <div className="header-title">🧑‍🍳 Mesero</div>
            <div className="header-sub">{mesa ? `Mesa ${mesa} seleccionada` : 'Tomá el pedido'}</div>
          </div>
          <a href="/admin" className="back-link">← Admin</a>
        </div>

        <div className="step-bar">
          <div className={`step ${paso === 'mesa' ? 'active' : paso !== 'mesa' ? 'done' : ''}`}>1. Mesa</div>
          <div className={`step ${paso === 'items' ? 'active' : paso === 'resumen' || paso === 'done' ? 'done' : ''}`}>2. Pedido</div>
          <div className={`step ${paso === 'resumen' ? 'active' : paso === 'done' ? 'done' : ''}`}>3. Confirmar</div>
        </div>

        <div className="content">

          {paso === 'mesa' && (
            <div style={{ animation: 'floatIn .3s ease both' }}>
              <p className="section-title">¿Qué mesa es?</p>
              <div className="mesas-grid">
                {[1,2,3,4,5,6,7,8,9,10].map(m => (
                  <button key={m} className={`mesa-btn ${mesa === m ? 'selected' : ''}`} onClick={() => setMesa(m)}>{m}</button>
                ))}
              </div>
              <button
                className="confirm-btn"
                disabled={!mesa}
                onClick={() => setPaso('items')}
              >
                Continuar →
              </button>
            </div>
          )}

          {paso === 'items' && (
            <div style={{ animation: 'floatIn .3s ease both' }}>
              <p className="section-title">Mesa {mesa} · Elegí los items</p>
              <div className="cat-tabs">
                {cats.map(c => (
                  <button key={c} className={`cat-tab ${catActiva === c ? 'active' : ''}`} onClick={() => setCatActiva(c)}>{c}</button>
                ))}
              </div>
              {itemsFiltrados.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">{fp(item.price)}</div>
                  </div>
                  {cart[item.id] ? (
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => setQty(item.id, -1)}>−</button>
                      <span className="qty-num">{cart[item.id]}</span>
                      <button className="qty-btn" onClick={() => setQty(item.id, 1)}>+</button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => setQty(item.id, 1)}>+ Agregar</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {paso === 'resumen' && (
            <div style={{ animation: 'floatIn .3s ease both' }}>
              <p className="section-title">Mesa {mesa} · Resumen</p>
              {Object.entries(cart).map(([id, qty]) => {
                const item = menuData.find(i => i.id === Number(id))
                if (!item) return null
                return (
                  <div key={id} className="resumen-item">
                    <span className="resumen-name">{item.name}</span>
                    <span><span className="resumen-qty">x{qty}</span><span className="resumen-price">{fp(item.price * qty)}</span></span>
                  </div>
                )
              })}
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-price">{fp(totalPrice)}</span>
              </div>
              <textarea className="notas-area" rows={3} placeholder="Aclaraciones... sin azúcar, sin TACC, algo extra..." value={notas} onChange={e => setNotas(e.target.value)} />
              {error && <div className="error-msg">{error}</div>}
              <button className="confirm-btn" onClick={enviarPedido} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar a la barra ☕'}
              </button>
            </div>
          )}

          {paso === 'done' && (
            <div className="done-screen">
              <div className="done-icon">✅</div>
              <div className="done-title">¡Pedido enviado!</div>
              <div className="done-body">Mesa {mesa} · {totalItems} items · {fp(totalPrice)}<br />El pedido ya aparece en el panel.</div>
              <button className="nuevo-btn" onClick={reset}>+ Nuevo pedido</button>
            </div>
          )}

        </div>

        {paso === 'items' && totalItems > 0 && (
          <div className="cart-bar" onClick={() => setPaso('resumen')}>
            <div className="cart-bar-left">
              <div className="cart-badge">{totalItems}</div>
              <span className="cart-bar-text">Ver resumen</span>
            </div>
            <span className="cart-bar-total">{fp(totalPrice)}</span>
          </div>
        )}

      </div>
    </>
  )
}