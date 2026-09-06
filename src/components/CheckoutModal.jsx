import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, DollarSign, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import confetti from 'canvas-confetti';

export const CheckoutModal = () => {
  const {
    lang,
    isCheckoutOpen,
    setIsCheckoutOpen,
    subtotalCartPrice,
    createOrder,
    cart
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('apple_pay'); // 'apple_pay', 'card', 'cash'
  const [tableNumber, setTableNumber] = useState('Table #07');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const totalAmount = subtotalCartPrice + 15;

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
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          style={{ position: 'absolute', top: '1rem', right: lang === 'ar' ? 'auto' : '1rem', left: lang === 'ar' ? '1rem' : 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {lang === 'ar' ? 'الدفع الإلكتروني وتأكيد الطلب' : 'Digital Checkout & Payment'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {lang === 'ar' ? 'اختر طريقة الدفع المناسبة لتوصيل الشيشة فوراً لطاولتك' : 'Select your instant digital payment method for table delivery.'}
        </p>

        {/* Table Number Selector */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            {lang === 'ar' ? 'رقم الطاولة في المجلس:' : 'Lounge Table Location:'}
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

        {/* Payment Methods */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
            {lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div
              onClick={() => setPaymentMethod('apple_pay')}
              style={{
                background: paymentMethod === 'apple_pay' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                border: paymentMethod === 'apple_pay' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                <Smartphone size={18} color="#d4af37" />
                <span>Apple Pay / Tap to Pay</span>
              </div>
              {paymentMethod === 'apple_pay' && <CheckCircle size={16} color="#d4af37" />}
            </div>

            <div
              onClick={() => setPaymentMethod('card')}
              style={{
                background: paymentMethod === 'card' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                border: paymentMethod === 'card' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
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
                <span>Credit / Debit Card</span>
              </div>
              {paymentMethod === 'card' && <CheckCircle size={16} color="#d4af37" />}
            </div>

            <div
              onClick={() => setPaymentMethod('cash')}
              style={{
                background: paymentMethod === 'cash' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                border: paymentMethod === 'cash' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                <DollarSign size={18} color="#d4af37" />
                <span>{lang === 'ar' ? 'الدفع نقداً للطاولة' : 'Pay Cash at Table'}</span>
              </div>
              {paymentMethod === 'cash' && <CheckCircle size={16} color="#d4af37" />}
            </div>
          </div>
        </div>

        {/* Amount Summary */}
        <div style={{ background: 'rgba(11, 13, 18, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>{lang === 'ar' ? 'إجمالي الطلبات:' : 'Items Total:'}</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>{formatCurrency(totalAmount)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#2a9d8f', marginTop: '0.5rem' }}>
            <ShieldCheck size={14} />
            <span>Encrypted SSL 256-bit Digital Checkout</span>
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
          {isProcessing ? (lang === 'ar' ? 'جاري تنفيذ العملية...' : 'Processing Payment...') : (lang === 'ar' ? `تأكيد ودفع ${formatCurrency(totalAmount)}` : `Pay ${formatCurrency(totalAmount)} Now`)}
        </button>

      </div>
    </div>
  );
};
