import { Menu, Phone, Search, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { Logo } from './Logo'

interface HeaderProps { onCart: () => void; onSearch: (value: string) => void; search: string; navigate: (path: string) => void }

export function Header({ onCart, onSearch, search, navigate }: HeaderProps) {
  const { cartCount, settings } = useStore()
  const [open, setOpen] = useState(false)
  const go = (id: string) => { navigate('/'); setOpen(false); window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 20) }

  return (
    <>
      <div className="announcement"><span>{settings.content.announcementPrimary}</span><span>•</span><span>{settings.content.announcementSecondary}</span></div>
      <header className="header">
        <div className="container header__inner">
          <button className="logo-button" onClick={() => navigate('/')}><Logo variant={settings.logoStyle} name={settings.storeName} slogan={settings.slogan} roundSrc={settings.logoRoundSrc} wideSrc={settings.logoWideSrc} /></button>
          <nav className={open ? 'nav nav--open' : 'nav'} aria-label="Điều hướng chính">
            <button onClick={() => go('products')}>{settings.content.navProducts}</button>
            <button onClick={() => go('why-us')}>{settings.content.navWhy}</button>
            <button onClick={() => go('contact')}>{settings.content.navContact}</button>
            <button onClick={() => { navigate('/admin'); setOpen(false) }}>Quản trị</button>
          </nav>
          <div className="header__tools">
            <label className="header-search"><Search size={18} /><input value={search} onChange={event => onSearch(event.target.value)} placeholder="Tìm laptop..." aria-label="Tìm laptop" /></label>
            <a className="phone-link" href={`tel:${settings.phone.replace(/\s/g, '')}`}><Phone size={17} /><span>{settings.phone}</span></a>
            <button className="cart-button" onClick={onCart} aria-label={`Giỏ hàng có ${cartCount} sản phẩm`}><ShoppingBag size={21} />{cartCount > 0 && <span>{cartCount}</span>}</button>
            <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Mở menu">{open ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>
    </>
  )
}
