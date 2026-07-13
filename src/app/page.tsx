'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Download, Loader2, Sparkles, Key } from 'lucide-react';
import { fetchGitHubData, GitHubData, fetchAdvancedGitHubData, AdvancedGitHubData } from '@/lib/github';
import { generateNeofetchSVG, CustomizationData, downloadFilesZip } from '@/lib/generateFiles';
import { generateAdvancedStatsSVG } from '@/lib/mockAdvancedStats';
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
    includeAdvancedStats: false
  });

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
    <main className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-blue-500/30 font-sans selection:text-blue-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/20">
            <Terminal className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Neofetch <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Profile Generator</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Generate an animated, self-updating terminal-style SVG for your GitHub profile README.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-16"
        >
          <form onSubmit={handleFetch} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-neutral-900 rounded-xl ring-1 ring-white/10 p-1">
              <input
                type="text"
                placeholder="Enter GitHub Username"
                className="w-full bg-transparent border-none text-white placeholder-neutral-500 px-4 py-3 focus:outline-none focus:ring-0"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span className="ml-2">{loading ? 'Fetching...' : 'Generate'}</span>
              </button>
            </div>
          </form>
          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence>
          {githubData && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
            >
              
              {/* Preview Column */}
              <div className="flex flex-col gap-6 lg:sticky lg:top-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" /> README Preview
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Download className="w-4 h-4" /> Download ZIP
                  </button>
                </div>
                
                <div className="bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>
                    <span className="text-sm font-semibold text-neutral-200">README.md</span>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col items-center gap-6">
                    <NeofetchPreview svgString={generateNeofetchSVG(githubData, customData)} />
                    
                    {customData.includeAdvancedStats && (
                      <>
                        {!advancedData ? (
                          <div className="w-full max-w-[800px] aspect-[800/530] border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white/5">
                            <Sparkles className="w-8 h-8 text-blue-400/60 mb-3" />
                            <h4 className="text-white font-medium mb-2">Advanced Stats Pending</h4>
                            <p className="text-sm text-blue-200/60 mb-4 max-w-sm">
                              Click below to fetch your public advanced stats and complete the README preview.
                            </p>
                            <button
                              onClick={handleFetchAdvanced}
                              disabled={isFetchingAdvanced}
                              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              {isFetchingAdvanced ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                              {isFetchingAdvanced ? 'Fetching...' : 'Generate Advanced Preview'}
                            </button>
                            {advancedError && <p className="text-red-400 text-sm mt-3">{advancedError}</p>}
                          </div>
                        ) : (
                          <NeofetchPreview svgString={generateAdvancedStatsSVG(githubData.username, githubData.name, advancedData, customData)} />
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-200/80 mt-2">
                  <strong>What's next?</strong> Extract the ZIP and push the files to a repository named <code>{githubData.username}</code>. GitHub Actions will automatically update your stats every day!
                </div>
              </div>

              {/* Customization Column */}
              <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 lg:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Customize Details</h2>
                
                <div className="space-y-6">
                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">Categories</h3>
                      <button 
                        type="button" 
                        onClick={() => setCustomData(p => ({ ...p, infoFields: [...p.infoFields, { label: 'New', value: 'Value' }] }))}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-white"
                      >
                        + Add Category
                      </button>
                    </div>
                    <div className="space-y-3">
                      {customData.infoFields.map((field, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 w-1/3"
                            placeholder="Category"
                            value={field.label}
                            onChange={e => handleInfoFieldChange(idx, 'label', e.target.value)}
                          />
                          <input
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 flex-1"
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
                            className="text-red-400 hover:bg-red-400/20 px-2 py-1.5 rounded-lg transition-colors font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-lg font-medium text-white mb-4">Other Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Status" name="status" value={customData.status} onChange={handleCustomChange} />
                      <Field label="Mood / Bio" name="mood" value={customData.mood} onChange={handleCustomChange} />
                    </div>
                    <div className="mt-4">
                      <Field label="Tagline (Below ASCII Name)" name="tagline" value={customData.tagline} onChange={handleCustomChange} />
                    </div>
                    
                    <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 bg-black/20 border border-white/10 rounded focus:ring-blue-500"
                          checked={customData.includeAdvancedStats || false}
                          onChange={e => setCustomData(p => ({ ...p, includeAdvancedStats: e.target.checked }))}
                        />
                        <div>
                          <span className="text-white font-medium block">Generate Advanced Stats (like Scemworks profile)</span>
                          <span className="text-sm text-blue-200/80 block mt-1">
                            Generates a secondary SVG with detailed languages, lifetime commits, and streaks. 
                            <strong> Requires adding a GitHub Secret named <code>GH_PAT</code></strong> with <code>repo</code> access in your repository.
                          </span>
                        </div>
                      </label>
                      
                      {customData.includeAdvancedStats && (
                        <div className="mt-4 ml-7 border-l-2 border-blue-500/30 pl-4">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="mt-1 bg-black/20 border border-white/10 rounded focus:ring-blue-500"
                              checked={customData.includePrivateCommits || false}
                              onChange={e => setCustomData(p => ({ ...p, includePrivateCommits: e.target.checked }))}
                            />
                            <div>
                              <span className="text-white font-medium block text-sm">Include Private Commits</span>
                              <span className="text-xs text-blue-200/70 block mt-0.5">
                                Your private contributions will be added to the total lifetime commits count.
                              </span>
                            </div>
                          </label>

                          {customData.includePrivateCommits && (
                            <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                              <h4 className="text-amber-300 font-semibold text-sm flex items-center gap-2 mb-3">
                                <Key className="w-4 h-4" /> Setup Required: Add <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">GH_PAT</code> Secret
                              </h4>
                              <p className="text-xs text-blue-200/60 mb-3">
                                Private commit data can only be accessed via GitHub Actions using a Personal Access Token. Follow these steps after downloading:
                              </p>
                              <ol className="text-xs text-blue-200/80 space-y-2.5 list-none">
                                <li className="flex gap-2">
                                  <span className="bg-blue-500/20 text-blue-300 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                                  <span>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">github.com/settings/tokens</a> → <strong>Generate new token (Classic)</strong></span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="bg-blue-500/20 text-blue-300 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                                  <span>Name it anything (e.g. <code className="bg-black/30 px-1 rounded">readme-stats</code>), set expiration, and check the <code className="bg-black/30 px-1 rounded">repo</code> scope</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="bg-blue-500/20 text-blue-300 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                                  <span>Click <strong>Generate token</strong> and copy it</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="bg-blue-500/20 text-blue-300 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">4</span>
                                  <span>Go to your profile repo → <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="bg-blue-500/20 text-blue-300 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">5</span>
                                  <span>Click <strong>New repository secret</strong>, name it <code className="bg-black/30 px-1 rounded">GH_PAT</code>, paste your token, and save</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="bg-blue-500/20 text-blue-300 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">6</span>
                                  <span>Go to <strong>Actions</strong> tab → select the workflow → click <strong>Run workflow</strong> to trigger it manually the first time</span>
                                </li>
                              </ol>
                              <p className="text-[10px] text-blue-200/40 mt-3">
                                After this, the GitHub Action will run daily and update your stats SVG automatically, including private commit counts.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-lg font-medium text-white mb-4">Top Projects</h3>
                    <div className="space-y-4">
                      {customData.projects.map((proj, idx) => (
                        <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 grid grid-cols-1 gap-3">
                          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                            <span className="bg-white/10 w-6 h-6 rounded flex items-center justify-center">{idx + 1}</span>
                            <span>Project Slot</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              className="bg-neutral-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Name"
                              value={proj.name}
                              onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                            />
                            <input
                              className="bg-neutral-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Language (e.g. JS)"
                              value={proj.language || ''}
                              onChange={e => handleProjectChange(idx, 'language', e.target.value)}
                            />
                          </div>
                          <input
                            className="bg-neutral-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                            placeholder="URL"
                            value={proj.url}
                            onChange={e => handleProjectChange(idx, 'url', e.target.value)}
                          />
                        </div>
                      ))}
                      {customData.projects.length === 0 && (
                        <p className="text-sm text-neutral-500">No public projects found to auto-fill.</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Field({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: any }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-400">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
      />
    </div>
  );
}
