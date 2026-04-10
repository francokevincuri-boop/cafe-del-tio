'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const menuData = [
  { id: 1, name: 'Espresso', price: 1200, cat: 'Cafés' },
  { id: 2, name: 'Cortado', price: 1400, cat: 'Cafés' },
  { id: 3, name: 'Café con leche', price: 1600, cat: 'Cafés' },
  { id: 4, name: 'Cappuccino', price: 1800, cat: 'Cafés' },
  { id: 5, name: 'Latte', price: 1900, cat: 'Cafés' },
  { id: 6, name: 'Chocolatada', price: 1700, cat: 'Calientes' },
  { id: 7, name: 'Leche sola', price: 1000, cat: 'Calientes' },
  { id: 8, name: 'Medialunas (x3)', price: 1500, cat: 'Facturas' },
  { id: 9, name: 'Vigilante', price: 900, cat: 'Facturas' },
  { id: 10, name: 'Cuernito', price: 800, cat: 'Facturas' },
  { id: 11, name: 'Brownie', price: 2200, cat: 'Pastelería' },
  { id: 12, name: 'Torta de zanahoria', price: 2500, cat: 'Pastelería' },
  { id: 13, name: 'Cheese cake', price: 2800, cat: 'Pastelería' },
]

const fp = (p) => p ? `$${Number(p).toLocaleString('es-AR')}` : '$0'
const timeAgo = (d) => {
  const diff = Math.floor((new Date() - new Date(d)) / 1000)
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `Hace ${Math.floor(diff/60)}m`
  if (diff < 86400) return `Hace ${Math.floor(diff/3600)}h`
  return new Date(d).toLocaleDateString('es-AR')
}

