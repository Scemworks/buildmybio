'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Terminal, Download, Loader2, Sparkles, Key, Eye, ChevronDown } from 'lucide-react';
import { fetchGitHubData, GitHubData, fetchAdvancedGitHubData, AdvancedGitHubData } from '@/lib/github';
import { generateNeofetchSVG, CustomizationData, downloadFilesZip } from '@/lib/generateFiles';
import { generateAdvancedStatsSVG } from '@/lib/AdvancedStats';
import NeofetchPreview from '@/components/NeofetchPreview';



export default function Home() {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [advancedData, setAdvancedData] = useState<AdvancedGitHubData | null>(null);
  const [isFetchingAdvanced, setIsFetchingAdvanced] = useState(false);
  const [advancedError, setAdvancedError] = useState('');
  const [customData, setCustomData] = useState<CustomizationData>({
    status: 'online',
    mood: 'building . learning',
    tagline: 'Building cool stuff, one commit at a time',
    infoFields: [
      { label: 'OS', value: 'GitHub Flavored Linux' },
      { label: 'Host', value: '' },
      { label: 'City', value: '' },
      { label: 'Role', value: '' },
      { label: 'Tools', value: '' },
      { label: 'Lang', value: '' },
      { label: 'Editor', value: 'VS Code' }
    ],
    projects: [],
    includeAdvancedStats: false,
    includePrivateCommits: false
  });

  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);

  // ─── Background parallax (DOM-only, zero React re-renders) ─────
  const bgLayer0Ref = useRef<HTMLDivElement>(null);
  const bgLayer1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bgLayer0Ref.current) bgLayer0Ref.current.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
        if (bgLayer1Ref.current) bgLayer1Ref.current.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero scroll progress for fade-out
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.8], [1, 0.96]);

  const handleFetchAdvanced = async () => {
    if (!githubData) return;
    setIsFetchingAdvanced(true);
    setAdvancedError('');
    try {
      const cacheKey = `advancedData_${githubData.username.toLowerCase()}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setAdvancedData(JSON.parse(cached));
        setIsFetchingAdvanced(false);
        return;
      }
      
      const res = await fetch(`/api/advanced?username=${githubData.username}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch advanced stats.');
      
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      setAdvancedData(data);
    } catch (err: any) {
      setAdvancedError(err.message || 'Failed to fetch advanced stats.');
    } finally {
      setIsFetchingAdvanced(false);
    }
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput) return;
    
    setLoading(true);
    setError('');
    setAdvancedData(null);
    setAdvancedError('');
    setHasGeneratedPreview(false);
    
    try {
      const cacheKey = `githubData_${usernameInput.toLowerCase()}`;
      const cached = sessionStorage.getItem(cacheKey);
      let data: GitHubData;
      if (cached) {
        data = JSON.parse(cached);
      } else {
        data = await fetchGitHubData(usernameInput);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }
      
      setGithubData(data);
      
      const defaultFields = [
        { label: 'OS', value: 'GitHub Flavored Linux' },
        { label: 'Host', value: `${data.username}.github.io` },
        { label: 'City', value: data.location || 'The Internet' },
        { label: 'Role', value: data.inferredRole },
        { label: 'Tools', value: data.topTopics || 'Git, GitHub' },
        { label: 'Lang', value: data.topLanguages || 'HTML, CSS' },
        { label: 'Editor', value: 'VS Code' }
      ];

      setCustomData(prev => ({
        ...prev,
        infoFields: defaultFields,
        projects: data.topProjects.map(p => ({ ...p })),
        mood: data.inferredMood,
        tagline: data.inferredTagline
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = async () => {
    if (!githubData) return;
    setHasGeneratedPreview(true);
    if (customData.includeAdvancedStats && !advancedData && !isFetchingAdvanced) {
      await handleFetchAdvanced();
    }
    setTimeout(() => {
      document.getElementById('preview-pane')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    if (hasGeneratedPreview && customData.includeAdvancedStats && !advancedData && !isFetchingAdvanced) {
      handleFetchAdvanced();
    }
  }, [hasGeneratedPreview, customData.includeAdvancedStats, advancedData, isFetchingAdvanced]);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomData(prev => ({ ...prev, [name]: value }));
  };

  const handleInfoFieldChange = (index: number, key: 'label' | 'value', val: string) => {
    setCustomData(prev => {
      const newFields = [...prev.infoFields];
      if (newFields[index]) {
        newFields[index] = { ...newFields[index], [key]: val };
      }
      return { ...prev, infoFields: newFields };
    });
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    setCustomData(prev => {
      const newProjects = [...prev.projects];
      if (newProjects[index]) {
        newProjects[index] = { ...newProjects[index], [field]: value };
      }
      return { ...prev, projects: newProjects };
    });
  };

  const handleDownload = async () => {
    if (githubData && customData) {
      await downloadFilesZip(githubData, customData);
    }
  };

  return (
    <main className="grain-overlay min-h-screen bg-[#141210] text-[#f0ebe3] font-sans">

      {/* ═══════════════════════════════════════════════════════════
          LAYER 0 — Deep background parallax (radial warm glow)
         ═══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div ref={bgLayer0Ref}>
          {/* Warm radial gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#c2703e]/[0.04] blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full bg-[#d4956a]/[0.03] blur-[130px]" />
          <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-[#8b6914]/[0.02] blur-[100px]" />
        </div>

        {/* Decorative dot grid — parallax layer 1 */}
        <div
          ref={bgLayer1Ref}
          className="absolute inset-0 opacity-[0.03]"
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dotgrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="#e8dcc8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)" />
          </svg>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO
         ═══════════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
      >
        {/* Logo mark */}
        <motion.div 
          initial={{ opacity: 0, y: -20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center p-4 bg-[#1e1c1a] rounded-2xl ring-1 ring-[#e8dcc8]/[0.08] shadow-xl">
            <Terminal className="w-7 h-7 text-[#c2703e]" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[#f0ebe3] mb-5">
            BuildMy<span className="text-[#c2703e]">Bio</span>
          </h1>
          <p className="text-base md:text-lg text-[#e8dcc8]/60 max-w-xl mx-auto font-light leading-relaxed">
            Generate an animated, self-updating terminal SVG for your GitHub Profile.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl"
        >
          <form onSubmit={handleFetch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#c2703e]/10 to-[#d4956a]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-[#1e1c1a] border border-[#e8dcc8]/[0.06] rounded-xl p-1.5 sm:p-2 shadow-2xl transition-all duration-300 focus-within:border-[#c2703e]/30 gap-2 sm:gap-0">
              <input
                type="text"
                placeholder="Enter your GitHub Username"
                className="w-full bg-transparent border-none text-[#f0ebe3] placeholder-[#e8dcc8]/20 px-4 sm:px-5 py-3 sm:py-3.5 focus:outline-none focus:ring-0 text-base font-light text-center sm:text-left"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-[#c2703e] hover:bg-[#d4956a] text-[#141210] px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 w-full sm:w-auto text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 opacity-80" />}
                <span className="ml-2">{loading ? 'Loading' : 'Initialize'}</span>
              </button>
            </div>
          </form>
          {error && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-4 text-center font-medium bg-red-400/10 py-3 rounded-xl border border-red-400/20">
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Scroll indicator */}
        {githubData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-[#e8dcc8]/30 uppercase tracking-[0.2em] font-medium">Scroll to configure</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-[#c2703e]/50" />
            </motion.div>
          </motion.div>
        )}
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — CONFIGURATION
         ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10">
        <AnimatePresence>
          {githubData && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
            >
              {/* Section header */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-4 mb-10"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#c2703e]/15 text-[#c2703e] text-sm font-bold ring-1 ring-[#c2703e]/20">1</span>
                <h2 className="text-2xl font-semibold text-[#f0ebe3] tracking-tight">Configure Profile</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#e8dcc8]/10 to-transparent" />
              </motion.div>

              <div
                className="grid grid-cols-1 md:grid-cols-12 gap-5"
              >
                {/* ── Identity Card ── */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="md:col-span-5 bg-[#1e1c1a] border border-[#e8dcc8]/[0.05] hover:border-[#c2703e]/20 rounded-2xl p-7 shadow-xl transition-colors duration-300 group"
                >
                  <h3 className="text-base font-medium text-[#f0ebe3] mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e8dcc8]/30 group-hover:bg-[#c2703e] transition-colors" />
                    Identity
                  </h3>
                  <div className="space-y-5">
                    <Field label="Status" name="status" value={customData.status} onChange={handleCustomChange} />
                    <Field label="Mood / Bio" name="mood" value={customData.mood} onChange={handleCustomChange} />
                    <Field label="Tagline" name="tagline" value={customData.tagline} onChange={handleCustomChange} />
                  </div>
                </motion.div>

                {/* ── Categories Card ── */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="md:col-span-7 bg-[#1e1c1a] border border-[#e8dcc8]/[0.05] hover:border-[#c2703e]/20 rounded-2xl p-7 shadow-xl transition-colors duration-300 group"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-medium text-[#f0ebe3] flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e8dcc8]/30 group-hover:bg-[#d4956a] transition-colors" />
                      Categories
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setCustomData(p => ({ ...p, infoFields: [...p.infoFields, { label: 'New', value: 'Value' }] }))}
                      className="text-xs bg-[#e8dcc8]/[0.06] hover:bg-[#c2703e]/15 hover:text-[#c2703e] px-3 py-1.5 rounded-lg transition-colors text-[#e8dcc8]/50 font-medium"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2.5 overflow-y-auto pr-2 max-h-[350px] sm:max-h-[280px] custom-scrollbar">
                    {customData.infoFields.map((field, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-[#141210]/60 p-2.5 rounded-xl border border-[#e8dcc8]/[0.03] relative">
                        <div className="flex items-center gap-2 w-full sm:w-1/3">
                          <input
                            className="bg-transparent px-3 py-1.5 text-sm text-[#c2703e] focus:outline-none focus:ring-1 focus:ring-[#c2703e]/30 rounded-lg w-full font-medium placeholder-[#c2703e]/30"
                            placeholder="Category"
                            value={field.label}
                            onChange={e => handleInfoFieldChange(idx, 'label', e.target.value)}
                          />
                          <span className="text-[#e8dcc8]/15 hidden sm:inline">:</span>
                        </div>
                        <div className="flex items-center gap-2 w-full flex-1">
                          <input
                            className="bg-transparent px-3 py-1.5 text-sm text-[#f0ebe3] focus:outline-none focus:ring-1 focus:ring-[#c2703e]/30 rounded-lg w-full placeholder-[#e8dcc8]/20"
                            placeholder="Content"
                            value={field.value}
                            onChange={e => handleInfoFieldChange(idx, 'value', e.target.value)}
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              const newFields = customData.infoFields.filter((_, i) => i !== idx);
                              setCustomData(p => ({ ...p, infoFields: newFields }));
                            }}
                            className="text-red-400/50 hover:text-red-400 hover:bg-red-400/10 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg transition-colors font-bold absolute sm:relative right-2 top-2 sm:right-auto sm:top-auto text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Top Projects Card ── */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="md:col-span-6 bg-[#1e1c1a] border border-[#e8dcc8]/[0.05] hover:border-[#c2703e]/20 rounded-2xl p-7 shadow-xl transition-colors duration-300 group"
                >
                  <h3 className="text-base font-medium text-[#f0ebe3] mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e8dcc8]/30 group-hover:bg-[#d4956a] transition-colors" />
                    Top Projects
                  </h3>
                  <div className="space-y-4">
                    {customData.projects.map((proj, idx) => (
                      <div key={idx} className="bg-[#141210]/40 p-5 rounded-xl border border-[#e8dcc8]/[0.03] grid grid-cols-1 gap-3 relative overflow-hidden group/item hover:border-[#c2703e]/15 transition-colors">
                        <div className="absolute top-0 left-0 w-0.5 h-full bg-[#383430] group-hover/item:bg-[#c2703e]/40 transition-colors" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-3">
                          <input
                            className="bg-[#e8dcc8]/[0.03] border border-[#e8dcc8]/[0.06] rounded-lg px-3 py-2 text-sm text-[#f0ebe3] placeholder-[#e8dcc8]/20 focus:outline-none focus:border-[#c2703e]/30 transition-colors w-full"
                            placeholder="Name"
                            value={proj.name}
                            onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                          />
                          <input
                            className="bg-[#e8dcc8]/[0.03] border border-[#e8dcc8]/[0.06] rounded-lg px-3 py-2 text-sm text-[#f0ebe3] placeholder-[#e8dcc8]/20 focus:outline-none focus:border-[#c2703e]/30 transition-colors w-full"
                            placeholder="Language (e.g. JS)"
                            value={proj.language || ''}
                            onChange={e => handleProjectChange(idx, 'language', e.target.value)}
                          />
                        </div>
                        <input
                          className="bg-[#e8dcc8]/[0.03] border border-[#e8dcc8]/[0.06] rounded-lg px-3 py-2 text-sm text-[#f0ebe3] placeholder-[#e8dcc8]/20 focus:outline-none focus:border-[#c2703e]/30 w-full ml-3 transition-colors"
                          placeholder="URL"
                          value={proj.url}
                          onChange={e => handleProjectChange(idx, 'url', e.target.value)}
                        />
                      </div>
                    ))}
                    {customData.projects.length === 0 && (
                      <div className="h-full flex items-center justify-center p-8 bg-[#141210]/30 rounded-xl border border-dashed border-[#e8dcc8]/[0.06]">
                        <p className="text-sm text-[#e8dcc8]/30 font-medium">No public projects found.</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* ── Advanced Stats Card ── */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="md:col-span-6 bg-gradient-to-br from-[#1e1c1a] to-[#181614] border border-[#e8dcc8]/[0.05] hover:border-[#c2703e]/20 rounded-2xl p-7 shadow-xl transition-colors duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                    <Sparkles className="w-28 h-28 text-[#c2703e]" />
                  </div>
                  
                  <h3 className="text-base font-medium text-[#f0ebe3] mb-6 flex items-center gap-3 relative z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e8dcc8]/30 group-hover:bg-[#c2703e] transition-colors" />
                    Advanced Integrations
                  </h3>
                  
                  <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
                    <label className="flex items-start gap-4 cursor-pointer p-5 bg-[#141210]/40 rounded-xl border border-[#e8dcc8]/[0.03] hover:border-[#c2703e]/15 transition-colors">
                      <div className="relative flex items-center justify-center pt-0.5">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={customData.includeAdvancedStats || false}
                          onChange={e => setCustomData(p => ({ ...p, includeAdvancedStats: e.target.checked }))}
                        />
                        <div className="w-5 h-5 bg-[#141210] border border-[#e8dcc8]/15 rounded peer-checked:bg-[#c2703e] peer-checked:border-[#c2703e] transition-colors flex items-center justify-center">
                          <svg className={`w-3.5 h-3.5 text-[#141210] pointer-events-none transition-transform ${customData.includeAdvancedStats ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                      <div>
                        <span className="text-[#f0ebe3] font-medium block text-sm mb-1.5">Generate Advanced Stats SVG</span>
                        <span className="text-xs text-[#e8dcc8]/40 block leading-relaxed font-light">
                          Adds an animated stats card displaying lifetime commits, PRs, and top languages.
                        </span>
                      </div>
                    </label>
                    
                    <AnimatePresence>
                      {customData.includeAdvancedStats && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pl-4">
                            <label className="flex items-start gap-3 cursor-pointer p-3 bg-[#141210]/30 rounded-xl border border-[#e8dcc8]/[0.03] hover:border-[#c2703e]/15 transition-colors">
                              <div className="relative flex items-center justify-center pt-0.5">
                                <input
                                  type="checkbox"
                                  className="peer sr-only"
                                  checked={customData.includePrivateCommits || false}
                                  onChange={e => setCustomData(p => ({ ...p, includePrivateCommits: e.target.checked }))}
                                />
                                <div className="w-5 h-5 bg-[#1e1c1a] border border-[#e8dcc8]/10 rounded flex items-center justify-center peer-checked:bg-[#c2703e] peer-checked:border-[#c2703e] transition-colors">
                                  <svg className={`w-3 h-3 text-[#141210] pointer-events-none transition-transform ${customData.includePrivateCommits ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                              </div>
                              <div>
                                <span className="text-[#f0ebe3] font-medium block text-sm">Include Private Commits</span>
                                <span className="text-xs text-[#e8dcc8]/35 block mt-0.5">
                                  Your private contributions will be added to the total lifetime commits count.
                                </span>
                              </div>
                            </label>


                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Setup Required Block */}
              <div className="mt-8 bg-[#c2703e]/[0.08] border border-[#c2703e]/20 rounded-xl p-5 shadow-inner max-w-2xl mx-auto">
                <h4 className="text-[#c2703e] font-bold text-sm flex items-center gap-2 mb-3 tracking-wide uppercase">
                  <Key className="w-4 h-4" /> Setup Required After Download
                </h4>
                <p className="text-sm text-[#d4956a]/80 mb-4 leading-relaxed">
                  To avoid API rate limits and include private commits, you must add a <code className="bg-[#141210]/60 px-1 py-0.5 rounded text-[#c2703e] font-mono">GH_PAT</code> secret with <code className="bg-[#141210]/60 px-1 py-0.5 rounded text-[#c2703e] font-mono">read:user</code> and <code className="bg-[#141210]/60 px-1 py-0.5 rounded text-[#c2703e] font-mono">repo</code> scopes to your repository's <strong>Actions Secrets</strong>.
                </p>
                <ol className="text-sm text-[#e8dcc8]/60 space-y-3 list-none">
                  <li className="flex gap-3 items-center">
                    <span className="bg-[#c2703e]/20 text-[#c2703e] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                    <span>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-[#c2703e] underline hover:text-[#d4956a]">github.com/settings/tokens</a> → Generate new token (Classic)</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="bg-[#c2703e]/20 text-[#c2703e] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                    <span>Name it, set expiration, and check <code className="bg-[#141210]/60 px-1 rounded text-[#c2703e]">read:user</code> and <code className="bg-[#141210]/60 px-1 rounded text-[#c2703e]">repo</code> scopes</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="bg-[#c2703e]/20 text-[#c2703e] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                    <span>Generate and copy the token</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="bg-[#c2703e]/20 text-[#c2703e] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px]">4</span>
                    <span>In your profile repo, go to <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="bg-[#c2703e]/20 text-[#c2703e] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px]">5</span>
                    <span>Add a <strong>New repository secret</strong> named <code className="bg-[#141210]/60 px-1 rounded text-[#c2703e]">GH_PAT</code> and paste the token</span>
                  </li>
                </ol>
              </div>

              {/* Render Preview CTA */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mt-14 flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={handleGeneratePreview}
                  className="flex items-center gap-3 bg-[#c2703e] hover:bg-[#d4956a] text-[#141210] px-10 py-4 rounded-full font-semibold text-base transition-all shadow-[0_0_0_0_rgba(194,112,62,0)] hover:shadow-[0_0_40px_rgba(194,112,62,0.15)]"
                >
                  <Eye className="w-5 h-5 opacity-80" /> Render Preview
                </motion.button>
              </motion.div>

            </motion.section>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — PREVIEW OUTPUT
           ═══════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {githubData && hasGeneratedPreview && (
            <motion.section
              id="preview-pane"
              initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32"
            >
              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c2703e]/20 to-transparent mb-16" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 px-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#c2703e]/15 text-[#c2703e] text-sm font-bold ring-1 ring-[#c2703e]/20">2</span>
                  <h2 className="text-2xl font-semibold text-[#f0ebe3] tracking-tight">Output</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-[#1e1c1a] hover:bg-[#2a2724] border border-[#e8dcc8]/[0.06] text-[#f0ebe3] px-6 py-2.5 rounded-full text-sm font-medium transition-colors w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4 opacity-60" /> Download Source
                </motion.button>
              </div>
              
              {/* Terminal window */}
              <div className="bg-[#0d1117] rounded-2xl border border-[#e8dcc8]/[0.06] overflow-hidden shadow-2xl">
                {/* Title bar */}
                <div className="bg-[#1a1816] px-6 py-4 border-b border-[#e8dcc8]/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#c2703e]/70"></div>
                      <div className="w-3 h-3 rounded-full bg-[#d4956a]/50"></div>
                      <div className="w-3 h-3 rounded-full bg-[#e8dcc8]/30"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#e8dcc8]/30 bg-[#141210]/40 px-3 py-1 rounded-md border border-[#e8dcc8]/[0.04]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>
                    <span className="text-xs font-mono">README.md</span>
                  </div>
                  <div className="w-[52px]"></div>
                </div>
                <div className="p-6 md:p-10 flex flex-col items-center gap-8 min-h-[500px]">
                  
                  {/* Base Neofetch Preview */}
                  <NeofetchPreview svgString={generateNeofetchSVG(githubData, customData)} />
                  
                  {/* Advanced Stats Preview */}
                  {customData.includeAdvancedStats && (
                    <div className="w-full max-w-[800px] flex flex-col items-center">
                      {!advancedData ? (
                        <div className="w-full aspect-[800/530] border-2 border-dashed border-[#c2703e]/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#c2703e]/[0.03]">
                          <Loader2 className="w-8 h-8 animate-spin text-[#c2703e] mb-4" />
                          <h4 className="text-[#f0ebe3] font-bold text-lg mb-2">Generating Advanced Stats...</h4>
                          <p className="text-sm text-[#e8dcc8]/40 max-w-sm">Fetching detailed language stats, lifetime commits, and contribution history from GitHub.</p>
                        </div>
                      ) : (
                        <NeofetchPreview svgString={generateAdvancedStatsSVG(githubData.username, githubData.name, advancedData, customData)} />
                      )}
                      {advancedError && <p className="text-red-400 text-sm mt-4 bg-red-400/10 py-2 px-4 rounded-lg font-medium">{advancedError}</p>}
                    </div>
                  )}
                  
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-[#e8dcc8]/[0.04] py-8 text-center">
        <p className="text-xs text-[#e8dcc8]/20 tracking-wide">
          Built with intent — not templates.
        </p>
      </footer>

    </main>
  );
}

// ─── Reusable field component ────────────────────────────────────
function Field({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: any }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-semibold text-[#e8dcc8]/30 uppercase tracking-[0.15em]">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#141210]/60 hover:bg-[#141210] border-b border-[#e8dcc8]/[0.06] hover:border-[#c2703e]/20 focus:border-[#c2703e]/40 rounded-t-lg px-4 py-3 text-[#f0ebe3] focus:outline-none transition-colors font-light placeholder-[#e8dcc8]/15 text-sm"
      />
    </div>
  );
}
