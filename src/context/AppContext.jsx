import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // 'en' | 'ar'
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'blender' | 'reservation' | 'orders'
  
  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('all');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  
  // Cart & Orders State
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  
  // Toast Notification System
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const addToCart = (item, options = {}) => {
    const cartItemId = options.customId || `${item.id}-${options.bowlId || 'std'}-${options.baseId || 'std'}`;
    
    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) => (i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          cartItemId,
          qty: 1,
          selectedOptions: options
        }
      ];
    });

    const msg = lang === 'ar' 
      ? `تمت إضافة "${lang === 'ar' ? item.nameAr : item.nameEn}" إلى الطلب`
      : `Added "${item.nameEn}" to your order`;
    showToast(msg);
    setIsCartOpen(true);
  };

  const updateCartQty = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const addReservation = (bookingDetails) => {
    setReservations((prev) => [bookingDetails, ...prev]);
    showToast(
      lang === 'ar' 
        ? `تم حجز الطاولة بنجاح! رقم الحجز: ${bookingDetails.bookingCode}` 
        : `Table reserved! Booking Ref: ${bookingDetails.bookingCode}`
    );
    setActiveTab('reservation');
  };

  const createOrder = (paymentMethod) => {
    const newOrder = {
      orderId: `ASL-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.qty, 0) + 15, // + 15 AED service/coal fee
      paymentMethod,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      statusStep: 1 // 1: Received, 2: Preparing Coals, 3: Packing Shisha, 4: Served at Table
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveTab('orders');

    showToast(
      lang === 'ar' ? `تم استلام الطلب! رقم الطلب ${newOrder.orderId}` : `Order placed! Order ID: ${newOrder.orderId}`
    );
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotalCartPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        inStockOnly,
        setInStockOnly,
        selectedProfile,
        setSelectedProfile,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedItemDetail,
        setSelectedItemDetail,
        reservations,
        addReservation,
        orders,
        createOrder,
        totalCartCount,
        subtotalCartPrice,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
