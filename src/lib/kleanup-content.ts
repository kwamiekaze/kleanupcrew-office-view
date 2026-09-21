import { BRAND_SLOGAN } from "./brand.ts";

export type ViewId = "welcome" | "cleaning" | "lawn" | "junk" | "tree" | "quote";

export interface OfficeView {
  id: ViewId;
  label: string;
  title: string;
  /** Short summary, kept for the section data; the panel itself stays bare. */
  line?: string;
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
    label: "Welcome",
    title: BRAND_SLOGAN,
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
    label: "Lawn Care",
    title: "Lawn & yard maintenance",
    line: "We mow, edge, trim, clear the leaves, shape the hedges and cut back the brush, on a single visit or a schedule you set.",
    cta: "Set up lawn service",
    // Square on to the lawn board, close enough to read every tool and low
    // enough to keep the mower's wheels on screen.
    pos: [1.44, 2.83, 1.0],
    target: [-5.38, 1.12, 1.78],
    horizontalFov: 44,
  },
  {
    id: "tree",
    label: "Tree & Yard",
    title: "Tree & heavy yard work",
    line: "We trim, prune, take trees down, grind the stumps out, and pressure wash the hard surfaces around the property.",
    cta: "Request a site visit",
    // Centres the tool board with the loppers, rake and spade at its foot.
    pos: [0.9, 2.75, 1.5],
    target: [-5.58, 1.45, -1.7],
    horizontalFov: 40,
  },
  {
    id: "cleaning",
    label: "Home Cleaning",
    title: "Residential & commercial cleaning",
    line: "Standard, deep, recurring and move-out cleans, rental turnovers, carpet, upholstery, windows and gutters.",
    cta: "Book a cleaning estimate",
    // Was set back across the whole room; now it stands in front of the supply
    // shelf so the bottles, rolls, bucket and caddy are all legible.
    pos: [-0.8, 2.4, 2.9],
    target: [5.1, 1.42, -1.05],
    horizontalFov: 44,
  },
  {
    id: "junk",
    label: "Junk Removal",
    title: "Junk removal & cleanouts",
    line: "Bulk items, garage and estate cleanouts, and non-hazardous renovation debris. We do the loading and haul it away in one visit.",
    cta: "Get a haul-away price",
    // Wider and tipped down, so the hand truck, cartons, bags, bin and offcuts
    // all sit in frame with floor beneath them instead of bare wall above.
    pos: [-1.8, 2.72, 5.95],
    target: [5.32, 0.78, 3.5],
    horizontalFov: 31,
  },
  {
    id: "quote",
    label: "Get a Quote",
    title: "Property prep & curb appeal",
    line: "Tell us about the property once and we price the whole job, from a single tidy up to year round care.",
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

export const TRUST_CHIPS = ["Fully insured", "Upfront pricing"];

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
/** Full service breakdowns, shown behind the More info button on each section. */
export const SERVICE_DETAILS: Record<ViewId, ServiceDetail> = {
  welcome: {
    title: "Inside. Outside. Handled.",
    intro:
      "We are one company that handles the whole property. The same people you speak to are the people who turn up, do the work and clean up afterwards. Nothing is handed off to anyone else.",
    groups: [
      {
        heading: "Who we are",
        items: [
          {
            name: "We do the work ourselves",
            detail:
              "Our own staff, our own trucks and our own equipment. You are not being passed along to someone we found, and you will not meet a different company on the day.",
          },
          {
            name: "One point of contact",
            detail:
              "One number, one price and one person answering for the whole job, even when it covers cleaning inside and clearing outside on the same visit.",
          },
          {
            name: "Fully insured",
            detail:
              "We carry general liability and workers compensation cover, and we are happy to send a certificate before we start.",
          },
          {
            name: "Based here, working here",
            detail:
              "We live and work in the same area we serve, which is why we care what the street looks like after we leave.",
          },
        ],
      },
      {
        heading: "What we handle",
        items: [
          {
            name: "Inside the property",
            detail:
              "Standard and deep cleaning, move outs, rental turnovers, carpets, upholstery, tile and grout, windows and offices.",
          },
          {
            name: "Outside the property",
            detail:
              "Mowing, edging, trimming, seasonal cleanups, beds and mulch, hedges, tree trimming and removal, stump grinding and pressure washing.",
          },
          {
            name: "Hauling it away",
            detail:
              "Single bulky items, full garage and estate cleanouts, renovation debris and storm damage, loaded by us and taken away.",
          },
          {
            name: "Getting a property ready",
            detail:
              "Pre sale and pre listing prep, tenant turnarounds and seasonal refreshes, where several of the above happen together on one schedule.",
          },
        ],
      },
      {
        heading: "How we work",
        items: [
          {
            name: "You tell us what you need",
            detail:
              "Call, message or send photos. For anything we cannot price from a description, we come and look at it first, and that visit costs you nothing.",
          },
          {
            name: "You get a price before we start",
            detail:
              "Written, itemized and fixed. If we find something we could not see at the quote stage, we stop and talk to you rather than adding it to the bill.",
          },
          {
            name: "We show up when we said we would",
            detail:
              "If we are running late you hear it from us first, not after the window has passed.",
          },
          {
            name: "We leave it clean",
            detail:
              "Drives blown down, debris picked up, trash taken with us. The job is not done until the property looks finished.",
          },
        ],
      },
    ],
    note: "Every price is agreed in writing before any work begins, and it does not move afterwards.",
  },

  lawn: {
    title: "Lawn & yard maintenance",
    intro:
      "Everything that keeps a property looking cared for week to week, from the routine cut to the seasonal work that decides how the turf comes back next spring. Book a single visit or put the property on a schedule.",
    groups: [
      {
        heading: "Routine mowing",
        items: [
          {
            name: "Mowing",
            detail:
              "We cut at the right height for your grass type and the time of year, and alternate the pattern each visit so the turf is not pushed the same way every week. Clippings mulched back in or bagged and removed, whichever the lawn needs.",
          },
          {
            name: "Edging and line trimming",
            detail:
              "A cut edge along drives, walkways, patios, bed lines and fences, and string trimming anywhere a mower deck cannot reach, including around posts, meters, trees and foundation lines.",
          },
          {
            name: "Blow down",
            detail:
              "We clear every hard surface before we leave, so drives, walks and porches are clean rather than covered in clippings.",
          },
          {
            name: "Schedules",
            detail:
              "Weekly, every other week, or monthly through the growing season. We adjust the cadence as growth slows in late summer and fall rather than charging you for cuts the lawn did not need.",
          },
        ],
      },
      {
        heading: "Seasonal cleanups",
        items: [
          {
            name: "Spring cleanup",
            detail:
              "Winter debris cleared, dead growth cut back, perennials tidied, bed lines re cut and the first proper cut of the season taken.",
          },
          {
            name: "Leaf removal",
            detail:
              "We make repeat passes through the fall rather than one late visit, so leaves never sit long enough to smother the turf. Hauled off or mulched in place.",
          },
          {
            name: "Storm and debris cleanup",
            detail:
              "Downed limbs, blown in debris and scattered yard waste collected and removed after weather.",
          },
          {
            name: "Winter prep",
            detail:
              "Final cut, beds cut back and mulched, hoses and fittings drained, and the yard left in a state that needs nothing until spring.",
          },
        ],
      },
      {
        heading: "Turf health",
        items: [
          {
            name: "Core aeration",
            detail:
              "We pull plugs to relieve compaction and open the soil, so water, air and feed reach the root zone instead of running off.",
          },
          {
            name: "Overseeding",
            detail:
              "Thin and bare areas seeded straight after aeration with a starter feed, so the new grass goes into open soil rather than thatch.",
          },
          {
            name: "Fertilization and weed control",
            detail:
              "Scheduled feeding matched to your grass type, plus broadleaf and grassy weed treatment, applied under the licenses the state requires.",
          },
          {
            name: "Grub and surface insect treatment",
            detail:
              "Preventative or curative treatment when damage is spreading, timed to the stage of the insect rather than the calendar.",
          },
          {
            name: "Sod and repair",
            detail:
              "Worn paths, pet damage and bare patches cut out and replaced with sod, or repaired with seed and topdressing.",
          },
        ],
      },
      {
        heading: "Beds, borders and hedges",
        items: [
          {
            name: "Mulch and pine straw",
            detail:
              "Beds weeded, edged and topped up to depth in hardwood mulch, pine bark or pine straw, deep enough to hold moisture and suppress weeds without burying the crowns.",
          },
          {
            name: "Bed weeding and cultivation",
            detail:
              "Hand weeding, light cultivation and pre emergent where it will actually help, rather than spraying over the top of everything.",
          },
          {
            name: "Shrub and hedge trimming",
            detail:
              "Shaped to the plant's own growth habit and pruned at the right point in its cycle, so it thickens up instead of going hollow and woody.",
          },
          {
            name: "Brush and fence line clearing",
            detail:
              "Overgrown fence lines, ditch banks, vacant strips and lot corners cut back and cleared, and we take the cuttings with us.",
          },
        ],
      },
    ],
    note: "We are fully insured, and you see the price before we start.",
  },

  tree: {
    title: "Tree, heavy yard work & pressure washing",
    intro:
      "The work that needs equipment, height and experience. We trim and remove trees, clear ground back to usable, and wash the hard surfaces around the property until they look new again.",
    groups: [
      {
        heading: "Tree trimming and pruning",
        items: [
          {
            name: "Crown thinning and raising",
            detail:
              "Selective cuts that let light and wind through the canopy and lift the lower limbs clear of the lawn, the drive and the roofline. We do not top trees.",
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
              "Torn and split limbs cut back to a proper collar so the wound closes, instead of being left ragged to rot.",
          },
          {
            name: "Structural pruning for young trees",
            detail:
              "Early shaping that sets a single strong leader and good branch spacing, which costs far less now than correcting it in fifteen years.",
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
              "Leaning, split, uprooted or storm damaged trees dealt with as a priority, including trees already sitting on a structure.",
          },
          {
            name: "Stump grinding",
            detail:
              "Ground out below grade so the area can be seeded or sodded. We haul the grindings off, or backfill and top with soil if you prefer.",
          },
          {
            name: "Haul away and chipping",
            detail:
              "Brush chipped and wood cut to length, then taken away, or stacked on site if you want the firewood.",
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
            name: "Lot and fence line clearing",
            detail:
              "Vacant lots, easements, property lines and fence rows cleared and left mowable.",
          },
          {
            name: "Grading and drainage touch ups",
            detail:
              "Low spots filled, swales re cut, downspouts extended and washed out areas restored, so water leaves the property instead of sitting against it.",
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
              "Surface cleaned at the right pressure for the material, lifting years of dirt, algae and staining out of concrete, pavers and stone without etching them.",
          },
          {
            name: "House and siding soft wash",
            detail:
              "Low pressure soft wash with the correct detergent for vinyl, brick, stucco, fiber cement or painted siding, so mold and mildew are killed rather than just blasted off.",
          },
          {
            name: "Decks, fences and porches",
            detail:
              "Timber cleaned at a pressure that will not raise the grain, and brightened ready for a stain or seal.",
          },
          {
            name: "Roof soft wash",
            detail:
              "Black streaking and moss treated with a no pressure wash that will not lift shingles or void your roof warranty.",
          },
          {
            name: "Concrete stain treatment",
            detail:
              "Oil, rust, leaf tannin and organic staining treated with the right chemistry before the wash, which is the only way most of it actually comes up.",
          },
          {
            name: "Gutter face brightening",
            detail:
              "The black striping down gutter faces cleaned off, usually scheduled alongside a gutter clean out.",
          },
        ],
      },
    ],
    note: "We are insured for tree work, and we tell you up front if a removal needs a permit.",
  },

  cleaning: {
    title: "Residential & commercial cleaning",
    intro:
      "From a standing weekly clean to a full turnover between tenants. Every job is quoted against a written scope, so you know exactly what we are cleaning before we start.",
    groups: [
      {
        heading: "Standard and recurring cleaning",
        items: [
          {
            name: "Standard clean",
            detail:
              "Kitchens, bathrooms, bedrooms and living areas: surfaces, sinks, showers, toilets, mirrors, the outside of appliances and cabinetry, floors vacuumed and mopped, trash out and beds made.",
          },
          {
            name: "Recurring plans",
            detail:
              "Weekly, every other week or monthly, with a rotating detail list so the deeper items come round on a schedule instead of never being touched.",
          },
          {
            name: "Single visits",
            detail:
              "Before guests arrive, after a party, ahead of listing photos, or whenever the house simply needs a reset.",
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
            name: "Move in and move out clean",
            detail:
              "An empty property taken to handover standard: inside every cabinet and drawer, inside all appliances, closets, garages, and all the places the furniture was hiding.",
          },
          {
            name: "Rental and short let turnover",
            detail:
              "Same day turns between guests, with linens stripped and remade, consumables restocked and a photo report if you need one for your listing platform.",
          },
          {
            name: "Post construction and post renovation",
            detail:
              "Fine dust removed in stages, because it settles more than once, plus sticker and adhesive removal, paint spot cleaning and final glass.",
          },
        ],
      },
      {
        heading: "Floors and soft surfaces",
        items: [
          {
            name: "Carpet cleaning",
            detail:
              "Hot water extraction with pre treatment for traffic lanes and spot treatment for stains, plus deodorizing where pets have been.",
          },
          {
            name: "Upholstery and mattress cleaning",
            detail:
              "Sofas, chairs, dining seats and mattresses cleaned with a method matched to the fabric code, so nothing shrinks or water marks.",
          },
          {
            name: "Tile, grout and hard floors",
            detail:
              "Grout lines scrubbed and rinsed, and sealed on request. Hardwood, luxury vinyl and laminate cleaned with the right amount of moisture for the finish.",
          },
          {
            name: "Area rug cleaning",
            detail:
              "Cleaned in place, or collected and treated off site where the rug needs it.",
          },
        ],
      },
      {
        heading: "Commercial and office",
        items: [
          {
            name: "Offices and suites",
            detail:
              "Desks, meeting rooms, kitchens and break areas, on a nightly, weekly or set schedule contract.",
          },
          {
            name: "Restrooms and common areas",
            detail:
              "Sanitized to a checklist, with consumables restocked and a signed record left behind.",
          },
          {
            name: "Retail and customer facing space",
            detail:
              "Entrances, glass, floors and fitting rooms cleaned outside your trading hours.",
          },
        ],
      },
      {
        heading: "Glass and exterior touchpoints",
        items: [
          {
            name: "Window cleaning",
            detail:
              "Interior and exterior glass, frames, sills and tracks. Reachable exterior glass is included; anything needing height equipment we quote separately.",
          },
          {
            name: "Gutter cleaning",
            detail:
              "Gutters cleared by hand and downspouts flushed until they run, with the debris bagged and taken away.",
          },
          {
            name: "Entryways and walkways",
            detail:
              "Porches, stoops and entry paths washed down. Larger hard surface washing we schedule under Tree & Yard, where the pressure washing equipment lives.",
          },
        ],
      },
    ],
    note: "Bring us your own checklist or use ours. Either way you approve it in writing before our first visit.",
  },

  junk: {
    title: "Junk removal & cleanouts",
    intro:
      "One item or a whole property. We do the loading, the price is agreed before anything moves, and we donate or recycle as much of it as we can rather than sending it all to landfill.",
    groups: [
      {
        heading: "Single items and bulk pickup",
        items: [
          {
            name: "Furniture",
            detail:
              "Sofas, beds, wardrobes, desks, tables and office furniture taken from wherever they stand, including upstairs, basements and tight stairwells.",
          },
          {
            name: "Appliances",
            detail:
              "Fridges, freezers, washers, dryers, ranges and water heaters removed, with refrigerant bearing units routed to handlers licensed to recover it.",
          },
          {
            name: "Mattresses and box springs",
            detail:
              "Taken away and sent for material recovery wherever a recycler serves the area.",
          },
          {
            name: "Electronics",
            detail:
              "TVs, monitors, computers, printers and cabling routed to certified electronics recyclers rather than the curb.",
          },
          {
            name: "Large outdoor items",
            detail:
              "Hot tubs, sheds, play sets, trampolines, above ground pools and fencing dismantled on site and hauled away.",
          },
        ],
      },
      {
        heading: "Whole property cleanouts",
        items: [
          {
            name: "Garage, attic and basement",
            detail:
              "Cleared back to usable space. Anything you want kept, we set aside and stack where you ask.",
          },
          {
            name: "Estate cleanouts",
            detail:
              "Worked room by room at a pace that lets the family sort keepsakes first, with donation receipts for anything given away.",
          },
          {
            name: "Foreclosure and eviction trash outs",
            detail:
              "Properties emptied to broom clean for agents, lenders and landlords, with before and after photos for the file.",
          },
          {
            name: "Storage unit cleanouts",
            detail:
              "Units emptied and swept. We coordinate directly with the facility if you cannot be there.",
          },
          {
            name: "Heavily cluttered properties",
            detail:
              "Handled discreetly and in stages, in plain trucks where that matters, and without any commentary from us.",
          },
        ],
      },
      {
        heading: "Construction and yard debris",
        items: [
          {
            name: "Renovation debris",
            detail:
              "Non hazardous demolition waste such as drywall, lumber, flooring, cabinetry, tile, fixtures and packaging, cleared as the job goes or in one final haul.",
          },
          {
            name: "Roofing tear off",
            detail:
              "Shingle and underlayment debris loaded and removed, and we sweep the drive and lawn for nails before we leave.",
          },
          {
            name: "Concrete, brick and soil",
            detail:
              "Small loads of heavy inert material taken to the right facility. Weight limits apply, so we price these by the load.",
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
            name: "We do the lifting",
            detail:
              "We carry everything out ourselves. You point at what goes; nothing needs to be moved to the curb first.",
          },
          {
            name: "Volume pricing, agreed first",
            detail:
              "Priced by how much truck space the load takes, quoted on site before we start loading, and there is no charge if you decide against it.",
          },
          {
            name: "Same day and next day",
            detail:
              "Available most of the time, including weekends, depending on what is already booked.",
          },
          {
            name: "Donation and recycling",
            detail:
              "Usable furniture, appliances, building materials and household goods go to local charities and reuse centers first, and we separate metal, electronics and cardboard for recycling.",
          },
        ],
      },
      {
        heading: "What we cannot take",
        items: [
          {
            name: "Hazardous material",
            detail:
              "Paint, solvents, pesticides, fuels, oils, asbestos, medical or chemical waste and pressurized cylinders need a licensed disposal route. Tell us and we will point you at one.",
          },
        ],
      },
    ],
    note: "We price the load on site before anything moves, and you only pay for the space it actually takes.",
  },

  quote: {
    title: "Property prep & curb appeal",
    intro:
      "When a property needs several things at once, you should not have to book them separately. Tell us about it once and we price the whole thing, then do it in the right order on one schedule.",
    groups: [
      {
        heading: "Getting a price",
        items: [
          {
            name: "Tell us once",
            detail:
              "Describe the property and what is bothering you. Photos help, and you can send as many as you like.",
          },
          {
            name: "We come and look",
            detail:
              "For anything we cannot price honestly from photos, we walk the property first. That visit is free and there is nothing to sign at the end of it.",
          },
          {
            name: "A written, itemized price",
            detail:
              "Line by line, so you can see what each part costs and drop anything you would rather leave. The total does not move once you accept it.",
          },
          {
            name: "No pressure, no follow up calls",
            detail:
              "The quote stays valid for thirty days. If you want it, call us. We will not chase you.",
          },
        ],
      },
      {
        heading: "Getting a property ready",
        items: [
          {
            name: "Pre listing and pre sale prep",
            detail:
              "Everything a buyer sees in the first ten seconds: the lawn cut and edged, beds mulched, hedges shaped, drive and siding washed, windows cleaned and the inside taken to photo standard.",
          },
          {
            name: "Tenant turnarounds",
            detail:
              "Full clean, junk left behind removed, yard reset and any damage cleaned up, timed to fit between the handover and the next move in.",
          },
          {
            name: "Move in prep",
            detail:
              "The empty property cleaned properly before your furniture goes in, which is the only time it is easy to do.",
          },
          {
            name: "Seasonal refresh",
            detail:
              "Spring and fall resets that cover the yard, the gutters, the windows and the hard surfaces in a single visit.",
          },
        ],
      },
      {
        heading: "Curb appeal",
        items: [
          {
            name: "The approach",
            detail:
              "Drive and walkway washed, edges cut in, weeds out of the cracks, and the mailbox and light posts cleaned up.",
          },
          {
            name: "The front of the house",
            detail:
              "Siding soft washed, porch and steps cleaned, windows and glass done, cobwebs and wasp nests cleared.",
          },
          {
            name: "The planting",
            detail:
              "Beds re cut and mulched, shrubs shaped back off the windows, dead material pulled and gaps filled.",
          },
          {
            name: "The details",
            detail:
              "Gutter faces brightened, the fence washed, trash and recycling screened, and anything stored out front put out of sight.",
          },
        ],
      },
      {
        heading: "Keeping it that way",
        items: [
          {
            name: "Recurring care",
            detail:
              "Weekly, biweekly or monthly yard care, with cleaning and washing dropped in at the intervals that suit the property.",
          },
          {
            name: "One schedule, one invoice",
            detail:
              "Everything on the property under one plan, billed together, so you are not tracking four different visits.",
          },
          {
            name: "Vacant and second properties",
            detail:
              "Regular visits to keep a property that nobody is living in from looking like nobody is living in it.",
          },
        ],
      },
    ],
    note: "Quotes are free, written and itemized, and the price we give you is the price you pay.",
  },
};
