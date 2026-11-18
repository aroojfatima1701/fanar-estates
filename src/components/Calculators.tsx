'use client';
import { useState } from 'react';
import { formatPrice, usePreferences } from '../lib/preferences';

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// UAE Central Bank rules for non-resident and expat buyers of a first home:
// at least 20% down up to AED 5M, 30% above. Terms up to 25 years.
export function MortgageCalculator({ priceAed }: { priceAed: number }) {
  const { currency } = usePreferences();
  const minDown = priceAed > 5_000_000 ? 30 : 20;
  const [down, setDown] = useState(Math.max(25, minDown));
  const [rate, setRate] = useState(4.49);
  const [years, setYears] = useState(25);

  const loan = priceAed * (1 - down / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? loan / n : (loan * r) / (1 - (1 + r) ** -n);

  // Upfront costs (estimates): DLD transfer fee 4%, agency 2% + 5% VAT, mortgage registration 0.25% + AED 290.
  const dld = priceAed * 0.04;
  const agency = priceAed * 0.02 * 1.05;
  const mortgageReg = loan * 0.0025 + 290;
  const cashNeeded = priceAed * (down / 100) + dld + agency + mortgageReg;

  return (
    <div className="calc">
      <div className="calc__head">
        <h3>Mortgage calculator</h3>
        <p className="calc__big tabular">{formatPrice(monthly, currency)}<span> / month</span></p>
      </div>
      <div className="calc__field">
        <label htmlFor="m-down">Down payment <b className="tabular">{down}% · {formatPrice(priceAed * down / 100, currency, true)}</b></label>
        <input id="m-down" type="range" min={minDown} max={80} step={5} value={down} onChange={(e) => setDown(clamp(Number(e.target.value), minDown, 80))} />
        <small>Minimum {minDown}% for this price</small>
      </div>
      <div className="calc__field">
        <label htmlFor="m-rate">Interest rate <b className="tabular">{rate.toFixed(2)}%</b></label>
        <input id="m-rate" type="range" min={2.5} max={8} step={0.01} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
      </div>
      <div className="calc__field">
        <label htmlFor="m-years">Term <b className="tabular">{years} years</b></label>
        <input id="m-years" type="range" min={5} max={25} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} />
      </div>
      <dl className="calc__rows tabular">
        <div><dt>Loan amount</dt><dd>{formatPrice(loan, currency)}</dd></div>
        <div><dt>DLD transfer fee (4%)</dt><dd>{formatPrice(dld, currency)}</dd></div>
        <div><dt>Agency fee (2% + VAT)</dt><dd>{formatPrice(agency, currency)}</dd></div>
        <div><dt>Mortgage registration</dt><dd>{formatPrice(mortgageReg, currency)}</dd></div>
        <div className="calc__total"><dt>Cash needed up front</dt><dd>{formatPrice(cashNeeded, currency)}</dd></div>
      </dl>
      <small className="calc__note">Estimates only. Your bank confirms the final rate and fees.</small>
    </div>
  );
}

export function YieldCalculator({ priceAed, areaSqft, serviceChargePerSqft = 15 }: { priceAed: number; areaSqft: number; serviceChargePerSqft?: number }) {
  const { currency } = usePreferences();
  const suggested = Math.round((priceAed * 0.06) / 1000) * 1000;
  const [rent, setRent] = useState(suggested);
  const [occupancy, setOccupancy] = useState(95);

  const serviceCharge = areaSqft * serviceChargePerSqft;
  const management = rent * 0.05;
  const income = rent * (occupancy / 100);
  const gross = (rent / priceAed) * 100;
  const net = ((income - serviceCharge - management) / priceAed) * 100;

  return (
    <div className="calc">
      <div className="calc__head">
        <h3>Rental yield</h3>
        <p className="calc__big tabular">{net.toFixed(1)}%<span> net · {gross.toFixed(1)}% gross</span></p>
      </div>
      <div className="calc__field">
        <label htmlFor="y-rent">Expected yearly rent (AED)</label>
        <input id="y-rent" type="number" inputMode="numeric" min={0} step={1000} value={rent} onChange={(e) => setRent(Math.max(0, Number(e.target.value)))} />
      </div>
      <div className="calc__field">
        <label htmlFor="y-occ">Occupancy <b className="tabular">{occupancy}%</b></label>
        <input id="y-occ" type="range" min={60} max={100} step={5} value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} />
      </div>
      <dl className="calc__rows tabular">
        <div><dt>Rental income</dt><dd>{formatPrice(income, currency)}</dd></div>
        <div><dt>Service charge (AED {serviceChargePerSqft} / sq ft)</dt><dd>− {formatPrice(serviceCharge, currency)}</dd></div>
        <div><dt>Management (5%)</dt><dd>− {formatPrice(management, currency)}</dd></div>
        <div className="calc__total"><dt>Net income per year</dt><dd>{formatPrice(income - serviceCharge - management, currency)}</dd></div>
      </dl>
    </div>
  );
}
