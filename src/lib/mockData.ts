// ─── Flower product images ────────────────────────────────────────────────────
import flower1  from "@/assets/products/flower 1.jpeg";
import flower2  from "@/assets/products/flower 2.jpeg";
import flower3  from "@/assets/products/flower 3.jpeg";
import flower4  from "@/assets/products/flower 4.jpeg";
import flower5  from "@/assets/products/flower 5.jpeg";
import flower6  from "@/assets/products/flower 6.jpeg";
import flower7  from "@/assets/products/flower 7.jpeg";
import flower8  from "@/assets/products/flower 8.jpeg";
import flower9  from "@/assets/products/flower 9.jpeg";
import flower10 from "@/assets/products/flower 10.jpeg";
import flower11 from "@/assets/products/flower 11.jpeg";
import flower12 from "@/assets/products/flower 12.jpeg";
import flower13 from "@/assets/products/flower 13.jpeg";
import flower14 from "@/assets/products/flower 14.jpeg";
import flower15 from "@/assets/products/flower 15.jpeg";
import flower16 from "@/assets/products/flower 16.jpeg";
import flower17 from "@/assets/products/flower 17.jpeg";
import flower18 from "@/assets/products/flower 18.jpeg";
import flower19 from "@/assets/products/flower 19.jpeg";
import flower20 from "@/assets/products/flower 20.jpeg";
// Note: space in filename — quotes required
import customProductImage from "@/assets/products/custom product.png";

// ─── Types & categories ───────────────────────────────────────────────────────
export type Category =
  | "Freshest Series"
  | "Flower Bouquet"
  | "Hand Bouquet"
  | "Flower Vase"
  | "Custom Order";

/** The four flower categories (used for homepage loops and filter tabs) */
export const CATEGORIES: Category[] = [
  "Freshest Series",
  "Flower Bouquet",
  "Hand Bouquet",
  "Flower Vase",
];

export const CATEGORY_SLUGS: Record<Category, string> = {
  "Freshest Series": "freshest-series",
  "Flower Bouquet":  "flower-bouquet",
  "Hand Bouquet":    "hand-bouquet",
  "Flower Vase":     "flower-vase",
  "Custom Order":    "custom-order",
};

export const SLUG_TO_CATEGORY: Record<string, Category> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k as Category]),
) as Record<string, Category>;

// ─── Product detail types ─────────────────────────────────────────────────────
export type ProductDetail = {
  mainFlowers:      string;
  companionFlowers: string;
  foliage:          string;
  wrappingPaper:    string;
  /** ribbon OR vase (label depends on category) */
  ribbonOrVase:     string;
  /** vase-only: arrangement style */
  arrangementStyle?: string;
};

export type Product = {
  id:           string;
  slug:         string;
  name:         string;
  category:     Category;
  price:        number;
  /** If set, shown instead of the formatted price everywhere */
  priceDisplay?: string;
  stock:        number;
  inStock:      boolean;
  image:        string;
  description:  string;
  /** Fixed-key structure for standard flower products */
  details:      ProductDetail | Record<string, never>;
  /** Flexible label-value array for non-flower products (e.g. Custom Order) */
  detailItems?: Array<{ label: string; value: string }>;
  perfectFor:   string[];
  /** Permanent product — admin cannot delete; only archive */
  isLocked?:    boolean;
  /** flower 5 only */
  sashText?:    string;
  sold?:        number;
  status?:      "Active" | "Draft";
};

