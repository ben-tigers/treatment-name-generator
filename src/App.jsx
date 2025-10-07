import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Lock, Unlock, Heart, Copy, Share2, Download, RefreshCw, Wand2, Zap, Star } from 'lucide-react';

const WORDBANK = {
  NATURE_WATER: [
    { text: "River" }, { text: "Rivers" }, { text: "Creek" }, { text: "Brook" }, { text: "Spring" }, { text: "Springs" },
    { text: "Harbor" }, { text: "Harbour" }, { text: "Bay" }, { text: "Cove" }, { text: "Lagoon" }, { text: "Lake" },
    { text: "Shore" }, { text: "Tide" }, { text: "Wave" }, { text: "Current" }, { text: "Stream" }, { text: "Fjord" },
    { text: "Waterfall" }, { text: "Falls" }, { text: "Delta" }, { text: "Estuary" }, { text: "Reservoir" },
    { text: "Canal" }, { text: "Channel" }, { text: "Inlet" }, { text: "Sound" }, { text: "Soundview" },
    { text: "Seabrook" }, { text: "Seaside" }, { text: "Seascape" }, { text: "Seaway" }, { text: "Seacliff" },
    { text: "Ocean" }, { text: "Oceanside" }, { text: "Marina" }, { text: "Quay" }, { text: "Harborview" },
    { text: "Riverside" }, { text: "Waterside" }, { text: "Brookside" }, { text: "Lakeside" }, { text: "Rivulet" },
    { text: "Gulf" }, { text: "Reef" }, { text: "Shoal" }, { text: "Glacier Run" }, { text: "Tarn" }, { text: "Mooring" }
  ],
  NATURE_LAND: [
    { text: "Ranch" }, { text: "Ridge" }, { text: "Valley" }, { text: "Canyon" }, { text: "Mesa" }, { text: "Butte" },
    { text: "Hills" }, { text: "Summit" }, { text: "Peak" }, { text: "Bluff" }, { text: "Meadow" }, { text: "Prairie" },
    { text: "Dune" }, { text: "Desert" }, { text: "Sage" }, { text: "Boulder" }, { text: "Rock" }, { text: "Cliff" },
    { text: "Foothills" }, { text: "Plateau" }, { text: "Basin" }, { text: "Pass" }, { text: "Vista" }, { text: "Lookout" },
    { text: "Overlook" }, { text: "Headland" }, { text: "Highland" }, { text: "Lowland" }, { text: "Range" },
    { text: "Sierra" }, { text: "Alpine" }, { text: "Badlands" }, { text: "Flatlands" }, { text: "Grassland" },
    { text: "Homestead" }, { text: "Outpost" }, { text: "Frontier" }, { text: "Timberline" }, { text: "Uplands" },
    { text: "Wilderness" }, { text: "Backcountry" }, { text: "Crest" }, { text: "Edge" }, { text: "Palisade" }
  ],
  SETTINGS: [
    { text: "Retreat" }, { text: "Haven" }, { text: "Sanctuary" }, { text: "Refuge" }, { text: "Oasis" }, { text: "Lodge" },
    { text: "House" }, { text: "Home" }, { text: "Village" }, { text: "Camp" }, { text: "Center" }, { text: "Centre" },
    { text: "Clinic" }, { text: "Institute" }, { text: "Program" }, { text: "Network" }, { text: "Collective" },
    { text: "Commons" }, { text: "Terrace" }, { text: "Gardens" }, { text: "Acres" }, { text: "Fields" }, { text: "Landing" },
    { text: "Hall" }, { text: "Cottage" }, { text: "Cottages" }, { text: "Manor" }, { text: "Harbor" }, { text: "Grove" },
    { text: "Springs" }, { text: "Pavilion" }, { text: "Courtyard" }, { text: "Quarters" }, { text: "Harbor House" },
    { text: "Waystation" }, { text: "Outlook" }, { text: "Campuses" }, { text: "Campus" }, { text: "Village Green" },
    { text: "Harbor Campus" }, { text: "Harbor Lodge" }, { text: "Hearth" }
  ],
  QUALITIES: [
    { text: "Serenity" }, { text: "Tranquility" }, { text: "Hope" }, { text: "Courage" }, { text: "Renewal" },
    { text: "Clarity" }, { text: "Ascend" }, { text: "Horizon" }, { text: "New Life" }, { text: "Fresh Start" },
    { text: "Harmony" }, { text: "Balance" }, { text: "Resilience" }, { text: "Thrive" }, { text: "Evergreen" },
    { text: "Anchor" }, { text: "North Star" }, { text: "Purpose" }, { text: "Journey" }, { text: "Catalyst" },
    { text: "Beacon" }, { text: "Calm" }, { text: "Clarity Point" }, { text: "Clear Path" }, { text: "Resolve" },
    { text: "Rise" }, { text: "Uplift" }, { text: "Fortitude" }, { text: "Vitality" }, { text: "Momentum" },
    { text: "Unison" }, { text: "Unity" }, { text: "Recovery Path" }, { text: "Beyond" }, { text: "Awaken" },
    { text: "Guidance" }, { text: "Renewed" }, { text: "Revival" }, { text: "Steadfast" }, { text: "Grounded" }
  ],
  RECOVERY_TERMS: [
    { text: "Recovery" }, { text: "Detox" }, { text: "Rehab" }, { text: "Wellness" }, { text: "Sober Living" },
    { text: "Therapy" }, { text: "Counseling" }, { text: "Behavioral Health" }, { text: "Treatment" }, { text: "Care" },
    { text: "Healing" }, { text: "Aftercare" }, { text: "Residential" }, { text: "Outpatient" }, { text: "Intensive Outpatient" },
    { text: "Partial Hospitalization" }, { text: "Dual Diagnosis" }, { text: "MAT" }, { text: "Family Program" },
    { text: "Support" }, { text: "Alumni" }, { text: "Peer Support" }, { text: "Group Therapy" }, { text: "Individual Therapy" },
    { text: "Medical Detox" }, { text: "Holistic" }, { text: "Mindfulness" }, { text: "Trauma Informed" }, { text: "Evidence Based" },
    { text: "Residential Care" }, { text: "Recovery Services" }, { text: "Integrative Care" }, { text: "Wellbeing" },
    { text: "Case Management" }, { text: "Clinical Services" }, { text: "Admissions" }, { text: "Intake" }, { text: "Recovery Network" },
    { text: "Supportive Housing" }, { text: "Sober Housing" }, { text: "Recovery Center" }, { text: "Therapeutic Community" }
  ],
  SUFFIXES: [
    { text: "Center" }, { text: "Clinic" }, { text: "Ranch" }, { text: "Retreat" }, { text: "Recovery" }, { text: "Detox" },
    { text: "Wellness" }, { text: "Therapy" }, { text: "Sober Living" }, { text: "Institute" }, { text: "Program" },
    { text: "Residence" }, { text: "House" }, { text: "Home" }, { text: "Village" }, { text: "Network" }, { text: "Care" },
    { text: "Services" }, { text: "Pathways" }, { text: "Solutions" }, { text: "Works" }, { text: "Collective" },
    { text: "Group" }, { text: "Partners" }, { text: "Healthcare" }, { text: "Health" }, { text: "Behavioral Health" },
    { text: "Counseling" }, { text: "Wellbeing" }, { text: "Foundations" }, { text: "Way" }, { text: "Path" },
    { text: "Harbor" }, { text: "Landing" }, { text: "Sanctuary" }, { text: "Oasis" }, { text: "Commons" },
    { text: "Lodge" }, { text: "Acres" }, { text: "Gardens" }, { text: "View" }, { text: "Point" }, { text: "Vista" }
  ]
};

