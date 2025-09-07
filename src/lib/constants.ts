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
