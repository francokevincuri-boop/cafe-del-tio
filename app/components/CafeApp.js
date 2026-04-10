'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const menuData = [
  {
    category: '☕ Cafés',
    items: [
      { id: 1, name: 'Espresso', price: 1200, desc: 'Intenso y puro' },
      { id: 2, name: 'Cortado', price: 1400, desc: 'Espresso con toque de leche' },
      { id: 3, name: 'Café con leche', price: 1600, desc: 'Clásico de siempre' },
      { id: 4, name: 'Cappuccino', price: 1800, desc: 'Espumoso y cremoso' },
      { id: 5, name: 'Latte', price: 1900, desc: 'Suave y aterciopelado' },
    ],
  },
  {
    category: '🍫 Calientes',
    items: [
      { id: 6, name: 'Chocolatada', price: 1700, desc: 'Chocolate caliente artesanal' },
      { id: 7, name: 'Leche sola', price: 1000, desc: 'Entera, bien caliente' },
    ],
  },
  {
    category: '🥐 Facturas',
    items: [
      { id: 8, name: 'Medialunas (x3)', price: 1500, desc: 'Con dulce de leche' },
      { id: 9, name: 'Vigilante', price: 900, desc: 'Dulce de leche y queso' },
      { id: 10, name: 'Cuernito', price: 800, desc: 'Hojaldrado, de manteca' },
    ],
  },
  {
    category: '🍰 Pastelería',
    items: [
      { id: 11, name: 'Brownie', price: 2200, desc: 'Húmedo, con nueces' },
      { id: 12, name: 'Torta de zanahoria', price: 2500, desc: 'Con frosting de queso crema' },
      { id: 13, name: 'Cheese cake', price: 2800, desc: 'Con coulis de frutos rojos' },
    ],
  },
]

