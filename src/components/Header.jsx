import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Globe, Flame, Store, Truck, Sparkles, Sliders, Clock } from 'lucide-react';

export const Header = () => {
  const { lang, toggleLanguage, activeTab, setActiveTab, totalCartCount, setIsCartOpen, orders } = useApp();

  const navItems = [
    { id: 'catalog', labelEn: 'Shop & Parlor', labelAr: 'المتجر والمجلس', icon: Store },
    { id: 'rental', labelEn: 'Rent a Hookah', labelAr: 'تأجير شيشة', icon: Truck },
    { id: 'party', labelEn: 'Party Catering', labelAr: 'تنظيم حفلات', icon: Sparkles },
    { id: 'blender', labelEn: 'Mix Your Own', labelAr: 'خلطتك الخاصة', icon: Sliders },
    { id: 'orders', labelEn: 'Orders & Rentals', labelAr: 'طلباتي وتأجيري', icon: Clock, badge: orders.length }
  ];

  return (
    <header className="glass-panel" style={{ margin: '1rem auto', maxWidth: '1250px', padding: '1rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('catalog')}>
          <div style={{
            background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
            padding: '0.6rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-gold-glow)'
          }}>
            <Flame size={26} color="#0b0d12" />
          </div>
          <div>
            <h1 className="gold-gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
              {lang === 'ar' ? 'متجر ومجلس الشيشة العربي' : 'Arabic Hookah Shop & Parlor'}
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              {lang === 'ar' ? 'بيع شيش ونكهات • تأجير منازل • تنظيم حفلات' : 'Retail Sales • 24h Pot Rentals • Party Catering'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(255, 159, 28, 0.15))' : 'transparent',
                  border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                  color: isActive ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Icon size={16} color={isActive ? '#d4af37' : '#adb5bd'} />
                <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.badge > 0 && (
                  <span style={{
                    background: 'var(--accent-amber)',
                    color: '#000',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    borderRadius: '50%',
                    padding: '1px 6px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleLanguage}
            title="Toggle Language / تغيير اللغة"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-gold-light)',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <Globe size={16} color="#d4af37" />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
              border: 'none',
              color: '#0b0d12',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-gold-glow)'
            }}
          >
            <ShoppingBag size={18} />
            <span>{lang === 'ar' ? 'السلة' : 'Cart'}</span>
            {totalCartCount > 0 && (
              <span style={{
                background: '#e63946',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
