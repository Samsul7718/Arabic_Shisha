import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Flame, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const CartDrawer = () => {
  const {
    lang,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    setIsCheckoutOpen,
    adminWhatsAppPhone
  } = useApp();

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Generate clean WhatsApp order text with zero prices/fees
  const whatsappOrderMessage = encodeURIComponent(
    lang === 'ar'
      ? `مرحباً متجر ومجلس الشيشة، أود تقديم طلب الشيشة التالي:\n\n${cart
          .map((item, idx) => `${idx + 1}. ${item.nameAr || item.nameEn} (العدد: ${item.qty})`)
          .join('\n')}\n\nيرجى تأكيد الاستلام والتجهيز.`
      : `Hello Arabic Shisha, I would like to place this shisha order:\n\n${cart
          .map((item, idx) => `${idx + 1}. ${item.nameEn} (Qty: ${item.qty})`)
          .join('\n')}\n\nPlease confirm availability and preparation.`
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 7, 10, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '430px',
        width: '100%',
        height: '100%',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        boxShadow: 'var(--shadow-card)',
        borderLeft: lang === 'ar' ? 'none' : '1px solid var(--border-gold)',
        borderRight: lang === 'ar' ? '1px solid var(--border-gold)' : 'none'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'قائمة الطلبات' : 'Your Shisha Order'}
            </h3>
            {totalItemsCount > 0 && (
              <span style={{
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--accent-gold-light)',
                border: '1px solid var(--border-gold)',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                padding: '1px 8px'
              }}>
                {totalItemsCount}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            title={lang === 'ar' ? 'إغلاق' : 'Close'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', padding: '0 1rem' }}>
            <Flame size={48} color="rgba(212, 175, 55, 0.3)" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'قائمة الطلبات فارغة حالياً' : 'Your order is currently empty'}
            </p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {lang === 'ar' ? 'تصفح نكهات الشيشة المتوفرة وأضف الأصناف المفضلة لديك' : 'Explore available shisha flavors and products to start your order!'}
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingRight: '0.2rem' }}>
            {cart.map((item) => (
              <div key={item.cartItemId} style={{ background: 'rgba(11, 13, 18, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <img src={item.image} alt={item.nameEn} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'contain', background: 'rgba(255,255,255,0.03)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {lang === 'ar' ? item.nameAr : item.nameEn}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        title={lang === 'ar' ? 'حذف' : 'Remove'}
                        style={{ background: 'transparent', border: 'none', color: '#e63946', cursor: 'pointer', padding: '0 0 0 4px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {item.brand && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', marginTop: '0.15rem', fontWeight: 600 }}>
                        {item.brand}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem' }}>
                      {/* Available Tag in place of amount */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: '#22c55e',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        <CheckCircle size={13} color="#22c55e" />
                        <span>{lang === 'ar' ? 'متوفر' : 'Available'}</span>
                      </span>

                      {/* Quantity Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, -1)}
                          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, 1)}
                          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer Summary (No amounts, no extra fees) */}
        {cart.length > 0 && (
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', marginTop: '1rem' }}>
            {/* Clean Items Summary */}
            <div style={{
              background: 'rgba(11, 13, 18, 0.65)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'إجمالي عدد الطلبات:' : 'Total Items:'}
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                  {totalItemsCount} {lang === 'ar' ? 'عناصر' : 'Items'}
                </span>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#22c55e',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)'
              }}>
                <CheckCircle size={14} color="#22c55e" />
                <span>{lang === 'ar' ? 'جاهز للتجهيز' : 'Ready to Order'}</span>
              </div>
            </div>

            {/* Direct WhatsApp Order Action */}
            <a
              href={`https://wa.me/${adminWhatsAppPhone || '919960154761'}?text=${whatsappOrderMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.6rem',
                boxShadow: '0 3px 12px rgba(37, 211, 102, 0.3)',
                boxSizing: 'border-box'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.333 5.004L2 22l5.133-1.343a9.963 9.963 0 0 0 4.876 1.28h.005c5.505 0 9.989-4.477 9.99-9.984A9.957 9.957 0 0 0 18.995 5.1 9.957 9.957 0 0 0 12.012 2zm.005 16.347h-.004a8.28 8.28 0 0 1-4.225-1.157l-.303-.18-3.138.823.837-3.06-.197-.314a8.277 8.277 0 0 1-1.27-4.475c.002-4.57 3.717-8.283 8.29-8.283 2.213.001 4.293.863 5.857 2.43 1.564 1.566 2.423 3.647 2.422 5.86-.002 4.571-3.718 8.284-8.29 8.284zm4.542-6.208c-.249-.124-1.474-.727-1.703-.81-.229-.083-.395-.124-.561.124-.166.248-.644.81-.789.975-.145.166-.29.186-.539.062-.249-.124-1.053-.388-2.006-1.238-.742-.661-1.243-1.478-1.388-1.727-.145-.248-.016-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.248.249-.415.083-.166.042-.311-.021-.435-.062-.124-.561-1.349-.769-1.847-.202-.486-.407-.42-.561-.428l-.478-.009c-.166 0-.435.062-.663.311-.229.248-.871.851-.871 2.075 0 1.224.891 2.406 1.015 2.572.124.166 1.753 2.677 4.248 3.754.593.256 1.057.409 1.418.524.596.19 1.138.163 1.566.099.478-.072 1.474-.602 1.681-1.183.207-.58.207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z"/>
              </svg>
              <span>{lang === 'ar' ? 'إرسال الطلب عبر واتساب' : 'Send Order to WhatsApp'}</span>
            </a>

            {/* Place Order on System */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
                border: 'none',
                color: '#0b0d12',
                padding: '0.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-gold-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem'
              }}
            >
              <span>{lang === 'ar' ? 'تأكيد الطلب للطاولة / المجلس' : 'Confirm Order for Table / Lounge'}</span>
              {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
