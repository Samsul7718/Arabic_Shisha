import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, Flame } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const CartDrawer = () => {
  const {
    lang,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    subtotalCartPrice,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  const serviceFee = cart.length > 0 ? 15 : 0; // 15 AED Coal master & service charge
  const totalAmount = subtotalCartPrice + serviceFee;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 7, 10, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        height: '100%',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'سلة الطلبات' : 'Your Shisha Order'}
            </h3>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
            <Flame size={48} color="rgba(212, 175, 55, 0.3)" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>
              {lang === 'ar' ? 'سلتك فارغة حالياً' : 'Your cart is currently empty'}
            </p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.3rem', color: 'var(--text-muted)' }}>
              {lang === 'ar' ? 'تصفح نكهات الشيشة الممتازة وأضف خلطاتك المفضلة' : 'Explore shisha flavors or craft a custom blend to start!'}
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.2rem' }}>
            {cart.map((item) => (
              <div key={item.cartItemId} style={{ background: 'rgba(11, 13, 18, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <img src={item.image} alt={item.nameEn} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? item.nameAr : item.nameEn}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{ background: 'transparent', border: 'none', color: '#e63946', cursor: 'pointer', padding: 0 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Options summary */}
                    {item.selectedOptions && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {item.selectedOptions.bowlNameEn && (
                          <div>• Bowl: {lang === 'ar' ? item.selectedOptions.bowlNameAr : item.selectedOptions.bowlNameEn}</div>
                        )}
                        {item.selectedOptions.extraIceHose && (
                          <div style={{ color: 'var(--accent-gold-light)' }}>• + Ice Hose Attachment</div>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '0.95rem' }}>
                        {formatCurrency(item.price * item.qty)}
                      </span>

                      {/* Quantity Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, -1)}
                          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, 1)}
                          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer Summary */}
        {cart.length > 0 && (
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span>{formatCurrency(subtotalCartPrice)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
              <span>{lang === 'ar' ? 'رسوم الفحم والخدمة:' : 'Coal Master & Service Fee:'}</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '1.2rem' }}>
              <span>{lang === 'ar' ? 'الإجمالي الكلي:' : 'Total Amount:'}</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>

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
                padding: '0.8rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-gold-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <CreditCard size={18} />
              <span>{lang === 'ar' ? 'المتابعة للدفع الإلكتروني' : 'Proceed to Digital Checkout'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
