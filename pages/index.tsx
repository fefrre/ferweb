"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CustomSolutionForm from "../components/CustomSolutionForm";
import { techLinks } from "../constants/techLinks";
import { cards } from "@/constants/cards";
import { CardType } from "../types";
import Link from "next/link";

interface CardProps {
  card: CardType;
  index: number;
  onClick?: () => void;
}

const Card = ({ card, index, onClick }: CardProps) => (
  <motion.div
    className={`${card.bgColor} rounded-3xl p-8 shadow-2xl flex flex-col h-full transition-transform hover:scale-[1.05] cursor-pointer ${
      card.highlight ? "md:scale-105 z-10 ring-4 ring-white/20" : "z-0"
    }`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
    onClick={onClick}
  >
    <div className="absolute top-0 right-0 text-[120px] opacity-10 p-4">
      {card.icon}
    </div>

    <div className="flex-1">
      <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
      {card.price && (
        <p className="text-xl font-semibold text-white/90 mb-6">{card.price}</p>
      )}

      <div className="mb-8 relative">
        <div className="absolute -left-4 top-0 h-full w-1 bg-white/30 rounded-full"></div>
        <ul className="space-y-3">
          {card.features?.map((feature, i) => (
            <motion.li key={i} className="flex items-start" whileHover={{ x: 5 }}>
              <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-white/90">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {card.tech && (
        <div className="flex flex-wrap gap-2 mb-6">
          {card.tech.map((tech, i) => (
            <motion.a
              key={i}
              href={techLinks[tech as keyof typeof techLinks]}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {tech}
            </motion.a>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const AnimatedBackground = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {[...Array(30)].map((_, i) => {
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400"
            initial={{
              x: initialX,
              y: initialY,
              width: Math.random() * 5 + 1,
              height: Math.random() * 5 + 1,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              x: [initialX, initialX + (Math.random() * 20 - 10)],
              y: [initialY, initialY + (Math.random() * 20 - 10)],
              transition: {
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        );
      })}
    </div>
  );
};

export default function Home() {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />

        <div className="text-center px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Desarrollo Web Profesional
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Soluciones a medida para impulsar tu presencia en línea
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <button
              onClick={() =>
                document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Ver Paquetes
            </button>
            <button
              onClick={() => window.open("https://wa.me/524491872870?text=Hola,%20estoy%20interesado%20en%20tus%20servicios%20web.%20¿Podrías%20brindarme%20más%20información?", "_blank")}
              className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all hover:scale-105"
            >
              Contactar Ahora
            </button>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16"
          >
            <div className="flex flex-col items-center">
              <span className="text-gray-400 mb-2">Desplázate para ver más</span>
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección de Paquetes */}
      <section id="packages" className="container mx-auto px-4 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Nuestros{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            Paquetes
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {cards
            .filter((card): card is CardType & { isCustom: false } => !card.isCustom)
            .map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
        </div>
      </section>

      {/* Sección de Proceso */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            ¿Cómo{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
              trabajamos
            </span>
            ?
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Consulta",
                desc: "Analizamos tus necesidades y objetivos",
                icon: "💬",
                color: "from-blue-500 to-cyan-400",
              },
              {
                title: "Diseño",
                desc: "Creamos prototipos y diseños interactivos",
                icon: "🎨",
                color: "from-purple-500 to-indigo-400",
              },
              {
                title: "Desarrollo",
                desc: "Implementamos con las mejores tecnologías",
                icon: "👨‍💻",
                color: "from-rose-500 to-pink-400",
              },
              {
                title: "Lanzamiento",
                desc: "Publicamos y optimizamos tu solución",
                icon: "🚀",
                color: "from-amber-500 to-orange-400",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-cyan-400 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl bg-gradient-to-br ${step.color}`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                width: Math.random() * 5 + 1,
                height: Math.random() * 5 + 1,
                opacity: Math.random() * 0.3 + 0.1,
              }}
              animate={{
                x: [null, Math.random() * 100],
                y: [null, Math.random() * 100],
                transition: {
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              ¿Listo para comenzar tu{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                proyecto
              </span>
              ?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Contáctanos para una consulta gratuita y sin compromiso
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => window.open("https://wa.me/524491872870?text=Hola,%20estoy%20interesado%20en%20tus%20servicios%20web.%20¿Podrías%20brindarme%20más%20información?", "_blank")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                WhatsApp
              </button>

              <button
                onClick={() => (window.location.href = "mailto:tuemail@ejemplo.com?subject=Consulta%20servicios%20web&body=Hola,%20estoy%20interesado%20en...")}
                className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Email
              </button>
            </motion.div>
          </div>
        </div>

        {/* Solución Personalizada */}
        <div className="grid md:grid-cols-1 gap-8 place-items-center mt-8">
          {cards
            .filter((card): card is CardType & { isCustom: true } => !!card.isCustom)
            .map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onClick={() => setShowCustomForm(true)}
              />
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                WebSolutions
              </h3>
              <p className="text-gray-400 mt-2">Transformando ideas en realidad digital</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </footer>

      {/* Modal del formulario personalizado */}
      {showCustomForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl overflow-hidden max-w-4xl w-full border border-gray-700 shadow-2xl">
            <CustomSolutionForm onClose={() => setShowCustomForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}