const ESTADOS = { pendiente: { label: 'Pendiente', color: '#C8873A', bg: '#FFF3E0' }, confirmado: { label: 'Confirmado', color: '#1565C0', bg: '#E3F2FD' }, entregado: { label: 'Entregado', color: '#2E7D32', bg: '#E8F5E9' } }
const ORIGENES = { qr: { label: 'QR / Mesa', icon: '📱' }, reserva: { label: 'Reserva', icon: '📅' }, mesero: { label: 'Mesero', icon: '🧑‍🍳' } }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#F5EFE6}
  .admin{min-height:100vh;background:#F5EFE6;font-family:'Lora',serif;color:#2C1A0E;max-width:600px;margin:0 auto}
  .admin-header{background:#5C3D2E;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:20}
  .admin-title{font-family:'Playfair Display',serif;font-size:20px;color:#E8D5B7;font-weight:700}
  .admin-sub{font-size:11px;color:#C4A882;font-style:italic;margin-top:2px}
  .live-dot{width:8px;height:8px;background:#5A9A4A;border-radius:50%;display:inline-block;margin-right:5px;animation:pulse 2s infinite}
  .live-label{font-size:12px;color:#C4A882;display:flex;align-items:center}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px}
  .stat{background:#FDF8F2;border:1.5px solid #D4B896;border-radius:12px;padding:12px;text-align:center}
  .stat-num{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#C8873A}
  .stat-label{font-size:11px;color:#7A5C48;font-style:italic;margin-top:2px}
  .tabs{display:flex;background:#FDF8F2;border-bottom:2px solid #D4B896;position:sticky;top:65px;z-index:10}
  .tab{flex:1;padding:13px 8px;text-align:center;font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:#7A5C48;cursor:pointer;border-bottom:3px solid transparent;transition:all .2s;margin-bottom:-2px}
  .tab.active{color:#5C3D2E;border-bottom-color:#C8873A}
  .tab-badge{background:#C8873A;color:white;border-radius:10px;padding:1px 6px;font-size:11px;margin-left:4px}
  .content{padding:12px}
  .card{background:#FDF8F2;border:1.5px solid #D4B896;border-radius:14px;padding:16px;margin-bottom:12px;animation:floatIn .3s ease both}
  .card.pendiente{border-left:4px solid #C8873A}
  .card.confirmado{border-left:4px solid #1565C0}
  .card.entregado{border-left:4px solid #2E7D32;opacity:.75}
  .card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:8px}
  .card-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#5C3D2E}
  .card-meta{font-size:11px;color:#7A5C48;font-style:italic;margin-top:3px;display:flex;gap:8px;flex-wrap:wrap}
  .badges{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
  .badge{border-radius:20px;padding:3px 10px;font-size:11px;font-weight:500;white-space:nowrap}
  .card-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px;border-bottom:1px dashed rgba(212,184,150,.4)}
  .card-row:last-child{border-bottom:none}
  .card-key{color:#7A5C48;font-style:italic}
  .card-val{font-weight:500;color:#2C1A0E;text-align:right}
  .items-box{background:#F5EFE6;border-radius:10px;padding:10px 12px;margin:10px 0}
  .item-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:3px 0;border-bottom:1px dashed rgba(212,184,150,.3)}
  .item-row:last-child{border-bottom:none}
  .item-name{color:#2C1A0E;flex:1}
  .item-qty{color:#7A5C48;font-style:italic;margin:0 8px;font-size:12px}
  .item-price{color:#C8873A;font-weight:500;white-space:nowrap}
  .notas-box{background:#FFF8EC;border:1px solid #E8D5B7;border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;color:#5C3D2E;font-style:italic}
  .card-total{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:2px solid #D4B896;margin-top:6px}
  .card-total-label{font-family:'Playfair Display',serif;font-size:14px;color:#5C3D2E}
  .card-total-price{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:#C8873A}
  .actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
  .action-btn{flex:1;border:none;border-radius:10px;padding:10px 8px;font-family:'Lora',serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;min-width:80px;text-align:center}
  .btn-confirm{background:#1565C0;color:white}
  .btn-confirm:hover{background:#0D47A1}
  .btn-deliver{background:#2E7D32;color:white}
  .btn-deliver:hover{background:#1B5E20}
  .btn-add{background:#E8D5B7;color:#5C3D2E;border:1.5px solid #D4B896}
  .btn-add:hover{background:#D4B896}
  .btn-mesa{background:#F5EFE6;color:#5C3D2E;border:1.5px solid #C8873A}
  .btn-mesa:hover{background:#E8D5B7}
  .mesa-selector{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
  .mesa-btn{width:44px;height:44px;border-radius:10px;border:1.5px solid #D4B896;background:#FDF8F2;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;color:#5C3D2E}
  .mesa-btn:hover,.mesa-btn.selected{background:#5C3D2E;color:#E8D5B7;border-color:#5C3D2E}
  .add-items-panel{margin-top:10px;background:#F5EFE6;border-radius:10px;padding:12px}
  .add-items-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:#5C3D2E;margin-bottom:8px}
  .add-item-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px dashed rgba(212,184,150,.3)}
  .add-item-row:last-child{border-bottom:none}
  .add-item-name{font-size:13px;color:#2C1A0E;flex:1}
  .add-item-price{font-size:12px;color:#C8873A;margin:0 8px}
  .add-qty-ctrl{display:flex;align-items:center;gap:6px}
  .add-qty-btn{background:#5C3D2E;border:none;border-radius:50%;width:24px;height:24px;color:white;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .add-qty-num{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#5C3D2E;min-width:16px;text-align:center}
  .save-items-btn{width:100%;background:#C8873A;color:white;border:none;border-radius:10px;padding:10px;font-family:'Playfair Display',serif;font-size:15px;font-weight:600;cursor:pointer;margin-top:10px;transition:background .2s}
  .save-items-btn:hover{background:#A0672A}
  .empty{text-align:center;padding:50px 20px;color:#7A5C48;font-style:italic}
  .empty-icon{font-size:44px;margin-bottom:12px}
  .empty-title{font-family:'Playfair Display',serif;font-size:18px;color:#5C3D2E;margin-bottom:6px}
  .mesero-link{display:block;background:#5C3D2E;color:#E8D5B7;border:none;border-radius:10px;padding:12px 16px;font-family:'Playfair Display',serif;font-size:15px;font-weight:600;cursor:pointer;text-align:center;text-decoration:none;margin:0 14px 14px}
  .mesero-link:hover{background:#8B5E4A}
  @keyframes floatIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
`

export default function AdminPanel() {
  const [tab, setTab] = useState('pedidos')
  const [reservas, setReservas] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandido, setExpandido] = useState({})
  const [mesaPanel, setMesaPanel] = useState({})
  const [addPanel, setAddPanel] = useState({})
  const [addCart, setAddCart] = useState({})

  const cargarDatos = async () => {
    setLoading(true)
    const [{ data: r }, { data: p }] = await Promise.all([
      supabase.from('reservas').select('*').order('created_at', { ascending: false }),
      supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
    ])
    setReservas(r || [])
    setPedidos(p || [])
    setLoading(false)
  }

  useEffect(() => {
    cargarDatos()
    const ch1 = supabase.channel('admin-reservas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, cargarDatos)
      .subscribe()
    const ch2 = supabase.channel('admin-pedidos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, cargarDatos)
      .subscribe()
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2) }
  }, [])

  const toggleExpandido = (id) => setExpandido(p => ({ ...p, [id]: !p[id] }))
  const toggleMesaPanel = (id) => setMesaPanel(p => ({ ...p, [id]: !p[id] }))
  const toggleAddPanel = (id) => { setAddPanel(p => ({ ...p, [id]: !p[id] })); setAddCart({}) }

  const asignarMesa = async (tipo, id, mesa) => {
    await supabase.from(tipo).update({ mesa_numero: mesa }).eq('id', id)
    setMesaPanel(p => ({ ...p, [id]: false }))
    cargarDatos()
  }

  const cambiarEstado = async (id, estadoActual) => {
    const siguiente = estadoActual === 'pendiente' ? 'confirmado' : estadoActual === 'confirmado' ? 'entregado' : 'entregado'
    const extra = siguiente === 'confirmado' ? { confirmado_at: new Date().toISOString() } : siguiente === 'entregado' ? { entregado_at: new Date().toISOString() } : {}
    await supabase.from('pedidos').update({ estado: siguiente, ...extra }).eq('id', id)
    cargarDatos()
  }

  const cambiarEstadoReserva = async (id, estadoActual) => {
    const siguiente = estadoActual === 'pendiente' ? 'confirmado' : 'entregado'
    await supabase.from('reservas').update({ estado: siguiente }).eq('id', id)
    cargarDatos()
  }

  const agregarItems = async (pedidoId, itemsActuales) => {
    const nuevos = Object.entries(addCart).map(([id, qty]) => {
      const item = menuData.find(i => i.id === Number(id))
      return { id: Number(id), name: item.name, qty, price: item.price, subtotal: item.price * qty }
    }).filter(i => i.qty > 0)
    if (!nuevos.length) return
    const merged = [...(itemsActuales || [])]
    nuevos.forEach(n => {
      const ex = merged.find(m => m.id === n.id)
      if (ex) ex.qty += n.qty, ex.subtotal += n.subtotal
      else merged.push(n)
    })
    const nuevoTotal = merged.reduce((acc, i) => acc + i.subtotal, 0)
    await supabase.from('pedidos').update({ items: merged, total: nuevoTotal }).eq('id', pedidoId)
    setAddPanel(p => ({ ...p, [pedidoId]: false }))
    setAddCart({})
    cargarDatos()
  }

  const setAddQty = (itemId, delta) => {
    setAddCart(prev => {
      const next = { ...prev }
      const newQty = (next[itemId] || 0) + delta
      if (newQty <= 0) delete next[itemId]
      else next[itemId] = newQty
      return next
    })
  }

  const pendientes = pedidos.filter(p => p.estado === 'pendiente').length
  const totalRecaudado = pedidos.filter(p => p.estado === 'entregado').reduce((acc, p) => acc + (p.total || 0), 0)

  const OrigenBadge = ({ origen }) => {
    const o = ORIGENES[origen] || ORIGENES.qr
    return <span className="badge" style={{ background: '#F5EFE6', color: '#5C3D2E', border: '1px solid #D4B896' }}>{o.icon} {o.label}</span>
  }

  const EstadoBadge = ({ estado }) => {
    const e = ESTADOS[estado] || ESTADOS.pendiente
    return <span className="badge" style={{ background: e.bg, color: e.color }}>{e.label}</span>
  }

  return (
    <>
      <style>{css}</style>
      <div className="admin">
        <div className="admin-header">
          <div>
            <div className="admin-title">☕ Panel del tío</div>
            <div className="admin-sub">El Rincón del Tío · Admin</div>
          </div>
          <div className="live-label"><span className="live-dot" />En vivo</div>
        </div>

        <div className="stats">
          <div className="stat"><div className="stat-num">{pendientes}</div><div className="stat-label">Pendientes</div></div>
          <div className="stat"><div className="stat-num">{reservas.length}</div><div className="stat-label">Reservas</div></div>
          <div className="stat"><div className="stat-num">{fp(totalRecaudado)}</div><div className="stat-label">Recaudado</div></div>
        </div>

        <a href="/mesero" className="mesero-link">🧑‍🍳 Ir a pantalla del mesero</a>

        <div className="tabs">
          <div className={`tab ${tab === 'pedidos' ? 'active' : ''}`} onClick={() => setTab('pedidos')}>
            Pedidos {pendientes > 0 && <span className="tab-badge">{pendientes}</span>}
          </div>
          <div className={`tab ${tab === 'reservas' ? 'active' : ''}`} onClick={() => setTab('reservas')}>
            Reservas {reservas.filter(r => r.estado === 'pendiente').length > 0 && <span className="tab-badge">{reservas.filter(r => r.estado === 'pendiente').length}</span>}
          </div>
        </div>

        <div className="content">
          {loading ? <div className="empty">Cargando...</div> : tab === 'pedidos' ? (
            pedidos.length === 0 ? (
              <div className="empty"><div className="empty-icon">🧾</div><div className="empty-title">Sin pedidos todavía</div><p>Los pedidos van a aparecer acá en tiempo real.</p></div>
            ) : pedidos.map(p => {
              const items = Array.isArray(p.items) ? p.items : []
              const estado = p.estado || 'pendiente'
              const expanded = expandido[p.id]
              return (
                <div key={p.id} className={`card ${estado}`}>
                  <div className="card-top">
                    <div>
                      <div className="card-name">
                        {p.mesa_numero ? `Mesa ${p.mesa_numero}` : p.mesa || 'Sin mesa'}
                      </div>
                      <div className="card-meta">
                        <span>🕐 {timeAgo(p.created_at)}</span>
                        {p.reserva_id && <span>🔗 Reserva #{p.reserva_id}</span>}
                      </div>
                    </div>
                    <div className="badges">
                      <OrigenBadge origen={p.origen || (p.reserva_id ? 'reserva' : 'qr')} />
                      <EstadoBadge estado={estado} />
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="items-box">
                      {(expanded ? items : items.slice(0, 2)).map((item, i) => (
                        <div key={i} className="item-row">
                          <span className="item-name">{item.name}</span>
                          <span><span className="item-qty">x{item.qty}</span><span className="item-price">{fp(item.subtotal)}</span></span>
                        </div>
                      ))}
                      {items.length > 2 && (
                        <div style={{ textAlign: 'center', marginTop: 6 }}>
                          <button onClick={() => toggleExpandido(p.id)} style={{ background: 'none', border: 'none', color: '#C8873A', cursor: 'pointer', fontSize: 12, fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
                            {expanded ? 'Ver menos ↑' : `Ver ${items.length - 2} más ↓`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {p.notas && <div className="notas-box">📝 {p.notas}</div>}

                  <div className="card-total">
                    <span className="card-total-label">Total</span>
                    <span className="card-total-price">{fp(p.total)}</span>
                  </div>

                  {/* Panel asignar mesa */}
                  {mesaPanel[p.id] && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, color: '#7A5C48', fontStyle: 'italic', marginBottom: 6 }}>Elegí la mesa:</div>
                      <div className="mesa-selector">
                        {[1,2,3,4,5,6,7,8,9,10].map(m => (
                          <button key={m} className={`mesa-btn ${p.mesa_numero === m ? 'selected' : ''}`} onClick={() => asignarMesa('pedidos', p.id, m)}>{m}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Panel agregar items */}
                  {addPanel[p.id] && (
                    <div className="add-items-panel">
                      <div className="add-items-title">Agregar al pedido</div>
                      {menuData.map(item => (
                        <div key={item.id} className="add-item-row">
                          <span className="add-item-name">{item.name}</span>
                          <span className="add-item-price">{fp(item.price)}</span>
                          <div className="add-qty-ctrl">
                            <button className="add-qty-btn" onClick={() => setAddQty(item.id, -1)}>−</button>
                            <span className="add-qty-num">{addCart[item.id] || 0}</span>
                            <button className="add-qty-btn" onClick={() => setAddQty(item.id, 1)}>+</button>
                          </div>
                        </div>
                      ))}
                      <button className="save-items-btn" onClick={() => agregarItems(p.id, items)}>
                        Guardar cambios ✓
                      </button>
                    </div>
                  )}

                  <div className="actions">
                    {estado === 'pendiente' && <button className="action-btn btn-confirm" onClick={() => cambiarEstado(p.id, estado)}>✓ Confirmar</button>}
                    {estado === 'confirmado' && <button className="action-btn btn-deliver" onClick={() => cambiarEstado(p.id, estado)}>✓ Entregado</button>}
                    <button className="action-btn btn-mesa" onClick={() => toggleMesaPanel(p.id)}>🪑 {p.mesa_numero ? `Mesa ${p.mesa_numero}` : 'Asignar mesa'}</button>
                    <button className="action-btn btn-add" onClick={() => toggleAddPanel(p.id)}>+ Agregar</button>
                  </div>
                </div>
              )
            })
          ) : (
            reservas.length === 0 ? (
              <div className="empty"><div className="empty-icon">📅</div><div className="empty-title">Sin reservas todavía</div></div>
            ) : reservas.map(r => {
              const estado = r.estado || 'pendiente'
              return (
                <div key={r.id} className={`card ${estado}`}>
                  <div className="card-top">
                    <div>
                      <div className="card-name">{r.nombre} {r.apellido}</div>
                      <div className="card-meta"><span>🕐 {timeAgo(r.created_at)}</span></div>
                    </div>
                    <div className="badges">
                      <OrigenBadge origen="reserva" />
                      <EstadoBadge estado={estado} />
                    </div>
                  </div>
                  <div className="card-row"><span className="card-key">Fecha</span><span className="card-val">{r.fecha}</span></div>
                  <div className="card-row"><span className="card-key">Hora</span><span className="card-val">{r.hora} hs</span></div>
                  <div className="card-row"><span className="card-key">Personas</span><span className="card-val">{r.personas}</span></div>
                  {r.mesa_numero && <div className="card-row"><span className="card-key">Mesa</span><span className="card-val">Mesa {r.mesa_numero}</span></div>}

                  {mesaPanel[`r${r.id}`] && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, color: '#7A5C48', fontStyle: 'italic', marginBottom: 6 }}>Asignar mesa:</div>
                      <div className="mesa-selector">
                        {[1,2,3,4,5,6,7,8,9,10].map(m => (
                          <button key={m} className={`mesa-btn ${r.mesa_numero === m ? 'selected' : ''}`} onClick={() => asignarMesa('reservas', r.id, m)}>{m}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="actions">
                    {estado === 'pendiente' && <button className="action-btn btn-confirm" onClick={() => cambiarEstadoReserva(r.id, estado)}>✓ Confirmar</button>}
                    {estado === 'confirmado' && <button className="action-btn btn-deliver" onClick={() => cambiarEstadoReserva(r.id, estado)}>✓ Completada</button>}
                    <button className="action-btn btn-mesa" onClick={() => toggleMesaPanel(`r${r.id}`)}>🪑 {r.mesa_numero ? `Mesa ${r.mesa_numero}` : 'Asignar mesa'}</button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}