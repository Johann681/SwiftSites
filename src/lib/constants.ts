import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiTypescript,
  SiRedux,
  SiExpress,
  SiPrisma,
  SiGraphql,
  SiFramer,
} from "react-icons/si";

export const frameworks = [
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Tailwind CSS", Icon: SiTailwindcss },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Redux", Icon: SiRedux },
  { name: "Express", Icon: SiExpress },
  { name: "Prisma", Icon: SiPrisma },
  { name: "GraphQL", Icon: SiGraphql },
  { name: "Framer Motion", Icon: SiFramer },
];
import { Shield, Rocket, Palette, Cloud } from "lucide-react";

export const features = [
  {
    title: "Launch Fast",
    description: "Get production-ready sites live in record time.",
    icon: Rocket,
    size: "col-span-2 row-span-1",
  },
  {
    title: "Bank-Level Security",
    description: "Your data stays safe with enterprise encryption.",
    icon: Shield,
    size: "col-span-1 row-span-1",
  },
  {
    title: "Design Freedom",
    description: "Templates that feel custom — tailored to you.",
    icon: Palette,
    size: "col-span-1 row-span-1",
  },
  {
    title: "Cloud Scale",
    description: "Scale instantly, no DevOps stress required.",
    icon: Cloud,
    size: "col-span-2 row-span-1",
  },
];

export const templates = [
  {
    name: "Portfolio",
    description: "Showcase your work with a sleek and modern design.",
    image: "/screenshot1.png",
  },
  {
    name: "Creative Agency",
    description: "Highlight services and case studies with style.",
    image: "/screenshot2.png",
  },
  {
    name: "E-commerce",
    description: "Boost sales with a fast and user-friendly storefront.",
    image: "/screenshot3.png",
  },
];

export const plans = [
  {
    name: "Starter Site",
    monthly: 49,
    yearly: 390,
    features: [
      "1 fully designed website",
      "Responsive & mobile-ready",
      "Basic SEO setup",
      "1 round of revisions",
      "Email support",
    ],
    action: "Get Started",
    popular: false,
  },
  {
    name: "Business Pro",
    monthly: 99,
    yearly: 890,
    features: [
      "Up to 5 custom websites/pages",
      "Advanced SEO optimization",
      "Custom branding & design",
      "Ongoing updates & revisions",
      "Priority chat + email support",
      "Blog setup & CMS integration",
    ],
    action: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise Growth",
    monthly: null,
    yearly: null,
    features: [
      "Unlimited websites & pages",
      "Dedicated design team",
      "E-commerce functionality",
      "Custom integrations (CRM, APIs, etc.)",
      "Performance monitoring & reporting",
      "24/7 priority support",
      "Strategy consulting",
    ],
    action: "Contact Sales",
    popular: false,
  },
];

// -------------------------------
// File: lib/constants.ts (left unchanged but included here for completeness in the canvas)
// -------------------------------

export type Service = {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  popular?: boolean;
  blurb?: string;
  features: string[];
  tags?: string[];
  monthly?: number | null;
  yearly?: number | null;
  action?: string;
  actionHref?: string;
  iconName?: string;
  order?: number;
  meta?: Record<string, any>;
};

export const services: Service[] = [
  {
    id: "wp-business",
    name: "WordPress Business Site",
    slug: "wordpress-business",
    category: "wordpress",
    popular: false,
    blurb: "Conversion-focused websites for service businesses and agencies.",
    features: [
      "Custom responsive theme",
      "Contact & lead capture forms",
      "SEO-friendly structure",
      "Speed & basic performance tuning",
    ],
    tags: ["wordpress", "business", "seo"],
    monthly: null,
    yearly: null,
    action: "Request a Quote",
    actionHref: "/contact?service=wordpress-business",
    iconName: "briefcase",
    order: 10,
  },

  {
    id: "woo-store",
    name: "WooCommerce Store",
    slug: "woocommerce-store",
    category: "ecommerce",
    popular: true,
    blurb: "Full e-commerce with payments, shipping and product management.",
    features: [
      "Product & variant setup",
      "Payment gateway integration",
      "Inventory & order workflows",
      "Product SEO & analytics",
    ],
    tags: ["woocommerce", "ecommerce", "payments"],
    monthly: null,
    yearly: null,
    action: "Start a Store",
    actionHref: "/contact?service=woocommerce-store",
    iconName: "shopping-cart",
    order: 20,
  },

  {
    id: "school-cbt",
    name: "School Website + CBT",
    slug: "school-website-cbt",
    category: "education",
    popular: false,
    blurb:
      "A full school portal: public site, admin dashboard, student portal, and CBT (computer-based testing).",
    features: [
      "Public school site & admissions pages",
      "Student registration & payments",
      "CBT module: timed exams, question banks, proctoring options",
      "Result portal & downloadable reports",
      "Teacher/admin dashboard & user roles",
    ],
    tags: ["school", "cbt", "lms", "admissions"],
    monthly: null,
    yearly: null,
    action: "Discuss School Project",
    actionHref: "/contact?service=school-website-cbt",
    iconName: "school",
    order: 30,
    meta: {
      supportsProctoring: true,
      maxConcurrentTests: 1000,
    },
  },

  {
    id: "membership-lms",
    name: "Membership & LMS (WordPress)",
    slug: "membership-lms",
    category: "education",
    popular: false,
    blurb:
      "Paid memberships, gated content, or course delivery with user progress tracking.",
    features: [
      "Member roles & protected content",
      "Payment & recurring billing integration",
      "Course/Curriculum setup & progress tracking",
      "Certificates & downloads",
    ],
    tags: ["lms", "memberships", "courses"],
    action: "Discuss Memberships",
    actionHref: "/contact?service=membership-lms",
    order: 40,
  },

  {
    id: "migration-speed-security",
    name: "Migration, Speed & Security",
    slug: "migration-speed-security",
    category: "maintenance",
    popular: false,
    blurb:
      "Migrate, speed up and secure your site with backups and monitoring.",
    features: [
      "Site migration & DNS setup",
      "Performance optimization & caching",
      "Daily backups & one-click restore",
      "Security hardening & malware scans",
    ],
    tags: ["migration", "performance", "security"],
    action: "Get Protected",
    actionHref: "/contact?service=migration-speed-security",
    order: 50,
  },
];
