import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { RentalSection } from './components/RentalSection';
import { PartyCateringSection } from './components/PartyCateringSection';
import { ShishaBlender } from './components/ShishaBlender';
import { OrdersTracker } from './components/OrdersTracker';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { Toast } from './components/Toast';

function MainContent() {
  const { activeTab } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, maxWidth: '1250px', width: '100%', margin: '0 auto', padding: '0 1rem' }}>
        {activeTab === 'catalog' && <Catalog />}
        {activeTab === 'rental' && <RentalSection />}
        {activeTab === 'party' && <PartyCateringSection />}
        {activeTab === 'blender' && <ShishaBlender />}
        {activeTab === 'orders' && <OrdersTracker />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <ItemDetailModal />
      <Toast />

      {/* Footer */}
      <footer className="glass-panel" style={{ margin: '2rem auto 1rem', maxWidth: '1250px', padding: '1.2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p style={{ margin: 0 }}>
          © 2026 Arabic Hookah Smoke Shop & Parlor • Retail Brands (Russian, Maya, Afzal, Coco-Aya, Al-Fakher, Soex) • 24h Rentals & Party Catering.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