const TEMPLATES = [
  ['QUALITIES', 'NATURE_WATER', 'SETTINGS'],
  ['NATURE_LAND', 'SUFFIXES'],
  ['NATURE_WATER', 'SETTINGS'],
  ['QUALITIES', 'RECOVERY_TERMS'],
  ['NATURE_WATER', 'NATURE_LAND', 'SUFFIXES']
];

const generateName = (locked = [], alliteration = false, customWord = '', includeCustom = false, wordCount = 3) => {
  let template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  
  const parts = [];
  let totalWordCount = 0;
  const targetWordCount = includeCustom && customWord.trim() ? wordCount : wordCount;
  const customWordCount = customWord.trim().split(' ').length;
  
  let customWordPosition = -1;
  if (includeCustom && customWord.trim()) {
    customWordPosition = Math.floor(Math.random() * (template.length + 1));
  }
  
  for (let i = 0; i < template.length; i++) {
    if (totalWordCount >= targetWordCount) break;
    
    if (i === customWordPosition && customWord.trim() && totalWordCount + customWordCount <= targetWordCount) {
      parts.push(customWord.trim());
      totalWordCount += customWordCount;
      continue;
    }
    
    if (locked[i]) {
      const lockedWordCount = locked[i].split(' ').length;
      if (totalWordCount + lockedWordCount <= targetWordCount) {
        parts.push(locked[i]);
        totalWordCount += lockedWordCount;
      }
    } else {
      const bucket = WORDBANK[template[i]];
      
      const validWords = bucket.filter(w => {
        const wc = w.text.split(' ').length;
        return totalWordCount + wc <= targetWordCount;
      });
      
      if (validWords.length === 0) continue;
      
      let word = validWords[Math.floor(Math.random() * validWords.length)].text;
      
      if (alliteration && parts.length > 0) {
        const targetLetter = parts[0].charAt(0).toLowerCase();
        const alliterativeWords = validWords.filter(w => w.text.charAt(0).toLowerCase() === targetLetter);
        if (alliterativeWords.length > 0) {
          word = alliterativeWords[Math.floor(Math.random() * alliterativeWords.length)].text;
        }
      }
      
      parts.push(word);
      totalWordCount += word.split(' ').length;
    }
  }
  
  if (customWordPosition === template.length && customWord.trim() && totalWordCount + customWordCount <= targetWordCount) {
    parts.push(customWord.trim());
  }
  
  return parts.join(' ');
};

