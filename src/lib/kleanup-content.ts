import { BRAND_SLOGAN } from "./brand.ts";

export type ViewId = "welcome" | "cleaning" | "lawn" | "junk" | "tree" | "quote";

export interface OfficeView {
  id: ViewId;
  index: string;
  label: string;
  title: string;
  line: string;
  cta: string;
  /** camera position */
  pos: [number, number, number];
  /** look-at target */
  target: [number, number, number];
  /** optional responsive camera overrides */
  mobilePos?: [number, number, number];
  mobileTarget?: [number, number, number];
  fov?: number;
  mobileFov?: number;
  horizontalFov?: number;
}

export const VIEWS: OfficeView[] = [
  {
    id: "welcome",
    index: "01",
    label: "Welcome",
    title: BRAND_SLOGAN,
    line: "KleanupCrew connects you with local, insured crews who clean it, clear it, maintain it and improve the property.",
    cta: "Make this property look good again",
    // Aimed a little higher than the room's centre, so the view tips down and
    // the whole sun clears the top of the window frame.
    pos: [0, 3.1, 7.6],
    target: [0, 1.56, -1.2],
    mobilePos: [0, 3.1, 7.35],
    mobileTarget: [0, 1.28, -1.2],
  },
  {
    id: "lawn",
    index: "02",
    label: "Lawn Care",
    title: "Lawn & yard maintenance",
    line: "Mowing, edging, trimming, leaf and yard cleanup, hedge shaping and brush clearing on a one-off or recurring schedule.",
    cta: "Set up lawn service",
    // Square on to the lawn board, close enough to read every tool and low
    // enough to keep the mower's wheels on screen.
    pos: [1.44, 2.83, 1.0],
    target: [-5.38, 1.12, 1.78],
    horizontalFov: 44,
  },
  {
    id: "tree",
    index: "03",
    label: "Tree & Yard",
    title: "Tree & heavy yard work",
    line: "Trimming, pruning, removal and stump grinding handled by qualified, equipped providers in your area.",
    cta: "Request a site visit",
    // Centres the tool board with the loppers, rake and spade at its foot.
    pos: [0.9, 2.75, 1.5],
    target: [-5.58, 1.45, -1.7],
    horizontalFov: 40,
  },
  {
    id: "cleaning",
    index: "04",
    label: "Home Cleaning",
    title: "Residential & commercial cleaning",
    line: "Standard, deep, recurring and move-in/move-out cleans, rental turnovers, carpet, upholstery, window, gutter and pressure washing.",
    cta: "Book a cleaning estimate",
    // Was set back across the whole room; now it stands in front of the supply
    // shelf so the bottles, rolls, bucket and caddy are all legible.
    pos: [-0.8, 2.4, 2.9],
    target: [5.1, 1.42, -1.05],
    horizontalFov: 44,
  },
  {
    id: "junk",
    index: "05",
    label: "Junk Removal",
    title: "Junk removal & cleanouts",
    line: "Bulk-item pickup, property, garage and estate cleanouts, plus non-hazardous renovation debris hauled away in one visit.",
    cta: "Get a haul-away price",
    // Wider and tipped down, so the hand truck, cartons, bags, bin and offcuts
    // all sit in frame with floor beneath them instead of bare wall above.
    pos: [-1.8, 2.72, 5.95],
    target: [5.32, 0.78, 3.5],
    horizontalFov: 31,
  },
  {
    id: "quote",
    index: "06",
    label: "Get a Quote",
    title: "Property prep & curb appeal",
    line: "Tell us about the property once — we match the right crews for prep packages, curb appeal and recurring property care.",
    cta: "Start a free quote",
    pos: [0, 1.95, 1.3],
    target: [0, 1.25, -2.3],
  },
];

export const SERVICE_OPTIONS = [
  "Home or office cleaning",
  "Deep / move-out clean",
  "Rental turnover",
  "Carpet, window or pressure washing",
  "Junk removal or cleanout",
  "Lawn mowing & yard care",
  "Tree trimming or removal",
  "Make this property look good again",
  "Other",
];

