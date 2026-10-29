import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Globe, Store, Truck, Sparkles, Sliders, Clock, Cloud, X, Award, Star } from 'lucide-react';
import shopImage from '../assets/shop.jpg';

export const Header = () => {
  const {
    lang,
    toggleLanguage,
    activeTab,
    setActiveTab,
    totalCartCount,
    setIsCartOpen,
    orders,
    partyBookings,
    adminWhatsAppPhone,
    setAdminSubTab
  } = useApp();

  const [showShopModal, setShowShopModal] = useState(false);

  const navItems = [
    { id: 'catalog', labelEn: 'Shop', labelAr: 'المجلس والمتجر', icon: Store },
    { id: 'rental', labelEn: 'Rent a Hookah', labelAr: 'تأجير شيشة', icon: Truck },
    { id: 'party', labelEn: 'Party Catering', labelAr: 'تنظيم حفلات', icon: Sparkles },
    { id: 'blender', labelEn: 'Mix Your Own', labelAr: 'خلطتك الخاصة', icon: Sliders },
    { id: 'orders', labelEn: 'Orders & Rentals', labelAr: 'طلباتي وتأجيري', icon: Clock, badge: orders.length },
    { id: 'admin', labelEn: 'Admin & Parties', labelAr: 'لوحة الإدارة والحفلات', icon: Cloud, badge: partyBookings?.length }
  ];

  return (
    <header className="glass-panel" style={{ margin: '1rem auto', maxWidth: '1250px', padding: '1rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo with Real Shop Image */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            onClick={() => setShowShopModal(true)}
            title={lang === 'ar' ? 'انقر لعرض صورة المتجر الحقيقي' : 'Click to view physical store photo'}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              padding: '2.5px',
              background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
              boxShadow: 'var(--shadow-gold-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-gold-glow)';
            }}
          >
            <img 
              src={shopImage} 
              alt="Arabic Shisha Shop" 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 22%',
                display: 'block'
              }} 
            />
          </div>
          <div 
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('catalog')}
            title={lang === 'ar' ? 'الرئيسية والمتجر' : 'Go to Catalog'}
          >
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
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'admin') {
                    setAdminSubTab('parties');
                  }
                }}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Trust & Google Rating Badge */}
          <div
            title={lang === 'ar' ? 'أكثر من ٢٥ عاماً في خدمة عملائنا • متوسط تقييم ٤.٩ على جوجل' : '25+ Years of Serving Customers • 4.9 Average Rating on Google'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(19, 23, 34, 0.6) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.28)',
              borderRadius: 'var(--radius-full)',
              padding: '0.38rem 0.8rem',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              userSelect: 'none'
            }}
          >
            {/* 25 Years of Service */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0b0d12',
                  flexShrink: 0,
                  boxShadow: '0 0 6px rgba(212, 175, 55, 0.4)'
                }}
              >
                <Award size={11} strokeWidth={2.8} />
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold-light)',
                  letterSpacing: '0.2px',
                  whiteSpace: 'nowrap'
                }}
              >
                {lang === 'ar' ? '٢٥+ عاماً في خدمتكم' : '25+ Yrs Serving'}
              </span>
            </div>

            {/* Subtle Divider */}
            <span style={{ width: '1px', height: '14px', background: 'rgba(212, 175, 55, 0.35)', flexShrink: 0 }} />

            {/* Google Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>4.9</span>
                <Star size={11} fill="#ffb703" color="#ffb703" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {lang === 'ar' ? 'تقييم جوجل' : 'Google'}
                </span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${adminWhatsAppPhone || '919960154761'}`}
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

      {/* Storefront Photo Lightbox Modal */}
      {showShopModal && (
        <div 
          onClick={() => setShowShopModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel"
            style={{
              maxWidth: '480px',
              width: '100%',
              background: 'linear-gradient(180deg, #161a23 0%, #0d0f15 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.3)'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={shopImage} 
                alt="Arabic Shisha Physical Store" 
                style={{ width: '100%', maxHeight: '430px', objectFit: 'cover', display: 'block' }}
              />
              <button
                onClick={() => setShowShopModal(false)}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.65)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <Store size={22} color="#d4af37" />
                <h3 className="gold-gradient-text" style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                  {lang === 'ar' ? 'متجر ومجلس الشيشة العربي' : 'Arabic Shisha Storefront'}
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: '0 0 1.25rem', lineHeight: 1.55 }}>
                {lang === 'ar' 
                  ? 'مرحباً بكم في متجرنا! تجدون لدينا أفضل ماركات الشيشة (الروسية، مايا، الفاخر، أفضال، بونتشي، كوكو آيا)، نكهات معسل، فحم طبيعي وسريع، وخدمات تأجير منازل وحفلات.'
                  : 'Welcome to our physical shop! Complete collection of Russian pots, Maya, Afzal flavors, premium coals, 24/7 home rentals, and party catering.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={`https://wa.me/${adminWhatsAppPhone || '919960154761'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: '#fff',
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>{lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
                </a>
                <button
                  onClick={() => setShowShopModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.88rem'
                  }}
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
