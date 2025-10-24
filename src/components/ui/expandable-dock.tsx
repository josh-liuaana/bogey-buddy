"use client";

import { motion } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/utils/classMerge";

interface ExpandableDockProps {
  headerContent: ReactNode;
  children: ReactNode;
  className?: string;
}

export const ExpandableDock = ({
  headerContent,
  children,
  className,
}: ExpandableDockProps) => {
  const [animationStage, setAnimationStage] = useState<
    | "collapsed"
    | "widthExpanding"
    | "heightExpanding"
    | "fullyExpanded"
    | "contentFadingOut"
    | "heightCollapsing"
    | "widthCollapsing"
  >("collapsed");

  const containerRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    setAnimationStage("widthExpanding");
    setTimeout(() => setAnimationStage("heightExpanding"), 400);
    setTimeout(() => setAnimationStage("fullyExpanded"), 850);
  };

  const handleCollapse = () => {
    setAnimationStage("contentFadingOut");
    setTimeout(() => setAnimationStage("heightCollapsing"), 250);
    setTimeout(() => setAnimationStage("widthCollapsing"), 650);
    setTimeout(() => setAnimationStage("collapsed"), 1050);
  };

  const isCollapsed = animationStage === "collapsed";
  const isExpanded = animationStage === "fullyExpanded";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isExpanded
      ) {
        handleCollapse();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  return (
    <div className="bottom-1 right-1 ----- fixed z-50 p-4 sm:px-0">
      <motion.div
        ref={containerRef}
        initial={{
          width: 60,
          height: 60,
          borderRadius: 999,
        }}
        animate={{
          width:
            animationStage === "collapsed" ||
            animationStage === "widthCollapsing"
              ? 60
              : "auto",
          height:
            animationStage === "collapsed" ||
            animationStage === "widthExpanding" ||
            animationStage === "widthCollapsing"
              ? 60
              : "auto",
          borderRadius: isCollapsed ? 20 : 20,
        }}
        transition={{
          width: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
          height: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
          borderRadius: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        }}
        className={cn(
          "backdrop-blur-lg overflow-hidden flex flex-col-reverse mx-auto",
          className
        )}
      >
        <div
          onClick={isCollapsed ? handleExpand : handleCollapse}
          className=" bg-black/100 dark:bg-black/100 ----- rounded-2xl flex items-center gap-4 px-4 sm:px-6 py-4 text-white w-full h-[68px] whitespace-nowrap cursor-pointer border-t border-gray-800 flex-shrink-0"
        >
          {headerContent}
        </div>
        <motion.div
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className=" ------ p-4 sm:p-6 flex-1 flex flex-col overflow-hidden"
        >
          <div className=" overflow-y-hidden overflow-x-auto scrollbar-none">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
