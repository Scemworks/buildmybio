'use client';

import { motion } from 'framer-motion';

export default function NeofetchPreview({ svgString }: { svgString: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center items-center p-4 bg-[#141210]/40 backdrop-blur-xl rounded-2xl border border-[#e8dcc8]/[0.05] shadow-2xl relative"
    >
      {/* We need to ensure the SVG scales correctly but remains readable on mobile */}
      <div 
        className="w-full max-w-[800px] overflow-x-auto custom-scrollbar pb-2 [&>svg]:w-full [&>svg]:min-w-[700px] md:[&>svg]:min-w-full [&>svg]:h-auto [&>svg]:block"
        dangerouslySetInnerHTML={{ __html: svgString }} 
      />
    </motion.div>
  );
}
