import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SEATING_ZONES, TIME_SLOTS } from '../data/shishaData';
import { Calendar, Clock, Users, MapPin, CheckCircle, Sparkles, Phone, User } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const ReservationSection = () => {
  const { lang, addReservation, reservations, cart } = useApp();

  const [selectedZone, setSelectedZone] = useState(SEATING_ZONES[0]);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[2]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert(lang === 'ar' ? 'الرجاء إدخال الاسم ورقم الهاتف' : 'Please enter your name and phone number');
      return;
    }

    const bookingCode = `ASL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      bookingCode,
      zone: selectedZone,
      guests: guestCount,
      date: selectedDate,
      time: selectedTimeSlot,
      customerName,
      customerPhone,
      specialNotes,
      attachedItemsCount: cart.length,
      createdAt: new Date().toLocaleTimeString()
    };

    addReservation(newBooking);
    
    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setSpecialNotes('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--accent-gold)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Calendar size={16} />
          <span>{lang === 'ar' ? 'نظام حجز الطاولات المباشر' : 'Live Table Reservations'}</span>
        </div>

        <h2 className="gold-gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          {lang === 'ar' ? 'احجز طاولتك في المجلس الملكي' : 'Reserve Your Lounge Experience'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          {lang === 'ar'
            ? 'احجز مقعدك المفضل مسبقاً وتجنب الانتظار. يمكنك إرفاق طلب الشيشة مسبقاً ليصلك طازجاً فور وصولك.'
            : 'Pre-book your preferred lounge seating zone to avoid queue times. Optionally pre-order your shisha flavors.'}
        </p>
      </div>

      {/* Active Reservations Banner if any */}
      {reservations.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem', border: '1px solid var(--accent-gold)' }}>
          <h4 style={{ color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} color="#d4af37" />
            {lang === 'ar' ? 'حجوزاتك الحالية الفعالة:' : 'Your Confirmed Table Bookings:'}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {reservations.map((res) => (
              <div key={res.bookingCode} style={{ background: 'rgba(11, 13, 18, 0.7)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1rem', marginRight: '0.8rem' }}>
                    {res.bookingCode}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {lang === 'ar' ? res.zone.nameAr : res.zone.nameEn}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.8rem' }}>
                    ({res.guests} {lang === 'ar' ? 'ضيوف' : 'Guests'}) • {res.date} @ {res.time}
                  </span>
                </div>
                <div style={{ background: 'rgba(42, 157, 143, 0.2)', color: '#2a9d8f', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {lang === 'ar' ? 'مؤكد' : 'Confirmed'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form Card */}
      <form onSubmit={handleBookingSubmit} className="glass-panel" style={{ padding: '1.8rem' }}>
        
        {/* Step 1: Select Seating Zone */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="#d4af37" />
            {lang === 'ar' ? '1. اختر منطقة الجلوس بالمجلس' : '1. Choose Lounge Seating Zone'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {SEATING_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  style={{
                    background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={zone.image} alt={zone.nameEn} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.8rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? 'var(--accent-gold)' : '#fff' }}>
                      {lang === 'ar' ? zone.nameAr : zone.nameEn}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {lang === 'ar' ? zone.descriptionAr : zone.descriptionEn}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--accent-gold-light)' }}>
                      <span>{zone.capacity}</span>
                      <span>Min {formatCurrency(zone.minSpend)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Date, Time & Guests */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }}>
          
          {/* Guest Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {lang === 'ar' ? 'عدد الضيوف:' : 'Number of Guests:'}
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {lang === 'ar' ? 'ضيوف' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {lang === 'ar' ? 'تاريخ الحجز:' : 'Reservation Date:'}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {lang === 'ar' ? 'موعد الحضور:' : 'Time Slot:'}
            </label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Step 3: Contact Details */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem' }}>
            {lang === 'ar' ? '2. تفاصيل الاتصال' : '2. Contact Information'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <input
                type="text"
                required
                placeholder={lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem', background: 'rgba(11, 13, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', outline: 'none' }}
              />
            </div>
            <div>
              <input
                type="tel"
                required
                placeholder={lang === 'ar' ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem', background: 'rgba(11, 13, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', outline: 'none' }}
              />
            </div>
          </div>

          <textarea
            placeholder={lang === 'ar' ? 'ملاحظات خاصة (أعياد ميلاد، طلبات الفحم الخاصة، إلخ)' : 'Special Requests (Birthday setup, coal preferences, etc.)'}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '0.65rem 1rem', background: 'rgba(11, 13, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', outline: 'none' }}
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
            border: 'none',
            color: '#0b0d12',
            padding: '0.85rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-gold-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle size={20} />
          <span>{lang === 'ar' ? 'تأكيد حجز الطاولة الآن' : 'Confirm Table Booking Now'}</span>
        </button>

      </form>

    </div>
  );
};
