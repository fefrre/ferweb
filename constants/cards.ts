// constants/cards.ts
import { CardType } from '../types';

export const cards: readonly CardType[] = [
  {
    id: "basico",
    title: "Starter Pack",
    price: "$2,500 - $3,000 MXN",
    features: [
      "Landing page responsive",
      "Formulario de contacto funcional",
      "Hosting básico y dominio incluido",
      "SEO básico optimizado",
      "Soporte inicial",
    ] as const,
    bgColor: "bg-gradient-to-br from-blue-500 to-cyan-400",
    tech: ["Next.js", "Tailwind CSS", "Vercel"] as const,
    icon: "💻",
    isCustom: false,
  },
  {
    id: "intermedio",
    title: "Business Pack",
    price: "$4,000 - $5,000 MXN",
    features: [
      "Landing + Blog o Sección dinámica",
      "Panel de administración básico con Supabase",
      "Integración con redes sociales",
      "Analítica básica con Google Analytics",
      "Soporte extendido",
    ] as const,
    bgColor: "bg-gradient-to-br from-purple-600 to-indigo-500",
    tech: ["Next.js", "Tailwind CSS", "Supabase", "TypeScript"] as const,
    icon: "🚀",
    highlight: true,
    isCustom: false,
  },
  {
    id: "completo",
    title: "Enterprise Pack",
    price: "$6,000 - $8,000 MXN",
    features: [
      "Web app completa con autenticación",
      "Base de datos y backend con Supabase",
      "Panel administrativo avanzado",
      "Integración de pagos con Stripe",
      "Soporte 24/7 y mantenimiento",
    ] as const,
    bgColor: "bg-gradient-to-br from-rose-600 to-pink-500",
    tech: ["Next.js", "Tailwind CSS", "Supabase", "TypeScript", "Stripe"] as const,
    icon: "🔥",
    isCustom: false,
  },
  {
    id: "personalizado",
    title: "Solución Personalizada",
    bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
    icon: "✨",
    isCustom: true,
  },
] as const;