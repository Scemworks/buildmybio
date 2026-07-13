'use client';

import { motion } from 'framer-motion';

export default function NeofetchPreview({ svgString }: { svgString: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center items-center p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* We need to ensure the SVG scales correctly */}
      <div 
        className="w-full max-w-[800px] aspect-[800/530]"
        dangerouslySetInnerHTML={{ __html: svgString }} 
      />
    </motion.div>
  );
}
