import { ChevronDown, FileText, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/StoreContext'

export function Header({ navigate, search, onSearch, onQuote }: { navigate: (path: string) => void; search: string; onSearch: (value: string) => void; onQuote: () => void }) {
  const { settings, quoteCount } = useStore(); const [open, setOpen] = useState(false)
  const categories = settings.categories.filter(item => item.visible).sort((a, b) => a.sortOrder - b.sortOrder)
  const go = (path: string) => { setOpen(false); navigate(path) }
  return <>{settings.visibility.announcement && <div className="announcement"><div className="container"><span>{settings.content.announcementPrimary}</span><span>{settings.content.announcementSecondary}</span></div></div>}<header className="header"><div className="container header__row">
    <button className={`brand brand--${settings.logoStyle}`} onClick={() => go('/')}><img src={settings.logoStyle === 'round' ? settings.logoRoundSrc : settings.logoWideSrc} alt={settings.storeName} /></button>
    <nav className={open ? 'nav nav--open' : 'nav'}><button onClick={() => go('/san-pham')}>{settings.content.navProducts}</button><div className="nav__dropdown"><button aria-haspopup="true">{settings.content.navSolutions}<ChevronDown /></button><div className="mega-menu">{categories.map(item => <button key={item.id} onClick={() => go(`/san-pham?category=${encodeURIComponent(item.name)}`)}><strong>{item.shortName}</strong><small>{item.description}</small></button>)}</div></div><button onClick={() => go('/#nang-luc')}>{settings.content.navWhy}</button><button onClick={() => go('/#lien-he')}>{settings.content.navContact}</button></nav>
    <div className="header__actions">{settings.visibility.search && <label className="search"><Search /><input value={search} onChange={event => onSearch(event.target.value)} placeholder="Tìm model, thương hiệu, tag..." /></label>}<button className="quote-button" onClick={onQuote}><FileText /><span>Yêu cầu báo giá</span>{quoteCount > 0 && <b>{quoteCount}</b>}</button><button className="menu-button" onClick={() => setOpen(value => !value)} aria-label="Menu">{open ? <X /> : <Menu />}</button></div>
  </div></header></>
}
