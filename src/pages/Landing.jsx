import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Building2,
  Gamepad2,
  ArrowRight,
  CheckCircle2,
  Globe,
  Cuboid,
  Palette,
  Clock,
  PlayCircle,
  Sparkles,
  Users,
  TrendingUp,
  Cpu,
  Lock,
  Layers,
  ChevronDown,
  Activity,
  Map,
  Eye,
  Shield,
  Smartphone,
  Check,
  Plus,
  Menu,
  X,
  Zap
} from 'lucide-react'
import { motion as Motion, AnimatePresence } from 'motion/react'
import ThemeToggle from '../components/ThemeToggle'

function Landing() {
  const navigate = useNavigate()
  const { profile, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track page scroll to shrink navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true)
      else setScrolled(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handlePortalNavigation() {
    if (loading) return
    if (profile) navigate('/dashboard')
    else navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/30 overflow-x-hidden relative bg-grid-pattern">
      {/* Background radial glowing meshes (contained to prevent page overflow scroll) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] aspect-square bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_60%)] rounded-full filter blur-[80px] animate-pulse-slow" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] aspect-square bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_65%)] rounded-full filter blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[70%] aspect-square bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06),transparent_70%)] rounded-full filter blur-[120px]" />
      </div>


      {/* Floating Glassmorphic Navbar */}
      <nav 
        className={`fixed left-4 right-4 z-50 mx-auto max-w-5xl rounded-full transition-all duration-300 ${
          scrolled 
            ? 'top-4 border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl py-3 px-6 shadow-2xl' 
            : 'top-6 border border-transparent bg-transparent py-4 px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-400/20 backdrop-blur-md">
              <Building2 className="absolute -ml-1 h-4.5 w-4.5 text-indigo-300" />
              <Gamepad2 className="absolute ml-2 mt-1.5 h-3.5 w-3.5 text-emerald-300" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Awaas<span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent ml-1">VR</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#configurator" className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Configurator</a>
            <a href="#bento" className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Showcase</a>
            <a href="#roles" className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Pipeline</a>
            <a href="#telemetry" className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Analytics</a>
            <a href="#faq" className="text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</a>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <button
              onClick={handlePortalNavigation}
              className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-zinc-900 dark:bg-white px-5 py-2 text-xs font-bold text-white dark:text-zinc-950 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 shadow-md shadow-black/10 dark:shadow-white/5"
            >
              Launch Portal
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <Motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden mt-4 pt-4 border-t border-zinc-200/80 dark:border-white/5 flex flex-col gap-4"
            >
              <a 
                href="#configurator" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 transition-colors"
              >
                VR Configurator
              </a>
              <a 
                href="#bento" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 transition-colors"
              >
                Bento Showcase
              </a>
              <a 
                href="#roles" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 transition-colors"
              >
                Pipeline Roles
              </a>
              <a 
                href="#telemetry" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 transition-colors"
              >
                Telemetry Analytics
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 transition-colors"
              >
                FAQ
              </a>
              {/* Mobile theme switcher */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200/80 dark:border-white/5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Appearance
                </span>
                <ThemeToggle />
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero text column */}
            <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <Motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-indigo-300 backdrop-blur-md mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                AWAAS ENGINE V1.0 LIVE
              </Motion.div>

              <Motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-4xl font-extrabold leading-[1.08] tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Unify Property <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent text-glow">
                  Tours in VR.
                </span>
              </Motion.h1>

              <Motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed sm:text-lg max-w-xl"
              >
                The ultimate PropTech hub linking Admins, Builders, Agencies, and Agents. Host multiplayer spatial walk-throughs, custom-stage spaces on the fly, and capture telemetry analytics instantly.
              </Motion.p>

              <Motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <button
                  onClick={handlePortalNavigation}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] active:scale-98"
                >
                  Enter Portal
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-8 py-3.5 text-sm font-bold text-zinc-900 dark:text-white transition-all active:scale-98"
                >
                  <PlayCircle className="h-4.5 w-4.5 text-indigo-400" />
                  Try Live customizer
                </button>
              </Motion.div>
            </div>

            {/* Configurator Preview column */}
            <div className="lg:col-span-6 w-full flex justify-center">
              <Motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-xl"
              >
                <VirtualConfigurator />
              </Motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Space Configurator Demo Section */}
      <section id="configurator" className="py-24 relative border-y border-zinc-200/80 dark:border-white/5 bg-zinc-100/60 dark:bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Virtual Staging Configurator
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              Show buyers the true versatility of unbuilt properties. Click the options on the live demo below to customize floor materials, ambient times of day, and furniture styles instantly.
            </p>
          </div>

          <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-3xl p-6 lg:p-10 backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 bg-zinc-950 aspect-[4/3] w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent z-0 pointer-events-none" />
                  <div className="w-full h-full relative z-10">
                    <InteractiveRenderStage />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full w-fit mb-6">
                  STAGE CONTROLLER
                </span>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Design Spatial Presets in Real-Time
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3 leading-relaxed">
                  Staging empty properties or rendering construction shells is no longer slow. Under Awaas, developers store asset sets directly, letting sales managers spin custom presets instantly.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                      <Palette className="w-4.5 h-4.5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Dynamic Material Swapping</h4>
                      <p className="text-xs text-zinc-500">Swap tiles, textures, and wall configurations seamlessly.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <Clock className="w-4.5 h-4.5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Lighting Atmospheres</h4>
                      <p className="text-xs text-zinc-500">Simulate shadows and sunshine at morning, sunset, or dusk.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <Cuboid className="w-4.5 h-4.5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Furniture Staging Layers</h4>
                      <p className="text-xs text-zinc-500">Change presets between Minimalist Lounge, Office, or Gallery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Showcase Section */}
      <section id="bento" className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Engineered for High-Converting Property Tours
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              We focus on building interactive technology that engages buyers, logs key interests, and sells properties faster than legacy real estate workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Bento Card 1: Blueprint to 3D Render Slider (Large) */}
            <div className="md:col-span-4 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col justify-between backdrop-blur-md">
              <div>
                <span className="text-[10px] font-bold font-mono text-indigo-400 tracking-widest uppercase">PRE-CONSTRUCTION STAGING</span>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-2 mb-4">Blueprint-to-Staging Magic</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 max-w-xl">
                  Slide below to see how raw CAD plans are instantly styled into a photorealistic 3D virtual environment ready for prospective buyers.
                </p>
              </div>
              <BlueprintToRender />
            </div>

            {/* Bento Card 2: 3D Model Fast Streaming (Medium) */}
            <div className="md:col-span-2 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col justify-between backdrop-blur-md">
              <div>
                <span className="text-[10px] font-bold font-mono text-emerald-400 tracking-widest uppercase">TURBO MESH ENGINE</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mt-2 mb-3">Instant VR Streaming</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  No slow file downloads. Awaas streams high-fidelity models direct to browser or WebXR headsets via chunked optimization.
                </p>
              </div>

              <div className="mt-8 space-y-4 font-mono">
                <div className="bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-600 dark:text-zinc-400 mb-1">
                    <span>AWAAS ENGINE</span>
                    <span className="text-emerald-400 font-bold">0.8s</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full animate-pulse" />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-xl p-3.5 opacity-65">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1">
                    <span>LEGACY WEBVR</span>
                    <span className="text-red-400">12.4s</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 w-[15%]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 bg-white/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-white/5 rounded-full px-3 py-1.5 w-fit">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Optimized 15x Faster Loading
              </div>
            </div>

            {/* Bento Card 3: Multiplayer Tours Map (Medium) */}
            <div className="md:col-span-3 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col justify-between backdrop-blur-md">
              <div>
                <span className="text-[10px] font-bold font-mono text-amber-400 tracking-widest uppercase">CO-BROKING WORKFLOW</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mt-2 mb-3">Multiplayer Live Walkthroughs</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  Agents can co-navigate spaces with remote buyers simultaneously. Audio chat and pointer sharing are completely synchronized.
                </p>
              </div>
              <MultiplayerMap />
            </div>

            {/* Bento Card 4: Multi-Role Hierarchy Security (Medium) */}
            <div className="md:col-span-3 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col justify-between backdrop-blur-md">
              <div>
                <span className="text-[10px] font-bold font-mono text-rose-400 tracking-widest uppercase">ROLE ACCESS HIERARCHY</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mt-2 mb-3">Enterprise-Grade Controls</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  Manage multiple developer portfolios, agencies, agents, and buyers. Custom permissions ensure absolute data isolation across domains.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono">Platform Admin</div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">Full Governance</div>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono">Property Builder</div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">Project Creator</div>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono">Sales Managers</div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">Team Operations</div>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono">Security Model</div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">RBAC Stated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Pipeline Tabs Explorer Section */}
      <section id="roles" className="py-24 relative border-t border-zinc-200/80 dark:border-white/5 bg-zinc-100/40 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Built for the Entire Property Pipeline
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              Explore how Awaas connects every link of the real estate chain under a unified database and spatial experience.
            </p>
          </div>

          <RoleExplorer />
        </div>
      </section>

      {/* Live Analytics Telemetry / Heatmap Section */}
      <section id="telemetry" className="py-24 relative border-t border-zinc-200/80 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Track Every Step Inside the Metaverse
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              We don't just provide visual setups. Awaas captures spatial metrics in real-time. Discover which rooms captivate buyers, what layouts they select, and when their purchase intent rises.
            </p>
          </div>

          <TelemetrySimulator />
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 relative border-t border-zinc-200/80 dark:border-white/5 bg-zinc-100/60 dark:bg-zinc-900/20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Have questions about platform integration, setup, or WebXR? Here are answers to common client questions.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* Footer CTA & Portal Entry */}
      <footer className="border-t border-zinc-200/80 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 pt-24 pb-16 text-center relative overflow-hidden">
        {/* Glow behind footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-[70px] pointer-events-none" />

        <div className="mx-auto max-w-3xl px-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/80 px-4 py-1.5 text-xs font-semibold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase mb-8">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Empowering Modern Real Estate
          </div>

          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl tracking-tight leading-tight">
            Ready to enter the new era of property sales?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-4 mb-10 text-base sm:text-lg max-w-lg mx-auto">
            Bring your blueprints to life. Deploy multiplayer VR staging configurations, manage sales agents, and check metrics under Awaas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handlePortalNavigation}
              className="w-full sm:w-auto rounded-full bg-zinc-900 dark:bg-white px-10 py-4 text-sm font-bold text-white dark:text-zinc-950 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5"
            >
              Access the Portal
            </button>
            <a
              href="#configurator"
              className="w-full sm:w-auto rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-10 py-4 text-sm font-bold text-zinc-900 dark:text-white transition-all active:scale-95"
            >
              Learn More
            </a>
          </div>

          <div className="mt-20 pt-8 border-t border-zinc-200/80 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 dark:text-white">Awaas VR</span>
              <span>© {new Date().getFullYear()} Awaas Technologies Inc.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sub-component: Virtual Configurator (Hero Version)
function VirtualConfigurator() {
  const [material, setMaterial] = useState('oak')
  const [time, setTime] = useState('day')

  const materialStyles = {
    oak: {
      label: 'Honey Oak',
      floorColor: 'from-amber-700 to-amber-900',
      description: 'Solid Natural Grain'
    },
    marble: {
      label: 'Calacatta Marble',
      floorColor: 'from-slate-200 to-slate-400',
      description: 'Polished High Gloss'
    },
    concrete: {
      label: 'Raw Cement',
      floorColor: 'from-zinc-500 to-zinc-700',
      description: 'Industrial Matte micro'
    }
  }

  const timeSettings = {
    day: {
      label: 'Daylight',
      bgGradient: 'from-sky-300 to-blue-500',
      sunColor: 'bg-yellow-100 shadow-[0_0_40px_#fff]',
      roomLight: 'bg-white/5',
      ambientShadow: 'rgba(56, 189, 248, 0.05)'
    },
    sunset: {
      label: 'Sunset Hour',
      bgGradient: 'from-orange-400 via-rose-500 to-indigo-950',
      sunColor: 'bg-orange-300 shadow-[0_0_50px_#fb923c]',
      roomLight: 'bg-amber-500/10',
      ambientShadow: 'rgba(251, 146, 60, 0.15)'
    },
    night: {
      label: 'Cyber Night',
      bgGradient: 'from-slate-950 via-purple-950 to-zinc-950',
      sunColor: 'bg-slate-800 shadow-[0_0_20px_#312e81]',
      roomLight: 'bg-indigo-500/10',
      ambientShadow: 'rgba(99, 102, 241, 0.1)'
    }
  }

  return (
    <div className="bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden w-full select-none">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Title / Indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-wider">HERO INTERACTIVE MINI-STAGER</span>
        </div>
        <span className="text-[9px] font-mono text-zinc-500">Preset: {timeSettings[time].label}</span>
      </div>

      {/* Interactive Render Screen */}
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200/80 dark:border-white/5 shadow-inner mb-5">
        {/* Exterior Sky Background via Large Window */}
        <div className={`absolute top-0 left-0 right-0 h-[65%] bg-gradient-to-b ${timeSettings[time].bgGradient} transition-all duration-700 flex items-center justify-center`}>
          {/* Sun/Moon */}
          <div className={`absolute w-12 h-12 rounded-full transition-all duration-700 ${
            time === 'day' ? 'top-6 right-16 scale-100' : time === 'sunset' ? 'top-10 right-28 scale-110' : 'top-8 right-20 scale-75'
          } ${timeSettings[time].sunColor}`} />
        </div>

        {/* Ambient Overlay Layer */}
        <div className={`absolute inset-0 z-10 transition-all duration-700 pointer-events-none ${timeSettings[time].roomLight}`} />

        {/* Interior Walls Outline (SVG) */}
        <svg viewBox="0 0 320 200" className="absolute inset-0 w-full h-full z-20" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
          {/* Back wall ceiling contour */}
          <polygon points="0,0 320,0 320,130 0,130" fill="transparent" />
          {/* Side wall profiles */}
          <polygon points="0,0 60,30 60,130 0,130" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.06)" />
          <polygon points="320,0 260,30 260,130 320,130" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.06)" />
          {/* Large Panoramic Window Frame */}
          <rect x="80" y="25" width="160" height="90" rx="3" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <line x1="160" y1="25" x2="160" y2="115" stroke="rgba(255,255,255,0.1)" />
        </svg>

        {/* Material Floor (Custom Color Gradient based on state) */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] z-20 overflow-hidden border-t border-zinc-200 dark:border-white/10">
          <div className={`w-full h-full bg-gradient-to-tr ${materialStyles[material].floorColor} transition-all duration-500`} />
          {/* Window Reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent mix-blend-screen opacity-40" />
        </div>

        {/* Simple staged couch outline */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-32 aspect-[4/1.5] bg-zinc-900/90 border border-zinc-300 dark:border-white/15 rounded-md flex items-center justify-between px-3 shadow-2xl">
          <div className="w-2.5 h-full bg-zinc-800 rounded-sm" />
          <span className="text-[8px] font-mono text-zinc-500 tracking-widest">AWAAS COUCH_V1</span>
          <div className="w-2.5 h-full bg-zinc-800 rounded-sm" />
        </div>

        {/* Ambient shadow gradient */}
        <div 
          className="absolute inset-0 z-25 pointer-events-none transition-all duration-700" 
          style={{ boxShadow: `inset 0 0 40px ${timeSettings[time].ambientShadow}` }} 
        />
      </div>

      {/* Controls panel */}
      <div className="grid grid-cols-2 gap-4">
        {/* Material options */}
        <div>
          <label className="block text-[10px] font-bold font-mono text-zinc-500 uppercase mb-2">Material Floor</label>
          <div className="flex gap-1.5">
            {Object.keys(materialStyles).map((mat) => (
              <button
                key={mat}
                onClick={() => setMaterial(mat)}
                className={`flex-1 py-1 px-2 text-[10px] font-semibold rounded border transition-all ${
                  material === mat
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-white/5 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {mat === 'oak' ? 'Oak' : mat === 'marble' ? 'Marble' : 'Concrete'}
              </button>
            ))}
          </div>
        </div>

        {/* Time of day options */}
        <div>
          <label className="block text-[10px] font-bold font-mono text-zinc-500 uppercase mb-2">Time Ambient</label>
          <div className="flex gap-1.5">
            {Object.keys(timeSettings).map((tm) => (
              <button
                key={tm}
                onClick={() => setTime(tm)}
                className={`flex-1 py-1 px-2 text-[10px] font-semibold rounded border transition-all ${
                  time === tm
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-200/70 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-white/5 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {tm === 'day' ? 'Day' : tm === 'sunset' ? 'Sunset' : 'Night'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-component: Interactive Render Stage (Main Demo Version)
function InteractiveRenderStage() {
  const [material, setMaterial] = useState('marble')
  const [time, setTime] = useState('sunset')
  const [furniture, setFurniture] = useState('gallery')

  // Details
  const matSpec = {
    oak: { name: 'Honey Oak Plank', desc: 'Grade-A Natural Solid Timber wood floor' },
    marble: { name: 'Imperial White Marble', desc: 'Polished Italian Calacatta stone floor' },
    concrete: { name: 'Raw Brutalist Concrete', desc: 'Matte Industrial Micro-Cement finish' }
  }

  const timeSpec = {
    day: { name: 'Radiant Midday Sun', desc: 'Bright exterior skyline with standard diffuse shadow rays' },
    sunset: { name: 'Golden Hour Glow', desc: 'Warm orange ambient light cast through panoramic frame' },
    night: { name: 'OLED Cyber Night', desc: 'Starry sky views coupled with modern indoor neon glows' }
  }

  return (
    <div className="flex flex-col h-full justify-between p-4 font-sans select-none">
      <div className="flex-1 relative aspect-[16/10] rounded-xl overflow-hidden border border-zinc-200/80 dark:border-white/5 bg-zinc-950 flex items-center justify-center">
        {/* Render Stage SVG */}
        <div className="absolute inset-0 w-full h-full">
          <svg viewBox="0 0 400 250" className="w-full h-full" stroke="none" fill="none">
            {/* Gradients */}
            <defs>
              {/* Day Sky */}
              <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              {/* Sunset Sky */}
              <linearGradient id="skySunset" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="70%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
              {/* Night Sky */}
              <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#030712" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>

              {/* Oak floor */}
              <linearGradient id="floorOak" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              {/* Marble floor */}
              <linearGradient id="floorMarble" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              {/* Concrete floor */}
              <linearGradient id="floorConcrete" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
            </defs>

            {/* Back wall */}
            <rect width="400" height="250" fill="#0f0f11" />

            {/* Panoramic Window Area */}
            <rect 
              x="60" y="20" width="280" height="130" 
              fill={time === 'day' ? 'url(#skyDay)' : time === 'sunset' ? 'url(#skySunset)' : 'url(#skyNight)'} 
              style={{ transition: 'all 0.5s' }}
            />

            {/* Exterior details inside window: Mountain silhouette */}
            <path d="M 60 150 L 140 100 L 220 130 L 290 80 L 340 150 Z" fill="rgba(15,15,17,0.85)" />

            {/* Sun/Moon */}
            {time === 'day' && <circle cx="280" cy="50" r="14" fill="#fef08a" filter="drop-shadow(0 0 20px #fde047)" />}
            {time === 'sunset' && <circle cx="200" cy="110" r="18" fill="#fdba74" filter="drop-shadow(0 0 25px #ea580c)" />}
            {time === 'night' && <circle cx="100" cy="50" r="6" fill="#f1f5f9" filter="drop-shadow(0 0 10px #ffffff)" />}

            {/* Window outline borders */}
            <rect x="60" y="20" width="280" height="130" stroke="#18181b" strokeWidth="2.5" />
            <line x1="200" y1="20" x2="200" y2="150" stroke="#18181b" strokeWidth="2" />
            <line x1="60" y1="85" x2="340" y2="85" stroke="#18181b" strokeWidth="1.5" />

            {/* Left and Right Wall Panels */}
            <polygon points="0,0 60,20 60,150 0,180" fill="#18181b" stroke="#09090b" />
            <polygon points="400,0 340,20 340,150 400,180" fill="#18181b" stroke="#09090b" />

            {/* Floor polygons */}
            <polygon 
              points="0,180 60,150 340,150 400,180 400,250 0,250" 
              fill={material === 'oak' ? 'url(#floorOak)' : material === 'marble' ? 'url(#floorMarble)' : 'url(#floorConcrete)'} 
              style={{ transition: 'all 0.5s' }}
            />

            {/* Floor board/tile seams grid lines */}
            <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.5">
              <line x1="60" y1="150" x2="0" y2="250" />
              <line x1="130" y1="150" x2="80" y2="250" />
              <line x1="200" y1="150" x2="200" y2="250" />
              <line x1="270" y1="150" x2="320" y2="250" />
              <line x1="340" y1="150" x2="400" y2="250" />
            </g>

            {/* Light shaft cast on floor from window */}
            <polygon 
              points="60,150 340,150 390,250 10,250" 
              fill={
                time === 'day' 
                  ? 'rgba(255,255,255,0.04)' 
                  : time === 'sunset' 
                    ? 'rgba(249,115,22,0.12)' 
                    : 'rgba(99,102,241,0.08)'
              } 
              style={{ mixBlendMode: 'screen', transition: 'all 0.5s' }} 
            />

            {/* Furniture Layer Staging */}
            {furniture === 'lounge' && (
              <g id="lounge-staging">
                {/* L-shaped Sofa */}
                <path d="M 120,165 L 280,165 L 290,210 L 110,210 Z" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
                <rect x="135" y="150" width="130" height="20" rx="3" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
                <circle cx="160" cy="185" r="8" fill="#d97706" /> {/* Pillow */}
                {/* Round Coffee Table */}
                <ellipse cx="200" cy="225" rx="35" ry="12" fill="#3f3f46" stroke="#e4e4e7" strokeWidth="1.5" />
                <ellipse cx="200" cy="225" rx="20" ry="6" fill="#18181b" />
              </g>
            )}

            {furniture === 'office' && (
              <g id="office-staging">
                {/* Large minimalist desk */}
                <polygon points="120,180 280,180 300,210 100,210" fill="#18181b" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="120" y1="180" x2="110" y2="230" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="280" y1="180" x2="290" y2="230" stroke="#cbd5e1" strokeWidth="2" />
                {/* iMac or Monitor on desk */}
                <rect x="180" y="145" width="40" height="28" rx="2" fill="#27272a" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="200" y1="173" x2="200" y2="182" stroke="#cbd5e1" strokeWidth="3" />
                {/* Keyboard and mouse */}
                <line x1="185" y1="185" x2="205" y2="185" stroke="#ffffff" strokeWidth="1.5" />
                {/* Office Chair */}
                <rect x="185" y="195" width="30" height="25" rx="4" fill="#3f3f46" stroke="#27272a" />
              </g>
            )}

            {furniture === 'gallery' && (
              <g id="gallery-staging">
                {/* Floating spotlight beams */}
                <polygon points="120,20 100,180 140,180" fill="rgba(253,224,71,0.06)" />
                <polygon points="280,20 260,180 300,180" fill="rgba(99,102,241,0.06)" />
                
                {/* Art Pedestal Left */}
                <rect x="105" y="165" width="30" height="50" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                {/* Abstract Gold Sphere */}
                <circle cx="120" cy="145" r="12" fill="#d97706" stroke="#f59e0b" strokeWidth="1.5" />

                {/* Art Pedestal Right */}
                <rect x="265" y="165" width="30" height="50" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                {/* Abstract Emerald Cone */}
                <polygon points="280,135 270,158 290,158" fill="#059669" stroke="#10b981" strokeWidth="1.5" />
              </g>
            )}
          </svg>

          {/* Active Preset Overlay Badge */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-white/10 rounded px-2.5 py-1 text-[10px] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            LIVE RENDER SPEC: active_viewport
          </div>
        </div>
      </div>

      {/* Control selectors beneath SVG */}
      <div className="mt-6 border-t border-zinc-200/80 dark:border-white/5 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Floor Choice */}
        <div>
          <span className="block text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider mb-2">Material style</span>
          <div className="flex gap-1 bg-white/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-white/5 p-1 rounded-lg">
            {['oak', 'marble', 'concrete'].map((mat) => (
              <button
                key={mat}
                onClick={() => setMaterial(mat)}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                  material === mat 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mat === 'oak' ? 'Oak' : mat === 'marble' ? 'Marble' : 'Concrete'}
              </button>
            ))}
          </div>
          <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-600 mt-1 text-center sm:text-left">{matSpec[material].name}</div>
        </div>

        {/* Ambient Choice */}
        <div>
          <span className="block text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider mb-2">Time preset</span>
          <div className="flex gap-1 bg-white/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-white/5 p-1 rounded-lg">
            {['day', 'sunset', 'night'].map((tm) => (
              <button
                key={tm}
                onClick={() => setTime(tm)}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                  time === tm 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tm === 'day' ? 'Day' : tm === 'sunset' ? 'Sunset' : 'Night'}
              </button>
            ))}
          </div>
          <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-600 mt-1 text-center sm:text-left">{timeSpec[time].name}</div>
        </div>

        {/* Layout Choice */}
        <div>
          <span className="block text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider mb-2">Furniture layout</span>
          <div className="flex gap-1 bg-white/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-white/5 p-1 rounded-lg">
            {['lounge', 'office', 'gallery'].map((lay) => (
              <button
                key={lay}
                onClick={() => setFurniture(lay)}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                  furniture === lay 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {lay === 'lounge' ? 'Lounge' : lay === 'office' ? 'Office' : 'Gallery'}
              </button>
            ))}
          </div>
          <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-600 mt-1 text-center sm:text-left">
            {furniture === 'lounge' ? 'Living Room Staged' : furniture === 'office' ? 'Creative Workspace' : 'Abstract Art Space'}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-component: Blueprint-to-Render Drag Slider
function BlueprintToRender() {
  const [sliderVal, setSliderVal] = useState(50)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderVal(percentage)
  }

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 cursor-ew-resize select-none bg-zinc-950"
      onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX) }}
      onClick={(e) => handleMove(e.clientX)}
      onTouchMove={handleTouchMove}
    >
      {/* Blueprint Underlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 bg-indigo-950/40 font-mono text-[9px] text-indigo-400 opacity-60">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <svg className="absolute inset-0 w-full h-full p-4" stroke="rgba(99, 102, 241, 0.35)" strokeWidth="1" fill="none">
          <rect x="5%" y="5%" width="90%" height="90%" rx="6" />
          <line x1="5%" y1="50%" x2="95%" y2="50%" strokeDasharray="3 3" />
          <line x1="50%" y1="5%" x2="50%" y2="95%" strokeDasharray="3 3" />
          <circle cx="50%" cy="50%" r="35" />
          <path d="M 40 40 L 90 120 M 310 50 L 260 210" />
          <text x="8%" y="15%" fill="currentColor" className="font-bold">AWAAS_VILLA_LAYOUT_REV_B</text>
          <text x="8%" y="22%" fill="currentColor">PROJECT_CODE: STAGE_01</text>
          <text x="56%" y="46%" fill="currentColor">MULTIPLAYER_STAGE_ZONE</text>
        </svg>
      </div>

      {/* 3D Photorealistic Stage Render (Foreground Overlay) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NjIzMjc0N3ww&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="3D Interior Render Staged"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-emerald-500/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm shadow-md">
          AWAAS STAGED_RENDER_v1.0
        </div>
      </div>

      {/* Slider Bar Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        style={{ left: `${sliderVal}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform">
          <svg className="w-4 h-4 text-indigo-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
      
      {/* Instructions Overlay */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-white/10 px-3 py-1.5 rounded-full text-xs text-zinc-700 dark:text-zinc-300 font-medium z-10 flex items-center gap-1.5 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        Drag slider to preview staging
      </div>
    </div>
  )
}

// Sub-component: Live Multiplayer Map SVG
function MultiplayerMap() {
  return (
    <div className="relative bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-2xl p-4 overflow-hidden aspect-[16/10] w-full flex items-center justify-center">
      {/* Map SVG wireframe */}
      <svg viewBox="0 0 300 180" className="w-full h-auto" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" fill="none">
        {/* Simple map continents polygons */}
        <path d="M30 40 C50 30, 80 50, 100 30 C120 50, 110 90, 80 110 C50 110, 40 80, 30 40 Z" fill="rgba(255,255,255,0.01)" />
        <path d="M160 30 C190 20, 240 20, 260 40 C280 60, 270 100, 240 120 C220 100, 180 80, 160 30 Z" fill="rgba(255,255,255,0.01)" />
        <path d="M120 120 C140 110, 170 120, 180 140 C160 160, 130 150, 120 120 Z" fill="rgba(255,255,255,0.01)" />

        {/* Session Paths with flowing dashes */}
        <path 
          d="M 60 70 Q 140 30 220 60" 
          stroke="rgba(99, 102, 241, 0.4)" 
          strokeWidth="1.5" 
          strokeDasharray="5 5" 
          className="animate-pulse"
        />
        <path 
          d="M 220 60 Q 200 110 150 130" 
          stroke="rgba(16, 185, 129, 0.4)" 
          strokeWidth="1.5" 
          strokeDasharray="5 5"
        />

        {/* Nodes */}
        {/* Dubai - Builder node */}
        <g className="cursor-pointer">
          <circle cx="220" cy="60" r="4" fill="#6366f1" />
          <circle cx="220" cy="60" r="10" stroke="#6366f1" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />
          <text x="228" y="63" fill="#ffffff" className="font-mono text-[8px] font-bold">DUBAI (Builder)</text>
        </g>

        {/* London - Investor node */}
        <g className="cursor-pointer">
          <circle cx="60" cy="70" r="4" fill="#10b981" />
          <circle cx="60" cy="70" r="8" stroke="#10b981" strokeWidth="1" className="animate-ping" style={{ animationDuration: '4.2s' }} />
          <text x="15" y="80" fill="#ffffff" className="font-mono text-[8px] font-bold">LONDON (Buyer)</text>
        </g>

        {/* Johannesburg - Agent node */}
        <g className="cursor-pointer">
          <circle cx="150" cy="130" r="4" fill="#f59e0b" />
          <circle cx="150" cy="130" r="8" stroke="#f59e0b" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          <text x="158" y="133" fill="#ffffff" className="font-mono text-[8px] font-bold">JHB (Agent)</text>
        </g>
      </svg>
      
      {/* Telemetry data ticker overlay */}
      <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/5 rounded px-2 py-1 text-[8px] font-mono text-zinc-600 dark:text-zinc-400">
        LATENCY: 42ms | AUD_STREAM: OK | TRANS_RATE: 120fps
      </div>
    </div>
  )
}

// Sub-component: Role Explorer Tab Panel
function RoleExplorer() {
  const [activeTab, setActiveTab] = useState('builder')

  const roles = {
    builder: {
      roleTitle: 'Developer & Builder',
      roleBadge: 'PORTAL OWNER',
      tagline: 'Orchestrate whole developments in immersive high-fidelity VR.',
      bullets: [
        'Upload & manage 3D CAD/BIM configurations for housing projects.',
        'Create and distribute secure agency links to select sales teams.',
        'Analyze regional dashboard KPIs and monitor project absorption rates.',
        'Configure spatial lighting presets & design stage presets.'
      ],
      dashboardMock: {
        title: 'Developer Control Center',
        stats: [
          { name: 'Active VR Projects', val: '12 Complexes' },
          { name: 'Connected Agencies', val: '8 Sales Teams' },
          { name: 'Total Stages Managed', val: '45 Layouts' }
        ],
        tableTitle: 'Active Developments',
        tableRows: [
          { name: 'Serenade Sky Villas', progress: '94% staged', status: 'Ready' },
          { name: 'Emerald Terraces Phase 3', progress: '100% staged', status: 'Ready' },
          { name: 'Amber Horizon Estates', progress: '42% staging', status: 'In Progress' }
        ]
      }
    },
    sales: {
      roleTitle: 'Sales Agency / Manager',
      roleBadge: 'TEAM ORCHESTRATOR',
      tagline: 'Supercharge agents, distribute hot leads, and hit quotas.',
      bullets: [
        'Deploy agents to host virtual open houses concurrently.',
        'View live heatmap telemetry to discover buyer intent points.',
        'Allocate property inventories dynamically based on real-time demands.',
        'Monitor individual sales rep engagement performance metrics.'
      ],
      dashboardMock: {
        title: 'Agency Performance Room',
        stats: [
          { name: 'Active Sales Reps', val: '18 Agents' },
          { name: 'Global Viewers Today', val: '124 Clients' },
          { name: 'Conversion Increase', val: '+28.4% YoY' }
        ],
        tableTitle: 'Sales Representative Standings',
        tableRows: [
          { name: 'Sarah Connor', progress: '14 tours / week', status: 'Top Seller' },
          { name: 'David Miller', progress: '12 tours / week', status: 'High Intent' },
          { name: 'Marcus Aurelius', progress: '9 tours / week', status: 'Stable' }
        ]
      }
    },
    agent: {
      roleTitle: 'Real Estate Agent',
      roleBadge: 'CLIENT TOUR GUIDE',
      tagline: 'Conduct immersive remote tours from anywhere, staging spaces on the fly.',
      bullets: [
        'Generate instant multiplayer WebXR walkthrough links for clients.',
        'Swap wall textures, floor woods, and lighting in real-time during tours.',
        'Guide multiple remote buyers simultaneously inside the virtual space.',
        'Integrate agent voice chat directly inside the spatial walkthrough.'
      ],
      dashboardMock: {
        title: 'Agent Tour Desk',
        stats: [
          { name: 'Tours Hosted', val: '48 Tours' },
          { name: 'Pending Client Invites', val: '5 Invites' },
          { name: 'Avg. Client Score', val: '4.8 / 5.0' }
        ],
        tableTitle: 'My Client Tour Invites',
        tableRows: [
          { name: 'James Stark (Penthouse Tour)', progress: 'Scheduled 3 PM', status: 'Active' },
          { name: 'Lois Lane (Appt 4B Tour)', progress: 'Link Generated', status: 'Open' },
          { name: 'Bruce Wayne (Manor Tour)', progress: 'Completed', status: 'Sold' }
        ]
      }
    },
    buyer: {
      roleTitle: 'Prospective Client',
      roleBadge: 'IMMERSIVE BUYER',
      tagline: 'Tour luxury spaces, swap materials, and co-design your future home.',
      bullets: [
        'Walk through property plans in 1:1 scale before building starts.',
        'Collaborate with family and agents inside the virtual rooms.',
        'Personalize your property: change woods, paint colors, and lighting styles.',
        'Review analytics-backed design choices with absolute physical confidence.'
      ],
      dashboardMock: {
        title: 'My Custom Home Hub',
        stats: [
          { name: 'Saved Presets', val: '6 custom styles' },
          { name: 'Scheduled Viewings', val: '2 Sessions' },
          { name: 'Interactive Hours', val: '4.2 hrs' }
        ],
        tableTitle: 'My Customized Wishlist',
        tableRows: [
          { name: 'Sky Villa - Honey Oak & Marble', progress: 'Staged Match: 98%', status: 'Favorite' },
          { name: 'Horizon Estate - Concrete Vibe', progress: 'Staged Match: 90%', status: 'Saved' },
          { name: 'Emerald Condo - Cozy Sunset', progress: 'Staged Match: 100%', status: 'Ready to Offer' }
        ]
      }
    }
  }

  return (
    <div className="mt-12 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-3xl p-6 lg:p-10 backdrop-blur-md">
      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 pb-6 border-b border-zinc-200/80 dark:border-white/5 justify-center md:justify-start">
        {Object.keys(roles).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-zinc-200/60 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {key === 'builder' && <Building2 className="w-3.5 h-3.5" />}
            {key === 'sales' && <TrendingUp className="w-3.5 h-3.5" />}
            {key === 'agent' && <Users className="w-3.5 h-3.5" />}
            {key === 'buyer' && <Sparkles className="w-3.5 h-3.5" />}
            {roles[key].roleTitle}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
        {/* Left: Role description */}
        <div className="lg:col-span-5">
          <span className="text-[10px] font-bold font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-widest">
            {roles[activeTab].roleBadge}
          </span>
          <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-4 tracking-tight leading-tight">
            {roles[activeTab].roleTitle}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3 leading-relaxed">
            {roles[activeTab].tagline}
          </p>

          <ul className="mt-8 space-y-4">
            {roles[activeTab].bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                </span>
                <span className="text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Mock UI Dashboard */}
        <div className="lg:col-span-7 bg-white/85 dark:bg-zinc-950/80 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          {/* Decorative glowing gradient blur */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-xl pointer-events-none" />

          {/* Top header of mock dashboard */}
          <div className="flex justify-between items-center pb-4 border-b border-zinc-200/80 dark:border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 ml-2 font-bold">{roles[activeTab].dashboardMock.title}</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-200/80 dark:border-white/5 px-2 py-0.5 rounded">
              Secure SSL Connection
            </span>
          </div>

          {/* Core Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles[activeTab].dashboardMock.stats.map((stat, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 p-3 rounded-xl flex flex-col justify-between">
                <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">{stat.name}</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white font-mono mt-1">{stat.val}</span>
              </div>
            ))}
          </div>

          {/* Mock table */}
          <div>
            <div className="text-[9px] text-zinc-600 dark:text-zinc-400 font-mono font-bold mb-2 uppercase tracking-wide">
              {roles[activeTab].dashboardMock.tableTitle}
            </div>
            <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left font-mono text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-white/5 bg-white/80 dark:bg-zinc-900/60 text-zinc-500 text-[8px] sm:text-[10px]">
                    <th className="py-2.5 px-4 font-normal">NAME</th>
                    <th className="py-2.5 px-4 font-normal">METRIC / ACTIVITY</th>
                    <th className="py-2.5 px-4 font-normal">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {roles[activeTab].dashboardMock.tableRows.map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-200/80 dark:border-white/5 last:border-0 hover:bg-zinc-800/20">
                      <td className="py-3 px-4 text-zinc-900 dark:text-white font-semibold">{row.name}</td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{row.progress}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                          row.status === 'Ready' || row.status === 'Top Seller' || row.status === 'Sold' || row.status === 'Ready to Offer'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-component: Telemetry Heatmap Room Simulator
function TelemetrySimulator() {
  const [activeRoom, setActiveRoom] = useState('living')

  const roomStats = {
    living: {
      name: 'Grand Living Lounge',
      dwellTime: '6m 48s',
      customClicks: '24 clicks',
      engagement: '96% - EXCITED',
      color: 'text-indigo-400',
      fillColor: 'rgba(99, 102, 241, 0.15)',
      strokeColor: 'rgba(99, 102, 241, 0.6)',
      desc: 'Most viewed room. Customizations focused heavily on Honey Oak wood panels and Sunset Hour profiles.',
      telemetryLog: [95, 96, 96, 94, 98, 97, 99]
    },
    kitchen: {
      name: 'Gourmet Kitchen Lab',
      dwellTime: '4m 12s',
      customClicks: '11 clicks',
      engagement: '78% - STABLE',
      color: 'text-emerald-400',
      fillColor: 'rgba(16, 185, 129, 0.15)',
      strokeColor: 'rgba(16, 185, 129, 0.6)',
      desc: 'High interaction rate on cabinetry and Calacatta countertops. Buyers spent time configuring ambient LEDs.',
      telemetryLog: [68, 70, 75, 78, 77, 80, 78]
    },
    bedroom: {
      name: 'Master Sanctuary',
      dwellTime: '3m 22s',
      customClicks: '8 clicks',
      engagement: '65% - STEADY',
      color: 'text-amber-400',
      fillColor: 'rgba(245, 158, 11, 0.15)',
      strokeColor: 'rgba(245, 158, 11, 0.6)',
      desc: 'Buyers explored window views and lighting variants. Transitioned to Cyber Night theme repeatedly.',
      telemetryLog: [40, 48, 55, 62, 60, 68, 65]
    },
    balcony: {
      name: 'Panoramic Sky Deck',
      dwellTime: '5m 55s',
      customClicks: '18 clicks',
      engagement: '89% - HOT DECK',
      color: 'text-rose-400',
      fillColor: 'rgba(244, 63, 94, 0.15)',
      strokeColor: 'rgba(244, 63, 94, 0.6)',
      desc: 'Users spent continuous time viewing panoramic mountain landscape overlay. Highly indicative of luxury interest.',
      telemetryLog: [70, 72, 85, 89, 87, 91, 89]
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 rounded-3xl p-6 lg:p-10 backdrop-blur-md">
      {/* Left: Interactive Villa Map */}
      <div className="relative bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-2xl p-6 overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-[9px] text-zinc-600 dark:text-zinc-400 tracking-wider">LIVE TELEMETRY SIMULATOR</span>
          </div>
          <span className="text-[8px] font-mono text-zinc-500">ID: AWAAS_TELEMETRIC_NODE_4</span>
        </div>

        {/* CAD Floorplan SVG */}
        <svg viewBox="0 0 320 220" className="w-full h-auto" stroke="#3f3f46" strokeWidth="1.5" fill="none">
          {/* Grid lines in background */}
          <defs>
            <pattern id="gridSub" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="220" fill="url(#gridSub)" />

          {/* Living Room */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setActiveRoom('living')}
          >
            <rect 
              x="10" y="10" width="160" height="110" 
              fill={activeRoom === 'living' ? roomStats.living.fillColor : 'transparent'} 
              stroke={activeRoom === 'living' ? roomStats.living.strokeColor : '#27272a'} 
              strokeWidth={activeRoom === 'living' ? 2 : 1.5}
              style={{ transition: 'all 0.3s' }}
            />
            <text x="25" y="35" className={`font-semibold text-[10px] tracking-wide ${activeRoom === 'living' ? 'fill-indigo-400' : 'fill-zinc-500'}`} style={{ transition: 'all 0.3s' }}>LIVING ROOM</text>
            <text x="25" y="50" className="fill-zinc-600 text-[8px] font-mono">STAGE: OAK_FLOOR</text>
          </g>

          {/* Kitchen */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setActiveRoom('kitchen')}
          >
            <rect 
              x="170" y="10" width="140" height="110" 
              fill={activeRoom === 'kitchen' ? roomStats.kitchen.fillColor : 'transparent'} 
              stroke={activeRoom === 'kitchen' ? roomStats.kitchen.strokeColor : '#27272a'} 
              strokeWidth={activeRoom === 'kitchen' ? 2 : 1.5}
              style={{ transition: 'all 0.3s' }}
            />
            <text x="185" y="35" className={`font-semibold text-[10px] tracking-wide ${activeRoom === 'kitchen' ? 'fill-emerald-400' : 'fill-zinc-500'}`} style={{ transition: 'all 0.3s' }}>KITCHEN LAB</text>
            <text x="185" y="50" className="fill-zinc-600 text-[8px] font-mono">STAGE: MARBLE</text>
          </g>

          {/* Bedroom */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setActiveRoom('bedroom')}
          >
            <rect 
              x="10" y="125" width="180" height="85" 
              fill={activeRoom === 'bedroom' ? roomStats.bedroom.fillColor : 'transparent'} 
              stroke={activeRoom === 'bedroom' ? roomStats.bedroom.strokeColor : '#27272a'} 
              strokeWidth={activeRoom === 'bedroom' ? 2 : 1.5}
              style={{ transition: 'all 0.3s' }}
            />
            <text x="25" y="145" className={`font-semibold text-[10px] tracking-wide ${activeRoom === 'bedroom' ? 'fill-amber-400' : 'fill-zinc-500'}`} style={{ transition: 'all 0.3s' }}>MASTER SUITE</text>
            <text x="25" y="160" className="fill-zinc-600 text-[8px] font-mono">STAGE: NIGHT_LIGHT</text>
          </g>

          {/* Balcony */}
          <g 
            className="cursor-pointer group" 
            onClick={() => setActiveRoom('balcony')}
          >
            <rect 
              x="195" y="125" width="115" height="85" 
              fill={activeRoom === 'balcony' ? roomStats.balcony.fillColor : 'transparent'} 
              stroke={activeRoom === 'balcony' ? roomStats.balcony.strokeColor : '#27272a'} 
              strokeWidth={activeRoom === 'balcony' ? 2 : 1.5}
              style={{ transition: 'all 0.3s' }}
            />
            <text x="205" y="145" className={`font-semibold text-[10px] tracking-wide ${activeRoom === 'balcony' ? 'fill-rose-400' : 'fill-zinc-500'}`} style={{ transition: 'all 0.3s' }}>SKY DECK</text>
            <text x="205" y="160" className="fill-zinc-600 text-[8px] font-mono">PANORAMA: ACTIVE</text>
          </g>
        </svg>
        
        {/* Helper overlay */}
        <div className="mt-4 text-center text-zinc-500 text-[9px] font-mono uppercase tracking-wider">
          ▲ Click any room on the floorplan to inspect attention stats
        </div>
      </div>

      {/* Right: Detailed Telemetry Panel */}
      <div className="flex flex-col justify-between h-full bg-zinc-950 border border-zinc-200/80 dark:border-white/5 rounded-2xl p-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-400" />
              {roomStats[activeRoom].name}
            </h3>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-200/80 dark:border-white/5 ${roomStats[activeRoom].color}`}>
              {roomStats[activeRoom].engagement.split(' ')[2] || 'STABLE'}
            </span>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
            {roomStats[activeRoom].desc}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 p-3 rounded-xl">
              <div className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">Dwell Time</div>
              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white font-mono mt-1">{roomStats[activeRoom].dwellTime}</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 p-3 rounded-xl">
              <div className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">User Actions</div>
              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white font-mono mt-1">{roomStats[activeRoom].customClicks}</div>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 p-3 rounded-xl">
              <div className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">Lead Intent</div>
              <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white font-mono mt-1">{roomStats[activeRoom].engagement.split(' ')[0]}</div>
            </div>
          </div>
        </div>

        {/* Real-time Graph SVG */}
        <div>
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-2">
            <span>SESSION PROGRESSION</span>
            <span>ENGAGEMENT GRAPH</span>
          </div>
          <div className="h-16 w-full bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-white/5 overflow-hidden relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={roomStats[activeRoom].strokeColor.split(',').slice(0,3).join(',') + ', 0.2)'} />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path 
                d={`M 0 40 
                    L 0 ${40 - roomStats[activeRoom].telemetryLog[0]/2.5} 
                    Q 16 ${40 - roomStats[activeRoom].telemetryLog[1]/2.5} 16 ${40 - roomStats[activeRoom].telemetryLog[1]/2.5} 
                    Q 32 ${40 - roomStats[activeRoom].telemetryLog[2]/2.5} 32 ${40 - roomStats[activeRoom].telemetryLog[2]/2.5} 
                    Q 48 ${40 - roomStats[activeRoom].telemetryLog[3]/2.5} 48 ${40 - roomStats[activeRoom].telemetryLog[3]/2.5} 
                    Q 64 ${40 - roomStats[activeRoom].telemetryLog[4]/2.5} 64 ${40 - roomStats[activeRoom].telemetryLog[4]/2.5} 
                    Q 80 ${40 - roomStats[activeRoom].telemetryLog[5]/2.5} 80 ${40 - roomStats[activeRoom].telemetryLog[5]/2.5} 
                    Q 100 ${40 - roomStats[activeRoom].telemetryLog[6]/2.5} 100 ${40 - roomStats[activeRoom].telemetryLog[6]/2.5} 
                    L 100 40 Z`} 
                fill="url(#chartGrad)" 
              />
              <path 
                d={`M 0 ${40 - roomStats[activeRoom].telemetryLog[0]/2.5} 
                    Q 16 ${40 - roomStats[activeRoom].telemetryLog[1]/2.5} 16 ${40 - roomStats[activeRoom].telemetryLog[1]/2.5}
                    Q 32 ${40 - roomStats[activeRoom].telemetryLog[2]/2.5} 32 ${40 - roomStats[activeRoom].telemetryLog[2]/2.5}
                    Q 48 ${40 - roomStats[activeRoom].telemetryLog[3]/2.5} 48 ${40 - roomStats[activeRoom].telemetryLog[3]/2.5}
                    Q 64 ${40 - roomStats[activeRoom].telemetryLog[4]/2.5} 64 ${40 - roomStats[activeRoom].telemetryLog[4]/2.5}
                    Q 80 ${40 - roomStats[activeRoom].telemetryLog[5]/2.5} 80 ${40 - roomStats[activeRoom].telemetryLog[5]/2.5}
                    Q 100 ${40 - roomStats[activeRoom].telemetryLog[6]/2.5} 100 ${40 - roomStats[activeRoom].telemetryLog[6]/2.5}`} 
                fill="none" 
                stroke={roomStats[activeRoom].strokeColor} 
                strokeWidth="1.5"
                style={{ transition: 'all 0.5s' }}
              />
            </svg>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[8px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-widest pointer-events-none">
              REAL-TIME ATTENTION TELEMETRY OUT
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-component: Interactive FAQ Accordion
function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState(0)

  const faqs = [
    {
      q: 'Do buyers need virtual reality headsets to view properties?',
      a: 'Absolutely not. Awaas VR is built on WebXR technology, meaning it renders beautifully on any device: smartphones, tablets, laptops, and desktop computers. When a VR headset (like Meta Quest or Apple Vision Pro) is connected, the app seamlessly unlocks a full 1:1 scale spatial walkthrough.'
    },
    {
      q: 'What 3D model formats does Awaas support?',
      a: 'We support standard CAD/BIM formats, including GLB, GLTF, FBX, OBJ, and USDZ. Our backend automatically optimizes high-poly models, compressing meshes and materials to stream seamlessly to mobile browsers without quality degradation.'
    },
    {
      q: 'How does the user hierarchy work?',
      a: 'Awaas employs a secure four-tier Role-Based Access Control (RBAC) model. (1) Platform Admins control the global service, (2) Builders create individual developments, (3) Sales Managers supervise agency teams and lead lists, and (4) Members (agents) build customized staging presets and host tours with buyers.'
    },
    {
      q: 'Can agents voice chat with clients inside the tour?',
      a: 'Yes. Awaas includes built-in spatial WebRTC audio. Agents and buyers can speak in real-time as they walk through rooms, and their audio is spatialized to feel like they are standing in the same physical space.'
    },
    {
      q: 'Is there a limit to how many tours we can host?',
      a: 'No. The platform supports unlimited concurrent staging links and virtual open houses. Your staging designs are compiled as static files, allowing thousands of viewers to browse simultaneously without server lag.'
    }
  ]

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx
        return (
          <div 
            key={idx}
            className="border border-zinc-200/80 dark:border-white/5 rounded-2xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-zinc-900 dark:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform duration-350 ${isOpen ? 'rotate-180 text-zinc-900 dark:text-white' : ''}`} />
            </button>
            <div 
              className={`transition-all duration-350 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-48 border-t border-zinc-200/80 dark:border-white/5 opacity-100 p-5' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Landing
