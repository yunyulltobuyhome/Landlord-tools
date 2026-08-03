// Expense categories mirroring the expense lines of IRS Schedule E (Form 1040),
// Part I — the form landlords actually report rental income and expenses on.
//
// This is a bookkeeping organizer, not tax advice. The line numbers and names
// come from the published form; the descriptions are plain-English examples of
// what landlords commonly record against each line. Whether any particular
// expense is deductible in a given situation is for a tax professional.

export type ExpenseCategory = {
  line: string;
  name: string;
  examples: string;
};

export const scheduleECategories: ExpenseCategory[] = [
  {
    line: "5",
    name: "Advertising",
    examples: "Listing fees, syndication sites, signage, photography for listings.",
  },
  {
    line: "6",
    name: "Auto and travel",
    examples:
      "Mileage driving to the property for showings, inspections, or repairs; travel to manage an out-of-area rental.",
  },
  {
    line: "7",
    name: "Cleaning and maintenance",
    examples:
      "Turnover cleaning, landscaping and lawn care, pest control, gutter cleaning, snow removal.",
  },
  {
    line: "8",
    name: "Commissions",
    examples: "Leasing commissions paid to an agent or broker to place a tenant.",
  },
  {
    line: "9",
    name: "Insurance",
    examples:
      "Landlord/dwelling policy premiums, liability coverage, umbrella policy allocated to the rental.",
  },
  {
    line: "10",
    name: "Legal and other professional fees",
    examples:
      "Attorney fees for lease review or an eviction, accountant or bookkeeping fees, tax prep for the rental.",
  },
  {
    line: "11",
    name: "Management fees",
    examples:
      "Property management company fees, leasing-only fees, tenant screening and background check costs.",
  },
  {
    line: "12",
    name: "Mortgage interest paid to banks",
    examples:
      "Interest portion of the mortgage payment (not principal). Usually shown on Form 1098.",
  },
  {
    line: "13",
    name: "Other interest",
    examples:
      "Interest on a HELOC or credit card used for the rental, or on a loan for an improvement.",
  },
  {
    line: "14",
    name: "Repairs",
    examples:
      "Fixing a leak, patching drywall, replacing a broken appliance part, repainting. Improvements that add value are usually depreciated instead.",
  },
  {
    line: "15",
    name: "Supplies",
    examples:
      "Light bulbs, filters, batteries for smoke detectors, small tools and cleaning supplies.",
  },
  {
    line: "16",
    name: "Taxes",
    examples: "Property taxes, local rental license or registration fees.",
  },
  {
    line: "17",
    name: "Utilities",
    examples:
      "Water, sewer, trash, gas, electric, and internet where the landlord pays them rather than the tenant.",
  },
  {
    line: "18",
    name: "Depreciation expense",
    examples:
      "Annual depreciation of the building (residential rental property is generally depreciated over 27.5 years) and of qualifying improvements. Usually calculated by your tax preparer.",
  },
  {
    line: "19",
    name: "Other",
    examples:
      "HOA dues, bank fees on the rental account, software subscriptions, education related to the rental.",
  },
];
