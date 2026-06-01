import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!isAuthenticated || !user || user.role === 'superadmin') {
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.get('/store/subscription');
      if (res.data && res.data.data) {
        setSubscription(res.data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data langganan', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated, user]);

  const plan = subscription?.plan || 'basic';
  const isPro = plan === 'pro' || plan === 'enterprise';
  const isEnterprise = plan === 'enterprise';

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, plan, isPro, isEnterprise, fetchSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
