'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Currency and area-unit choices, remembered per visitor.
// AED is pegged to USD; GBP and EUR rates are indicative and should come from a rates API in production.
export const currencies = {
  AED: { label: 'AED', perAed: 1 },
  USD: { label: 'USD', perAed: 1 / 3.6725 },
  GBP: { label: 'GBP', perAed: 1 / 4.65 },
  EUR: { label: 'EUR', perAed: 1 / 3.95 },
} as const;
export type Currency = keyof typeof currencies;
export type AreaUnit = 'sqft' | 'm2';

interface Prefs {
  currency: Currency;
  unit: AreaUnit;
  setCurrency: (c: Currency) => void;
  setUnit: (u: AreaUnit) => void;
}

const PrefsContext = createContext<Prefs>({
  currency: 'AED', unit: 'sqft', setCurrency: () => {}, setUnit: () => {},
});

const read = (key: string) => {
  try { return window.localStorage.getItem(key); } catch { return null; }
};
const write = (key: string, value: string) => {
  try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ }
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('AED');
  const [unit, setUnitState] = useState<AreaUnit>('sqft');

  useEffect(() => {
    const c = read('fanar-currency');
    const u = read('fanar-unit');
    if (c && c in currencies) setCurrencyState(c as Currency);
    if (u === 'sqft' || u === 'm2') setUnitState(u);
  }, []);

  const setCurrency = (c: Currency) => { setCurrencyState(c); write('fanar-currency', c); };
  const setUnit = (u: AreaUnit) => { setUnitState(u); write('fanar-unit', u); };

  return (
    <PrefsContext.Provider value={{ currency, unit, setCurrency, setUnit }}>
      {children}
    </PrefsContext.Provider>
  );
}

export const usePreferences = () => useContext(PrefsContext);

export function formatPrice(aed: number, currency: Currency, compact = false) {
  const value = aed * currencies[currency].perAed;
  if (compact && value >= 1_000_000) {
    return `${currency} ${(value / 1_000_000).toFixed(value >= 10_000_000 ? 1 : 2).replace(/\.?0+$/, '')}M`;
  }
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

export function formatArea(sqft: number, unit: AreaUnit) {
  return unit === 'sqft'
    ? `${sqft.toLocaleString('en-US')} sq ft`
    : `${Math.round(sqft * 0.092903).toLocaleString('en-US')} m²`;
}

// Dubai Golden Visa: property investment of AED 2 million or more.
export const GOLDEN_VISA_THRESHOLD_AED = 2_000_000;