const fp = (p) => `$${p.toLocaleString('es-AR')}`

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  .cafe-app{max-width:430px;margin:0 auto;min-height:100vh;background:#F5EFE6;font-family:'Lora',serif;color:#2C1A0E;position:relative;overflow-x:hidden}
  .cafe-screen{position:relative;z-index:1}
  .home{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:40px 32px;text-align:center}
  .home-logo{width:90px;height:90px;background:#5C3D2E;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:42px;margin-bottom:24px;box-shadow:0 8px 32px rgba(92,61,46,.25);animation:floatIn .7s ease both}
  .home-title{font-family:'Playfair Display',serif;font-size:38px;font-weight:700;color:#5C3D2E;line-height:1.1;animation:floatIn .7s .1s ease both}
  .home-subtitle{font-style:italic;color:#7A5C48;margin-top:8px;font-size:15px;animation:floatIn .7s .2s ease both}
  .divider{width:60px;height:2px;background:linear-gradient(90deg,transparent,#C8873A,transparent);margin:24px auto;animation:floatIn .7s .3s ease both}
  .home-actions{display:flex;flex-direction:column;gap:14px;width:100%;animation:floatIn .7s .4s ease both}
  .home-footer{margin-top:40px;font-size:12px;color:#7A5C48;font-style:italic;animation:floatIn .7s .5s ease both}
  .btn-primary{background:#5C3D2E;color:#E8D5B7;border:none;border-radius:14px;padding:18px 24px;font-family:'Playfair Display',serif;font-size:17px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all .2s;box-shadow:0 4px 16px rgba(92,61,46,.2);text-align:left;width:100%}
  .btn-primary:hover{background:#8B5E4A;transform:translateY(-1px)}
  .btn-secondary{background:#FDF8F2;color:#5C3D2E;border:2px solid #D4B896;border-radius:14px;padding:16px 24px;font-family:'Playfair Display',serif;font-size:17px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all .2s;text-align:left;width:100%}
  .btn-secondary:hover{border-color:#C8873A}
  .btn-icon{font-size:22px}.btn-content{display:flex;flex-direction:column}
  .btn-desc{font-family:'Lora',serif;font-size:12px;font-weight:400;opacity:.7;margin-top:2px}
  .header{display:flex;align-items:center;padding:20px 20px 16px;gap:12px;border-bottom:1px solid #D4B896;background:#FDF8F2;position:sticky;top:0;z-index:10}
  .back-btn{background:none;border:none;font-size:22px;cursor:pointer;padding:4px;color:#5C3D2E;transition:transform .2s}
  .back-btn:hover{transform:translateX(-2px)}
  .header-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#5C3D2E;flex:1}
  .header-sub{font-size:11px;color:#7A5C48;font-style:italic}
  .reserva-screen{padding:24px 20px}
  .section-label{font-family:'Playfair Display',serif;font-size:13px;font-weight:600;color:#C8873A;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
  .field-group{margin-bottom:20px}
  .field-label{display:block;font-size:13px;color:#7A5C48;margin-bottom:6px;font-style:italic}
  .field-input{width:100%;background:#FDF8F2;border:1.5px solid #D4B896;border-radius:12px;padding:14px 16px;font-family:'Lora',serif;font-size:15px;color:#2C1A0E;outline:none;transition:border-color .2s}
  .field-input:focus{border-color:#C8873A}
  .field-input::placeholder{color:#C4A882}
  .row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .guests-picker{display:flex;align-items:center;gap:16px;background:#FDF8F2;border:1.5px solid #D4B896;border-radius:12px;padding:10px 16px}
  .guests-btn{background:#E8D5B7;border:none;border-radius:8px;width:34px;height:34px;font-size:20px;cursor:pointer;color:#5C3D2E;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .guests-btn:hover{background:#D4B896}
  .guests-val{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#5C3D2E;min-width:28px;text-align:center}
  .guests-label{font-size:13px;color:#7A5C48;font-style:italic}
  .separator{border:none;border-top:1px dashed #D4B896;margin:24px 0}
  .pedido-toggle{background:#FDF8F2;border:1.5px solid #D4B896;border-radius:14px;padding:16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;transition:border-color .2s;width:100%;text-align:left}
  .pedido-toggle:hover{border-color:#C8873A}
  .pedido-toggle-text{font-family:'Playfair Display',serif;font-size:15px;color:#5C3D2E}
  .pedido-toggle-sub{font-size:12px;color:#7A5C48;font-style:italic;margin-top:2px}
  .toggle-arrow{font-size:20px;transition:transform .3s;display:inline-block}
  .toggle-arrow.open{transform:rotate(180deg)}
  .menu-screen{padding-bottom:100px}
  .category-section{padding:20px 20px 0}
  .category-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#5C3D2E;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #D4B896}
  .menu-item{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(212,184,150,.4);gap:12px}
  .menu-item-info{flex:1}
  .menu-item-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:#2C1A0E}
  .menu-item-desc{font-size:12px;color:#7A5C48;font-style:italic;margin-top:2px}
  .menu-item-price{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#C8873A;white-space:nowrap}
  .qty-control{display:flex;align-items:center;gap:8px;background:#E8D5B7;border-radius:20px;padding:4px 8px}
  .qty-btn{background:#5C3D2E;border:none;border-radius:50%;width:26px;height:26px;color:white;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .qty-btn:hover{background:#8B5E4A}
  .qty-num{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#5C3D2E;min-width:18px;text-align:center}
  .add-btn{background:#5C3D2E;border:none;border-radius:20px;padding:6px 14px;color:#E8D5B7;font-family:'Lora',serif;font-size:13px;cursor:pointer;transition:background .2s;white-space:nowrap}
  .add-btn:hover{background:#8B5E4A}
  .cart-bar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:calc(100% - 40px);max-width:390px;background:#5C3D2E;border-radius:18px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 32px rgba(92,61,46,.35);cursor:pointer;transition:all .2s;z-index:100;animation:slideUp .4s ease}
  .cart-bar:hover{transform:translateX(-50%) translateY(-2px)}
  .cart-bar-left{display:flex;align-items:center;gap:12px}
  .cart-badge{background:#C8873A;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:14px;font-weight:700}
  .cart-bar-text{font-family:'Playfair Display',serif;font-size:15px;color:#E8D5B7;font-weight:600}
  .cart-bar-total{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#E8D5B7}
  .cart-screen{padding:24px 20px 100px}
  .cart-item{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(212,184,150,.4);gap:12px}
  .cart-item-name{font-family:'Playfair Display',serif;font-size:15px;color:#2C1A0E}
  .cart-item-price{font-size:13px;color:#7A5C48;font-style:italic;margin-top:2px}
  .cart-total-row{display:flex;justify-content:space-between;align-items:center;padding:20px 0 0;border-top:2px solid #D4B896;margin-top:4px}
  .cart-total-label{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:#5C3D2E}
  .cart-total-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#C8873A}
  .notes-area{width:100%;background:#FDF8F2;border:1.5px solid #D4B896;border-radius:12px;padding:14px 16px;font-family:'Lora',serif;font-size:14px;color:#2C1A0E;outline:none;resize:none;margin-top:20px;transition:border-color .2s}
  .notes-area:focus{border-color:#C8873A}
  .notes-area::placeholder{color:#C4A882;font-style:italic}
  .confirm-btn{background:linear-gradient(135deg,#C8873A,#A0672A);color:white;border:none;border-radius:16px;padding:18px;width:100%;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;cursor:pointer;margin-top:24px;box-shadow:0 6px 20px rgba(200,135,58,.35);transition:all .2s}
  .confirm-btn:hover{transform:translateY(-2px)}
  .confirm-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .loading-btn{opacity:.7;cursor:not-allowed}
  .confirm-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;padding:40px 32px;text-align:center}
  .confirm-icon{font-size:72px;margin-bottom:24px;animation:popIn .5s cubic-bezier(.34,1.56,.64,1) both}
  .confirm-title{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:#5C3D2E;margin-bottom:12px}
  .confirm-body{font-size:15px;color:#7A5C48;line-height:1.6;font-style:italic;max-width:280px}
  .confirm-card{background:#FDF8F2;border:1.5px solid #D4B896;border-radius:16px;padding:20px;margin:24px 0;width:100%;text-align:left}
  .confirm-row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px;border-bottom:1px dashed #D4B896}
  .confirm-row:last-child{border-bottom:none}
  .confirm-key{color:#7A5C48;font-style:italic}
  .confirm-val{font-weight:600;color:#5C3D2E;font-family:'Playfair Display',serif}
  .error-msg{background:#FFF0F0;border:1px solid #FFAAAA;border-radius:10px;padding:12px 16px;font-size:13px;color:#8B2020;margin-top:12px;text-align:center}
  .fade-in{animation:floatIn .4s ease both}
  @keyframes floatIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
`

export default function CafeApp() {
  const [screen, setScreen] = useState('home')
  const [prevScreen, setPrevScreen] = useState(null)
  const [guests, setGuests] = useState(2)
  const [form, setForm] = useState({ nombre: '', apellido: '', fecha: '', hora: '' })
  const [pedidoOpen, setPedidoOpen] = useState(false)
  const [cart, setCart] = useState({})
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const go = (to) => { setPrevScreen(screen); setScreen(to) }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = menuData.flatMap(c => c.items).find(i => i.id === Number(id))
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

  const reset = () => {
    setScreen('home'); setCart({}); setNotes('')
    setForm({ nombre: '', apellido: '', fecha: '', hora: '' })
    setGuests(2); setPedidoOpen(false); setError(null)
  }

  // Guardar reserva en Supabase
  const confirmarReserva = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Guardar la reserva
      const { data: reserva, error: errReserva } = await supabase
        .from('reservas')
        .insert([{ nombre: form.nombre, apellido: form.apellido, fecha: form.fecha, hora: form.hora, personas: guests }])
        .select()
        .single()

      if (errReserva) throw errReserva

      // 2. Si hay pedido anticipado, guardarlo también
      if (totalItems > 0) {
        const itemsDetalle = Object.entries(cart).map(([id, qty]) => {
          const item = menuData.flatMap(c => c.items).find(i => i.id === Number(id))
          return { id: Number(id), name: item.name, qty, price: item.price, subtotal: item.price * qty }
        })
        const { error: errPedido } = await supabase
          .from('pedidos')
          .insert([{ mesa: 'reserva', items: itemsDetalle, total: totalPrice, notas: notes, reserva_id: reserva.id }])
        if (errPedido) throw errPedido
      }

      go('done')
    } catch (e) {
      setError('Hubo un problema al guardar. Intentá de nuevo.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Guardar pedido desde mesa en Supabase
  const confirmarPedido = async () => {
    setLoading(true)
    setError(null)
    try {
      const itemsDetalle = Object.entries(cart).map(([id, qty]) => {
        const item = menuData.flatMap(c => c.items).find(i => i.id === Number(id))
        return { id: Number(id), name: item.name, qty, price: item.price, subtotal: item.price * qty }
      })
      const { error: errPedido } = await supabase
        .from('pedidos')
        .insert([{ mesa: 'Mesa #3', items: itemsDetalle, total: totalPrice, notas: notes }])
      if (errPedido) throw errPedido
      go('done')
    } catch (e) {
      setError('Hubo un problema al enviar el pedido. Intentá de nuevo.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const MenuItems = ({ inReserva = false }) => (
    <>
      {menuData.map(cat => (
        <div key={cat.category} className={inReserva ? '' : 'category-section'}>
          <div className="category-title">{cat.category}</div>
          {cat.items.map(item => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-info">
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-desc">{item.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="menu-item-price">{fp(item.price)}</span>
                {cart[item.id] ? (
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => setQty(item.id, -1)}>−</button>
                    <span className="qty-num">{cart[item.id]}</span>
                    <button className="qty-btn" onClick={() => setQty(item.id, 1)}>+</button>
                  </div>
                ) : (
                  <button className="add-btn" onClick={() => setQty(item.id, 1)}>+ Agregar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="cafe-app">

        {/* HOME */}
        {screen === 'home' && (
          <div className="cafe-screen home">
            <div className="home-logo">☕</div>
            <h1 className="home-title">El Rincón<br />del Tío</h1>
            <p className="home-subtitle">Cafetería artesanal · Buenos Aires</p>
            <div className="divider" />
            <div className="home-actions">
              <button className="btn-primary" onClick={() => go('reserva')}>
                <span className="btn-icon">📅</span>
                <span className="btn-content">
                  <span>Reservar una mesa</span>
                  <span className="btn-desc">Elegí día, horario y hacé tu pedido</span>
                </span>
              </button>
              <button className="btn-secondary" onClick={() => go('menu')}>
                <span className="btn-icon">🧾</span>
                <span className="btn-content">
                  <span>Ver el menú</span>
                  <span className="btn-desc">Explorá y pedí desde tu mesa</span>
                </span>
              </button>
            </div>
            <p className="home-footer">Escaneaste el QR de tu mesa · Mesa #3</p>
          </div>
        )}

        {/* RESERVA */}
        {screen === 'reserva' && (
          <div className="cafe-screen fade-in">
            <div className="header">
              <button className="back-btn" onClick={() => go('home')}>←</button>
              <div>
                <div className="header-title">Reservar mesa</div>
                <div className="header-sub">Te esperamos con todo listo</div>
              </div>
            </div>
            <div className="reserva-screen">
              <p className="section-label">Tus datos</p>
              <div className="row-2">
                <div className="field-group">
                  <label className="field-label">Nombre</label>
                  <input className="field-input" placeholder="Ej: María" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="field-group">
                  <label className="field-label">Apellido</label>
                  <input className="field-input" placeholder="Ej: González" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
                </div>
              </div>
              <hr className="separator" />
              <p className="section-label">Cuándo venís</p>
              <div className="row-2">
                <div className="field-group">
                  <label className="field-label">Fecha</label>
                  <input className="field-input" type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
                </div>
                <div className="field-group">
                  <label className="field-label">Hora</label>
                  <input className="field-input" type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">¿Cuántos son?</label>
                <div className="guests-picker">
                  <button className="guests-btn" onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <span className="guests-val">{guests}</span>
                    <div className="guests-label">{guests === 1 ? 'persona' : 'personas'}</div>
                  </div>
                  <button className="guests-btn" onClick={() => setGuests(Math.min(10, guests + 1))}>+</button>
                </div>
              </div>
              <hr className="separator" />
              <p className="section-label">Pedido anticipado</p>
              <button className="pedido-toggle" onClick={() => setPedidoOpen(!pedidoOpen)}>
                <div>
                  <div className="pedido-toggle-text">{pedidoOpen ? 'Ocultar menú' : 'Agregar pedido ya 🛍️'}{totalItems > 0 && ` (${totalItems} items)`}</div>
                  <div className="pedido-toggle-sub">Opcional · Lo tendremos listo para vos</div>
                </div>
                <span className={`toggle-arrow ${pedidoOpen ? 'open' : ''}`}>⌄</span>
              </button>
              {pedidoOpen && <div className="fade-in"><MenuItems inReserva={true} /></div>}
              {error && <div className="error-msg">{error}</div>}
              <button
                className={`confirm-btn ${loading ? 'loading-btn' : ''}`}
                style={{ marginTop: 32 }}
                onClick={confirmarReserva}
                disabled={!form.nombre || !form.fecha || !form.hora || loading}
              >
                {loading ? 'Guardando...' : 'Confirmar reserva →'}
              </button>
              {(!form.nombre || !form.fecha || !form.hora) && !loading && (
                <p style={{ textAlign: 'center', fontSize: 12, color: '#7A5C48', marginTop: 10, fontStyle: 'italic' }}>Completá nombre, fecha y hora para continuar</p>
              )}
            </div>
          </div>
        )}

        {/* MENÚ */}
        {screen === 'menu' && (
          <div className="cafe-screen fade-in">
            <div className="header">
              <button className="back-btn" onClick={() => go('home')}>←</button>
              <div>
                <div className="header-title">Menú del día</div>
                <div className="header-sub">Pedí desde tu mesa · Mesa #3</div>
              </div>
            </div>
            <div className="menu-screen"><MenuItems /></div>
            {totalItems > 0 && (
              <div className="cart-bar" onClick={() => go('cart')}>
                <div className="cart-bar-left">
                  <div className="cart-badge">{totalItems}</div>
                  <span className="cart-bar-text">Ver mi pedido</span>
                </div>
                <span className="cart-bar-total">{fp(totalPrice)}</span>
              </div>
            )}
          </div>
        )}

        {/* CARRITO */}
        {screen === 'cart' && (
          <div className="cafe-screen fade-in">
            <div className="header">
              <button className="back-btn" onClick={() => go('menu')}>←</button>
              <div>
                <div className="header-title">Tu pedido</div>
                <div className="header-sub">Revisalo antes de confirmar</div>
              </div>
            </div>
            <div className="cart-screen">
              <p className="section-label">Items seleccionados</p>
              {Object.entries(cart).map(([id, qty]) => {
                const item = menuData.flatMap(c => c.items).find(i => i.id === Number(id))
                if (!item) return null
                return (
                  <div key={id} className="cart-item">
                    <div className="menu-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">{fp(item.price)} c/u</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => setQty(Number(id), -1)}>−</button>
                        <span className="qty-num">{qty}</span>
                        <button className="qty-btn" onClick={() => setQty(Number(id), 1)}>+</button>
                      </div>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#C8873A', minWidth: 70, textAlign: 'right' }}>{fp(item.price * qty)}</span>
                    </div>
                  </div>
                )
              })}
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-price">{fp(totalPrice)}</span>
              </div>
              <textarea className="notes-area" rows={3} placeholder="Alguna aclaración... sin azúcar, sin lactosa, algo extra..." value={notes} onChange={e => setNotes(e.target.value)} />
              {error && <div className="error-msg">{error}</div>}
              <button className={`confirm-btn ${loading ? 'loading-btn' : ''}`} onClick={confirmarPedido} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar pedido a la barra ☕'}
              </button>
            </div>
          </div>
        )}

        {/* CONFIRMACIÓN */}
        {screen === 'done' && (
          <div className="cafe-screen fade-in">
            <div className="confirm-screen">
              <div className="confirm-icon">✅</div>
              <h2 className="confirm-title">{prevScreen === 'cart' ? '¡Pedido enviado!' : '¡Reserva confirmada!'}</h2>
              <p className="confirm-body">{prevScreen === 'cart' ? 'Tu pedido ya está en camino a la barra. En unos minutos lo tenés.' : `¡Gracias ${form.nombre}! Te esperamos con todo listo.`}</p>
              <div className="confirm-card">
                {form.nombre && <div className="confirm-row"><span className="confirm-key">Nombre</span><span className="confirm-val">{form.nombre} {form.apellido}</span></div>}
                {form.fecha && <div className="confirm-row"><span className="confirm-key">Fecha</span><span className="confirm-val">{form.fecha}</span></div>}
                {form.hora && <div className="confirm-row"><span className="confirm-key">Hora</span><span className="confirm-val">{form.hora} hs</span></div>}
                {form.nombre && <div className="confirm-row"><span className="confirm-key">Personas</span><span className="confirm-val">{guests}</span></div>}
                {totalItems > 0 && <div className="confirm-row"><span className="confirm-key">Items</span><span className="confirm-val">{totalItems}</span></div>}
                {totalItems > 0 && <div className="confirm-row"><span className="confirm-key">Total</span><span className="confirm-val">{fp(totalPrice)}</span></div>}
              </div>
              <button className="btn-secondary" onClick={reset}>
                <span className="btn-icon">🏠</span>
                <span>Volver al inicio</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}