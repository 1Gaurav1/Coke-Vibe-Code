import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate premium loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out scroll progress (Lerp-based animation logic)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 15,
    restDelta: 0.001
  });

  // Energy Ribbon SVG Transforms
  const ribbonPathLength = useTransform(smoothProgress, [0, 0.8], [0, 1]);
  const ribbonOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  // Parallax Text Layers
  const layer1Y = useTransform(smoothProgress, [0, 0.3], ['0%', '-50%']);
  const layer1Opacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  const layer2Y = useTransform(smoothProgress, [0.2, 0.4, 0.6], ['50%', '0%', '-50%']);
  const layer2Opacity = useTransform(smoothProgress, [0.2, 0.3, 0.45, 0.6], [0, 1, 1, 0]);

  const layer3Y = useTransform(smoothProgress, [0.5, 0.7, 0.9], ['50%', '0%', '-50%']);
  const layer3Opacity = useTransform(smoothProgress, [0.5, 0.6, 0.8, 0.9], [0, 1, 1, 0]);

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.15] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {isLoading && (
        <motion.div 
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-sans"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
          onAnimationComplete={() => document.body.style.overflow = "auto"}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16 pointer-events-none border border-white/10 rounded-full flex items-center justify-center">
               <motion.div 
                  className="absolute inset-0 border-t-2 border-red-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               />
               <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Loading</span>
            </div>
            <motion.div 
              className="text-red-600/80 text-xs tracking-[0.4em] uppercase"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Building Experience
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Main Scroll Container */}
      <div ref={containerRef} className="relative h-[400vh] bg-[#050505] text-white selection:bg-red-600 overflow-clip font-sans">
         
         {/* Sticky Viewport */}
         <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
            
            {/* Nav */}
            <nav className="absolute top-0 w-full flex items-center justify-between px-8 md:px-16 py-8 z-50">
              <div className="text-xl font-black tracking-tighter uppercase">COCA-COLA<span className="text-red-500">.</span></div>
              <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase text-white/70">
                <a href="#" className="hover:text-red-500 transition-colors">Vision</a>
                <a href="#" className="hover:text-red-500 transition-colors">Design</a>
                <a href="#" className="hover:text-red-500 transition-colors">Taste</a>
              </div>
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full backdrop-blur-md">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
            </nav>

            {/* Ambient Background Glows */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-red-600/20 blur-[140px] pointer-events-none mix-blend-screen"
              style={{ scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 1.5, 0.9]) }}
            />
            <motion.div 
              className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-700/10 blur-[100px] pointer-events-none"
            />

            {/* SVG Energy Ribbon */}
            <div className="absolute inset-0 pointer-events-none z-10 hidden md:block mix-blend-lighten">
              <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="glowRed" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff0000" stopOpacity="0" />
                    <stop offset="20%" stopColor="#ff0000" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#ff4d4d" stopOpacity="1" />
                    <stop offset="80%" stopColor="#ff0000" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                  <filter id="extremeGlow">
                    <feGaussianBlur stdDeviation="15" result="blur1"/>
                    <feGaussianBlur stdDeviation="30" result="blur2"/>
                    <feMerge>
                      <feMergeNode in="blur2"/>
                      <feMergeNode in="blur1"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <motion.path
                  d="M 1600,300 C 1200,500 900,-100 700,450 C 500,1000 -100,600 -200,900"
                  fill="none"
                  stroke="url(#glowRed)"
                  strokeWidth="40"
                  filter="url(#extremeGlow)"
                  className="opacity-80"
                  style={{ 
                    pathLength: ribbonPathLength,
                    opacity: ribbonOpacity
                  }}
                />
                <motion.path
                  d="M 1600,300 C 1200,500 900,-100 700,450 C 500,1000 -100,600 -200,900"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="blur-[2px]"
                  style={{ 
                    pathLength: ribbonPathLength,
                    opacity: ribbonOpacity
                  }}
                />
                 <motion.path
                  d="M 1600,350 C 1100,550 950,-50 650,500 C 450,1050 0,650 -200,950"
                  fill="none"
                  stroke="url(#glowRed)"
                  strokeWidth="10"
                  filter="url(#extremeGlow)"
                  className="opacity-40 mix-blend-color-dodge"
                  style={{ 
                    pathLength: useTransform(smoothProgress, [0.1, 0.9], [0, 1]),
                    opacity: ribbonOpacity
                  }}
                />
              </svg>
            </div>

            {/* Typography Sections */}
            
            {/* 1. Hero */}
            <motion.div 
               className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
               style={{ opacity: layer1Opacity, y: layer1Y }}
            >
               <div className="mb-8 flex items-center gap-4 hidden md:flex">
                  <span className="w-12 h-[1px] bg-red-600"></span>
                  <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/50">The New Standard</span>
                  <span className="w-12 h-[1px] bg-red-600"></span>
               </div>
               <h1 className="text-[14vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-[#a3a3a3] text-center uppercase drop-shadow-2xl">
                  Taste The <br/> <span className="text-red-600 bg-none text-red-600 drop-shadow-[0_0_30px_rgba(255,0,0,0.4)]">Feeling.</span>
               </h1>
               
               <motion.div className="absolute bottom-12 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Initiate Experience</span>
                  <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-8 h-12 border border-white/20 rounded-full flex justify-center pt-2 backdrop-blur-sm"
                  >
                     <div className="w-1 h-2 bg-red-600 rounded-full"></div>
                  </motion.div>
               </motion.div>
            </motion.div>

            {/* 2. Detail Reveal */}
            <motion.div 
               className="absolute inset-0 flex items-center justify-start pl-[5vw] md:pl-[12vw] z-10 pointer-events-none"
               style={{ opacity: layer2Opacity, y: layer2Y }}
            >
               <div className="flex flex-col max-w-xl pr-4">
                  <div className="flex items-center gap-4 mb-8">
                     <span className="w-8 h-[1px] bg-red-600"></span>
                     <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/60">Flawless Design</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black leading-[0.9] mb-8 uppercase tracking-tighter text-white drop-shadow-2xl">
                     Zero <span className="text-red-600 italic font-serif pr-2">Sugar</span>.<br/> Maximum <br/> Impact.
                  </h2>
                  <div className="pl-6 border-l-[1.5px] border-red-600/50">
                    <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light backdrop-blur-[2px]">
                       Engineered for the perfect grip. The new sleek silhouette combines aerospace-grade aluminum with our signature ice-cold thermal retention system.
                    </p>
                  </div>
               </div>
            </motion.div>

            {/* 3. The Energy/Ribbon Connection */}
            <motion.div 
               className="absolute inset-0 flex items-center justify-end pr-[5vw] md:pr-[12vw] z-10 pointer-events-none text-right"
               style={{ opacity: layer3Opacity, y: layer3Y }}
            >
               <div className="flex flex-col items-end max-w-xl pl-4">
                  <h2 className="text-5xl md:text-7xl font-black leading-[0.9] mb-8 uppercase tracking-tighter drop-shadow-2xl">
                     Pure <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">Energy.</span><br/> Liquid Art.
                  </h2>
                  <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light backdrop-blur-[2px]">
                     Every drop is a symphony of flavor. We didn't just redesign the can; we reimagined the entire sensory experience. The flow, the chill, the rush.
                  </p>
                  <button className="mt-10 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 hover:text-white transition-all duration-300 pointer-events-auto shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                     Unlock The Vault
                  </button>
               </div>
            </motion.div>

         </div>
      </div>
    </>
  );
}

