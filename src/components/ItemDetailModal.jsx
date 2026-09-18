import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BOWL_UPGRADES, BASE_LIQUIDS } from '../data/shishaData';
import { X, Check, Flame, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const ItemDetailModal = () => {
  const { lang, selectedItemDetail, setSelectedItemDetail, addToCart } = useApp();
  const [selectedBowl, setSelectedBowl] = useState(BOWL_UPGRADES[0]);
  const [selectedBase, setSelectedBase] = useState(BASE_LIQUIDS[0]);
  const [extraIceHose, setExtraIceHose] = useState(false);
  const [extraCoalRefill, setExtraCoalRefill] = useState(true);

  if (!selectedItemDetail) return null;

  const calculateTotalPrice = () => {
    let total = selectedItemDetail.price;
    total += selectedBowl.price;
    total += selectedBase.price;
    if (extraIceHose) total += 15;
    if (extraCoalRefill) total += 10;
    return total;
  };

  const handleConfirmAddToCart = () => {
    const finalPrice = calculateTotalPrice();
    const itemWithOptions = {
      ...selectedItemDetail,
      price: finalPrice
    };

    addToCart(itemWithOptions, {
      bowlId: selectedBowl.id,
      bowlNameEn: selectedBowl.nameEn,
      bowlNameAr: selectedBowl.nameAr,
      baseId: selectedBase.id,
      baseNameEn: selectedBase.nameEn,
      baseNameAr: selectedBase.nameAr,
      extraIceHose,
      extraCoalRefill
    });

    setSelectedItemDetail(null);
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
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '550px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.5rem',
        position: 'relative',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setSelectedItemDetail(null)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: lang === 'ar' ? 'auto' : '1rem',
            left: lang === 'ar' ? '1rem' : 'auto',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', alignItems: 'center' }}>
          <img
            src={selectedItemDetail.image}
            alt={selectedItemDetail.nameEn}
            style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? selectedItemDetail.nameAr : selectedItemDetail.nameEn}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {lang === 'ar' ? selectedItemDetail.descriptionAr : selectedItemDetail.descriptionEn}
            </p>
          </div>
        </div>

        {/* Option Group 1: Bowl Upgrades */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={16} />
            {lang === 'ar' ? 'اختر رأس الشيشة (الوعاء)' : 'Select Bowl Upgrade'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {BOWL_UPGRADES.map((bowl) => {
              const isSelected = selectedBowl.id === bowl.id;
              return (
                <div
                  key={bowl.id}
                  onClick={() => setSelectedBowl(bowl)}
                  style={{
                    background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.5)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>{lang === 'ar' ? bowl.nameAr : bowl.nameEn}</span>
                    {isSelected && <Check size={14} color="#d4af37" />}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', marginTop: '0.2rem' }}>
                    {bowl.price === 0 ? (lang === 'ar' ? 'مجاناً' : 'Included') : `+ ${formatCurrency(bowl.price)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Option Group 2: Base Liquids */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem' }}>
            {lang === 'ar' ? 'اختر قاعدة السائل (القارورة)' : 'Select Base Liquid'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {BASE_LIQUIDS.map((base) => {
              const isSelected = selectedBase.id === base.id;
              return (
                <div
                  key={base.id}
                  onClick={() => setSelectedBase(base)}
                  style={{
                    background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.5)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {lang === 'ar' ? base.nameAr : base.nameEn}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>
                    {base.price === 0 ? (lang === 'ar' ? 'مجاناً' : 'Standard') : `+ ${formatCurrency(base.price)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Option Group 3: Add-on Extras */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem' }}>
            {lang === 'ar' ? 'إضافات ممتازة' : 'Add-on Enhancements'}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(11, 13, 18, 0.5)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.85rem' }}>
                {lang === 'ar' ? 'خرطوم آيس مبرد مغلف' : 'Ice Cooling Attachment (+15 AED)'}
              </span>
              <input
                type="checkbox"
                checked={extraIceHose}
                onChange={(e) => setExtraIceHose(e.target.checked)}
                style={{ accentColor: '#d4af37', width: '16px', height: '16px' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(11, 13, 18, 0.5)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.85rem' }}>
                {lang === 'ar' ? 'خدمة تبديل الفحم المستمرة' : 'Unlimited Premium Coal Refills (+10 AED)'}
              </span>
              <input
                type="checkbox"
                checked={extraCoalRefill}
                onChange={(e) => setExtraCoalRefill(e.target.checked)}
                style={{ accentColor: '#d4af37', width: '16px', height: '16px' }}
              />
            </label>
          </div>
        </div>

        {/* Footer Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
              {lang === 'ar' ? 'الإجمالي النهائي:' : 'Total Price:'}
            </span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {formatCurrency(calculateTotalPrice())}
            </span>
          </div>

          <button
            onClick={handleConfirmAddToCart}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
              border: 'none',
              color: '#0b0d12',
              padding: '0.7rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-gold-glow)'
            }}
          >
            {lang === 'ar' ? 'تأكيد وإضافة للطلب' : 'Confirm & Add to Order'}
          </button>
        </div>

      </div>
    </div>
  );
};