// ─── Shared price formatter ────────────────────────────────────────────────────
export function formatPrice(product: Product): string {
  if (product.priceDisplay) return product.priceDisplay;
  const { formatRp } = { formatRp: (n: number) => `Rp ${new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}` };
  return formatRp(product.price);
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [

  // ── FRESHEST SERIES ──────────────────────────────────────────────────────────

  {
    id: "p1", slug: "stargazer-lily-bouquet", name: "Stargazer Lily Bouquet",
    category: "Freshest Series", price: 420000, stock: 8, inStock: true, image: flower1,
    description: "A bold, dramatic statement piece centred around the magnificent stargazer lily. Deep hot-pink blooms with a rich natural fragrance make this arrangement impossible to ignore — the perfect choice when you want to make a grand impression.",
    details: {
      mainFlowers:      "Hot pink stargazer lilies in full bloom, chosen for their vibrant colour and intense, sweet fragrance.",
      companionFlowers: "Soft pink alstroemeria and small white spray roses balancing the boldness of the lilies.",
      foliage:          "Glossy ruscus leaves and minimal eucalyptus providing a clean, structured backdrop.",
      wrappingPaper:    "Premium white organza fabric wrap gathered at the stem, giving a soft, airy, luxurious feel.",
      ribbonOrVase:     "Large white satin bow with long trailing tails.",
    },
    perfectFor: ["Grand gestures and milestone celebrations", "Graduation and achievement gifts", "Expressing deep admiration", "Someone who loves bold, fragrant flowers"],
    sold: 24, status: "Active",
  },

  {
    id: "p2", slug: "fresh-flower-collection", name: "Fresh Flower Collection",
    category: "Freshest Series", price: 350000, stock: 0, inStock: false, image: flower3,
    description: "Our signature fresh flower collection — a curated selection of the finest seasonal varieties available in the shop that day. No two collections are identical, making every order a one-of-a-kind floral experience.",
    details: {
      mainFlowers:      "Seasonal showpiece variety — tulips, orchids, or lilies based on the day's freshest stock.",
      companionFlowers: "A handpicked mix of complementary blooms chosen by our florist to harmonise with the main flowers.",
      foliage:          "Seasonal greenery selected to complement the colour palette of the day's arrangement.",
      wrappingPaper:    "Premium kraft or decorative paper chosen to complement the colour palette of the arrangement.",
      ribbonOrVase:     "Coordinating satin ribbon, colour matched to the blooms.",
    },
    perfectFor: ["Those who love surprises and unique, one-of-a-kind gifts", "Seasonal and special occasion gifting", "Customers who trust our florist's curation", "Rotating home decor that changes with the season"],
    sold: 18, status: "Active",
  },

  {
    id: "p3", slug: "spring-tulip-series", name: "Spring Tulip Series",
    category: "Freshest Series", price: 195000, stock: 15, inStock: true, image: flower4,
    description: "Celebrate the freshness of the season with a vibrant bundle of spring tulips. Pink and soft yellow blooms bursting with life — light, cheerful, and full of the optimism that only tulips can bring.",
    details: {
      mainFlowers:      "Fresh pink tulips and soft yellow-blush tulips, selected at the peak of their seasonal availability.",
      companionFlowers: "Small white gypsophila added to soften and frame the tulip stems naturally.",
      foliage:          "Tulip's own natural leaves kept intact for a garden-fresh, just-picked aesthetic.",
      wrappingPaper:    "Lightweight pastel tissue in a coordinating spring tone, casually wrapped to preserve the natural feel.",
      ribbonOrVase:     "Thin satin ribbon in a simple single tie.",
    },
    perfectFor: ["Spring celebrations and seasonal gifting", "Cheerful get-well-soon tokens", "Someone who loves soft, fresh colour palettes", "Desk and windowsill decoration"],
    sold: 12, status: "Active",
  },

  {
    id: "p4", slug: "sunny-mix-bouquet", name: "Sunny Mix Bouquet",
    category: "Freshest Series", price: 275000, stock: 10, inStock: true, image: flower6,
    description: "The ultimate feel-good bouquet. A cheerful, energetic mix of sunflower, gerbera, and pink blooms that radiates warmth and positivity from every angle. Impossible to look at without smiling.",
    details: {
      mainFlowers:      "One full sunflower and two yellow gerbera daisies as the bold, sunny focal point.",
      companionFlowers: "Hot pink carnations and pink spray roses filling in the arrangement with warmth and volume.",
      foliage:          "Soft ruscus leaves and bear grass for a relaxed, garden-fresh look.",
      wrappingPaper:    "Soft pink matte paper with a lighter pink tissue lining, fully wrapping the stems for a neat finish.",
      ribbonOrVase:     "Dusty pink satin ribbon with a rounded, full bow.",
    },
    perfectFor: ["Birthdays and cheerful celebrations", "Pick-me-up surprises", "Sunshine-lover gifts", "Housewarming presents"],
    sold: 22, status: "Active",
  },

  {
    id: "p5", slug: "vivid-garden-bouquet", name: "Vivid Garden Bouquet",
    category: "Freshest Series", price: 310000, stock: 7, inStock: true, image: flower18,
    description: "Bold, expressive, and completely unexpected — this vivid arrangement blends deep purple roses, lavender blooms, and bright gerbera daisies for a look that stands out in the most beautiful way.",
    details: {
      mainFlowers:      "Rich purple and lavender roses as the dramatic, jewel-toned focal point.",
      companionFlowers: "Pink and orange gerbera daisies adding vibrant colour contrast throughout the arrangement.",
      foliage:          "Dark olive and tropical leaves providing a moody, rich backdrop that deepens the colour palette.",
      wrappingPaper:    "Deep green matte wrap, allowing the vivid bloom colours to contrast and stand out boldly.",
      ribbonOrVase:     "Natural raffia or dark green ribbon in a relaxed knot.",
    },
    perfectFor: ["Bold and unconventional gifters", "Purple and jewel-tone aesthetic lovers", "Making a memorable, unique impression", "Art and colour enthusiasts"],
    sold: 9, status: "Active",
  },

  // ── FLOWER BOUQUET ────────────────────────────────────────────────────────────

  {
    id: "p6", slug: "full-pink-rose-bouquet", name: "Full Pink Rose Bouquet",
    category: "Flower Bouquet", price: 330000, stock: 6, inStock: true, image: flower7,
    description: "A generously full, lush arrangement of the finest pink roses. Classic, romantic, and deeply beautiful — this is the bouquet that makes every recipient feel truly celebrated.",
    details: {
      mainFlowers:      "Premium mixed-tone pink roses — from soft blush to medium pink — forming a full, rounded dome.",
      companionFlowers: "Small pink spray roses and white gypsophila woven throughout for depth and texture.",
      foliage:          "Ruscus and minimal eucalyptus neatly tucked in to support the rose-forward aesthetic.",
      wrappingPaper:    "Crisp white cone wrap with a semi-gloss finish, giving a polished, premium presentation.",
      ribbonOrVase:     "White satin ribbon tied into a clean, elegant bow.",
    },
    perfectFor: ["Anniversaries and romantic milestones", "Birthday gifts for rose lovers", "Formal gifting occasions", "Anyone who believes you can never go wrong with roses"],
    sold: 28, status: "Active",
  },

  {
    id: "p7", slug: "grand-rose-abundance", name: "Grand Rose Abundance",
    category: "Flower Bouquet", price: 650000, stock: 0, inStock: false, image: flower9,
    description: "Our most extravagant rose arrangement — an overflowing abundance of the finest pink roses, generously piled and luxuriously full. For when only the grandest gesture will do.",
    details: {
      mainFlowers:      "Thirty or more premium pink garden roses in varying tones, creating an overflowing, dramatic composition.",
      companionFlowers: "Pink spray roses and soft white ranunculus scattered throughout for a layered, garden-opulent look.",
      foliage:          "Generous ruscus and eucalyptus filling the base and framing the abundant blooms.",
      wrappingPaper:    "Warm cream and gold-toned layered paper wrap with a wide opening to display the full abundance.",
      ribbonOrVase:     "Wide cream satin ribbon, hand-tied with a generous bow.",
    },
    perfectFor: ["Proposals and romantic grand gestures", "Major milestone birthdays (18th, 21st, 30th)", "Premium anniversary gifts", "When you want to make an unforgettable impression"],
    sold: 6, status: "Active",
  },

  {
    id: "p8", slug: "dreamy-pink-bouquet", name: "Dreamy Pink Bouquet",
    category: "Flower Bouquet", price: 280000, stock: 9, inStock: true, image: flower10,
    description: "Soft, ethereal, and utterly romantic. This dreamy pink arrangement is wrapped in delicate sheer paper that gives the whole bouquet a floating, cloud-like quality that feels almost too beautiful to hold.",
    details: {
      mainFlowers:      "Soft pink roses and blush garden roses as the centrepiece of the arrangement.",
      companionFlowers: "Pink alstroemeria and pale lilac waxflower giving the arrangement a soft, multi-dimensional quality.",
      foliage:          "Wispy asparagus fern and delicate maidenhair for an airy, romantic finish.",
      wrappingPaper:    "Layered white sheer/organza-style paper giving a transparent, dreamy, cloud-like presentation.",
      ribbonOrVase:     "Soft pink chiffon ribbon tied loosely and casually.",
    },
    perfectFor: ["Romantic gifting", "Sweet sixteen and coming-of-age celebrations", "Delicate, feminine aesthetic lovers", "Anyone who loves pink in its softest form"],
    sold: 17, status: "Active",
  },

  {
    id: "p9", slug: "peach-and-cream-bouquet", name: "Peach & Cream Bouquet",
    category: "Flower Bouquet", price: 295000, stock: 11, inStock: true, image: flower17,
    description: "A sophisticated blend of cream and soft peach roses that speaks the language of warmth and understated elegance. Refined, versatile, and endlessly beautiful — a gift that flatters anyone.",
    details: {
      mainFlowers:      "Ivory and cream garden roses as the refined, soft centrepiece of the arrangement.",
      companionFlowers: "Soft peach roses and pale champagne spray roses adding gentle warmth and depth.",
      foliage:          "Silver eucalyptus and soft pittosporum for a light, elegant, neutral backdrop.",
      wrappingPaper:    "Warm butter-yellow and pale gold paper wrap — subtle and sophisticated without being loud.",
      ribbonOrVase:     "Ivory grosgrain ribbon with a neat, understated bow.",
    },
    perfectFor: ["Sophisticated birthday gifts", "Thank-you and appreciation presents", "Warm, neutral-aesthetic home decoration", "Formal and corporate gifting"],
    sold: 14, status: "Active",
  },

  {
    id: "p10", slug: "ivory-rose-grand-bouquet", name: "Ivory Rose Grand Bouquet",
    category: "Flower Bouquet", price: 520000, stock: 4, inStock: true, image: flower19,
    description: "A grand, full arrangement of premium ivory and cream roses — timeless, pure, and deeply impressive. Effortless luxury in every stem, every petal, and every carefully considered detail.",
    details: {
      mainFlowers:      "Premium ivory garden roses and large cream roses, selected for their full bloom and perfect petal form.",
      companionFlowers: "White lisianthus and ivory ranunculus adding layers of soft, tonal depth.",
      foliage:          "Dusty miller and silver eucalyptus giving the arrangement a cool, polished, refined finish.",
      wrappingPaper:    "Crisp white matte wrap with a satin inner lining — clean, luxurious, and minimal.",
      ribbonOrVase:     "Wide white satin ribbon, generously tied.",
    },
    perfectFor: ["Wedding-related gifts and events", "Premium farewell and retirement presents", "Sophisticated anniversary celebrations", "White and ivory aesthetic lovers"],
    sold: 11, status: "Active",
  },

  // ── HAND BOUQUET ──────────────────────────────────────────────────────────────

  {
    id: "p11", slug: "congratulatory-hand-bouquet", name: "Congratulatory Hand Bouquet",
    category: "Hand Bouquet", price: 240000, stock: 13, inStock: true, image: flower5,
    description: "A joyful, celebratory hand bouquet designed for life's proudest moments. White and pink blooms paired with a festive decorative sash make this the perfect bouquet to carry on graduation day or any major achievement.",
    details: {
      mainFlowers:      "White lilies and soft pink roses as the clean, celebratory focal blooms.",
      companionFlowers: "White alstroemeria and baby's breath filling the arrangement with a fresh, airy quality.",
      foliage:          "Clean ruscus and minimal greenery for a polished, ceremonial look.",
      wrappingPaper:    "White tissue paper wrapped in white kraft, neat and ceremony-appropriate.",
      ribbonOrVase:     'Decorative pink ribbon sash with personalised text option (e.g. "Congratulations", "Wisuda", custom name).',
    },
    perfectFor: ["Graduation ceremonies (wisuda)", "Academic and professional achievements", "Promotions and career milestones", "Any major life celebration"],
    sold: 42, status: "Active",
  },

  {
    id: "p12", slug: "pink-garden-hand-bouquet", name: "Pink Garden Hand Bouquet",
    category: "Hand Bouquet", price: 220000, stock: 16, inStock: true, image: flower11,
    description: "Fresh, full, and beautifully pink — this garden-style hand bouquet has an effortless, just-gathered-from-the-garden quality. Lush and abundant without being stiff, it feels as natural as it looks.",
    details: {
      mainFlowers:      "Full pink garden roses in mixed tones, generously clustered for a rounded, hand-held shape.",
      companionFlowers: "Pink spray roses and soft white flowers filling in the gaps for a dense, lush appearance.",
      foliage:          "Natural ruscus and garden leaves giving a fresh, organic, outdoor feel.",
      wrappingPaper:    "Soft green-toned or natural kraft paper wrapped loosely at the stems for a garden-picked aesthetic.",
      ribbonOrVase:     "Thin natural twine or soft satin ribbon in a simple single tie.",
    },
    perfectFor: ["Outdoor events and garden parties", "Natural and botanical aesthetic lovers", "Casual but thoughtful gifting", "Mother's Day and appreciation gifts"],
    sold: 19, status: "Active",
  },

  {
    id: "p13", slug: "rainbow-bloom-hand-bouquet", name: "Rainbow Bloom Hand Bouquet",
    category: "Hand Bouquet", price: 275000, stock: 8, inStock: true, image: flower12,
    description: "An exuberant, colourful celebration of floristry — pink gerbera, white chamomile, soft carnations, and more, all bundled together in a joyful, light-hearted arrangement. The happiest bouquet in the shop.",
    details: {
      mainFlowers:      "Large pink gerbera daisies as the bold, cheerful focal blooms of the arrangement.",
      companionFlowers: "White chamomile, soft pink carnations, and small coloured accent flowers for a rainbow-like variety.",
      foliage:          "Light asparagus fern and delicate bear grass for an airy, playful texture.",
      wrappingPaper:    "White sheer wrap gathered softly at the stems, letting the colourful blooms shine through.",
      ribbonOrVase:     "Pale pink satin ribbon wound down the stems with a small bow at the base.",
    },
    perfectFor: ["Birthday gifts (especially for children and teenagers)", "Colour and joy lovers", "Surprise visits and spontaneous gifting", "Anyone who needs a mood lift"],
    sold: 31, status: "Active",
  },

  {
    id: "p14", slug: "mauve-rose-hand-bouquet", name: "Mauve Rose Hand Bouquet",
    category: "Hand Bouquet", price: 310000, stock: 0, inStock: false, image: flower13,
    description: "Refined, understated, and quietly beautiful — this mauve and dusty pink rose bouquet is designed for those with an eye for sophisticated colour and elegant restraint.",
    details: {
      mainFlowers:      "Mauve and dusty rose garden roses in a soft, tonal rounded arrangement.",
      companionFlowers: "Blush white spray roses and pale waxflower softening the arrangement with gentle contrast.",
      foliage:          "Silver-grey pittosporum and soft eucalyptus for a muted, sophisticated colour scheme.",
      wrappingPaper:    "Dusty pink matte paper with a light tissue inner lining — restrained and refined.",
      ribbonOrVase:     "Soft pink satin ribbon with a full, feminine bow.",
    },
    perfectFor: ["Refined and muted aesthetic lovers", "Sophisticated birthday and anniversary gifts", "Bridal party gifts (bridesmaid, maid of honour)", "Those who prefer subtle elegance over bold colour"],
    sold: 13, status: "Active",
  },

  {
    id: "p15", slug: "soft-blossom-hand-bouquet", name: "Soft Blossom Hand Bouquet",
    category: "Hand Bouquet", price: 235000, stock: 14, inStock: true, image: flower16,
    description: "Gentle, soft, and utterly sweet — this hand bouquet combines soft pink gerbera, delicate alstroemeria, and white blooms into a tender arrangement that feels like a warm embrace in floral form.",
    details: {
      mainFlowers:      "Soft pink gerbera daisies as the gentle, open focal flowers of the arrangement.",
      companionFlowers: "Pink alstroemeria and white waxflower adding soft texture and delicate volume.",
      foliage:          "Baby's breath and clean ruscus for a light, airy, feminine finish.",
      wrappingPaper:    "Clean white paper wrapped neatly at the stems with a soft blush inner tissue lining.",
      ribbonOrVase:     "Soft pink satin ribbon tied in a clean, simple bow.",
    },
    perfectFor: ["Gentle and tender gestures of affection", "Baby showers and new arrival gifts", "Young girl birthdays and celebrations", "Sweet, understated gifting"],
    sold: 16, status: "Active",
  },

  // ── FLOWER VASE ───────────────────────────────────────────────────────────────

  {
    id: "p16", slug: "pink-amaryllis-vase", name: "Pink Amaryllis Vase",
    category: "Flower Vase", price: 380000, stock: 5, inStock: true, image: flower2,
    description: "Striking and architectural, this tall pink amaryllis vase arrangement commands every room it enters. The naturally dramatic form of the amaryllis needs no embellishment — just an elegant vase and space to breathe.",
    details: {
      mainFlowers:      "Three tall stems of deep pink amaryllis (hippeastrum) in various stages of bloom — open and budding.",
      companionFlowers: "No companion flowers — the amaryllis is the undeniable star and stands beautifully alone.",
      foliage:          "Long natural grass blades and minimal tropical leaf to support the architectural height of the arrangement.",
      wrappingPaper:    "Clear cylindrical glass vase (~30 cm) filled with water, letting the long green stems show through.",
      ribbonOrVase:     "Tall and vertical — three stems at slightly varying heights to create movement and visual interest.",
      arrangementStyle: "Tall and vertical — three stems at slightly varying heights to create movement and visual interest.",
    },
    perfectFor: ["Statement home or office decor", "Minimalist interior enthusiasts", "Long-lasting floral displays (amaryllis last 2-3 weeks)", "Anyone who appreciates dramatic, sculptural floristry"],
    sold: 11, status: "Active",
  },

  {
    id: "p17", slug: "elegant-mixed-vase", name: "Elegant Mixed Vase",
    category: "Flower Vase", price: 295000, stock: 7, inStock: true, image: flower8,
    description: "A compact, carefully composed vase arrangement with a refined, premium feel. Soft pink tones and elegant presentation make this the ideal piece for a desk, bedside table, or any space that deserves a touch of beauty.",
    details: {
      mainFlowers:      "Soft pink roses and blush garden roses as the quiet, elegant focal blooms.",
      companionFlowers: "White alstroemeria and pink waxflower adding soft texture without competing for attention.",
      foliage:          "Trimmed ruscus and minimal eucalyptus for a clean, polished finish.",
      wrappingPaper:    "Neutral-toned ceramic or glass vase, compact size (~15 cm) suitable for desk or bedside placement.",
      ribbonOrVase:     "Compact and rounded — a neat dome of soft colour designed to look beautiful from all angles.",
      arrangementStyle: "Compact and rounded — a neat dome of soft colour designed to look beautiful from all angles.",
    },
    perfectFor: ["Office and desk decoration", "Bedside and vanity table styling", "Understated, polished home gifting", "Compact spaces that need a floral touch"],
    sold: 16, status: "Active",
  },

  {
    id: "p18", slug: "garden-gerbera-vase", name: "Garden Gerbera Vase",
    category: "Flower Vase", price: 240000, stock: 9, inStock: true, image: flower14,
    description: "A joyful, colourful vase arrangement built around the open, cheerful face of the gerbera daisy. Yellow, pink, and chamomile-white blooms create a garden-in-a-vase effect that brightens any corner instantly.",
    details: {
      mainFlowers:      "Yellow gerbera and pink gerbera daisies as the open, cheerful centrepieces of the arrangement.",
      companionFlowers: "White chamomile, pink carnations, and small accent blooms filling the arrangement with garden variety.",
      foliage:          "Natural ruscus and ornamental grass giving a fresh, outdoor feel.",
      wrappingPaper:    "Wide-mouth white ceramic or clear glass vase to allow the blooms to spread naturally.",
      ribbonOrVase:     "Loose and open — blooms at varying heights for an effortless, freshly-cut-from-the-garden look.",
      arrangementStyle: "Loose and open — blooms at varying heights for an effortless, freshly-cut-from-the-garden look.",
    },
    perfectFor: ["Kitchen and dining table centrepieces", "Cheerful home gifting", "Bright and colourful interior styling", "Sunflower and daisy lovers"],
    sold: 8, status: "Active",
  },

  {
    id: "p19", slug: "bohemian-mix-vase", name: "Bohemian Mix Vase",
    category: "Flower Vase", price: 320000, stock: 0, inStock: false, image: flower15,
    description: "Fearless, expressive, and completely unique — this bold vase arrangement blends deep purples, orange gerbera, and eclectic mixed blooms into a statement piece that refuses to be ordinary.",
    details: {
      mainFlowers:      "Deep purple and lavender chrysanthemums or roses as the rich, moody focal blooms.",
      companionFlowers: "Orange and peach gerbera daisies creating a vivid colour contrast against the dark purple.",
      foliage:          "Dark olive and tropical leaves framing the arrangement with a lush, jungle-like quality.",
      wrappingPaper:    "Dark green or earthy terracotta ceramic vase complementing the bold, natural colour palette.",
      ribbonOrVase:     "Full and textured — blooms at different heights for a layered, eclectic, maximalist composition.",
      arrangementStyle: "Full and textured — blooms at different heights for a layered, eclectic, maximalist composition.",
    },
    perfectFor: ["Bold and unconventional interior decor", "Dark and moody aesthetic enthusiasts", "Statement gifting for artistic personalities", "Autumn and nature-inspired home styling"],
    sold: 13, status: "Active",
  },

  {
    id: "p20", slug: "soft-ivory-vase", name: "Soft Ivory Vase",
    category: "Flower Vase", price: 285000, stock: 12, inStock: true, image: flower20,
    description: "Pure, serene, and deeply calming — this soft ivory vase arrangement is the epitome of quiet luxury. Cream and white blooms with the lightest touch of greenery create a timeless, space-enhancing centrepiece.",
    details: {
      mainFlowers:      "Soft ivory garden roses and cream ranunculus as the gentle, luminous centrepiece.",
      companionFlowers: "White lisianthus and pale cream spray roses adding layered depth without disrupting the tonal harmony.",
      foliage:          "Minimal silver eucalyptus and a few stems of soft greenery to ground the all-white palette.",
      wrappingPaper:    "Clean white or frosted glass vase, keeping the entire arrangement in a cohesive ivory-white palette.",
      ribbonOrVase:     "Soft, rounded dome — all blooms close together for a full, cloud-like, immersive look.",
      arrangementStyle: "Soft, rounded dome — all blooms close together for a full, cloud-like, immersive look.",
    },
    perfectFor: ["Bridal and wedding decor", "Minimalist white and neutral interior styling", "Peaceful bedroom and living room ambience", "Premium gifting for those with a refined, soft aesthetic"],
    sold: 10, status: "Active",
  },

  // ── CUSTOM ORDER (permanent, locked) ─────────────────────────────────────────

  {
    id: "p21",
    slug: "custom-order",
    name: "Custom Order",
    category: "Custom Order",
    price: 0,
    priceDisplay: "Ask the Owner",
    stock: 999,
    inStock: true,
    isLocked: true,
    image: customProductImage,
    description:
      "Have something special in mind that goes beyond flowers? We bring your vision to life. From money bouquets and snack arrangements to themed gift sets and personalised keepsakes — if you can dream it, we can wrap it.",
    details: {},
    detailItems: [
      {
        label: "What Can Be Customised",
        value:
          "Almost anything — money bouquets, snack and food arrangements, skincare sets, accessories, plush toys, stationery, or a mix of flowers and personal items.",
      },
      {
        label: "How to Order",
        value:
          "Send us a message on WhatsApp or Instagram describing your idea, budget, and the occasion. We will get back to you with options and a quote.",
      },
      {
        label: "Timeline",
        value:
          "Custom orders require a minimum of 2-3 days notice. For complex or large arrangements, please allow up to 5 days.",
      },
      {
        label: "Pricing",
        value:
          "Price varies based on materials, complexity, and quantity. Contact the owner directly for a personalised quote.",
      },
      {
        label: "Packaging",
        value:
          "Wrapped in our signature Asari packaging — kraft paper, organza, or a custom wrap style based on your preference and the arrangement type.",
      },
    ],
    perfectFor: [
      "Graduation and wisuda gifts with a personal touch",
      "Creative and one-of-a-kind birthday surprises",
      "Money bouquets for financial milestones",
      "Anyone who wants something truly unique",
    ],
    sold: 0,
    status: "Active",
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
export type Review = {
  id: string;
  name: string;
  date: Date;
  text: string;
};

const REVIEW_TEXTS = [
  "Bunganya cantik banget, fresh dan rapi. Pengirimannya juga tepat waktu. Pasti order lagi!",
  "Pelayanannya ramah dan hasil bouquet-nya melebihi ekspektasi. Pacar saya sangat suka.",
  "Asari selalu jadi pilihan utama untuk bunga di Bandung. Selalu cantik dan tahan lama.",
  "Custom order untuk wedding kemarin hasilnya stunning. Highly recommended!",
  "Packaging-nya cantik, bunganya segar, dan pengirimannya cepat. Thank you Asari!",
  "Pesanan untuk kado ulang tahun mama. Beliau senang sekali. Terima kasih banyak.",
  "Hand bouquet-nya elegant banget. Cocok untuk acara graduation.",
  "Pastel dream box favorit aku. Warnanya soft dan bunganya berkualitas premium.",
];

const NAMES = [
  "Carla Mentari", "Rina Aulia", "Bagas Pratama", "Anonymous",
  "Sinta Dewi", "Anonymous", "Putri Maharani", "Dimas Saputra",
];

export const REVIEWS: Record<string, Review[]> = {};
const MONTH_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
MONTH_NUMS.forEach((m) => {
  const key = `2026-${String(m).padStart(2, "0")}`;
  REVIEWS[key] = Array.from({ length: 8 }, (_, i) => ({
    id: `${key}-${i}`,
    name: NAMES[i % NAMES.length],
    date: new Date(2026, m - 1, 5 + i * 2, 10, 0),
    text: REVIEW_TEXTS[i % REVIEW_TEXTS.length],
  }));
});

// ─── Orders ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "Pending"
  | "Dikonfirmasi"
  | "Diproses"
  | "Siap"
  | "Selesai"
  | "Dibatalkan";

export type Order = {
  id: string;
  customerName: string;
  whatsapp: string;
  productName: string;
  quantity: number;
  paperBag: number;
  request?: string;
  cardMessage?: string;
  pickupDate: string;
  pickupTime: string;
  method: "Ambil di Store" | "Diantar";
  address?: string;
  total: number;
  source: "WA" | "IG";
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
};

export const ORDERS: Order[] = [
  { id: "ORD-001", customerName: "Sinta Dewi",     whatsapp: "+6281234567890", productName: "Full Pink Rose Bouquet",       quantity: 1, paperBag: 1, pickupDate: "Sabtu, 30 Mei 2026",  pickupTime: "12:30", method: "Diantar",       address: "Jl. Antapani No. 42, Bandung", total: 332000, source: "WA", status: "Pending",       createdAt: new Date(2026, 4, 28) },
  { id: "ORD-002", customerName: "Rina Aulia",      whatsapp: "+6285678901234", productName: "Stargazer Lily Bouquet",       quantity: 1, paperBag: 1, pickupDate: "Minggu, 31 Mei 2026", pickupTime: "10:00", method: "Ambil di Store",                                          total: 422000, source: "IG", status: "Dikonfirmasi",  createdAt: new Date(2026, 4, 27) },
  { id: "ORD-003", customerName: "Bagas Pratama",   whatsapp: "+6289012345678", productName: "Ivory Rose Grand Bouquet",     quantity: 1, paperBag: 0, pickupDate: "Senin, 1 Juni 2026",  pickupTime: "14:00", method: "Diantar",       address: "Hotel Padma, Bandung",         total: 520000, source: "WA", status: "Diproses",      createdAt: new Date(2026, 4, 26) },
  { id: "ORD-004", customerName: "Putri Maharani",  whatsapp: "+6287812345678", productName: "Congratulatory Hand Bouquet", quantity: 2, paperBag: 0, pickupDate: "Sabtu, 30 Mei 2026",  pickupTime: "16:00", method: "Ambil di Store",                                          total: 480000, source: "WA", status: "Siap",          createdAt: new Date(2026, 4, 29) },
  { id: "ORD-005", customerName: "Dimas Saputra",   whatsapp: "+6281298765432", productName: "Pink Amaryllis Vase",          quantity: 1, paperBag: 1, pickupDate: "Jumat, 29 Mei 2026",  pickupTime: "11:00", method: "Diantar",       address: "Jl. Riau No. 10, Bandung",     total: 382000, source: "IG", status: "Selesai",       createdAt: new Date(2026, 4, 25) },
  { id: "ORD-006", customerName: "Carla Mentari",   whatsapp: "+6282345678901", productName: "Rainbow Bloom Hand Bouquet",  quantity: 1, paperBag: 1, pickupDate: "Minggu, 31 Mei 2026", pickupTime: "13:30", method: "Ambil di Store",                                          total: 277000, source: "WA", status: "Pending",       createdAt: new Date(2026, 4, 29) },
  { id: "ORD-007", customerName: "Andini Permata",  whatsapp: "+6285511223344", productName: "Dreamy Pink Bouquet",          quantity: 2, paperBag: 2, pickupDate: "Senin, 1 Juni 2026",  pickupTime: "09:00", method: "Diantar",       address: "Jl. Cihampelas No. 25",        total: 564000, source: "WA", status: "Dikonfirmasi",  createdAt: new Date(2026, 4, 28) },
  { id: "ORD-008", customerName: "Reza Mahendra",   whatsapp: "+6281122334455", productName: "Sunny Mix Bouquet",            quantity: 1, paperBag: 0, pickupDate: "Sabtu, 30 Mei 2026",  pickupTime: "15:00", method: "Ambil di Store",                                          total: 277000, source: "IG", status: "Diproses",      createdAt: new Date(2026, 4, 28) },
  { id: "ORD-009", customerName: "Tania Sari",      whatsapp: "+6287799887766", productName: "Soft Ivory Vase",              quantity: 1, paperBag: 1, pickupDate: "Minggu, 31 Mei 2026", pickupTime: "17:00", method: "Diantar",       address: "Setrasari Mall area",           total: 287000, source: "WA", status: "Selesai",       createdAt: new Date(2026, 4, 24) },
  { id: "ORD-010", customerName: "Hadi Wijaya",     whatsapp: "+6281999888777", productName: "Spring Tulip Series",          quantity: 1, paperBag: 0, pickupDate: "Sabtu, 30 Mei 2026",  pickupTime: "11:30", method: "Ambil di Store",                                          total: 197000, source: "WA", status: "Dibatalkan",    createdAt: new Date(2026, 4, 27) },
];

// ─── Sales chart helper ───────────────────────────────────────────────────────
export function generateSalesData(year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const seed = year * 100 + month;
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const x = Math.sin(seed + day) * 10000;
    const noise = x - Math.floor(x);
    const base = 120000 + noise * 180000;
    return { day, revenue: Math.round(base) };
  });
}
