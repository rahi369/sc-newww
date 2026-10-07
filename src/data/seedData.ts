import { Product, QuizQuestion, StoreSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-w-01',
    name: 'Embroidered Georgette Anarkali Suit',
    category: 'Women',
    price: 3450,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Exquisite hand-finished georgette fabric featuring intricate gold zari threadwork, matching dupattas with scalloped borders, and comfortable inner lining. Perfect for weddings and celebrations.',
    stock: 14,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Emerald Green', 'Royal Navy', 'Ruby Maroon'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-w-02',
    name: 'Royal Mulberry Silk Party Kurti Set',
    category: 'Women',
    price: 2650,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pure Mulberry blend silk featuring floral motif neckline, paired with tailored straight cigarette pants and a delicate organza dupatta.',
    stock: 9,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Champagne Gold', 'Blush Rose', 'Mint Sage'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-w-03',
    name: 'Handcrafted Muslin Floral Maxi Dress',
    category: 'Women',
    price: 2250,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Breathable authentic Dhakai muslin cotton fabric, soft flared tier cut, long sleeves with elasticated ruffled cuffs. Elegant modest summer drape.',
    stock: 18,
    sizes: ['Free Size', 'M', 'L'],
    colors: ['Ivory Floral', 'Pastel Lilac', 'Powder Blue'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-w-04',
    name: 'Festive Velvet Shawl Salwar Kameez',
    category: 'Women',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rich micro-velvet heavy embroidered shawl paired with premium cotton satin long tunic and tailored trousers. True regal boutique styling.',
    stock: 6,
    sizes: ['M', 'L', 'XL'],
    colors: ['Deep Plum', 'Midnight Black', 'Burgundy'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-w-05',
    name: 'Pure Cotton Daily Elegance Three-Piece',
    category: 'Women',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: '100% combed cotton print kameez with hand-embellished mirror accents, matching soft cotton orna, and comfortable salwar bottom.',
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Mustard Ochre', 'Sky Cyan', 'Dusty Peach'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-m-01',
    name: 'Egyptian Cotton Semi-Formal Panjabi',
    category: 'Boys/Men',
    price: 2450,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'High thread count Egyptian cotton panjabi tailored with geometric placket stitching, Mandarin collar, and engraved metallic snap buttons.',
    stock: 20,
    sizes: ['40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colors: ['Crisp White', 'Soft Charcoal', 'Navy Blue'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-m-02',
    name: 'Royal Embroidered Silk Festive Panjabi',
    category: 'Boys/Men',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heritage raw silk panjabi with fine threadwork along collar, chest, and cuffs. An outstanding choice for Eid, weddings, and formal occasions.',
    stock: 12,
    sizes: ['40 (M)', '42 (L)', '44 (XL)'],
    colors: ['Golden Beige', 'Midnight Teal', 'Maroon'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-m-03',
    name: 'Classic Tailored Linen Kurta',
    category: 'Boys/Men',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Breathable pure European linen short kurta with chest pocket and mother-of-pearl buttons. Pairs seamlessly with denim or traditional pajama.',
    stock: 16,
    sizes: ['M', 'L', 'XL'],
    colors: ['Olive Drab', 'Natural Linen', 'Deep Indigo'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-m-04',
    name: 'Executive Formal Tailored Trousers',
    category: 'Boys/Men',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Wrinkle-resistant poly-viscose blend tailored slim-fit trousers with flexi-waistband, double welt pockets, and refined structure.',
    stock: 22,
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Classic Charcoal', 'Dark Navy', 'Jet Black'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-m-05',
    name: 'Boys Luxury Festive Jacquard Panjabi Set',
    category: 'Boys/Men',
    price: 1950,
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Self-textured jacquard fabric with delicate matching embroidery, accompanied by an elasticated comfortable cotton pajama. Specially tailored for young boys.',
    stock: 15,
    sizes: ['24 (Age 4-5)', '28 (Age 6-7)', '32 (Age 8-10)', '36 (Age 11-13)'],
    colors: ['Royal Blue', 'Champagne Pearl', 'Ruby Wine'],
    status: 'in_stock',
    visibility: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-q-01',
    question: 'In garment production and fabric accounting, what does "GSM" specifically measure?',
    options: [
      'Grams per Square Meter — reflecting the fabric weight and density',
      'Gauge Size Measurement — needle thickness in knitting machines',
      'Graded Stitch Margin — fabric seam strength per linear inch',
      'Gloss & Sheen Metric — fabric surface reflection index'
    ],
    correctAnswer: 0,
    explanation: 'GSM stands for Grams per Square Meter. It is the international standard metric defining fabric weight, thickness, and material density.',
    active: true
  },
  {
    id: 'quiz-q-02',
    question: 'Why is pure Mulberry Silk considered the highest quality silk in premium luxury garments?',
    options: [
      'It is dyed before weaving rather than after printing',
      'Silkworms feed exclusively on white mulberry leaves, producing uniform, strong, and exceptionally smooth cylindrical fibers',
      'It is blended with Egyptian cotton to prevent shrinkage during laundering',
      'It requires zero tension during mechanized loom weaving'
    ],
    correctAnswer: 1,
    explanation: 'Mulberry silk is cultivated from Bombyx mori silkworms fed strictly on mulberry leaves, resulting in pure, round, uniform filaments with unrivaled luster.',
    active: true
  },
  {
    id: 'quiz-q-03',
    question: 'In traditional Bangladeshi heritage textile weaving, what distinct weaving technique characterizes authentic Jamdani muslin?',
    options: [
      'Jacquard computerized punch-card weaving',
      'Discontinuous weft technique where supplementary decorative threads are inserted entirely by hand with bamboo spools',
      'Acid-wash tie-and-dye block resist technique',
      'Double-ply mechanical power-loom twill warp weave'
    ],
    correctAnswer: 1,
    explanation: 'Jamdani is recognized by UNESCO as an Intangible Cultural Heritage of Humanity because its intricate geometric patterns are woven by hand using discontinuous supplementary weft threads.',
    active: true
  },
  {
    id: 'quiz-q-04',
    question: 'What is the key business reason why high-end fashion brands enforce strict inventory batch testing for "Color Fastness to Crock (Rubbing)"?',
    options: [
      'To verify that the fabric shrinks evenly when steamed',
      'To ensure garment dyes do not transfer onto skin, undergarments, or upholstery during dry and wet friction',
      'To certify thread tensile strength against tearing',
      'To assess whether metallic embroidery threads corrode over time'
    ],
    correctAnswer: 1,
    explanation: 'Color fastness to crocking evaluates resistance to color transfer during physical friction, protecting consumers from dye rub-off.',
    active: true
  },
  {
    id: 'quiz-q-05',
    question: 'In retail merchandising economics, what does the term "Sell-Through Rate (STR)" quantify?',
    options: [
      'The percentage of units sold relative to the amount of inventory received from suppliers during a specific period',
      'The average discount percentage required to clear dead stock',
      'The speed of parcel transit from Moulvibazar warehouse to customer doorstep',
      'The return on ad spend (ROAS) divided by customer acquisition cost'
    ],
    correctAnswer: 0,
    explanation: 'Sell-Through Rate measures the proportion of inventory sold versus inventory received, a vital efficiency metric for fashion stock turnover.',
    active: true
  },
  {
    id: 'quiz-q-06',
    question: 'What is "Mercerization" in the finishing process of premium cotton shirts and panjabis?',
    options: [
      'A chemical treatment using sodium hydroxide that enhances cotton luster, fiber strength, and dye affinity',
      'A mechanical shearing process that cuts off surface lint using hot ceramic blades',
      'A waterproofing silicone coating applied to prevent perspiration stains',
      'A chemical enzyme wash that artificially softens stiff denim seams'
    ],
    correctAnswer: 0,
    explanation: 'Mercerization swells cotton cellulose fibers, increasing luster, tear strength, dimensional stability, and dye absorption.',
    active: true
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  heroTagline: 'THE ART OF BESPOKE ELEGANCE',
  heroHeading: "Elegance Crafted For Women & Boys",
  heroDescription: "Curated premium fashion hand-selected by Md. Humaun Husen Rahi. Discover authentic luxury silks, embroidered festive collections, and tailored panjabis designed for discerning style.",
  announcementText: '🌟 Free gift with streak rewards! Delivery across Moulvibazar (৳50) and all Bangladesh (৳150).',
  ownerName: 'Md. Humaun Husen Rahi',
  whatsappNumber: '01834012069',
  paymentNumber: '01314652599'
};
