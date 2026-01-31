// import { PrismaClient } from "../../src/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";
// import "dotenv/config";

// // Setup the Driver Adapter for Prisma 7
// const { Pool } = pg;
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// const adapter = new PrismaPg(pool);

// const prisma = new PrismaClient({ adapter });

import { prisma } from "../../src/lib/schema";

async function main() {
  console.log("🌱 Seeding categories...");

  const categories = [
    {
      name: "Development",
      slug: "development",
      seoTitle: "Learn Software Development",
      seoDescription:
        "Master programming languages, web apps, and software engineering.",
      seoKeywords:
        "development, programming, coding, web development, software",
      metaImage: "https://example.com/images/development.jpg",
    },
    {
      name: "Business",
      slug: "business",
      seoTitle: "Business and Entrepreneurship Courses",
      seoDescription:
        "Learn management, leadership, and business strategy skills.",
      seoKeywords:
        "business, management, leadership, entrepreneurship, marketing",
      metaImage: "https://example.com/images/business.jpg",
    },
    {
      name: "Finance & Accounting",
      slug: "finance-accounting",
      seoTitle: "Finance and Accounting Skills",
      seoDescription: "Learn investment, bookkeeping, and financial analysis.",
      seoKeywords:
        "finance, accounting, investment, stock market, financial analysis",
      metaImage: "https://example.com/images/finance.jpg",
    },
    {
      name: "IT & Software",
      slug: "it-software",
      seoTitle: "IT and Software Courses",
      seoDescription:
        "Build your IT skills: networking, cloud computing, and cybersecurity.",
      seoKeywords: "it, software, networking, cybersecurity, cloud computing",
      metaImage: "https://example.com/images/it-software.jpg",
    },
    {
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      seoTitle: "Learn Artificial Intelligence",
      seoDescription:
        "Master AI concepts, machine learning, deep learning, and neural networks.",
      seoKeywords:
        "artificial intelligence, ai, machine learning, deep learning, neural networks",
      metaImage: "https://example.com/images/artificial-intelligence.jpg",
    },
    {
      name: "Design",
      slug: "design",
      seoTitle: "Graphic and UI/UX Design",
      seoDescription:
        "Learn design principles, tools, and user experience design.",
      seoKeywords: "design, ui, ux, graphic design, figma, adobe",
      metaImage: "https://example.com/images/design.jpg",
    },
    {
      name: "Marketing",
      slug: "marketing",
      seoTitle: "Marketing and Digital Advertising",
      seoDescription:
        "Learn SEO, social media marketing, and content strategy.",
      seoKeywords:
        "marketing, seo, social media, advertising, content strategy",
      metaImage: "https://example.com/images/marketing.jpg",
    },
    {
      name: "Personal Development",
      slug: "personal-development",
      seoTitle: "Personal Growth and Productivity",
      seoDescription:
        "Improve confidence, communication, and productivity skills.",
      seoKeywords:
        "personal development, motivation, productivity, communication",
      metaImage: "https://example.com/images/personal-development.jpg",
    },
    {
      name: "Photography & Video",
      slug: "photography-video",
      seoTitle: "Photography and Video Production",
      seoDescription:
        "Master photography, videography, and post-production editing.",
      seoKeywords: "photography, video, filmmaking, editing, camera",
      metaImage: "https://example.com/images/photography.jpg",
    },
    {
      name: "Health & Fitness",
      slug: "health-fitness",
      seoTitle: "Health and Fitness Courses",
      seoDescription: "Learn wellness, nutrition, and exercise training.",
      seoKeywords: "fitness, health, nutrition, yoga, workout",
      metaImage: "https://example.com/images/fitness.jpg",
    },
    {
      name: "Music",
      slug: "music",
      seoTitle: "Music and Instruments",
      seoDescription: "Learn instruments, music production, and theory.",
      seoKeywords: "music, guitar, piano, production, theory",
      metaImage: "https://example.com/images/music.jpg",
    },
    {
      name: "Teaching & Academics",
      slug: "teaching-academics",
      seoTitle: "Teaching and Academic Courses",
      seoDescription:
        "Learn educational methods, pedagogy, and tutoring techniques.",
      seoKeywords: "teaching, academics, education, tutoring, learning",
      metaImage: "https://example.com/images/academics.jpg",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
