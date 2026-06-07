import { PrismaClient, ProductStatus, BlogStatus, OrderStatus } from "@prisma/client";
import {
  BLOG_ARTICLE_1_CONTENT,
  BLOG_ARTICLE_1_COVER,
  BLOG_ARTICLE_2_CONTENT,
  BLOG_ARTICLE_2_COVER,
} from "./seedBlogArticles.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.product.deleteMany();

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      siteName: "AW Naturals",
      siteUrl: "https://awnaturals.com",
      tagline: "Nature's Best, For You",
      instagram: "https://instagram.com/awnaturals",
      facebook: "https://facebook.com/awnaturals",
      twitter: "https://twitter.com/awnaturals",
    },
    update: {},
  });

  /**
   * Full catalog (single row per id — re-seed clears duplicates):
   * - prod_001–004: original four clinical teas (active)
   * - prod_005–006: Herbal infusion + The Bar (active)
   * - prod_007, prod_009: upcoming oral care rituals
   * - prod_008: upcoming night ritual (foot massage oil)
   */
  const cloud = (path: string) =>
    `https://res.cloudinary.com/dfucsfgbs/image/upload/q_auto/f_auto/${path}`;

  const pMarigold = await prisma.product.create({
    data: {
      id: "prod_001",
      name: "Marigold Premium",
      description: "High antioxidant herbal tea for daily energy.",
      benefit: "Vibrant Energy",
      price: 499,
      category: "Herbal Tea",
      stock: 100,
      status: ProductStatus.active,
      images: [cloud("v1775279433/Gemini_Generated_Image_3xcqfu3xcqfu3xcq_l6v0kv.png")],
      ingredientsPoints: ["Marigold", "Rose petals", "Yasthimadhu", "Peppermint", "Cardamom"],
    },
  });
  const pChamomile = await prisma.product.create({
    data: {
      id: "prod_002",
      name: "Chamomile Bliss",
      description: "Calming herbal tea for deep sleep.",
      benefit: "Deep Sleep",
      price: 549,
      category: "Herbal Tea",
      stock: 80,
      status: ProductStatus.active,
      images: [cloud("v1775279469/Gemini_Generated_Image_vrcv19vrcv19vrcv_m3edll.png")],
      ingredientsPoints: ["Chamomile flowers", "Rose petals"],
    },
  });
  await prisma.product.create({
    data: {
      id: "prod_003",
      name: "Blue Pea Zen",
      description: "Herbal tea for mental clarity and focus.",
      benefit: "Mental Clarity",
      price: 529,
      category: "Herbal Tea",
      stock: 90,
      status: ProductStatus.active,
      images: [cloud("v1775279413/Gemini_Generated_Image_4vlqbr4vlqbr4vlq_r10uqb.png")],
      ingredientsPoints: ["Blue pea flowers", "Lemon peel"],
    },
  });
  const pGinger = await prisma.product.create({
    data: {
      id: "prod_004",
      name: "Ginger & Berberis",
      description: "Herbal blend for metabolism and digestion.",
      benefit: "Metabolic Balance",
      price: 599,
      category: "Herbal Tea",
      stock: 70,
      status: ProductStatus.active,
      images: [cloud("v1775279429/Gemini_Generated_Image_2g2s0p2g2s0p2g2s_kxh2xu.png")],
      ingredientsPoints: ["Ginger", "Berberis"],
    },
  });
  await prisma.product.create({
    data: {
      id: "prod_005",
      name: "Herbal infusion",
      description:
        "A curated botanical infusion for calm focus and gentle daily hydration — whole-leaf herbs, slow-steeped character.",
      benefit: "Daily Ritual",
      price: 449,
      category: "Herbal Tea",
      stock: 120,
      status: ProductStatus.active,
      images: [
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80",
      ],
    },
  });
  await prisma.product.create({
    data: {
      id: "prod_006",
      name: "The Bar | Botanical Face Bar",
      description: "Luxurious botanical face bar for daily glow and balanced cleansing.",
      benefit: "Skin Radiance",
      price: 599,
      category: "Botanical Skincare",
      stock: 50,
      status: ProductStatus.active,
      images: ["https://images.unsplash.com/photo-1556228578-8c89e565adf0?auto=format&fit=crop&w=800&q=80"],
    },
  });

  await prisma.product.create({
    data: {
      id: "prod_007",
      name: "The SENCES | Oil pulling oil",
      description:
        "Ayurvedic oil-pulling blend for the classical kavala ritual — fresh mouth feel and gum comfort with cold-pressed botanical oils.",
      benefit: "Oral Ritual Care",
      price: 449,
      category: "Oral Care Line",
      stock: 0,
      status: ProductStatus.upcoming,
      images: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      ],
    },
  });
  await prisma.product.create({
    data: {
      id: "prod_008",
      name: "THE RELEASE | Foot massage oil",
      description:
        "Warming botanical massage oil for feet and calves — unwind tension after long days with a silky, non-greasy glide.",
      benefit: "Rest & Recovery",
      price: 549,
      category: "Night Ritual Line",
      stock: 0,
      status: ProductStatus.upcoming,
      images: [
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
      ],
    },
  });
  await prisma.product.create({
    data: {
      id: "prod_009",
      name: "THE IMMUNITY | Gooseberry",
      description:
        "Whole-gooseberry (amla) forward formulation for antioxidant-rich immune terrain support — seasonal resilience, daily defense.",
      benefit: "Immune Terrain",
      price: 549,
      category: "Oral Care Line",
      stock: 0,
      status: ProductStatus.upcoming,
      images: [
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
      ],
    },
  });

  await prisma.blog.createMany({
    data: [
      {
        title: "The Universal Mirror: How the World Outside Shapes the Cells Within",
        slug: "universal-mirror-world-outside-shapes-cells-within",
        author: "AW Naturals Editorial",
        category: "Science",
        coverImage: BLOG_ARTICLE_1_COVER,
        content: BLOG_ARTICLE_1_CONTENT,
        seoTitle:
          "Universal Mirror: Ayurveda, Quantum Coherence & Panchakarma | AW Naturals Science",
        seoDescription:
          "Padarth Vigyan meets modern physics—Lok-Purush Samyata, Srotas as information highways, and Panchakarma as coherence reset.",
        status: BlogStatus.published,
      },
      {
        title: "The Architecture of Vitality: Designing Your Ideal Lifestyle Through Ayurveda",
        slug: "architecture-of-vitality-ayurvedic-lifestyle",
        author: "AW Naturals Editorial",
        category: "Wellness",
        coverImage: BLOG_ARTICLE_2_COVER,
        content: BLOG_ARTICLE_2_CONTENT,
        seoTitle:
          "Architecture of Vitality: Dinacharya, Ritucharya & Agni | AW Naturals",
        seoDescription:
          "Blueprint your days and seasons—Dinacharya, Ritucharya, Ratricharya, Agni, and Sadvritta with chronobiology and physiology.",
        status: BlogStatus.published,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        quote:
          "The Chamomile Bliss has completely transformed my sleep quality. I wake up feeling genuinely refreshed for the first time in years.",
        authorName: "Sarah Mitchell",
        authorTitle: "Marketing Executive",
        published: true,
        sortOrder: 10,
      },
      {
        quote:
          "As a nutritionist, I'm impressed by the clinical formulation. The Blue Pea Zen is now part of my daily routine for sustained cognitive focus.",
        authorName: "Dr. James Chen",
        authorTitle: "Clinical Nutritionist",
        published: true,
        sortOrder: 20,
      },
      {
        quote:
          "The attention to ingredient quality and sourcing is remarkable. You can truly experience the difference in clinical efficacy.",
        authorName: "Priya Sharma",
        authorTitle: "Holistic Wellness Coach",
        published: true,
        sortOrder: 30,
      },
      {
        quote:
          "I've tried countless herbal blends, but nothing matches the precise calibration here. The Day-to-Night ritual is my ultimate stress protocol.",
        authorName: "Elena Rodriguez",
        authorTitle: "Senior Product Designer",
        published: true,
        sortOrder: 40,
      },
      {
        quote:
          "My digestion feels completely reset. The Ginger & Berberis formula is an absolute gamechanger for gut inflammation.",
        authorName: "Marcus Thorne",
        authorTitle: "Distance Runner",
        published: true,
        sortOrder: 50,
      },
      {
        quote:
          "Every step feels so premium. You can literally taste the difference that clinical Ayurvedic formulation makes to the botanical profile.",
        authorName: "Dr. Aisha Patel",
        authorTitle: "Ayurvedic Practitioner",
        published: true,
        sortOrder: 60,
      },
    ],
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-001",
      customerName: "Priya Sharma",
      email: "priya@example.com",
      phone: "9876543210",
      address: "42 MG Road, Bengaluru",
      city: "Bengaluru",
      pincode: "560001",
      total: 998,
      status: OrderStatus.delivered,
      paymentMethod: "UPI",
      items: {
        create: [
          {
            productId: pMarigold.id,
            productName: pMarigold.name,
            quantity: 2,
            price: 499,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "ORD-002",
      customerName: "Rahul Mehta",
      email: "rahul@example.com",
      phone: "9123456780",
      address: "15 Linking Road, Mumbai",
      city: "Mumbai",
      pincode: "400050",
      total: 1697,
      status: OrderStatus.shipped,
      paymentMethod: "Credit Card",
      items: {
        create: [
          { productId: pChamomile.id, productName: pChamomile.name, quantity: 2, price: 549 },
          { productId: pGinger.id, productName: pGinger.name, quantity: 1, price: 599 },
        ],
      },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
