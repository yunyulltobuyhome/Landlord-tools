export type Verdict =
  | "Usually normal wear and tear"
  | "Often a valid deduction"
  | "It depends";

export type DeductionItem = {
  slug: string;
  item: string; // short label, e.g. "carpet cleaning"
  question: string; // full search-style question
  verdict: Verdict;
  shortAnswer: string; // 1–2 sentence summary answer
  detail: string[]; // paragraphs of unique explanation
  wearExamples: string[]; // things that are normal wear (not chargeable)
  damageExamples: string[]; // things that are damage (chargeable)
};

export const deductionsData: DeductionItem[] = [
  {
    slug: "carpet-cleaning",
    item: "carpet cleaning",
    question: "Can a landlord charge a tenant for carpet cleaning?",
    verdict: "Usually normal wear and tear",
    shortAnswer:
      "Routine carpet cleaning between tenants is generally the landlord's cost — you usually can't deduct it just to freshen a carpet that's normally worn. You can charge when a tenant leaves the carpet excessively stained, soiled, or damaged beyond ordinary use.",
    detail: [
      "Cleaning a carpet so the next tenant moves into a fresh unit is widely treated as a normal cost of doing business, not tenant damage. Many courts have rejected automatic, flat carpet-cleaning fees deducted from every deposit, and some states and cities specifically prohibit them unless the tenant actually caused excess soiling.",
      "The line is condition, not routine. If the carpet is simply showing the light matting and traffic patterns you'd expect from someone living there, that's wear and tear. If it comes back with pet urine, large stains, burns, or grime well beyond normal use, professional cleaning (or replacement, prorated for age) can be a legitimate deduction.",
      "If you do charge, keep move-in and move-out photos and an itemized invoice. A vague 'carpet cleaning — $150' line with no evidence is the kind of deduction tenants successfully challenge.",
    ],
    wearExamples: [
      "Light traffic patterns and matting in walkways",
      "Minor, faded spots from ordinary use",
      "General dinginess from age",
    ],
    damageExamples: [
      "Pet urine saturation or odor",
      "Large food, wine, or paint stains",
      "Cigarette burns or bleach spots",
    ],
  },
  {
    slug: "carpet-replacement",
    item: "carpet replacement",
    question: "Can a landlord charge a tenant to replace the carpet?",
    verdict: "It depends",
    shortAnswer:
      "You can charge for replacing carpet the tenant genuinely destroyed — but only for its remaining useful life, not the full cost of new carpet, and never for a carpet that simply wore out with age.",
    detail: [
      "Carpet has a limited useful life (often estimated at around 5–10 years for rental-grade carpet). If a tenant ruins a carpet that was already several years old, you generally can't bill them for a brand-new replacement — you prorate. Example: if a carpet with a 7-year life is destroyed after 5 years, roughly two years of value remains, so a tenant charge should reflect only that remaining portion.",
      "Replacement is only justified when the damage is real and beyond cleaning — irreversible staining, burns, tears, or pet destruction. A carpet that's simply old, flattened, or faded is the landlord's replacement cost, full stop.",
      "Document the carpet's age and original cost if you can. The prorated-useful-life approach is what small-claims courts expect to see, and showing your math is what makes the deduction stick.",
    ],
    wearExamples: [
      "Carpet worn thin after years of normal use",
      "Fading from sunlight",
      "Seams loosening with age",
    ],
    damageExamples: [
      "Widespread pet urine damage to padding/subfloor",
      "Large burns or tears",
      "Permanent stains covering significant areas",
    ],
  },
  {
    slug: "painting",
    item: "painting",
    question: "Can a landlord charge a tenant for repainting?",
    verdict: "Usually normal wear and tear",
    shortAnswer:
      "Repainting to cover normal scuffs, minor marks, and faded paint is typically a landlord expense. You can charge when walls are damaged or altered beyond normal use — think large holes, unapproved colors, or crayon and smoke damage.",
    detail: [
      "Paint wears out. Fading, minor scuffs from furniture, and the general dinginess of walls after someone has lived in a unit for a year or more are classic examples of normal wear and tear that landlords are expected to absorb. Like carpet, interior paint is often treated as having a useful life, after which repainting is simply maintenance.",
      "Charges become fair when the tenant did something beyond living there normally: painting walls a bold color without permission, leaving large or numerous holes, or causing damage from smoke, grease, or children's drawings that requires priming and extra coats.",
      "If a tenant lived in the unit for many years, it's very hard to justify charging them for paint at all — the paint would have needed refreshing regardless of who lived there.",
    ],
    wearExamples: [
      "Faded or slightly dirty walls",
      "Small scuffs from furniture",
      "Minor marks around switches and doorknobs",
    ],
    damageExamples: [
      "Unapproved paint colors that need covering",
      "Large or numerous holes requiring patching",
      "Smoke, grease, or crayon damage needing primer",
    ],
  },
  {
    slug: "nail-holes",
    item: "nail holes",
    question: "Can a landlord charge for nail holes in the wall?",
    verdict: "Usually normal wear and tear",
    shortAnswer:
      "Small nail and pin holes from hanging pictures are almost always considered normal wear and tear. Large anchor holes, many holes, or holes that tore the drywall can be a legitimate repair charge.",
    detail: [
      "Hanging things on the wall is normal use of a home, and the small holes left by picture nails or thumbtacks are the textbook example of wear and tear. Deducting for a handful of pin holes is one of the most commonly challenged — and lost — deposit deductions.",
      "It changes when the holes are large or destructive: big holes from wall anchors, mounting a TV, or shelving; dozens of holes across a wall; or holes where the drywall paper tore and needs patching and sanding rather than a dab of filler.",
      "A reasonable rule of thumb: if a quick spackle-and-touch-up during normal repainting would handle it, it's wear and tear. If it needs real drywall repair, it may be chargeable.",
    ],
    wearExamples: [
      "Small nail or pin holes from picture frames",
      "A few thumbtack holes",
      "Tiny marks that fill during normal repainting",
    ],
    damageExamples: [
      "Large holes from wall anchors or TV mounts",
      "Drywall torn or cratered",
      "Excessive numbers of holes across walls",
    ],
  },
  {
    slug: "cleaning-fees",
    item: "cleaning fees",
    question: "Can a landlord charge a cleaning fee from the deposit?",
    verdict: "It depends",
    shortAnswer:
      "You can deduct for cleaning only what's needed to return the unit to its move-in condition — not to make it cleaner than the tenant received it, and usually not as an automatic flat fee unless the tenant left it dirty.",
    detail: [
      "The governing principle is 'back to move-in condition, minus normal wear.' If the tenant leaves the unit reasonably clean, you generally can't deduct a cleaning charge just because a professional turn is your preference. Automatic, non-refundable cleaning fees baked into every move-out are frequently challenged and, in some places, prohibited.",
      "Deductions are fair when the tenant leaves genuine mess: grease-caked appliances, filthy bathrooms, trash left behind, or a unit that needs far more than a routine turnover clean. Charge the actual, reasonable cost and itemize it.",
      "The best protection is a move-in checklist documenting how clean the unit was when the tenant received it — that's the baseline any cleaning deduction is measured against.",
    ],
    wearExamples: [
      "Light dust and normal light soiling",
      "A unit left broom-clean and tidy",
      "Minor grime that a routine turnover covers",
    ],
    damageExamples: [
      "Grease-caked stove or oven",
      "Trash or belongings left behind",
      "Filthy bathrooms or heavy grime",
    ],
  },
  {
    slug: "pet-damage",
    item: "pet damage",
    question: "Can a landlord charge for pet damage?",
    verdict: "Often a valid deduction",
    shortAnswer:
      "Damage caused by a pet — scratched floors and doors, chewed trim, urine-soaked carpet, or odor that needs remediation — is generally a valid deposit deduction, since it goes beyond normal human wear and tear.",
    detail: [
      "Pets can cause damage that a person living normally wouldn't, so the costs of repairing genuine pet damage are usually chargeable. That includes deep scratches on floors and doors, chewed woodwork or cabinets, torn screens, and carpet or padding ruined by urine.",
      "Two caveats keep these deductions defensible. First, still respect useful life and proration — a scratched 8-year-old floor isn't a brand-new-floor charge. Second, a pet deposit or pet fee you already collected may need to be applied to pet-related damage first, depending on your lease and state rules.",
      "Odor remediation (ozone treatment, sealing subfloor) can be charged when it's genuinely required, but document it — 'pet smell' with no evidence is weaker than photos plus a remediation invoice.",
    ],
    wearExamples: [
      "A little extra vacuuming for pet hair",
      "Very minor, cleanable marks",
      "Normal wear a pet-approved unit anticipates",
    ],
    damageExamples: [
      "Urine saturation of carpet and padding",
      "Chewed trim, doors, or cabinets",
      "Deep scratches on floors and torn screens",
    ],
  },
  {
    slug: "broken-blinds",
    item: "broken blinds",
    question: "Can a landlord charge for broken or damaged blinds?",
    verdict: "It depends",
    shortAnswer:
      "Blinds that are sun-faded or brittle from age are usually wear and tear, but cracked, bent, or missing slats a tenant broke can be a fair, low-cost deduction.",
    detail: [
      "Inexpensive vinyl blinds are notorious for becoming brittle and discolored from sunlight over time — that deterioration is wear and tear, not something to bill a departing tenant for. Expecting blinds to look new after years in a sunny window isn't reasonable.",
      "If a tenant physically broke them — snapped slats, bent headrails, or missing pieces beyond normal aging — the cost to replace that specific set is a legitimate deduction. Because most blinds are cheap, keep the charge to the actual replacement cost; inflated blind charges are an easy target in a dispute.",
    ],
    wearExamples: [
      "Sun-faded or yellowed slats",
      "Brittleness from age",
      "Slight warping over years of use",
    ],
    damageExamples: [
      "Snapped or cracked slats",
      "Bent or broken headrail",
      "Missing pieces from mishandling",
    ],
  },
  {
    slug: "unpaid-rent",
    item: "unpaid rent",
    question: "Can a landlord deduct unpaid rent from the security deposit?",
    verdict: "Often a valid deduction",
    shortAnswer:
      "Yes — unpaid rent is one of the most universally accepted deposit deductions. You can generally apply the deposit to rent the tenant still owes, along with other charges allowed by the lease.",
    detail: [
      "Security deposits exist in large part to cover unpaid rent, so deducting genuine rent arrears is nearly always permitted. This includes rent for months the tenant didn't pay and, depending on your lease and state law, unpaid late fees or a portion of rent lost when a tenant breaks the lease early.",
      "The usual limits still apply: you can only deduct what's actually owed, you should itemize it in your statement, and in some states you may have a duty to mitigate (re-rent the unit) rather than simply charging out the full remaining lease. Utilities the tenant was responsible for but left unpaid can often be deducted too, if the lease assigns them to the tenant.",
      "As always, spell out each amount. 'Unpaid rent — June: $1,500' with your ledger attached is far stronger than a lump sum.",
    ],
    wearExamples: [
      "n/a — unpaid rent is a financial charge, not a condition issue",
    ],
    damageExamples: [
      "Rent owed for unpaid months",
      "Unpaid late fees allowed by the lease",
      "Tenant-responsible utilities left unpaid",
    ],
  },
  {
    slug: "appliance-damage",
    item: "appliance damage",
    question: "Can a landlord charge for damaged appliances?",
    verdict: "It depends",
    shortAnswer:
      "You can charge when a tenant breaks an appliance through misuse or neglect, but not when an appliance simply fails or wears out with age. Proration for the appliance's remaining life applies.",
    detail: [
      "Appliances break down over time, and normal mechanical failure is the landlord's responsibility. If a refrigerator compressor dies or a dishwasher stops working after years of use, that's not a tenant charge — it's the cost of owning the appliance.",
      "Tenant-caused damage is different: a cracked glass cooktop, a microwave burned out by running it empty, racks and shelves broken through misuse, or an appliance ruined by neglect. For those, you can deduct repair or replacement cost, prorated for how much useful life the appliance had left.",
      "Keep purchase dates and any repair invoices. The distinction between 'it broke' and 'they broke it' is exactly what a deduction dispute turns on.",
    ],
    wearExamples: [
      "An appliance that failed from age",
      "Normal mechanical breakdown",
      "Worn finishes on older units",
    ],
    damageExamples: [
      "Cracked glass cooktop",
      "Microwave burned out by misuse",
      "Broken racks, shelves, or doors from mishandling",
    ],
  },
  {
    slug: "floor-scratches",
    item: "floor scratches",
    question: "Can a landlord charge for scratches on hardwood or laminate floors?",
    verdict: "It depends",
    shortAnswer:
      "Light surface scratches and dulling from normal foot traffic are wear and tear, but deep gouges, pet scratches, or water damage a tenant caused can be a valid, often prorated, deduction.",
    detail: [
      "Floors show their age. Fine surface scratches, minor scuffing, and a general loss of shine from walking, moving furniture carefully, and everyday living are normal wear a landlord shouldn't bill for. Refinishing a floor that's simply seen a few years of use is maintenance.",
      "Real damage is chargeable: deep gouges from dragging furniture, extensive pet scratching, buckling from spills or overwatered plants left unaddressed, or sections that must be replaced. Because refinishing and board replacement are expensive, courts scrutinize these — proration for the floor's age and clear before/after evidence matter a lot.",
    ],
    wearExamples: [
      "Fine surface scratches from foot traffic",
      "Dulled finish over time",
      "Minor scuffs near doorways",
    ],
    damageExamples: [
      "Deep gouges from dragged furniture",
      "Water damage or buckling from neglect",
      "Extensive pet scratching",
    ],
  },
  {
    slug: "mold",
    item: "mold",
    question: "Can a landlord charge a tenant for mold?",
    verdict: "It depends",
    shortAnswer:
      "It hinges on the cause. Mold from a building problem like a leaky roof or bad ventilation is the landlord's responsibility, while mold from tenant neglect — never running a fan, ignoring spills, blocking airflow — may be chargeable.",
    detail: [
      "Mold is one of the most fact-specific deductions. If moisture came from a structural or maintenance issue the landlord should have handled — plumbing leaks, roof leaks, inadequate ventilation — remediation is the landlord's cost, and charging the tenant would be hard to defend.",
      "Where a tenant clearly caused the conditions — for example, never using bathroom or kitchen ventilation, failing to report a leak they knew about, or letting standing water sit — a landlord may have a basis to charge for cleanup. Even then, because mold implicates habitability and health, this is an area where documentation and, often, professional input matter most.",
      "Given the health and legal sensitivity here, mold deductions are worth confirming with a local attorney before you rely on them.",
    ],
    wearExamples: [
      "Mold from a roof or plumbing leak",
      "Mold from poor building ventilation",
      "Condensation from structural issues",
    ],
    damageExamples: [
      "Mold from a tenant never ventilating",
      "Standing water left unaddressed",
      "An unreported leak the tenant caused",
    ],
  },
  {
    slug: "smoke-damage",
    item: "smoke damage",
    question: "Can a landlord charge for smoke or cigarette damage?",
    verdict: "Often a valid deduction",
    shortAnswer:
      "Smoke damage — yellowed walls, lingering odor, and residue that requires sealing and repainting — is generally chargeable, especially where smoking violated the lease, because it goes well beyond normal wear.",
    detail: [
      "Cigarette and other smoke leaves behind more than a smell: nicotine residue stains walls and ceilings, permeates carpet and fixtures, and often requires special cleaning, odor sealing (primer), and repainting to make a unit rentable again. That remediation is usually a legitimate deduction.",
      "The case is strongest when the lease prohibited smoking, but even without an explicit clause, damage that exceeds normal wear can be charged. As always, prorate anything with a useful life (like paint and carpet), and back the charge with photos and the actual remediation invoices rather than a flat 'smoke fee.'",
    ],
    wearExamples: [
      "Faint, quickly-airing odor with no residue",
      "Normal aging unrelated to smoke",
    ],
    damageExamples: [
      "Nicotine-stained walls and ceilings",
      "Odor requiring sealing and repainting",
      "Smoke-permeated carpet and fixtures",
    ],
  },
  {
    slug: "last-months-rent",
    item: "last month's rent",
    question: "Can a landlord use a security deposit for last month's rent?",
    verdict: "It depends",
    shortAnswer:
      "A security deposit and prepaid last month's rent are legally different funds. A tenant usually can't demand you apply the deposit to their final month, but you can generally deduct rent the tenant actually failed to pay.",
    detail: [
      "A security deposit secures against damage and unpaid amounts; 'last month's rent' is prepaid rent. Tenants often ask to 'just use my deposit' for the final month, but in most states a tenant can't unilaterally force that — doing so would leave nothing to cover damage discovered after move-out.",
      "From the landlord's side, if the tenant genuinely skips the final month, unpaid rent is one of the most accepted deductions, so you can typically apply the deposit to it. What you generally can't do is treat a sum the lease labeled a 'deposit' as prepaid rent by default.",
      "Some states have specific rules — and even different return deadlines — distinguishing a deposit from last month's rent, so check your lease wording and state law before treating them as interchangeable.",
    ],
    wearExamples: ["n/a — this is a financial question, not a condition issue"],
    damageExamples: [
      "Unpaid final-month rent the tenant skipped",
      "A rent shortfall the tenant left owing",
    ],
  },
  {
    slug: "lost-keys",
    item: "lost keys",
    question: "Can a landlord charge for lost keys or re-keying the locks?",
    verdict: "Often a valid deduction",
    shortAnswer:
      "If a tenant doesn't return keys, fobs, or remotes — or you must re-key the locks because keys weren't returned — the reasonable, documented cost is generally a fair deduction.",
    detail: [
      "Returning all keys is part of returning the unit. When keys, garage remotes, or fobs are lost or not handed back, you often have to re-key locks or replace remotes to secure the unit for the next tenant, and that cost is usually chargeable.",
      "Keep it to actual, reasonable cost — a locksmith invoice or the price of replacement fobs. An inflated 'lock fee' beyond real cost is the kind of charge tenants successfully dispute.",
      "Routine re-keying you'd perform between every tenant regardless is arguably your own cost; re-keying forced specifically because keys weren't returned is the tenant's.",
    ],
    wearExamples: [
      "Normal key wear",
      "Routine turnover re-keying you'd do anyway",
    ],
    damageExamples: [
      "Unreturned keys, fobs, or remotes",
      "Re-keying forced by lost keys",
    ],
  },
  {
    slug: "light-bulbs",
    item: "light bulbs",
    question: "Can a landlord charge for replacing light bulbs?",
    verdict: "Usually normal wear and tear",
    shortAnswer:
      "Burned-out bulbs are generally a minor turnover cost and normal wear, so charging for standard bulbs is hard to justify — though bulbs a tenant removed or specialty bulbs they broke can be different.",
    detail: [
      "Light bulbs burn out; that's expected. Deducting for a few standard bulbs is a small, easily-challenged charge most tenants and courts view as ordinary turnover rather than damage.",
      "It's more defensible when bulbs are missing entirely because the tenant took them, or when expensive specialty bulbs need replacing because the tenant broke or removed them. Even then, keep any charge to actual cost.",
    ],
    wearExamples: ["Standard bulbs burned out from normal use"],
    damageExamples: [
      "Bulbs the tenant removed and took with them",
      "Specialty bulbs broken through misuse",
    ],
  },
  {
    slug: "trash-removal",
    item: "trash removal",
    question: "Can a landlord charge for trash or junk removal?",
    verdict: "Often a valid deduction",
    shortAnswer:
      "If a tenant leaves behind trash, furniture, or belongings you have to haul away, the actual disposal cost is generally a fair deduction — returning the unit empty is part of moving out.",
    detail: [
      "Tenants are expected to remove their belongings and trash. When they leave junk, old furniture, or piles of garbage, you can usually deduct the real cost of hauling and disposal, including dump fees.",
      "Photograph what was left before removal and keep hauling receipts. 'Trash removal — $300' with a photo of a room full of abandoned furniture is defensible; the same charge on a broom-clean unit is not.",
    ],
    wearExamples: ["A nearly-empty, tidy unit with light dust"],
    damageExamples: [
      "Furniture or belongings left behind",
      "Bags of trash and debris",
      "Dump and hauling fees",
    ],
  },
  {
    slug: "lawn-care",
    item: "lawn care",
    question: "Can a landlord charge for lawn care or yard cleanup from the deposit?",
    verdict: "It depends",
    shortAnswer:
      "If the lease made the tenant responsible for the yard and they let it badly deteriorate, cleanup can be chargeable — but not for normal seasonal growth or landscaping you'd maintain anyway.",
    detail: [
      "Where the lease clearly assigns lawn and yard upkeep to the tenant, a yard left seriously overgrown, weed-choked, or damaged can support a cleanup deduction. Where the landlord handles landscaping, it's the landlord's cost.",
      "Normal seasonal change — grass grown since the last mow, autumn leaves — isn't damage. Any charge should reflect restoring the yard to its move-in condition, not upgrading it.",
    ],
    wearExamples: [
      "Normal seasonal growth",
      "A yard maintained as the lease required",
    ],
    damageExamples: [
      "Severely overgrown yard the tenant was required to maintain",
      "Landscaping killed through neglect",
    ],
  },
  {
    slug: "door-damage",
    item: "door damage",
    question: "Can a landlord charge for a damaged door?",
    verdict: "It depends",
    shortAnswer:
      "Minor scuffs and hardware loosened by years of use are wear and tear, but holes, cracks, broken doors, or damage from forcing a lock are generally chargeable.",
    detail: [
      "Doors absorb normal use — light scuffing, a slightly loose hinge, minor marks near the handle — and that's wear and tear that adjusting or refinishing handles as maintenance.",
      "Real damage is chargeable: holes punched or kicked through a door, cracked panels, doors pulled off the frame, or damage from forcing a lock. Interior hollow-core doors are inexpensive, so keep replacement charges to actual cost and prorate where relevant.",
    ],
    wearExamples: [
      "Light scuffs and marks",
      "Slightly loose hinges from age",
    ],
    damageExamples: [
      "Holes or cracks in the door",
      "Doors kicked in or off the frame",
      "Damage from forcing a lock",
    ],
  },
  {
    slug: "window-screens",
    item: "window screens",
    question: "Can a landlord charge for torn or missing window screens?",
    verdict: "It depends",
    shortAnswer:
      "Screens gone brittle or faded from sun and age are wear and tear, but screens a tenant tore, bent, or lost can be a small, reasonable replacement charge.",
    detail: [
      "Window screens degrade in sunlight and turn brittle over years — that deterioration is wear and tear, not a tenant charge. Expecting screens to look new after long exposure isn't reasonable.",
      "Screens torn, punched out, bent, or missing because of the tenant can be replaced at their cost. Screens are cheap, so keep any deduction to the actual replacement price.",
    ],
    wearExamples: [
      "Sun-faded, brittle screens",
      "Minor aging",
    ],
    damageExamples: [
      "Torn or punched-out screens",
      "Bent frames or missing screens the tenant removed",
    ],
  },
  {
    slug: "broken-window",
    item: "broken window",
    question: "Can a landlord charge for a broken window?",
    verdict: "Often a valid deduction",
    shortAnswer:
      "A window the tenant, their household, or guests broke is generally a fair deduction, since broken glass is damage — but glass that failed on its own from a defect is the landlord's cost.",
    detail: [
      "Broken or cracked window glass caused by the tenant, their household, or guests is classic damage you can deduct — the reasonable, documented cost of repair or reglazing.",
      "The exception is glass that failed on its own: a blown seal in a double-pane unit or a crack from a structural or building defect. If the tenant didn't cause it, it's a repair the landlord absorbs.",
    ],
    wearExamples: [
      "Seal failure in older double-pane glass",
      "Defect-related cracks the tenant didn't cause",
    ],
    damageExamples: ["Glass broken by the tenant, household, or guests"],
  },
  {
    slug: "countertop-damage",
    item: "countertop damage",
    question: "Can a landlord charge for burns, cuts, or damage to countertops?",
    verdict: "It depends",
    shortAnswer:
      "Light surface wear on a counter is expected, but burns, deep cuts, cracks, or chips the tenant caused can be chargeable — prorated for the counter's age.",
    detail: [
      "Countertops show light use over time — fine scratches, dulling — and that's wear and tear. A counter that's simply aged isn't a tenant charge.",
      "Heat burns from hot pans, deep knife cuts, cracks, chips, or laminate lifted by standing water are damage. Because full replacement is costly, prorate for the counter's remaining life and document with photos rather than billing a new countertop for old damage.",
    ],
    wearExamples: [
      "Fine surface scratches",
      "Dulling with age",
    ],
    damageExamples: [
      "Heat burns from pans",
      "Deep knife cuts, cracks, or chips",
      "Laminate lifted by standing water",
    ],
  },
  {
    slug: "tv-mount-holes",
    item: "TV mount holes",
    question: "Can a landlord charge for holes from mounting a TV?",
    verdict: "It depends",
    shortAnswer:
      "Small picture-hanging holes are wear and tear, but the large anchor holes left by a TV mount often need real drywall repair, which can be a fair, modest deduction.",
    detail: [
      "A TV wall mount uses heavy anchors that leave large holes and can crack or crater the drywall — that goes beyond the pin holes of hanging a picture, so patching, sanding, and repainting the affected area can be chargeable.",
      "If the lease required permission to mount a TV and the tenant didn't ask, that strengthens the case. Keep the charge to the actual repair, not a whole-room repaint unless the wall genuinely needs it.",
    ],
    wearExamples: ["Small nail or pin holes filled during normal repainting"],
    damageExamples: [
      "Large anchor holes from a mount",
      "Cracked or cratered drywall",
    ],
  },
  {
    slug: "water-damage",
    item: "water damage",
    question: "Can a landlord charge for water damage?",
    verdict: "It depends",
    shortAnswer:
      "Water damage the tenant caused — an overflowed tub, an unreported leak they were responsible for, or standing water left to sit — can be chargeable, but damage from plumbing or building failures is the landlord's cost.",
    detail: [
      "The question is who caused it. Overflowing a tub or sink, leaving windows open in a storm, or ignoring a leak they should have reported can make water damage the tenant's responsibility.",
      "Water damage from failed plumbing, a leaking roof, or a landlord-supplied appliance that failed on its own is not the tenant's charge. Because water damage is costly and overlaps with habitability, document the cause carefully before deducting.",
    ],
    wearExamples: ["n/a — water damage is a condition issue, not aging"],
    damageExamples: [
      "Overflowed tub or sink",
      "Ignored leaks the tenant caused",
      "Storm damage from windows left open",
    ],
  },
  {
    slug: "oven-cleaning",
    item: "oven cleaning",
    question: "Can a landlord charge for cleaning a dirty oven or stove?",
    verdict: "It depends",
    shortAnswer:
      "You can deduct for a genuinely filthy, grease-caked oven left well beyond move-in condition — but not as a routine fee when the tenant left the kitchen reasonably clean.",
    detail: [
      "Ovens and stovetops caked in baked-on grease and food, well beyond a normal wipe-down, can support a cleaning deduction for the actual, reasonable cost.",
      "What you can't do is charge an automatic oven-cleaning fee when the tenant left it reasonably clean, or bill to make it cleaner than it was at move-in. A move-in checklist noting the appliance's starting condition is your best support.",
    ],
    wearExamples: ["Light cooking residue a routine wipe handles"],
    damageExamples: ["Heavy baked-on grease and grime left at move-out"],
  },
  {
    slug: "bathroom-fixtures",
    item: "bathroom fixtures",
    question: "Can a landlord charge for broken towel bars or bathroom fixtures?",
    verdict: "It depends",
    shortAnswer:
      "Fixtures loosened by normal use are wear and tear, but towel bars, holders, or fixtures a tenant snapped off or cracked can be replaced at their cost.",
    detail: [
      "Bathroom hardware loosens over years of normal use; tightening or minor wear is maintenance the landlord handles.",
      "Fixtures pulled out of the wall, snapped towel bars, cracked sinks or toilet tanks, or a shower door knocked off its track through misuse are damage. These parts are usually inexpensive, so charge the actual replacement cost.",
    ],
    wearExamples: [
      "Hardware loosened by normal use",
      "Minor aging of fixtures",
    ],
    damageExamples: [
      "Snapped towel bars or holders",
      "Cracked sink or toilet tank",
      "Fixtures pulled from the wall",
    ],
  },
];

export function getDeductionBySlug(slug: string): DeductionItem | undefined {
  return deductionsData.find((d) => d.slug === slug);
}
