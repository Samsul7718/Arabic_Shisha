import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Globe, Flame, Store, Truck, Sparkles, Sliders, Clock } from 'lucide-react';

export const Header = () => {
  const { lang, toggleLanguage, activeTab, setActiveTab, totalCartCount, setIsCartOpen, orders } = useApp();

  const navItems = [
    { id: 'catalog', labelEn: 'Shop', labelAr: ' المجلس', icon: Store },
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
              {lang === 'ar' ? 'متجر ومجلس الشيشة العربي' : 'Arabic Shisha'}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/919960154761"
            target="_blank"
            rel="noopener noreferrer"
            title={lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
            style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#ffffff',
              padding: '0.5rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 2px 10px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.333 5.004L2 22l5.133-1.343a9.963 9.963 0 0 0 4.876 1.28h.005c5.505 0 9.989-4.477 9.99-9.984A9.957 9.957 0 0 0 18.995 5.1 9.957 9.957 0 0 0 12.012 2zm.005 16.347h-.004a8.28 8.28 0 0 1-4.225-1.157l-.303-.18-3.138.823.837-3.06-.197-.314a8.277 8.277 0 0 1-1.27-4.475c.002-4.57 3.717-8.283 8.29-8.283 2.213.001 4.293.863 5.857 2.43 1.564 1.566 2.423 3.647 2.422 5.86-.002 4.571-3.718 8.284-8.29 8.284zm4.542-6.208c-.249-.124-1.474-.727-1.703-.81-.229-.083-.395-.124-.561.124-.166.248-.644.81-.789.975-.145.166-.29.186-.539.062-.249-.124-1.053-.388-2.006-1.238-.742-.661-1.243-1.478-1.388-1.727-.145-.248-.016-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.248.249-.415.083-.166.042-.311-.021-.435-.062-.124-.561-1.349-.769-1.847-.202-.486-.407-.42-.561-.428l-.478-.009c-.166 0-.435.062-.663.311-.229.248-.871.851-.871 2.075 0 1.224.891 2.406 1.015 2.572.124.166 1.753 2.677 4.248 3.754.593.256 1.057.409 1.418.524.596.19 1.138.163 1.566.099.478-.072 1.474-.602 1.681-1.183.207-.58.207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z"/>
            </svg>
            <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
          </a>

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
