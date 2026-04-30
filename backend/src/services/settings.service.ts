import { prisma } from "../lib/prisma.js";

const DEFAULT_ID = "default";

export async function getSiteSettings() {
  let row = await prisma.siteSettings.findUnique({ where: { id: DEFAULT_ID } });
  if (!row) {
    row = await prisma.siteSettings.create({
      data: {
        id: DEFAULT_ID,
        siteName: "AW Naturals",
        siteUrl: "https://awnaturals.com",
        tagline: "Nature's Best, For You",
      },
    });
  }
  return {
    siteName: row.siteName,
    siteUrl: row.siteUrl,
    logo: row.logo,
    tagline: row.tagline,
    socialLinks: {
      instagram: row.instagram,
      facebook: row.facebook,
      twitter: row.twitter,
      youtube: row.youtube,
    },
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function updateSiteSettings(data: {
  siteName?: string;
  siteUrl?: string;
  logo?: string;
  tagline?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
}) {
  const social = data.socialLinks;
  const row = await prisma.siteSettings.upsert({
    where: { id: DEFAULT_ID },
    create: {
      id: DEFAULT_ID,
      siteName: data.siteName ?? "AW Naturals",
      siteUrl: data.siteUrl ?? "https://awnaturals.com",
      logo: data.logo ?? "",
      tagline: data.tagline ?? "",
      instagram: social?.instagram ?? "",
      facebook: social?.facebook ?? "",
      twitter: social?.twitter ?? "",
      youtube: social?.youtube ?? "",
    },
    update: {
      ...(data.siteName != null ? { siteName: data.siteName } : {}),
      ...(data.siteUrl != null ? { siteUrl: data.siteUrl } : {}),
      ...(data.logo != null ? { logo: data.logo } : {}),
      ...(data.tagline != null ? { tagline: data.tagline } : {}),
      ...(social?.instagram != null ? { instagram: social.instagram } : {}),
      ...(social?.facebook != null ? { facebook: social.facebook } : {}),
      ...(social?.twitter != null ? { twitter: social.twitter } : {}),
      ...(social?.youtube != null ? { youtube: social.youtube } : {}),
    },
  });
  return {
    siteName: row.siteName,
    siteUrl: row.siteUrl,
    logo: row.logo,
    tagline: row.tagline,
    socialLinks: {
      instagram: row.instagram,
      facebook: row.facebook,
      twitter: row.twitter,
      youtube: row.youtube,
    },
    updatedAt: row.updatedAt.toISOString(),
  };
}
