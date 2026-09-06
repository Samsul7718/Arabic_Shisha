import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SHISHA_FLAVORS_MASTER, BOWL_UPGRADES, BASE_LIQUIDS } from '../data/shishaData';
import { Sliders, Plus, Trash2, CheckCircle, Flame, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const ShishaBlender = () => {
  const { lang, addToCart, showToast } = useApp();

  // Selected Flavors with percentages
  const [selectedFlavors, setSelectedFlavors] = useState([
    { flavor: SHISHA_FLAVORS_MASTER[0], ratio: 60 },
    { flavor: SHISHA_FLAVORS_MASTER[1], ratio: 40 }
  ]);

  const [selectedBowl, setSelectedBowl] = useState(BOWL_UPGRADES[1]); // Default Pineapple
  const [selectedBase, setSelectedBase] = useState(BASE_LIQUIDS[0]);
  const [customName, setCustomName] = useState('');

  // Total ratio check
  const totalRatio = selectedFlavors.reduce((acc, f) => acc + f.ratio, 0);

  const handleRatioChange = (index, newRatio) => {
    const updated = [...selectedFlavors];
    updated[index].ratio = Number(newRatio);
    setSelectedFlavors(updated);
  };

  const handleAddFlavorSlot = (flavor) => {
    if (selectedFlavors.length >= 3) {
      showToast(lang === 'ar' ? 'يمكنك دمج 3 نكهات كحد أقصى' : 'Maximum 3 flavors per custom blend', 'warning');
      return;
    }
    if (selectedFlavors.some((f) => f.flavor.id === flavor.id)) {
      showToast(lang === 'ar' ? 'هذه النكهة مضافة بالفعل' : 'Flavor already added to mix', 'warning');
      return;
    }

    const currentSum = selectedFlavors.reduce((acc, f) => acc + f.ratio, 0);
    const newRatio = Math.max(10, 100 - currentSum);

    setSelectedFlavors([...selectedFlavors, { flavor, ratio: newRatio }]);
  };

  const handleRemoveFlavorSlot = (index) => {
    if (selectedFlavors.length <= 1) {
      showToast(lang === 'ar' ? 'يجب اختيار نكهة واحدة على الأقل' : 'Keep at least 1 flavor in your mix', 'warning');
      return;
    }
    setSelectedFlavors(selectedFlavors.filter((_, i) => i !== index));
  };

  const calculateCustomPrice = () => {
    const basePrice = 90; // Base custom mix fee
    return basePrice + selectedBowl.price + selectedBase.price;
  };

  const handleAddCustomMixToCart = () => {
    if (totalRatio !== 100) {
      showToast(lang === 'ar' ? 'يجب أن يكون المجموع الكلي للنسبة 100%' : 'Total blend ratio must equal exactly 100%', 'error');
      return;
    }

    const blendSummaryEn = selectedFlavors.map((f) => `${f.ratio}% ${f.flavor.nameEn}`).join(' + ');
    const blendSummaryAr = selectedFlavors.map((f) => `${f.ratio}% ${f.flavor.nameAr}`).join(' + ');

    const customMixItem = {
      id: `custom_${Date.now()}`,
      category: 'builder',
      nameEn: customName.trim() || `Custom Blend (${selectedFlavors.map((f) => f.flavor.nameEn.split(' ')[0]).join('-')})`,
      nameAr: customName.trim() || `خلطة خاصة (${selectedFlavors.map((f) => f.flavor.nameAr.split(' ')[0]).join('-')})`,
      descriptionEn: `Custom mix ratio: ${blendSummaryEn} in ${selectedBowl.nameEn}`,
      descriptionAr: `خلطة خاصة بنسبة: ${blendSummaryAr} في ${selectedBowl.nameAr}`,
      price: calculateCustomPrice(),
      rating: 5.0,
      stockStatus: 'in_stock',
      image: selectedBowl.id === 'b_pineapple'
        ? 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
    };

    addToCart(customMixItem, {
      customId: `custom_${Date.now()}`,
      bowlNameEn: selectedBowl.nameEn,
      bowlNameAr: selectedBowl.nameAr,
      baseNameEn: selectedBase.nameEn,
      baseNameAr: selectedBase.nameAr
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--accent-gold)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Sliders size={16} />
          <span>{lang === 'ar' ? 'مختبر خلط النكهات المباشر' : 'Interactive Flavor Lab'}</span>
        </div>

        <h2 className="gold-gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          {lang === 'ar' ? 'اصنع خلطة الشيشة الخاصة بك' : 'Mix & Match Your Custom Shisha'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          {lang === 'ar'
            ? 'اختر النكهات من مخزننا المباشر، اضبط نسب النكهات بدقة، واختر رأس الفاكهة الطبيعي المفضل لديك.'
            : 'Select up to 3 available flavors from live stock, adjust percentage ratios, and choose your fresh fruit bowl upgrade.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        
        {/* Step 1: Active Mix Ratio Sliders */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={18} color="#d4af37" />
              {lang === 'ar' ? '1. نسب النكهات المختارة' : '1. Selected Flavor Ratios'}
            </h3>

            <div style={{
              background: totalRatio === 100 ? 'rgba(42, 157, 143, 0.2)' : 'rgba(230, 57, 70, 0.2)',
              border: totalRatio === 100 ? '1px solid #2a9d8f' : '1px solid #e63946',
              color: totalRatio === 100 ? '#2a9d8f' : '#e63946',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {lang === 'ar' ? `المجموع: ${totalRatio}%` : `Total Ratio: ${totalRatio}%`}
            </div>
          </div>

          {selectedFlavors.map((item, idx) => (
            <div key={item.flavor.id} style={{ background: 'rgba(11, 13, 18, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.flavor.color, display: 'inline-block' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {lang === 'ar' ? item.flavor.nameAr : item.flavor.nameEn}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {item.flavor.profile}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.1rem' }}>
                    {item.ratio}%
                  </span>
                  <button
                    onClick={() => handleRemoveFlavorSlot(idx)}
                    style={{ background: 'transparent', border: 'none', color: '#e63946', cursor: 'pointer', opacity: 0.8 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={item.ratio}
                onChange={(e) => handleRatioChange(idx, e.target.value)}
                style={{ width: '100%', accentColor: '#d4af37', cursor: 'pointer' }}
              />
            </div>
          ))}

          {/* Available Flavor Selector Pills */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
              {lang === 'ar' ? 'أضف نكهات إضافية من المتوفر بالمخزن:' : 'Add flavors from live stock:'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SHISHA_FLAVORS_MASTER.map((flavor) => {
                const isSelected = selectedFlavors.some((f) => f.flavor.id === flavor.id);
                const isOutOfStock = flavor.stock === 0;

                return (
                  <button
                    key={flavor.id}
                    disabled={isSelected || isOutOfStock}
                    onClick={() => handleAddFlavorSlot(flavor)}
                    style={{
                      background: isSelected ? 'rgba(212, 175, 55, 0.2)' : isOutOfStock ? 'rgba(255,255,255,0.03)' : 'rgba(11, 13, 18, 0.8)',
                      border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      color: isSelected ? 'var(--accent-gold)' : isOutOfStock ? 'var(--text-muted)' : 'var(--text-primary)',
                      padding: '0.45rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      cursor: isSelected || isOutOfStock ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      opacity: isOutOfStock ? 0.5 : 1
                    }}
                  >
                    <Plus size={14} />
                    <span>{lang === 'ar' ? flavor.nameAr : flavor.nameEn}</span>
                    {isOutOfStock && <span style={{ color: '#e63946', fontSize: '0.7rem' }}>(Out)</span>}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Step 2: Bowl & Custom Name Configuration */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem' }}>
            {lang === 'ar' ? '2. اختر وعاء الشيشة واسم الخلطة' : '2. Bowl Upgrade & Custom Blend Name'}
          </h3>

          {/* Custom Blend Name */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              {lang === 'ar' ? 'اسم خلطتك الخاصة (اختياري):' : 'Custom Blend Name (Optional):'}
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: خلطة السهرة الملكية' : 'e.g. Sultan Royal Night Blend'}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                background: 'rgba(11, 13, 18, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Bowl Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {BOWL_UPGRADES.map((bowl) => {
              const isSelected = selectedBowl.id === bowl.id;
              return (
                <div
                  key={bowl.id}
                  onClick={() => setSelectedBowl(bowl)}
                  style={{
                    background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    padding: '0.8rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? 'var(--accent-gold)' : '#fff' }}>
                    {lang === 'ar' ? bowl.nameAr : bowl.nameEn}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {lang === 'ar' ? bowl.descriptionAr : bowl.descriptionEn}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold-light)', marginTop: '0.5rem' }}>
                    {bowl.price === 0 ? (lang === 'ar' ? 'سعر قياسي' : 'Standard') : `+ ${formatCurrency(bowl.price)}`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
                {lang === 'ar' ? 'إجمالي سعر الخلطة:' : 'Calculated Custom Price:'}
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {formatCurrency(calculateCustomPrice())}
              </span>
            </div>

            <button
              onClick={handleAddCustomMixToCart}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
                border: 'none',
                color: '#0b0d12',
                padding: '0.75rem 1.6rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-gold-glow)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle size={18} />
              <span>{lang === 'ar' ? 'إضافة الخلطة إلى الطلب' : 'Add Custom Blend to Order'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
