export type FounderProfile = {
    id: string;
    name: string;
    role: string;
    /** Set when a portrait asset is available — layout stays two-column with a branded placeholder if omitted */
    imageSrc?: string;
    initials: string;
    bio: readonly string[];
};

/**
 * Portrait paths: add files under `frontend/public/assets/founders/` and set `imageSrc`, e.g.
 * `imageSrc: '/assets/founders/dr-neil-rasal.webp'`
 */
export const ABOUT_FOUNDERS: readonly FounderProfile[] = [
    {
        id: 'neil-rasal',
        name: 'Dr. Neil Rasal',
        role: 'Founder & Director of Wellness',
        initials: 'NR',
        imageSrc: '/assets/founders/dr_neil.webp',
        bio: [
            'An MD in Ayurveda and specialist in Panchakarma with 16 years of expertise. Having managed over 15,000 clinical cases and established AW Naturals under Aayurshala Wellness Pvt Ltd, Dr. Rasal’s work is rooted in Ayurgenomics — the fusion of DNA-based health assessments with systemic cleansing. He leads the brand’s clinical strategy and “Phygital” healthcare integration.',
        ],
    },
    {
        id: 'kanika-tyagi',
        name: 'Kanika Tyagi',
        role: 'Co-Founder',
        initials: 'KT',
        imageSrc: '/assets/founders/dr_kanika.webp',
        bio: [
            'A seasoned veteran in the wellness industry, Kanika brings over 20 years of vast experience in nutrition and clinical practice. Her deep understanding of dietary science and functional health has been the driving force behind the brand’s global expansion into France, Dubai, Turkey, Japan, and Russia. She ensures that every AW Naturals product is nutritionally sound and capable of addressing the complex lifestyle needs of a global clientele.',
        ],
    },
] as const;
