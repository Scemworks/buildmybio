'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Download, Loader2, Sparkles } from 'lucide-react';
import { fetchGitHubData, GitHubData } from '@/lib/github';
import { generateNeofetchSVG, CustomizationData, downloadFilesZip } from '@/lib/generateFiles';
import NeofetchPreview from '@/components/NeofetchPreview';

export default function Home() {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [customData, setCustomData] = useState<CustomizationData>({
    host: '',
    city: '',
    role: '',
    tools: '',
    lang: '',
    editor: 'VS Code',
    status: 'online',
    mood: 'building . learning',
    projects: []
  });

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchGitHubData(usernameInput);
      setGithubData(data);
      
      // Auto-fill customizations based on fetched data
      setCustomData(prev => ({
        ...prev,
        city: data.location || 'The Internet',
        host: `${data.username}.github.io`,
        projects: data.topProjects.map(p => ({ ...p })),
        lang: data.topLanguages || 'HTML, CSS',
        tools: data.topTopics || 'Git, GitHub',
        role: data.inferredRole,
        mood: data.bio && data.bio.length > 30 ? data.bio.slice(0, 40) + '...' : 'building . learning'
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
                    <Sparkles className="w-5 h-5 text-emerald-400" /> Live Preview
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Download className="w-4 h-4" /> Download ZIP
                  </button>
                </div>
                <NeofetchPreview svgString={generateNeofetchSVG(githubData, customData)} />
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-200/80">
                  <strong>What's next?</strong> Extract the ZIP and push the files to a repository named <code>{githubData.username}/{githubData.username}</code>. GitHub Actions will automatically update your stats every day!
                </div>
              </div>

              {/* Customization Column */}
              <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 lg:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Customize Details</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Host (URL)" name="host" value={customData.host} onChange={handleCustomChange} />
                    <Field label="Location" name="city" value={customData.city} onChange={handleCustomChange} />
                    <Field label="Role" name="role" value={customData.role} onChange={handleCustomChange} />
                    <Field label="Tools" name="tools" value={customData.tools} onChange={handleCustomChange} />
                    <Field label="Languages" name="lang" value={customData.lang} onChange={handleCustomChange} />
                    <Field label="Editor" name="editor" value={customData.editor} onChange={handleCustomChange} />
                    <Field label="Status" name="status" value={customData.status} onChange={handleCustomChange} />
                  </div>
                  
                  <Field label="Mood / Bio" name="mood" value={customData.mood} onChange={handleCustomChange} />

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
