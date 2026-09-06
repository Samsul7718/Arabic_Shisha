import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Flame, CheckCircle2, ShieldAlert, Utensils } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const OrdersTracker = () => {
  const { lang, orders, setActiveTab } = useApp();

  const steps = [
    { step: 1, labelEn: 'Order Received', labelAr: 'تم استلام الطلب' },
    { step: 2, labelEn: 'Heating Coals', labelAr: 'تجهيز الفحم المشتعل' },
    { step: 3, labelEn: 'Packing Shisha', labelAr: 'تجهيز وتعبئة الشيشة' },
    { step: 4, labelEn: 'Served at Table', labelAr: 'تم التقديم للطاولة' }
  ];

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Clock size={48} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>
            {lang === 'ar' ? 'لا توجد طلبات حية حالياً' : 'No Active Orders Yet'}
          </h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {lang === 'ar' ? 'قم بطلب نكهتك المفضلة من المنيو وتابع حالة إعداد الفحم مباشرةً' : 'Place an order from the Shisha Menu or Custom Mixer to track live prep updates.'}
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
              border: 'none',
              color: '#0b0d12',
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'تصفح قائمتنا الآن' : 'Browse Shisha Menu'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div className="glass-panel" style={{ padding: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 className="gold-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          {lang === 'ar' ? 'تتبع الطلبات الحية في المجلس' : 'Live Order Prep & Coal Tracker'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {lang === 'ar' ? 'متابعة مباشرة لمراحل تجهيز الفحم وتوصيل الشيشة لطاولتك' : 'Real-time status updates from our master coal station to your lounge table.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => (
          <div key={order.orderId} className="glass-panel" style={{ padding: '1.5rem' }}>
            {/* Order Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.1rem' }}>
                  {order.orderId}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.8rem' }}>
                  • Placed at {order.timestamp}
                </span>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                {formatCurrency(order.totalAmount)}
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '2rem 0' }}>
              {/* Background Connecting Line */}
              <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '3px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }} />
              <div style={{ position: 'absolute', top: '18px', left: '10%', width: `${(order.statusStep - 1) * 33}%`, height: '3px', background: 'linear-gradient(90deg, #d4af37, #ff9f1c)', zIndex: 2, transition: 'width 0.5s ease' }} />

              {steps.map((s) => {
                const isComplete = order.statusStep >= s.step;
                const isCurrent = order.statusStep === s.step;

                return (
                  <div key={s.step} style={{ zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '25%' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isComplete ? 'linear-gradient(135deg, #d4af37, #ff9f1c)' : '#131722',
                      border: isComplete ? 'none' : '2px solid var(--border-subtle)',
                      color: isComplete ? '#0b0d12' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      boxShadow: isCurrent ? 'var(--shadow-gold-glow)' : 'none'
                    }}>
                      {isComplete ? <CheckCircle2 size={20} /> : s.step}
                    </div>
                    <span style={{ fontSize: '0.78rem', marginTop: '0.5rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--accent-gold-light)' : 'var(--text-secondary)' }}>
                      {lang === 'ar' ? s.labelAr : s.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Itemized Summary */}
            <div style={{ background: 'rgba(11, 13, 18, 0.6)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {lang === 'ar' ? 'محتويات الطلب:' : 'Ordered Items:'}
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  <span>{item.qty}x {lang === 'ar' ? item.nameAr : item.nameEn}</span>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
