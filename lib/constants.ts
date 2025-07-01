// lib/constants.ts
export const projectTypes = [
  { value: "landing", label: "Página de presentación (Landing Page)", icon: "🖥️" },
  { value: "ecommerce", label: "Tienda en línea (E-commerce)", icon: "🛒" },
  { value: "webapp", label: "Aplicación Web", icon: "📱" },
  { value: "cms", label: "Sitio con CMS (Fácil de actualizar)", icon: "✏️" },
  { value: "redesign", label: "Rediseño de sitio existente", icon: "🎨" },
  { value: "other", label: "Otro tipo de proyecto", icon: "❓" },
] as const;

export const budgetOptions = [
  { value: "5-10k", label: "Básico ($5k-$10k MXN)", description: "Para proyectos simples o sitios informativos" },
  { value: "10-20k", label: "Estándar ($10k-$20k MXN)", description: "Sitios con funcionalidades medias" },
  { value: "20-50k", label: "Avanzado ($20k-$50k MXN)", description: "Sitios complejos o e-commerce" },
  { value: "50k+", label: "Empresarial ($50k+ MXN)", description: "Soluciones a medida para empresas" },
  { value: "unsure", label: "No estoy seguro", description: "Necesito asesoría para definir presupuesto" },
] as const;

export const hostingOptions = [
  { value: "", label: "No tengo preferencia", description: "Recomiéndenme la mejor opción" },
  { value: "shared", label: "Hosting compartido", description: "Económico para sitios pequeños" },
  { value: "vps", label: "VPS", description: "Para sitios medianos con más control" },
  { value: "cloud", label: "Cloud hosting", description: "Escalable y flexible" },
  { value: "managed", label: "Hosting gestionado", description: "Nos encargamos de todo por ti" },
  { value: "existing", label: "Ya tengo hosting", description: "Solo necesito el desarrollo" },
] as const;