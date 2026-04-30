/**
 * Replace all Blog rows with the two flagship articles only.
 * Does not touch products, orders, or testimonials.
 *
 *   npx tsx scripts/seed-blogs.ts
 */
import { PrismaClient, BlogStatus } from "@prisma/client";
import {
  BLOG_ARTICLE_1_CONTENT,
  BLOG_ARTICLE_1_COVER,
  BLOG_ARTICLE_2_CONTENT,
  BLOG_ARTICLE_2_COVER,
} from "../prisma/seedBlogArticles.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.blog.deleteMany();
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
  console.log("Blog table replaced with 2 flagship articles.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
