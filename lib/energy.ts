// Transparent, configurable baseline used only when the customer does not know their
// old appliance's exact annual consumption and picks an approximate energy class instead.
// These are rough illustrative category averages — not manufacturer-certified figures.
export const LEGACY_CLASS_BASELINE_KWH: Record<string, Record<string, number>> = {
  cooling: { A: 420, B: 520, C: 650, D: 800 },
  cooking: { A: 220, B: 280, C: 340, D: 400 },
  laundry: { A: 190, B: 240, C: 300, D: 360 },
  dishwashers: { A: 260, B: 310, C: 370, D: 430 },
  multimedia: { A: 120, B: 160, C: 210, D: 260 },
};

export interface EnergyCalcInput {
  oldAnnualKwh: number;
  newAnnualKwh: number;
  pricePerKwh: number;
  years: number;
}

export interface EnergyCalcResult {
  annualKwhSavings: number;
  annualCostSavings: number;
  totalCostSavings: number;
  consumptionDifferencePct: number;
}

export function calculateEnergySavings(input: EnergyCalcInput): EnergyCalcResult {
  const annualKwhSavings = Math.max(0, input.oldAnnualKwh - input.newAnnualKwh);
  const annualCostSavings = annualKwhSavings * input.pricePerKwh;
  const totalCostSavings = annualCostSavings * input.years;
  const consumptionDifferencePct = input.oldAnnualKwh > 0 ? (annualKwhSavings / input.oldAnnualKwh) * 100 : 0;
  return { annualKwhSavings, annualCostSavings, totalCostSavings, consumptionDifferencePct };
}
