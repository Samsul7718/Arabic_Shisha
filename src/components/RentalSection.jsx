import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RENTAL_POT_MODELS, SHISHA_FLAVORS_MASTER } from '../data/shishaData';
import { Truck, ShieldCheck, Clock, CheckCircle, Flame, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const RentalSection = () => {
  const { lang, addToCart, showToast } = useApp();

  const [selectedPot, setSelectedPot] = useState(RENTAL_POT_MODELS[0]);
  const [rentalDurationDays, setRentalDurationDays] = useState(1); // 1, 2, or 3 days
  const [selectedFlavor, setSelectedFlavor] = useState(SHISHA_FLAVORS_MASTER[0]);
  const [extraCoalBox, setExtraCoalBox] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const calculateRentalSubtotal = () => {
    let rate = selectedPot.dailyRate * rentalDurationDays;
    if (rentalDurationDays === 3) rate *= 0.85; // 15% weekend discount
    if (extraCoalBox) rate += 20;
    return Math.round(rate);
  };

  const handleAddRentalToCart = () => {
    const subtotal = calculateRentalSubtotal();
    const rentalItem = {
      id: `rental_${Date.now()}`,
      category: 'rentals',
      nameEn: `Hookah Rental: ${selectedPot.nameEn} (${rentalDurationDays} Day${rentalDurationDays > 1 ? 's' : ''})`,
      nameAr: `تأجير شيشة: ${selectedPot.nameAr} (${rentalDurationDays} يوم)`,
      descriptionEn: `Includes ${selectedPot.brand} Pot, ${selectedFlavor.nameEn} Flavor Pack, and ${selectedPot.deposit} AED refundable deposit.`,
      descriptionAr: `تتضمن شيشة ${selectedPot.brand}، علبة معسل ${selectedFlavor.nameAr}، وتأمين مسترد بقيمة ${selectedPot.deposit} درهم.`,
      price: subtotal,
      deposit: selectedPot.deposit,
      rating: 5.0,
      stockStatus: 'in_stock',
      image: selectedPot.image
    };

    addToCart(rentalItem, {
      rentalPotId: selectedPot.id,
      durationDays: rentalDurationDays,
      flavorNameEn: selectedFlavor.nameEn,
      flavorNameAr: selectedFlavor.nameAr,
      depositAmount: selectedPot.deposit,
      deliveryAddress
    });

    showToast(
      lang === 'ar'
        ? `تم إدراج حزمة تأجير شيشة ${selectedPot.brand} في سلتك!`
        : `Added ${selectedPot.brand} Hookah Rental Package to your order!`
    );
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--accent-gold)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Truck size={16} />
          <span>{lang === 'ar' ? 'خدمة تأجير الشيشة للمنازل والحفلات' : '24h Home & Event Hookah Rental'}</span>
        </div>

        <h2 className="gold-gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          {lang === 'ar' ? 'استأجر شيشة فاخرة لمنزلك (24 ساعة / عطلة)' : 'Rent a Premium Hookah Pot to Your Doorstep'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
          {lang === 'ar'
            ? 'استمتع بتجربة الشيشة الروسية أو مايا أو الأكبر في منزلك. تشمل الحزمة الشيشة الكاملة، الخراطيم، علبة المعسل، والفحم.'
            : 'Enjoy Russian, Maya, Al-Akbar, or Coco-Aya hookah pots at home. Every rental includes the full hookah setup, flavor box, and charcoal.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Step 1: Select Pot Model */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={18} color="#d4af37" />
            {lang === 'ar' ? '1. اختر نوع الشيشة للتأجير' : '1. Select Hookah Pot Brand Model'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {RENTAL_POT_MODELS.map((pot) => {
              const isSelected = selectedPot.id === pot.id;
              return (
                <div
                  key={pot.id}
                  onClick={() => setSelectedPot(pot)}
                  style={{
                    background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '0.8rem',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={pot.image} alt={pot.nameEn} style={{ width: '65px', height: '65px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? 'var(--accent-gold)' : '#fff' }}>
                      {lang === 'ar' ? pot.nameAr : pot.nameEn}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                      Brand: <span style={{ color: 'var(--accent-gold-light)', fontWeight: 600 }}>{pot.brand}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>
                        {formatCurrency(pot.dailyRate)} / Day
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Deposit: {formatCurrency(pot.deposit)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Duration, Flavor & Options */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#d4af37" />
              {lang === 'ar' ? '2. ملاحق وحزمة التأجير' : '2. Duration & Included Flavors'}
            </h3>

            {/* Rental Duration Picker */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                {lang === 'ar' ? 'مدة التأجير:' : 'Rental Duration:'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { days: 1, labelEn: '24 Hours', labelAr: '24 ساعة' },
                  { days: 2, labelEn: '48 Hours', labelAr: '48 ساعة' },
                  { days: 3, labelEn: 'Weekend (3 Days)', labelAr: 'عطلة نهاية الأسبوع (3 أيام)' }
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setRentalDurationDays(d.days)}
                    style={{
                      flex: 1,
                      background: rentalDurationDays === d.days ? 'linear-gradient(135deg, #d4af37, #ff9f1c)' : 'rgba(11, 13, 18, 0.6)',
                      border: rentalDurationDays === d.days ? 'none' : '1px solid var(--border-subtle)',
                      color: rentalDurationDays === d.days ? '#0b0d12' : 'var(--text-secondary)',
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'ar' ? d.labelAr : d.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Included Flavor Box */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                {lang === 'ar' ? 'علبة المعسل المجانية المرفقة:' : 'Included Flavor Pack:'}
              </label>
              <select
                value={selectedFlavor.id}
                onChange={(e) => setSelectedFlavor(SHISHA_FLAVORS_MASTER.find((f) => f.id === e.target.value) || SHISHA_FLAVORS_MASTER[0])}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
              >
                {SHISHA_FLAVORS_MASTER.map((f) => (
                  <option key={f.id} value={f.id}>
                    {lang === 'ar' ? f.nameAr : f.nameEn} ({f.brand})
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Address */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                {lang === 'ar' ? 'عنوان التوصيل للمنزل:' : 'Home Delivery Address:'}
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل اسم الشارع/الفيلا/الفيلا...' : 'Street address, Villa # or Apartment...'}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Pricing Breakdown & Action */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              <span>{lang === 'ar' ? 'رسوم التأجير:' : 'Rental Fee:'}</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{formatCurrency(calculateRentalSubtotal())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <span>{lang === 'ar' ? 'التأمين المسترد عند الإرجاع:' : 'Refundable Deposit (on return):'}</span>
              <span>{formatCurrency(selectedPot.deposit)}</span>
            </div>

            <button
              onClick={handleAddRentalToCart}
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
              <CheckCircle size={18} />
              <span>{lang === 'ar' ? 'إضافة حزمة التأجير إلى السلة' : 'Add Rental Package to Cart'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
