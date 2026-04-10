import './globals.css'

export const metadata = {
  title: 'El Rincón del Tío',
  description: 'Cafetería artesanal · Buenos Aires',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