export const SERVICE_FOR_VIEW: Record<ViewId, string> = {
  welcome: SERVICE_OPTIONS[0]!,
  cleaning: "Home or office cleaning",
  lawn: "Lawn mowing & yard care",
  junk: "Junk removal or cleanout",
  tree: "Tree trimming or removal",
  quote: "Make this property look good again",
};

export const TRUST_CHIPS = ["Insured providers", "Upfront estimates", "Local crews"];

export interface ServiceGroup {
  heading: string;
  items: Array<{ name: string; detail: string }>;
}

export interface ServiceDetail {
  title: string;
  intro: string;
  groups: ServiceGroup[];
  note: string;
}

/** Full service breakdowns, shown behind the More info button on each section. */
export const SERVICE_DETAILS: Partial<Record<ViewId, ServiceDetail>> = {
  lawn: {
    title: "Lawn & yard maintenance",
    intro:
      "Everything that keeps a property looking cared for week to week, from the routine cut to the seasonal work that decides how the turf comes back next spring. Book a one-off visit or put the property on a recurring schedule.",
    groups: [
      {
        heading: "Routine mowing",
        items: [
          {
            name: "Mowing",
            detail:
              "Cut at the right height for the grass type and the time of year, with the pattern alternated each visit so the turf is not pushed the same way every week. Clippings mulched back in or bagged and removed, whichever the property needs.",
          },
          {
            name: "Edging and line trimming",
            detail:
              "A cut edge along drives, walkways, patios, bed lines and fences, and string trimming anywhere a mower deck cannot reach — around posts, meters, trees and foundation lines.",
          },
          {
            name: "Blow-down",
            detail:
              "Every hard surface cleared at the end of the visit, so drives, walks and porches are left clean rather than covered in clippings.",
          },
          {
            name: "Recurring schedules",
            detail:
              "Weekly, every other week, or monthly through the growing season, with the cadence adjusted as growth slows in late summer and autumn.",
          },
        ],
      },
      {
        heading: "Seasonal cleanups",
        items: [
          {
            name: "Spring cleanup",
            detail:
              "Winter debris cleared, dead growth cut back, perennials tidied, bed lines re-cut and the first proper cut of the season taken.",
          },
          {
            name: "Leaf removal",
            detail:
              "Repeat passes through the fall rather than one late visit, so leaves never sit long enough to smother the turf. Leaves hauled off or mulched in place.",
          },
          {
            name: "Storm and debris cleanup",
            detail:
              "Downed limbs, blown-in debris and scattered yard waste collected and removed after weather.",
          },
          {
            name: "Winter prep",
            detail:
              "Final cut, beds cut back and mulched, hoses and fittings drained, and the yard left in a state that does not need attention until spring.",
          },
        ],
      },
      {
        heading: "Turf health",
        items: [
          {
            name: "Core aeration",
            detail:
              "Plugs pulled to relieve compaction and open the soil so water, air and feed reach the root zone instead of running off.",
          },
          {
            name: "Overseeding",
            detail:
              "Thin and bare areas seeded straight after aeration, with a starter feed, so the new grass goes into open soil rather than thatch.",
          },
          {
            name: "Fertilisation and weed control",
            detail:
              "Scheduled feeding matched to the grass type, plus broadleaf and grassy weed treatment. Applied by licensed applicators wherever the state requires a licence.",
          },
          {
            name: "Grub and surface insect treatment",
            detail:
              "Preventative or curative treatment when damage is spreading, timed to the stage of the insect rather than the calendar.",
          },
          {
            name: "Sod and repair",
            detail:
              "Worn paths, pet damage and bare patches cut out and replaced with sod or repaired with seed and topdressing.",
          },
        ],
      },
      {
        heading: "Beds, borders and hedges",
        items: [
          {
            name: "Mulch and pine straw",
            detail:
              "Beds weeded, edged and topped up to depth in hardwood mulch, pine bark or pine straw — enough to hold moisture and suppress weeds without burying the crowns.",
          },
          {
            name: "Bed weeding and cultivation",
            detail:
              "Hand weeding, light cultivation and pre-emergent where it will do some good, rather than spraying over the top of everything.",
          },
          {
            name: "Shrub and hedge trimming",
            detail:
              "Shaped to the plant's own growth habit and pruned at the right point in its cycle, so it thickens up rather than getting hollow and woody.",
          },
          {
            name: "Brush and fence-line clearing",
            detail:
              "Overgrown fence lines, ditch banks, vacant strips and lot corners cut back and cleared, with the arisings hauled away.",
          },
        ],
      },
    ],
    note: "Every crew we match you with is insured, and you see the price before any work starts.",
  },

  tree: {
    title: "Tree, heavy yard work & pressure washing",
    intro:
      "The work that needs equipment, height and experience — trimming and removals, clearing ground back to usable, and washing the hard surfaces around the property until they look new again.",
    groups: [
      {
        heading: "Tree trimming and pruning",
        items: [
          {
            name: "Crown thinning and raising",
            detail:
              "Selective cuts to let light and wind through the canopy and to lift the lower limbs clear of the lawn, the drive and the roofline, without topping the tree.",
          },
          {
            name: "Deadwood removal",
            detail:
              "Dead, broken and hanging limbs taken out before they come down on their own.",
          },
          {
            name: "Clearance pruning",
            detail:
              "Limbs cut back off roofs, gutters, chimneys, drives, fences and service drops, to the clearance the utility or your insurer asks for.",
          },
          {
            name: "Storm damage pruning",
            detail:
              "Torn and split limbs cut back to a proper collar so the wound closes, rather than left ragged to rot.",
          },
          {
            name: "Structural pruning for young trees",
            detail:
              "Early shaping that sets a single strong leader and good branch spacing, which is far cheaper than correcting it in fifteen years.",
          },
        ],
      },
      {
        heading: "Tree removal",
        items: [
          {
            name: "Full removal",
            detail:
              "Taken down whole where there is room to drop it, or rigged down in sections over roofs, fences, pools and power lines where there is not.",
          },
          {
            name: "Hazard and emergency removal",
            detail:
              "Leaning, split, uprooted or storm-damaged trees dealt with as a priority, including trees already on a structure.",
          },
          {
            name: "Stump grinding",
            detail:
              "Ground out below grade so the area can be seeded or sodded, with grindings hauled off or backfilled and topped with soil.",
          },
          {
            name: "Haul-away and chipping",
            detail:
              "Brush chipped and wood cut to length — hauled away, or stacked on site if you want the firewood.",
          },
        ],
      },
      {
        heading: "Heavy yard work",
        items: [
          {
            name: "Brush and undergrowth clearing",
            detail:
              "Overgrown areas cut back to ground and cleared, including briar, privet, vine and volunteer saplings.",
          },
          {
            name: "Lot and fence-line clearing",
            detail:
              "Vacant lots, easements, property lines and fence rows cleared and left mowable.",
          },
          {
            name: "Grading and drainage touch-ups",
            detail:
              "Low spots filled, swales re-cut, downspouts extended and washed-out areas restored so water leaves the property instead of sitting against it.",
          },
          {
            name: "Ground repair after removals",
            detail:
              "Ruts filled, soil restored and the area seeded or sodded once the heavy work is finished.",
          },
        ],
      },
      {
        heading: "Pressure washing",
        items: [
          {
            name: "Driveways, walkways and patios",
            detail:
              "Surface-cleaned at the right pressure for the material, lifting years of dirt, algae and staining out of concrete, pavers and stone without etching them.",
          },
          {
            name: "House and siding soft wash",
            detail:
              "Low-pressure soft wash with the correct detergent for vinyl, brick, stucco, fibre cement or painted siding, so mould and mildew are killed rather than just blasted off.",
          },
          {
            name: "Decks, fences and porches",
            detail:
              "Timber cleaned at a pressure that will not furr the grain, and brightened ready for a stain or seal.",
          },
          {
            name: "Roof soft wash",
            detail:
              "Black streaking and moss treated with a no-pressure wash that will not lift shingles or void the roof warranty.",
          },
          {
            name: "Concrete stain treatment",
            detail:
              "Oil, rust, leaf tannin and organic staining treated with the right chemistry before the wash, which is the only way most of it actually comes up.",
          },
          {
            name: "Gutter face brightening",
            detail:
              "The tiger-striping down gutter faces cleaned off, usually scheduled alongside a gutter clean-out.",
          },
        ],
      },
    ],
    note: "Tree work is matched to qualified, insured providers, and we tell you up front when a removal needs a permit.",
  },

  cleaning: {
    title: "Residential & commercial cleaning",
    intro:
      "From a standing weekly clean to a full turnover between tenants. Every job is quoted against a written scope, so you know exactly what is being cleaned before anyone starts.",
    groups: [
      {
        heading: "Standard and recurring cleaning",
        items: [
          {
            name: "Standard clean",
            detail:
              "Kitchens, bathrooms, bedrooms and living areas: surfaces, sinks, showers, toilets, mirrors, exterior of appliances and cabinetry, floors vacuumed and mopped, trash out and beds made.",
          },
          {
            name: "Recurring plans",
            detail:
              "Weekly, every other week or monthly, with a rotating detail list so the deeper items come round on a schedule instead of never being touched.",
          },
          {
            name: "One-off and occasion cleans",
            detail:
              "Before guests arrive, after a party, ahead of a listing photo shoot, or whenever the house simply needs a reset.",
          },
        ],
      },
      {
        heading: "Deep and specialty cleaning",
        items: [
          {
            name: "Deep clean",
            detail:
              "Everything in a standard clean plus baseboards, door frames, switch plates, vents, light fixtures, window sills and tracks, inside the oven, fridge and microwave, and grout scrubbed rather than wiped.",
          },
          {
            name: "Move-in and move-out clean",
            detail:
              "An empty-property clean taken to handover standard: inside every cabinet and drawer, inside all appliances, closets, garages, and all the places furniture was hiding.",
          },
          {
            name: "Rental and short-let turnover",
            detail:
              "Same-day turns between guests, with linens stripped and remade, consumables restocked and a photo report if you need one for your listing platform.",
          },
          {
            name: "Post-construction and post-renovation",
            detail:
              "Fine dust removed in stages — it settles more than once — plus sticker and adhesive removal, paint spot cleaning and final glass.",
          },
        ],
      },
      {
        heading: "Floors and soft surfaces",
        items: [
          {
            name: "Carpet cleaning",
            detail:
              "Hot water extraction with pre-treatment for traffic lanes and spot treatment for stains, plus deodorising where pets have been.",
          },
          {
            name: "Upholstery and mattress cleaning",
            detail:
              "Sofas, chairs, dining seats and mattresses cleaned with a method matched to the fabric code, so nothing shrinks or water-marks.",
          },
          {
            name: "Tile, grout and hard floors",
            detail:
              "Grout lines scrubbed and rinsed, and sealed on request. Hardwood, LVP and laminate cleaned with the right amount of moisture for the finish.",
          },
          {
            name: "Area rug cleaning",
            detail:
              "Cleaned in place or collected for off-site treatment where the rug needs it.",
          },
        ],
      },
      {
        heading: "Commercial and office",
        items: [
          {
            name: "Offices and suites",
            detail:
              "Desks, meeting rooms, kitchens and break areas, on a nightly, weekly or set-schedule contract.",
          },
          {
            name: "Restrooms and common areas",
            detail:
              "Sanitised to a checklist, with consumables restocked and a signed record left behind.",
          },
          {
            name: "Retail and customer-facing space",
            detail:
              "Entrances, glass, floors and fitting rooms cleaned outside trading hours.",
          },
        ],
      },
      {
        heading: "Glass and exterior touchpoints",
        items: [
          {
            name: "Window cleaning",
            detail:
              "Interior and exterior glass, frames, sills and tracks. Reachable exterior glass included; anything needing height equipment is quoted separately.",
          },
          {
            name: "Gutter cleaning",
            detail:
              "Gutters cleared by hand and downspouts flushed until they run, with the debris bagged and taken away.",
          },
          {
            name: "Entryways and walkways",
            detail:
              "Porches, stoops and entry paths washed down. Larger hard-surface washing is scheduled with the pressure washing crews under Tree & Yard.",
          },
        ],
      },
    ],
    note: "Bring your own scope or use ours — either way you approve it in writing before the first visit.",
  },

  junk: {
    title: "Junk removal & cleanouts",
    intro:
      "One item or a whole property. Crews do the loading, the price is agreed before anything moves, and as much as possible is donated or recycled rather than landfilled.",
    groups: [
      {
        heading: "Single items and bulk pickup",
        items: [
          {
            name: "Furniture",
            detail:
              "Sofas, beds, wardrobes, desks, tables and office furniture taken from wherever they stand — including upstairs, basements and tight stairwells.",
          },
          {
            name: "Appliances",
            detail:
              "Fridges, freezers, washers, dryers, ranges and water heaters removed, with refrigerant-bearing units routed to handlers licensed to recover it.",
          },
          {
            name: "Mattresses and box springs",
            detail:
              "Taken away and sent for material recovery wherever a recycler serves the area.",
          },
          {
            name: "Electronics and e-waste",
            detail:
              "TVs, monitors, computers, printers and cabling routed to certified electronics recyclers rather than the kerb.",
          },
          {
            name: "Large outdoor items",
            detail:
              "Hot tubs, sheds, play sets, trampolines, above-ground pools and fencing dismantled on site and hauled away.",
          },
        ],
      },
      {
        heading: "Whole-property cleanouts",
        items: [
          {
            name: "Garage, attic and basement",
            detail:
              "Cleared back to usable space, with anything you want kept set aside and stacked where you ask.",
          },
          {
            name: "Estate cleanouts",
            detail:
              "Worked room by room at a pace that lets the family sort keepsakes first, with donation receipts provided for anything given away.",
          },
          {
            name: "Foreclosure and eviction trash-outs",
            detail:
              "Properties emptied to broom-clean for agents, lenders and landlords, with before-and-after photos for the file.",
          },
          {
            name: "Storage unit cleanouts",
            detail:
              "Units emptied and swept, coordinated directly with the facility if you cannot be there.",
          },
          {
            name: "Heavily cluttered properties",
            detail:
              "Handled discreetly, in stages, in unmarked or plain trucks where that matters, and without any commentary from the crew.",
          },
        ],
      },
      {
        heading: "Construction and yard debris",
        items: [
          {
            name: "Renovation debris",
            detail:
              "Non-hazardous demolition waste — drywall, lumber, flooring, cabinetry, tile, fixtures and packaging — cleared as the job goes or in one final haul.",
          },
          {
            name: "Roofing tear-off",
            detail:
              "Shingle and underlayment debris loaded and removed, including nail sweeping of the drive and lawn.",
          },
          {
            name: "Concrete, brick and soil",
            detail:
              "Small loads of heavy inert material taken to the right facility. Weight limits apply, so these are priced by load.",
          },
          {
            name: "Yard waste and storm debris",
            detail:
              "Limbs, brush, stumps, sod and fencing collected after a clearing job or a storm.",
          },
        ],
      },
      {
        heading: "How the job runs",
        items: [
          {
            name: "Labour included",
            detail:
              "Crews carry everything out themselves. You point at what goes; nothing needs to be moved to the kerb first.",
          },
          {
            name: "Volume pricing, agreed first",
            detail:
              "Priced by how much truck space the load takes, quoted on site before loading starts, with no charge if you decide against it.",
          },
          {
            name: "Same-day and next-day",
            detail:
              "Available in most areas when a crew has capacity, including weekend slots.",
          },
          {
            name: "Donation and recycling",
            detail:
              "Usable furniture, appliances, building materials and household goods offered to local charities and reuse centres first, with metal, electronics and cardboard separated for recycling.",
          },
        ],
      },
      {
        heading: "What crews cannot take",
        items: [
          {
            name: "Hazardous material",
            detail:
              "Paint, solvents, pesticides, fuels, oils, asbestos, medical or chemical waste and pressurised cylinders need a licensed disposal route — tell us and we will point you at one.",
          },
        ],
      },
    ],
    note: "Quotes are given on site before loading, and you only pay for the space the load actually takes.",
  },
};
