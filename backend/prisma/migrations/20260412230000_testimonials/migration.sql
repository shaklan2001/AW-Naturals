-- Testimonials for homepage carousel (admin-managed, published + sort order).

CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "quote" VARCHAR(400) NOT NULL,
    "authorName" VARCHAR(100) NOT NULL,
    "authorTitle" VARCHAR(120) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Testimonial_published_sortOrder_idx" ON "Testimonial"("published", "sortOrder");
