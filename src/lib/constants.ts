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
  import { Shield, Rocket, Palette, Cloud } from "lucide-react"

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
]


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
]

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
