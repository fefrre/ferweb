"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { SolicitudFormData, ProjectType, BudgetRange } from "../types";

// Constantes mejor organizadas
const projectTypes = [
  { value: "landing", label: "Página de presentación (Landing Page)", icon: "🖥️" },
  { value: "ecommerce", label: "Tienda en línea (E-commerce)", icon: "🛒" },
  { value: "webapp", label: "Aplicación Web", icon: "📱" },
  { value: "cms", label: "Sitio con CMS (Fácil de actualizar)", icon: "✏️" },
  { value: "redesign", label: "Rediseño de sitio existente", icon: "🎨" },
  { value: "other", label: "Otro tipo de proyecto", icon: "❓" },
] as const;

const budgetOptions = [
  { value: "5-10k", label: "Básico ($5k-$10k MXN)", description: "Para proyectos simples o sitios informativos" },
  { value: "10-20k", label: "Estándar ($10k-$20k MXN)", description: "Sitios con funcionalidades medias" },
  { value: "20-50k", label: "Avanzado ($20k-$50k MXN)", description: "Sitios complejos o e-commerce" },
  { value: "50k+", label: "Empresarial ($50k+ MXN)", description: "Soluciones a medida para empresas" },
  { value: "unsure", label: "No estoy seguro", description: "Necesito asesoría para definir presupuesto" },
] as const;

const featureOptions = [
  { value: "Diseño responsive", icon: "📱", category: "Básico" },
  { value: "Blog/Noticias", icon: "📰", category: "Contenido" },
  { value: "Formularios de contacto", icon: "✉️", category: "Básico" },
  { value: "Galería multimedia", icon: "🖼️", category: "Contenido" },
  { value: "Sistema de reservas/citas", icon: "🗓️", category: "Interacción" },
  { value: "Carrito de compras", icon: "🛍️", category: "E-commerce" },
  { value: "Sistema de membresías", icon: "🔑", category: "Usuarios" },
  { value: "Área de clientes", icon: "👤", category: "Usuarios" },
  { value: "Integración con redes sociales", icon: "📢", category: "Marketing" },
  { value: "Chat en vivo", icon: "💬", category: "Interacción" },
  { value: "Multidioma", icon: "🌐", category: "Internacional" },
  { value: "SEO avanzado", icon: "🔍", category: "Marketing" },
  { value: "Analítica integrada", icon: "📊", category: "Analítica" },
  { value: "Sistema de pagos", icon: "💳", category: "E-commerce" },
  { value: "Base de datos", icon: "🗄️", category: "Avanzado" },
  { value: "Panel administrativo", icon: "⚙️", category: "Gestión" },
] as const;

const integrationOptions = [
  { value: "Google Analytics", icon: "📈" },
  { value: "Facebook/Instagram", icon: "👍" },
  { value: "WhatsApp", icon: "📱" },
  { value: "Mailchimp", icon: "✉️" },
  { value: "Stripe/PayPal", icon: "💳" },
  { value: "Google Maps", icon: "🗺️" },
  { value: "CRM (Salesforce, Hubspot)", icon: "📋" },
  { value: "ERP", icon: "📦" },
  { value: "API de terceros", icon: "🔌" },
  { value: "Google Drive/Dropbox", icon: "📁" },
  { value: "Calendario (Google Calendar)", icon: "🗓️" },
  { value: "Zoom/Meet", icon: "🎥" },
] as const;

const hostingOptions = [
  { value: "", label: "No tengo preferencia", description: "Recomiéndenme la mejor opción" },
  { value: "shared", label: "Hosting compartido", description: "Económico para sitios pequeños" },
  { value: "vps", label: "VPS", description: "Para sitios medianos con más control" },
  { value: "cloud", label: "Cloud hosting", description: "Escalable y flexible" },
  { value: "managed", label: "Hosting gestionado", description: "Nos encargamos de todo por ti" },
  { value: "existing", label: "Ya tengo hosting", description: "Solo necesito el desarrollo" },
] as const;

const CustomSolutionForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<SolicitudFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "" as ProjectType,
    budgetRange: "" as BudgetRange,
    deadline: "",
    description: "",
    features: [],
    integrations: [],
    designPreferences: "",
    targetAudience: "",
    existingWebsite: "",
    hostingPreferences: "",
    additionalComments: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [progress, setProgress] = useState(0);
  const modalRef = useRef<HTMLFormElement>(null);

  // Calcular progreso del formulario
  useEffect(() => {
    const requiredFields = ["name", "email", "projectType", "budgetRange", "description"];
    const completedFields = requiredFields.filter(field => 
      formData[field as keyof SolicitudFormData]?.toString().trim()
    ).length;
    
    const additionalFields = Object.keys(formData).length - requiredFields.length;
    const totalProgress = (completedFields / requiredFields.length) * 70 + 
                         (Object.values(formData).filter(val => val?.toString().trim()).length - completedFields) / additionalFields * 30;
    
    setProgress(Math.round(totalProgress));
  }, [formData]);

  // Cierre al hacer clic fuera o presionar ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === "features" || name === "integrations") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value),
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Por favor ingresa tu nombre";
    if (!formData.email.trim()) return "Necesitamos tu email para contactarte";
    if (!formData.email.includes("@")) return "Por favor ingresa un email válido";
    if (!formData.projectType) return "Selecciona el tipo de proyecto que necesitas";
    if (!formData.budgetRange) return "Indícanos un rango de presupuesto aproximado";
    if (!formData.description.trim()) return "Descripción breve del proyecto es requerida";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setActiveSection("personal"); // Volver a la primera sección con error
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("solicitudes").insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        project_type: formData.projectType,
        budget_range: formData.budgetRange,
        deadline: formData.deadline,
        description: formData.description,
        features: formData.features,
        integrations: formData.integrations,
        design_preferences: formData.designPreferences,
        target_audience: formData.targetAudience,
        existing_website: formData.existingWebsite,
        hosting_preferences: formData.hostingPreferences,
        additional_comments: formData.additionalComments,
      }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Error al enviar:", err);
      setError("Ocurrió un error al enviar. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8 relative max-w-md mx-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="text-5xl mb-6">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          ¡Gracias por tu solicitud!
        </h3>
        <p className="text-gray-300 mb-6">
          Hemos recibido tu información y nos pondremos en contacto contigo
          en menos de 24 horas.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Volver
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      ref={modalRef}
      className="space-y-6 p-6 max-h-[90vh] overflow-y-auto relative bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 max-w-3xl mx-auto"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-xl"
        aria-label="Cerrar formulario"
      >
        ×
      </button>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Cuéntanos sobre tu proyecto
        </h3>
        <p className="text-gray-400">
          Completa este formulario y te enviaremos una propuesta personalizada
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-300">Progreso del formulario</span>
          <span className="text-sm text-gray-300">{progress}% completado</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 flex items-start gap-2"
        >
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>{error}</div>
        </motion.div>
      )}

      {/* Sección de navegación */}
      <div className="flex overflow-x-auto pb-2 gap-2">
        <SectionButton
          active={activeSection === "personal"}
          onClick={() => setActiveSection("personal")}
          icon="👤"
          label="Tus datos"
        />
        <SectionButton
          active={activeSection === "project"}
          onClick={() => setActiveSection("project")}
          icon="📋"
          label="Tu proyecto"
        />
        <SectionButton
          active={activeSection === "features"}
          onClick={() => setActiveSection("features")}
          icon="⚙️"
          label="Funcionalidades"
        />
        <SectionButton
          active={activeSection === "preferences"}
          onClick={() => setActiveSection("preferences")}
          icon="🎨"
          label="Preferencias"
        />
      </div>

      {/* Sección: Información personal */}
      {activeSection === "personal" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h4 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
            <span>👤</span> Información de contacto
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">
                Nombre completo*
                <span className="text-sm text-gray-500 block">Como quieres que nos dirijamos a ti</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: María González"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Correo electrónico*
                <span className="text-sm text-gray-500 block">Para enviarte nuestra respuesta</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: contacto@midominio.com"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Teléfono (opcional)
                <span className="text-sm text-gray-500 block">Para contactarte más rápido</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: 55 1234 5678"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Empresa/Organización (opcional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: Mi Empresa S.A."
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setActiveSection("project")}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              Siguiente: Tu proyecto
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Sección: Detalles del proyecto */}
      {activeSection === "project" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h4 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
            <span>📋</span> Detalles de tu proyecto
          </h4>
          
          <div className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2">
                ¿Qué tipo de proyecto necesitas?*
                <span className="text-sm text-gray-500 block">Selecciona la opción que mejor describa tu necesidad</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, projectType: type.value as ProjectType})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${formData.projectType === type.value ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Presupuesto estimado*
                <span className="text-sm text-gray-500 block">Esto nos ayuda a recomendarte la mejor solución</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {budgetOptions.map((budget) => (
                  <button
                    key={budget.value}
                    type="button"
                    onClick={() => setFormData({...formData, budgetRange: budget.value as BudgetRange})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${formData.budgetRange === budget.value ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                  >
                    <div className="font-medium">{budget.label}</div>
                    <div className="text-sm text-gray-400 mt-1">{budget.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                ¿Cuándo necesitas el proyecto?
                <span className="text-sm text-gray-500 block">Indícanos si tienes una fecha límite</span>
              </label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: 3 meses, para diciembre 2023, etc."
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Cuéntanos más sobre tu proyecto*
                <span className="text-sm text-gray-500 block">
                  Describe qué necesitas, objetivos, público al que va dirigido, etc.
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: Necesito un sitio web para mi restaurante con menú digital, sistema de reservaciones y galería de fotos..."
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveSection("personal")}
              className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("features")}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              Siguiente: Funcionalidades
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Sección: Funcionalidades */}
      {activeSection === "features" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h4 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
            <span>⚙️</span> Funcionalidades necesarias
          </h4>
          
          <div className="space-y-6">
            <div>
              <h5 className="text-lg font-medium text-white mb-3">
                Características principales
                <span className="text-sm text-gray-500 block">Selecciona todas las que necesites</span>
              </h5>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {featureOptions.map((feature) => (
                  <div key={feature.value} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`feature-${feature.value}`}
                      name="features"
                      value={feature.value}
                      checked={formData.features.includes(feature.value)}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-5 w-5 text-cyan-500 rounded focus:ring-cyan-600 bg-gray-700 border-gray-600 flex-shrink-0"
                    />
                    <label
                      htmlFor={`feature-${feature.value}`}
                      className="ml-2 text-gray-300"
                    >
                      <div className="flex items-center gap-2">
                        <span>{feature.icon}</span>
                        <span>{feature.value}</span>
                      </div>
                      <span className="text-xs text-gray-500 block mt-1">{feature.category}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-medium text-white mb-3">
                Integraciones con otras plataformas
                <span className="text-sm text-gray-500 block">Selecciona las que necesites conectar</span>
              </h5>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {integrationOptions.map((integration) => (
                  <div key={integration.value} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`integration-${integration.value}`}
                      name="integrations"
                      value={integration.value}
                      checked={formData.integrations.includes(integration.value)}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-5 w-5 text-cyan-500 rounded focus:ring-cyan-600 bg-gray-700 border-gray-600 flex-shrink-0"
                    />
                    <label
                      htmlFor={`integration-${integration.value}`}
                      className="ml-2 text-gray-300"
                    >
                      <div className="flex items-center gap-2">
                        <span>{integration.icon}</span>
                        <span>{integration.value}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveSection("project")}
              className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("preferences")}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              Siguiente: Preferencias
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Sección: Preferencias */}
      {activeSection === "preferences" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h4 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
            <span>🎨</span> Tus preferencias
          </h4>
          
          <div className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2">
                Estilo de diseño preferido
                <span className="text-sm text-gray-500 block">Colores, estilos, referencias (opcional)</span>
              </label>
              <textarea
                name="designPreferences"
                value={formData.designPreferences}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: Minimalista con tonos azules, me gusta el estilo de www.ejemplo.com..."
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                ¿A qué público va dirigido?
                <span className="text-sm text-gray-500 block">Para adaptar el diseño y contenido</span>
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: Mujeres 25-45 años, empresas B2B, adolescentes..."
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                ¿Tienes un sitio web existente?
                <span className="text-sm text-gray-500 block">Si es un rediseño, indícanos la URL</span>
              </label>
              <input
                type="text"
                name="existingWebsite"
                value={formData.existingWebsite}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: https://misitioactual.com"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Preferencias de hosting/alojamiento
                <span className="text-sm text-gray-500 block">¿Dónde quieres alojar tu sitio web?</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {hostingOptions.map((hosting) => (
                  <button
                    key={hosting.value}
                    type="button"
                    onClick={() => setFormData({...formData, hostingPreferences: hosting.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${formData.hostingPreferences === hosting.value ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                  >
                    <div className="font-medium">{hosting.label}</div>
                    <div className="text-sm text-gray-400 mt-1">{hosting.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                ¿Algo más que debamos saber?
                <span className="text-sm text-gray-500 block">Comentarios adicionales (opcional)</span>
              </label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Ej: Necesito que sea accesible, tengo materiales preparados, etc."
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8">
            <button
              type="button"
              onClick={() => setActiveSection("features")}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver a funcionalidades
            </button>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-transparent border-2 border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-800/50 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar solicitud
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.form>
  );
};

// Componente auxiliar para botones de sección
const SectionButton = ({ active, onClick, icon, label }: { 
  active: boolean; 
  onClick: () => void; 
  icon: string; 
  label: string 
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-shrink-0 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${active ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

export default CustomSolutionForm;