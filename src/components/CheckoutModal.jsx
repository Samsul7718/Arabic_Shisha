import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, DollarSign, Smartphone, CheckCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = () => {
  const {
    lang,
    isCheckoutOpen,
    setIsCheckoutOpen,
    createOrder,
    cart
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('apple_pay'); // 'apple_pay', 'card', 'cash'
  const [tableNumber, setTableNumber] = useState('Table #07');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsProcessing(false);
      createOrder(paymentMethod);
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 7, 10, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '1.8rem',
        position: 'relative',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          title={lang === 'ar' ? 'إغلاق' : 'Close'}
          style={{ position: 'absolute', top: '1rem', right: lang === 'ar' ? 'auto' : '1rem', left: lang === 'ar' ? '1rem' : 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {lang === 'ar' ? 'تأكيد وإرسال الطلب للمجلس' : 'Confirm & Place Shisha Order'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {lang === 'ar' ? 'حدد رقم طاولتك وخيار الخدمة لتوصيل الشيشة فوراً' : 'Select your lounge table location for instant delivery.'}
        </p>

        {/* Table Number Selector */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            {lang === 'ar' ? 'موقع الطاولة أو المجلس:' : 'Lounge Table Location:'}
          </label>
          <select
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
          >
            {['Table #01 (VIP)', 'Table #04 (Terrace)', 'Table #07 (Royal Lounge)', 'Table #12 (Cabana)'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Service Options */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
            {lang === 'ar' ? 'طريقة الخدمة والتسليم:' : 'Service Preference:'}
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div
              onClick={() => setPaymentMethod('table_service')}
              style={{
                background: paymentMethod === 'table_service' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                border: paymentMethod === 'table_service' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="#d4af37" />
                <span>{lang === 'ar' ? 'خدمة الطاولة المباشرة' : 'Direct Table Service'}</span>
              </div>
              {paymentMethod === 'table_service' && <CheckCircle size={16} color="#d4af37" />}
            </div>

            <div
              onClick={() => setPaymentMethod('takeaway')}
              style={{
                background: paymentMethod === 'takeaway' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                border: paymentMethod === 'takeaway' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                <CreditCard size={18} color="#d4af37" />
                <span>{lang === 'ar' ? 'استلام من الكاونتر' : 'Counter Pickup'}</span>
              </div>
              {paymentMethod === 'takeaway' && <CheckCircle size={16} color="#d4af37" />}
            </div>
          </div>
        </div>

        {/* Order Review (Zero amounts, zero extra charges) */}
        <div style={{ background: 'rgba(11, 13, 18, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'إجمالي محتويات الطلب:' : 'Order Contents:'}</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>
              {totalItemsCount} {lang === 'ar' ? 'عناصر' : 'Items'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#22c55e', marginTop: '0.5rem' }}>
            <CheckCircle size={14} color="#22c55e" />
            <span>{lang === 'ar' ? 'جميع الطلبات متوفرة وجاهزة للتجهيز الفوري' : 'All items verified in stock & ready'}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={isProcessing}
          onClick={handlePayNow}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
            border: 'none',
            color: '#0b0d12',
            padding: '0.85rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: isProcessing ? 'wait' : 'pointer',
            boxShadow: 'var(--shadow-gold-glow)'
          }}
        >
          {isProcessing ? (lang === 'ar' ? 'جاري إرسال الطلب...' : 'Placing Order...') : (lang === 'ar' ? 'تأكيد وإرسال الطلب' : 'Confirm & Place Order')}
        </button>

      </div>
    </div>
  );
};
