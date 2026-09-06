import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: toast.type === 'error' ? '#e63946' : 'linear-gradient(135deg, #131722, #1c2232)',
        border: '1px solid var(--border-gold)',
        color: '#fff',
        padding: '0.75rem 1.4rem',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-gold-glow)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        animation: 'fadeInUp 0.3s ease'
      }}
    >
      <Sparkles size={18} color="#d4af37" />
      <span>{toast.message}</span>
    </div>
  );
};
