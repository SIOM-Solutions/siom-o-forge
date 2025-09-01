import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AirLandingPage() {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">SystemAIR™ — Auditoría Inicial de Rendimiento</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Diagnóstico 360° de tu rendimiento para identificar brechas y trazar una hoja de ruta con retorno medible.</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-start md:items-stretch">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">¿Qué es AIR?</h2>
              <p className="text-gray-300 mb-4">Auditoría Inicial de Rendimiento de <span className="text-white font-semibold">SIOM Solutions</span> que establece tu <span className="text-white font-semibold">línea base</span> en <span className="text-white font-semibold">10 áreas críticas</span> y prioriza palancas de alto impacto.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🚪</span>
                  <div>
                    <div className="text-white font-semibold">Entrada al ecosistema</div>
                    <div className="text-gray-400 text-sm">Activa tu recorrido en O‑Forge</div>
                  </div>
                </div>
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🔟</span>
                  <div>
                    <div className="text-white font-semibold">10 áreas críticas</div>
                    <div className="text-gray-400 text-sm">Cobertura integral del rendimiento</div>
                  </div>
                </div>
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">⚙️</span>
                  <div>
                    <div className="text-white font-semibold">Prioriza palancas</div>
                    <div className="text-gray-400 text-sm">Mejoras visibles sin fricción</div>
                  </div>
                </div>
              </div>

              <div className="hud-card p-4 mb-6">
                <div className="text-white font-semibold mb-2">Resultados</div>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li><span className="text-white font-semibold">Mapa de brechas y fortalezas</span> con retorno medible</li>
                  <li><span className="text-white font-semibold">Learning Path personalizado</span> a partir de tu línea base</li>
                  <li>Integración operativa con <span className="text-white font-semibold">PSITAC</span>, <span className="text-white font-semibold">Performance</span> y <span className="text-white font-semibold">OPS</span></li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/air/assignments')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Ver Mis Materias
              </button>
            </div>
            <div className="h-full">
              {!imgError ? (
                <div className="relative h-48 md:h-full rounded-xl overflow-hidden border border-gray-800 shadow-lg shadow-emerald-900/20">
                  <img
                    src="/images/air/air-hero.jpg"
                    alt="SystemAIR™ — Sistema de Diagnóstico"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setImgError(true)}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/55 text-gray-200 text-xs px-2 py-1 rounded">
                    Sistema de Diagnóstico
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
            <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-800/30">
                      <span className="text-4xl font-bold text-white tracking-wide">AIR</span>
              </div>
              <p className="text-gray-400 text-sm">Sistema de Diagnóstico</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">SystemAIR en SIOM O‑Forge</h2>
          <div className="hud-card p-5 mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge badge-info">Neurociencia</span>
              <span className="badge badge-info">Fisiología aplicada</span>
              <span className="badge badge-info">IA Multiplataforma</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Como parte del <span className="text-white font-semibold">Ecosistema de Inteligencia Híbrida de SIOM Solutions</span>, AIR combina estas disciplinas para transformar datos en decisiones.
              El objetivo es simple: <span className="text-white font-semibold">aumentar tu capacidad de rendir mejor, incluso bajo presión</span>.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-2">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Qué evalúa</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1 Sueño */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🌙</span>
                  <div>
                    <div className="text-white font-semibold">Sueño y recuperación</div>
                    <div className="text-gray-400 text-sm">Calidad del descanso y ritmos de recuperación</div>
                  </div>
                </div>
                {/* 2 Acondicionamiento */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🏋️</span>
                  <div>
                    <div className="text-white font-semibold">Acondicionamiento físico</div>
                    <div className="text-gray-400 text-sm">Fuerza, cardio y movilidad orientados a función</div>
                  </div>
                </div>
                {/* 3 Nutrición */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🥗</span>
                  <div>
                    <div className="text-white font-semibold">Nutrición</div>
                    <div className="text-gray-400 text-sm">Energía estable y densidad nutritiva</div>
                  </div>
                </div>
                {/* 4 Atención */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🎯</span>
                  <div>
                    <div className="text-white font-semibold">Atención y foco</div>
                    <div className="text-gray-400 text-sm">Control de distracciones y trabajo profundo</div>
                  </div>
                </div>
                {/* 5 Aprendizaje */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">📘</span>
                  <div>
                    <div className="text-white font-semibold">Dominio del aprendizaje</div>
                    <div className="text-gray-400 text-sm">Método para aprender rápido lo crítico</div>
                  </div>
                </div>
                {/* 6 Productividad */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🗂️</span>
                  <div>
                    <div className="text-white font-semibold">Productividad ejecutiva</div>
                    <div className="text-gray-400 text-sm">Decisión, priorización y ejecución</div>
                  </div>
                </div>
                {/* 7 Estrés */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🧘</span>
                  <div>
                    <div className="text-white font-semibold">Gestión del estrés</div>
                    <div className="text-gray-400 text-sm">Autorregulación y rendimiento bajo presión</div>
                  </div>
                </div>
                {/* 8 Neuroquímica */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">⚛️</span>
                  <div>
                    <div className="text-white font-semibold">Neuroquímica</div>
                    <div className="text-gray-400 text-sm">Energía, motivación y control emocional</div>
                  </div>
                </div>
                {/* 9 Liderazgo */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🏁</span>
                  <div>
                    <div className="text-white font-semibold">Liderazgo</div>
                    <div className="text-gray-400 text-sm">Dirección, influencia y cohesión</div>
                  </div>
                </div>
                {/* 10 Master Concept */}
                <div className="hud-card p-3 flex gap-3 items-start">
                  <span aria-hidden className="mt-0.5 text-cyan-300">🧩</span>
                  <div>
                    <div className="text-white font-semibold">The Master Concept</div>
                    <div className="text-gray-400 text-sm">Integración de prácticas SIOM en tu sistema</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Cómo usamos los datos</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Privacidad y control: visibles solo para ti. Todo es estrictamente confidencial.</li>
                <li>KPIs y seguimiento: progreso y ROI operacional</li>
                <li>Learning Path: materias y acciones personalizadas</li>
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">Bloques: ~50 preguntas por materia</div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">Tiempo: variable según usuario</div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 col-span-2">Requisito: realizar con máxima dedicación para resultados reales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ruta visual de AIR (timeline horizontal en desktop, vertical en móvil) */}
        <div className="mb-10">
          {/* Desktop / md+: horizontal timeline */}
          <div className="hidden md:flex items-start justify-between relative px-2">
            {/* Step 1 */}
            <div className="flex-1 pr-6">
              <div className="flex items-start">
                <div className="relative mr-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 border border-cyan-500 text-white flex items-center justify-center font-bold">1</div>
                  <div className="hidden md:block absolute top-1/2 left-full w-28 h-[2px] bg-gradient-to-r from-cyan-600/60 to-gray-700 -translate-y-1/2"></div>
                </div>
                <div>
                  <div className="text-white font-semibold">Diagnóstico</div>
                  <div className="text-gray-400 text-sm max-w-xs">Evaluación completa de tu rendimiento actual en las materias y programas de SIOM Performance</div>
                </div>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex-1 px-6">
              <div className="flex items-start">
                <div className="relative mr-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 border border-cyan-500 text-white flex items-center justify-center font-bold">2</div>
                  <div className="hidden md:block absolute top-1/2 left-full w-28 h-[2px] bg-gradient-to-r from-cyan-600/60 to-gray-700 -translate-y-1/2"></div>
                </div>
                <div>
                  <div className="text-white font-semibold">Análisis</div>
                  <div className="text-gray-400 text-sm max-w-xs">Identificación de fortalezas y oportunidades de mejora</div>
                </div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex-1 pl-6">
              <div className="flex items-start">
                <div className="relative mr-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 border border-cyan-500 text-white flex items-center justify-center font-bold">3</div>
                </div>
                <div>
                  <div className="text-white font-semibold">Plan</div>
                  <div className="text-gray-400 text-sm max-w-xs">Desarrollo de un Learning Path personalizado para tu crecimiento</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile: vertical cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            <div className="hud-card p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gray-900 border border-cyan-500 text-white flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <div className="text-white font-semibold">Diagnóstico</div>
                <div className="text-gray-400 text-sm">Evaluación completa de tu rendimiento actual en las materias y programas de SIOM Performance</div>
              </div>
            </div>
            <div className="hud-card p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gray-900 border border-cyan-500 text-white flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <div className="text-white font-semibold">Análisis</div>
                <div className="text-gray-400 text-sm">Identificación de fortalezas y oportunidades de mejora</div>
              </div>
            </div>
            <div className="hud-card p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gray-900 border border-cyan-500 text-white flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <div className="text-white font-semibold">Plan</div>
                <div className="text-gray-400 text-sm">Desarrollo de un Learning Path personalizado para tu crecimiento</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/hub')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200 mr-4"
          >
            ← Volver al Hub
          </button>
          <button
            onClick={() => navigate('/air/assignments')}
            className="btn btn-air"
          >
            Comenzar AIR →
          </button>
        </div>
      </div>
    </motion.div>
  )
}
