import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Akaki Full Gospel Church - Management System',
  description: 'Comprehensive church tithing and membership management',
  icons: {
    icon: '/Full_gosple.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
