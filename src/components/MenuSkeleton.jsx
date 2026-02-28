import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton loading cho danh sách menu
 * Hiển thị placeholder shimmer khi đang tải dữ liệu từ Firestore
 */
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-white p-4 rounded-3xl flex gap-5 animate-pulse"
  >
    {/* Image placeholder */}
    <div className="w-32 h-32 rounded-2xl bg-coffee-200 shrink-0" />

    {/* Text placeholders */}
    <div className="flex-1 flex flex-col justify-between py-1">
      <div>
        <div className="h-5 bg-coffee-200 rounded-lg w-3/4 mb-3" />
        <div className="h-3 bg-coffee-100 rounded-lg w-full mb-1.5" />
        <div className="h-3 bg-coffee-100 rounded-lg w-2/3" />
      </div>
      <div className="flex justify-between items-end mt-3">
        <div className="h-6 bg-coffee-200 rounded-lg w-20" />
        <div className="w-12 h-12 bg-coffee-100 rounded-2xl" />
      </div>
    </div>
  </motion.div>
);

const MenuSkeleton = ({ count = 4 }) => (
  <div className="grid gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} index={i} />
    ))}
  </div>
);

export default MenuSkeleton;
