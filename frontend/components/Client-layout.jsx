"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./page-transition";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
