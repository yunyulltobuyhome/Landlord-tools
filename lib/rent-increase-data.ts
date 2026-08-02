// Rent-increase rules.
//
// Deliberately conservative: only the two states with a well-established
// statewide cap are encoded. Every other state is reported as having no
// statewide cap, which is accurate — but local (city/county) rent control can
// still apply, and the UI says so rather than implying "no cap anywhere".
//
// Percentages tied to CPI change every year, so the caps below are described
// as formulas with their ceiling rather than frozen numbers, and the UI asks
// the user to confirm the current local CPI figure.

export type RentIncreaseRule = {
  /** Statewide cap on annual increases, if the state has one. */
  cap?: {
    /** Fixed component of the formula, in percent (e.g. 5 for "5% + CPI"). */
    basePercent: number;
    /** Hard ceiling regardless of CPI, in percent. */
    ceilingPercent: number;
    label: string;
  };
  /** Statewide written-notice rules a landlord must give before an increase. */
  notice: {
    /** Baseline notice, in days. */
    days: number;
    /** Longer notice required above a percentage threshold, where applicable. */
    largeIncrease?: { overPercent: number; days: number };
    label: string;
  };
  note?: string;
};

export const DEFAULT_NOTICE_DAYS = 30;

export const rentIncreaseRules: Record<string, RentIncreaseRule> = {
  california: {
    cap: {
      basePercent: 5,
      ceilingPercent: 10,
      label: "5% + local CPI, capped at 10% per year",
    },
    notice: {
      days: 30,
      largeIncrease: { overPercent: 10, days: 90 },
      label: "30 days' written notice; 90 days if the increase exceeds 10%",
    },
    note: "Applies to units covered by the Tenant Protection Act (AB 1482). Newer construction and some single-family homes are exempt, and cities such as Los Angeles and San Francisco impose stricter local limits.",
  },
  oregon: {
    cap: {
      basePercent: 7,
      ceilingPercent: 10,
      label: "7% + local CPI, capped at 10% per year",
    },
    notice: {
      days: 90,
      label: "90 days' written notice for month-to-month tenancies",
    },
    note: "Oregon was the first state with a statewide cap. Buildings under 15 years old are generally exempt.",
  },
};

export function getRentIncreaseRule(slug: string): RentIncreaseRule | undefined {
  return rentIncreaseRules[slug];
}
