import { ChevronDown, Menu, Phone, Search, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { laptopBrands } from '../data/laptopTaxonomy'
import { useStore } from '../store/StoreContext'
import { Logo } from './Logo'

interface HeaderProps {
  onCart: () => void
  onSearch: (value: string) => void
  search: string
  navigate: (path: string) => void
  onCatalogSelect: (brand?: string, line?: string) => void
}

export function Header({ onCart, onSearch, search, navigate, onCatalogSelect }: HeaderProps) {
  const { cartCount, settings } = useStore()
  const [open, setOpen] = useState(false)

  const selectCatalog = (brand?: string, line?: string) => {
    navigate('/')
    onCatalogSelect(brand, line)
    setOpen(false)
    window.setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 20)
  }

  return (
    <>
      <div className="announcement"><span>{settings.content.announcementPrimary}</span><span>•</span><span>{settings.content.announcementSecondary}</span></div>
      <header className="header">
        <div className="container header__inner">
          <button className="logo-button" onClick={() => navigate('/')}><Logo variant={settings.logoStyle} name={settings.storeName} slogan={settings.slogan} roundSrc={settings.logoRoundSrc} wideSrc={settings.logoWideSrc} /></button>
          <nav className={open ? 'nav nav--open' : 'nav'} aria-label="Điều hướng nhanh theo hãng laptop">
            {laptopBrands.map(group => (
              <div className="nav-dropdown" key={group.brand}>
                <button onClick={() => selectCatalog(group.brand)}>{group.brand}<ChevronDown size={14} /></button>
                <div className="nav-dropdown__menu">
                  <button onClick={() => selectCatalog(group.brand)}>Tất cả {group.brand}</button>
                  {group.lines.map(line => <button key={line} onClick={() => selectCatalog(group.brand, line)}>{line}</button>)}
                </div>
              </div>
            ))}
            <button className="nav-admin" onClick={() => { navigate('/admin'); setOpen(false) }}>Quản trị</button>
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
