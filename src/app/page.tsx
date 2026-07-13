'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Download, Loader2, Sparkles, Key, Eye } from 'lucide-react';
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
    setHasGeneratedPreview(false); // Reset preview on new fetch
    
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
      
      // Auto-fill customizations based on fetched data
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
    // Scroll to preview smoothly
    setTimeout(() => {
      document.getElementById('preview-pane')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    // If preview is active and they toggle advanced stats, fetch it automatically
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
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-blue-500/30 font-sans selection:text-blue-200 pb-32 overflow-hidden">
      {/* Sophisticated ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="inline-flex items-center justify-center p-3.5 bg-white/[0.03] backdrop-blur-md rounded-2xl mb-6 ring-1 ring-white/10 shadow-xl"
          >
            <Terminal className="w-7 h-7 text-neutral-300" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">
            BuildMy<span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-white">Bio</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Generate an animated, self-updating terminal SVG for your GitHub Profile.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto mb-20"
        >
          <form onSubmit={handleFetch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-[#111] border border-white/10 rounded-2xl p-1.5 sm:p-2 shadow-2xl transition-all duration-300 focus-within:border-white/20 focus-within:shadow-[0_0_40px_rgba(255,255,255,0.05)] gap-2 sm:gap-0">
              <input
                type="text"
                placeholder="Enter your GitHub Username"
                className="w-full bg-transparent border-none text-white placeholder-neutral-600 px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:ring-0 text-base sm:text-lg font-light text-center sm:text-left"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-white text-black hover:bg-neutral-200 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg active:scale-95 w-full sm:w-auto"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 opacity-70" />}
                <span className="ml-2.5">{loading ? 'Loading' : 'Initialize'}</span>
              </button>
            </div>
          </form>
          {error && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-4 text-center font-medium bg-red-400/10 py-3 rounded-xl border border-red-400/20">
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Bento Grid Configuration Area */}
        <AnimatePresence>
          {githubData && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="mb-20"
            >
              <motion.h2 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-2xl font-semibold text-white mb-8 flex items-center gap-3 tracking-tight"
              >
                <span className="bg-white/10 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border border-white/5 shadow-sm">1</span> 
                Configure Profile
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Identity Card */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="md:col-span-5 bg-[#111] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 shadow-xl flex flex-col transition-colors group"
                >
                  <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 group-hover:bg-emerald-400 transition-colors" />
                    Identity
                  </h3>
                  <div className="space-y-4 flex-1">
                    <Field label="Status" name="status" value={customData.status} onChange={handleCustomChange} />
                    <Field label="Mood / Bio" name="mood" value={customData.mood} onChange={handleCustomChange} />
                    <Field label="Tagline (Below ASCII Name)" name="tagline" value={customData.tagline} onChange={handleCustomChange} />
                  </div>
                </motion.div>

                {/* Categories Card */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="md:col-span-7 bg-[#111] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 shadow-xl flex flex-col transition-colors group"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-white flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-neutral-400 group-hover:bg-blue-400 transition-colors" />
                      Categories
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setCustomData(p => ({ ...p, infoFields: [...p.infoFields, { label: 'New', value: 'Value' }] }))}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-white font-medium shadow-sm"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-3 overflow-y-auto pr-2 max-h-[350px] sm:max-h-[280px] custom-scrollbar">
                    {customData.infoFields.map((field, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-black/20 p-2 sm:p-2 rounded-xl border border-white/5 relative">
                        <div className="flex items-center gap-2 w-full sm:w-1/3">
                          <input
                            className="bg-transparent px-3 py-1.5 text-sm text-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded-lg w-full font-medium placeholder-blue-200/30"
                            placeholder="Category"
                            value={field.label}
                            onChange={e => handleInfoFieldChange(idx, 'label', e.target.value)}
                          />
                          <span className="text-white/20 hidden sm:inline">:</span>
                        </div>
                        <div className="flex items-center gap-2 w-full flex-1">
                          <input
                            className="bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded-lg w-full placeholder-white/30"
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
                            className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg transition-colors font-bold absolute sm:relative right-2 top-2 sm:right-auto sm:top-auto"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Top Projects Card */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="md:col-span-6 bg-[#111] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 shadow-xl flex flex-col transition-colors group"
                >
                  <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 group-hover:bg-purple-400 transition-colors" />
                    Top Projects
                  </h3>
                  <div className="space-y-4">
                    {customData.projects.map((proj, idx) => (
                      <div key={idx} className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 grid grid-cols-1 gap-3 relative overflow-hidden group/item hover:bg-white/[0.04] transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-neutral-800 group-hover/item:bg-purple-500/50 transition-colors" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-3">
                          <input
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors w-full"
                            placeholder="Name"
                            value={proj.name}
                            onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                          />
                          <input
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors w-full"
                            placeholder="Language (e.g. JS)"
                            value={proj.language || ''}
                            onChange={e => handleProjectChange(idx, 'language', e.target.value)}
                          />
                        </div>
                        <input
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 w-full sm:ml-2 transition-colors ml-0 mt-1 sm:mt-0"
                          style={{ width: 'calc(100% - 0.5rem)' }}
                          placeholder="URL"
                          value={proj.url}
                          onChange={e => handleProjectChange(idx, 'url', e.target.value)}
                        />
                      </div>
                    ))}
                    {customData.projects.length === 0 && (
                      <div className="h-full flex items-center justify-center p-8 bg-black/10 rounded-xl border border-dashed border-white/10">
                        <p className="text-sm text-neutral-500 font-medium">No public projects found.</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Advanced Stats Card */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="md:col-span-6 bg-gradient-to-br from-neutral-900 to-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 shadow-xl flex flex-col transition-colors relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                    <Sparkles className="w-32 h-32 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-3 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 group-hover:bg-amber-400 transition-colors" />
                    Advanced Integrations
                  </h3>
                  
                  <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
                    <label className="flex items-start gap-4 cursor-pointer p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="relative flex items-center justify-center pt-0.5">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={customData.includeAdvancedStats || false}
                          onChange={e => setCustomData(p => ({ ...p, includeAdvancedStats: e.target.checked }))}
                        />
                        <div className="w-5 h-5 bg-black border border-white/20 rounded peer-checked:bg-white peer-checked:border-white transition-colors flex items-center justify-center">
                          <svg className={`w-3.5 h-3.5 text-black pointer-events-none transition-transform ${customData.includeAdvancedStats ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium block text-base mb-1.5">Generate Advanced Stats SVG</span>
                        <span className="text-sm text-neutral-500 block leading-relaxed font-light">
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
                          <div className="pt-4 pl-4">
                            <label className="flex items-start gap-3 cursor-pointer p-3 bg-black/20 rounded-xl border border-white/5 hover:bg-black/30 transition-colors">
                              <div className="relative flex items-center justify-center pt-0.5">
                                <input
                                  type="checkbox"
                                  className="peer sr-only"
                                  checked={customData.includePrivateCommits || false}
                                  onChange={e => setCustomData(p => ({ ...p, includePrivateCommits: e.target.checked }))}
                                />
                                <div className="w-5 h-5 bg-neutral-800 border-2 border-neutral-600 rounded flex items-center justify-center peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors">
                                  <svg className={`w-3 h-3 text-white pointer-events-none transition-transform ${customData.includePrivateCommits ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                              </div>
                              <div>
                                <span className="text-white font-medium block text-sm">Include Private Commits</span>
                                <span className="text-xs text-blue-200/60 block mt-0.5">
                                  Your private contributions will be added to the total lifetime commits count.
                                </span>
                              </div>
                            </label>

                            {customData.includePrivateCommits && (
                              <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 shadow-inner">
                                <h4 className="text-amber-400 font-bold text-xs flex items-center gap-2 mb-2 tracking-wide uppercase">
                                  <Key className="w-3.5 h-3.5" /> Setup Required After Download
                                </h4>
                                <p className="text-xs text-amber-200/70 mb-3 leading-relaxed">
                                  To access private commits, you must add a <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">GH_PAT</code> secret with <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">read:user</code> and <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">repo</code> scopes to your repository's <strong>Actions Secrets</strong>.
                                </p>
                                <ol className="text-xs text-amber-100/70 space-y-2 list-none">
                                  <li className="flex gap-2">
                                    <span className="bg-amber-500/20 text-amber-400 font-bold w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[9px]">1</span>
                                    <span>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">github.com/settings/tokens</a> → Generate new token (Classic)</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <span className="bg-amber-500/20 text-amber-400 font-bold w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[9px]">2</span>
                                    <span>Name it, set expiration, and check <code className="bg-black/40 px-1 rounded text-amber-300">read:user</code> and <code className="bg-black/40 px-1 rounded text-amber-300">repo</code> scopes</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <span className="bg-amber-500/20 text-amber-400 font-bold w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[9px]">3</span>
                                    <span>Generate and copy the token</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <span className="bg-amber-500/20 text-amber-400 font-bold w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[9px]">4</span>
                                    <span>In your profile repo, go to <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></span>
                                  </li>
                                  <li className="flex gap-2">
                                    <span className="bg-amber-500/20 text-amber-400 font-bold w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[9px]">5</span>
                                    <span>Add a <strong>New repository secret</strong> named <code className="bg-black/40 px-1 rounded text-amber-300">GH_PAT</code> and paste the token</span>
                                  </li>
                                </ol>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Action Bar */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mt-16 flex justify-center sticky top-6 z-50"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={handleGeneratePreview}
                  className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-medium text-lg transition-shadow shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-black/5"
                >
                  <Eye className="w-5 h-5 opacity-70" /> Render Preview
                </motion.button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Pane Area */}
        <AnimatePresence>
          {githubData && hasGeneratedPreview && (
            <motion.div
              id="preview-pane"
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              className="mt-8 border-t border-white/5 pt-20"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 px-2">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3 tracking-tight">
                  <span className="bg-white/10 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border border-white/5 flex-shrink-0">2</span> 
                  Output
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4 opacity-70" /> Download Source
                </motion.button>
              </div>
              
              <div className="bg-[#0d1117] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="bg-[#161b22] px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400 bg-black/20 px-3 py-1 rounded-md border border-white/5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>
                    <span className="text-xs font-mono">README.md</span>
                  </div>
                  <div className="w-[52px]"></div> {/* Spacer for balance */}
                </div>
                <div className="p-8 md:p-12 flex flex-col items-center gap-8 min-h-[500px]">
                  
                  {/* Base Neofetch Preview */}
                  <NeofetchPreview svgString={generateNeofetchSVG(githubData, customData)} />
                  
                  {/* Advanced Stats Preview */}
                  {customData.includeAdvancedStats && (
                    <div className="w-full max-w-[800px] flex flex-col items-center">
                      {!advancedData ? (
                        <div className="w-full aspect-[800/530] border-2 border-dashed border-blue-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-blue-500/5">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mb-4" />
                          <h4 className="text-white font-bold text-lg mb-2">Generating Advanced Stats...</h4>
                          <p className="text-sm text-blue-200/60 max-w-sm">Fetching detailed language stats, lifetime commits, and contribution history from GitHub.</p>
                        </div>
                      ) : (
                        <NeofetchPreview svgString={generateAdvancedStatsSVG(githubData.username, githubData.name, advancedData, customData)} />
                      )}
                      {advancedError && <p className="text-red-400 text-sm mt-4 bg-red-400/10 py-2 px-4 rounded-lg font-medium">{advancedError}</p>}
                    </div>
                  )}
                  
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
}

function Field({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: any }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors font-light placeholder-neutral-600"
      />
    </div>
  );
}