export default function TreatmentNameGenerator() {
  const [names, setNames] = useState([]);
  const [featured, setFeatured] = useState('');
  const [locked, setLocked] = useState([]);
  const [alliteration, setAlliteration] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [toast, setToast] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [customWord, setCustomWord] = useState('');
  const [includeCustom, setIncludeCustom] = useState(false);
  const [wordCount, setWordCount] = useState(3);
  const canvasRef = useRef(null);

  useEffect(() => {
    generateNames();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147, 51, 234, 0.1)';
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const generateNames = () => {
    setIsGenerating(true);
    setFeatured('');
    
    setTimeout(() => {
      const newNames = [];
      for (let i = 0; i < 10; i++) {
        newNames.push(generateName(locked, alliteration, customWord, includeCustom, wordCount));
      }
      setNames(newNames);
      
      setTimeout(() => {
        setFeatured(newNames[0]);
        setIsGenerating(false);
      }, 300);
    }, 1200);
  };

  const toggleLock = (index) => {
    const newLocked = [...locked];
    const nameParts = featured.split(' ');
    if (newLocked[index]) {
      newLocked[index] = null;
    } else {
      newLocked[index] = nameParts[index];
    }
    setLocked(newLocked);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToast('✨ Copied to clipboard!');
    setTimeout(() => setToast(''), 2000);
  };

  const toggleFavorite = (name) => {
    if (favorites.includes(name)) {
      setFavorites(favorites.filter(f => f !== name));
    } else {
      setFavorites([...favorites, name]);
      setToast('💖 Added to favorites!');
      setTimeout(() => setToast(''), 2000);
    }
  };

  const exportFavorites = () => {
    const csv = 'Treatment Center Name\n' + favorites.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'treatment-center-names.csv';
    a.click();
    setToast('📥 Exported successfully!');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(236, 72, 153, 0.4); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes particle-burst {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0) translateY(-60px); }
        }
        @keyframes text-reveal {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9);
            filter: blur(10px);
          }
          50% {
            filter: blur(5px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes word-pop {
          0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-dark {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {toast && (
        <div className="fixed top-8 right-8 glass px-8 py-4 rounded-2xl shadow-2xl z-50 animate-slideIn border-2 border-purple-400">
          <p className="text-white font-semibold text-lg">{toast}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <header className="text-center mb-16 animate-slideIn">
          <div className="inline-block mb-6">
            <Wand2 className="w-20 h-20 text-purple-400 animate-float" strokeWidth={1.5} />
          </div>
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6 tracking-tight">
            Treatment Center
            <br />
            Name Generator
          </h1>
          <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-sm text-purple-300 mt-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span>For entertainment purposes only</span>
          </div>
        </header>

        <div className="glass rounded-3xl p-10 mb-10 shadow-2xl animate-scaleIn border-2 border-purple-500/30">
          <div className="mb-10">
            <div className="text-center mb-8 relative">
              {isGenerating ? (
                <div className="relative h-32 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-3">
                    <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                    <Wand2 className="w-10 h-10 text-pink-400 animate-bounce" />
                    <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                        style={{
                          animation: 'particle-burst 1.5s ease-out infinite',
                          animationDelay: `${i * 0.15}s`,
                          left: '50%',
                          top: '50%',
                          transform: `rotate(${i * 45}deg) translateY(-40px)`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl opacity-30 animate-pulse" />
                    <h2 className="relative text-6xl font-black text-white mb-8 tracking-tight" style={{ animation: 'text-reveal 0.8s ease-out' }}>
                      {featured.split(' ').map((word, i) => (
                        <span 
                          key={i}
                          className="inline-block mx-1"
                          style={{ 
                            animation: 'word-pop 0.6s ease-out',
                            animationDelay: `${i * 0.15}s`,
                            animationFillMode: 'backwards'
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </h2>
                  </div>
                  
                  <div className="flex justify-center gap-3 mb-8 flex-wrap">
                    {featured.split(' ').map((part, i) => (
                      <button
                        key={i}
                        onClick={() => toggleLock(i)}
                        className="group relative glass-dark px-6 py-3 rounded-xl transition-all duration-300 hover:scale-110 hover:border-purple-400 animate-scaleIn"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <div className="flex items-center gap-2">
                          {locked[i] ? (
                            <Lock className="w-5 h-5 text-purple-400" />
                          ) : (
                            <Unlock className="w-5 h-5 text-purple-300 group-hover:text-purple-400" />
                          )}
                          <span className={`text-lg font-semibold ${locked[i] ? 'text-purple-400' : 'text-purple-100'}`}>
                            {part}
                          </span>
                        </div>
                        {locked[i] && (
                          <div className="absolute inset-0 rounded-xl bg-purple-500/20 animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => copyToClipboard(featured)}
                      className="group glass-dark px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400 flex items-center gap-3"
                    >
                      <Copy className="w-5 h-5 text-purple-300 group-hover:text-purple-400 transition-colors" />
                      <span className="text-white font-semibold text-lg">Copy</span>
                    </button>
                    
                    <button
                      onClick={() => toggleFavorite(featured)}
                      className={`group px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 ${
                        favorites.includes(featured)
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/50'
                          : 'glass-dark hover:border-pink-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 transition-all ${
                        favorites.includes(featured) 
                          ? 'fill-white text-white' 
                          : 'text-pink-300 group-hover:text-pink-400'
                      }`} />
                      <span className="text-white font-semibold text-lg">
                        {favorites.includes(featured) ? 'Favorited' : 'Favorite'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const url = `${window.location.href}?name=${encodeURIComponent(featured)}`;
                        copyToClipboard(url);
                      }}
                      className="group glass-dark px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400 flex items-center gap-3"
                    >
                      <Share2 className="w-5 h-5 text-purple-300 group-hover:text-purple-400 transition-colors" />
                      <span className="text-white font-semibold text-lg">Share</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mb-8 items-center">
            <div className="glass-dark px-6 py-4 rounded-xl flex items-center gap-4">
              <input
                type="text"
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                placeholder="Add your own word..."
                className="bg-transparent text-white placeholder-purple-300 outline-none text-lg font-medium w-48"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCustom}
                  onChange={(e) => setIncludeCustom(e.target.checked)}
                  className="w-5 h-5 rounded accent-purple-500"
                />
                <span className="text-purple-200 text-sm font-semibold">Include</span>
              </label>
            </div>

            <div className="glass-dark px-6 py-4 rounded-xl flex items-center gap-4">
              <span className="text-purple-200 font-semibold">Words:</span>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6, 7].map((count) => (
                  <button
                    key={count}
                    onClick={() => setWordCount(count)}
                    className={`w-10 h-10 rounded-lg font-bold text-lg transition-all duration-300 ${
                      wordCount === count
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 shadow-lg'
                        : 'bg-white/10 text-purple-300 hover:bg-white/20'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            
            <label className="group glass-dark px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:border-purple-400 flex items-center gap-3">
              <input
                type="checkbox"
                checked={alliteration}
                onChange={(e) => setAlliteration(e.target.checked)}
                className="w-6 h-6 rounded accent-purple-500"
              />
              <Sparkles className="w-5 h-5 text-purple-300" />
              <span className="text-white font-semibold text-lg">Alliteration Mode</span>
            </label>
          </div>

          <div className="flex justify-center gap-6">
            <button
              onClick={generateNames}
              disabled={isGenerating}
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/50 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 animate-shimmer" />
              <div className="relative flex items-center gap-3">
                <RefreshCw className={`w-6 h-6 text-white ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="text-white font-bold text-xl">
                  {isGenerating ? 'Generating...' : 'Generate Magic'}
                </span>
                <Zap className="w-6 h-6 text-yellow-300" />
              </div>
            </button>
            
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="group glass-dark px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:border-pink-400 flex items-center gap-3"
            >
              <Heart className="w-6 h-6 text-pink-300 group-hover:text-pink-400" />
              <span className="text-white font-bold text-xl">
                Favorites
              </span>
              <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm font-bold">
                {favorites.length}
              </span>
            </button>
          </div>
        </div>

        {showFavorites ? (
          <div className="glass rounded-3xl p-10 shadow-2xl animate-scaleIn border-2 border-pink-500/30">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-4xl font-black text-white flex items-center gap-3">
                <Star className="w-10 h-10 text-yellow-400" />
                Your Favorites
              </h3>
              {favorites.length > 0 && (
                <button
                  onClick={exportFavorites}
                  className="group glass-dark px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:border-green-400 flex items-center gap-3"
                >
                  <Download className="w-5 h-5 text-green-300 group-hover:text-green-400" />
                  <span className="text-white font-semibold">Export CSV</span>
                </button>
              )}
            </div>
            {favorites.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-20 h-20 text-purple-300 mx-auto mb-4 animate-float" />
                <p className="text-purple-200 text-xl">No favorites yet. Click the heart on any name to save it!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((name, i) => (
                  <div
                    key={i}
                    className="group glass-dark p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:border-pink-400 animate-slideIn"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-lg">{name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(name)}
                          className="p-2 glass rounded-lg hover:bg-purple-500/20 transition-all"
                        >
                          <Copy className="w-5 h-5 text-purple-300" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(name)}
                          className="p-2 glass rounded-lg hover:bg-pink-500/20 transition-all"
                        >
                          <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {names.map((name, i) => (
              <div
                key={i}
                onClick={() => setFeatured(name)}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative p-8 rounded-2xl cursor-pointer transition-all duration-500 animate-slideIn ${
                  name === featured
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/50 scale-105'
                    : 'glass hover:scale-105 hover:border-purple-400'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {hoveredCard === i && name !== featured && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl animate-pulse" />
                )}
                <div className="relative flex justify-between items-center">
                  <span className={`text-xl font-bold transition-colors ${
                    name === featured ? 'text-white' : 'text-purple-100 group-hover:text-white'
                  }`}>
                    {name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(name);
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        name === featured 
                          ? 'bg-white/20 hover:bg-white/30' 
                          : 'glass hover:bg-purple-500/20'
                      }`}
                    >
                      <Copy className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(name);
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        name === featured 
                          ? 'bg-white/20 hover:bg-white/30' 
                          : 'glass hover:bg-pink-500/20'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${
                        favorites.includes(name) 
                          ? 'fill-pink-400 text-pink-400' 
                          : 'text-white'
                      }`} />
                    </button>
                  </div>
                </div>
                {name === featured && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
