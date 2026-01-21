"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";

const SPRING = {
  mass: 0.1, // Controls inertia (how sluggish or responsive the object feels)
  damping: 10, // Like the weight of the ball - heavier the ball less it will bounce
  stiffness: 131, // Like rubber band - the more you stretch the more speed it goes back
};

export default function GlobalCursor() {
  const xSpring = useSpring(0, SPRING);
  const ySpring = useSpring(0, SPRING);
  const opacitySpring = useSpring(0, SPRING);
  const scaleSpring = useSpring(0, SPRING);

  useEffect(() => {
    const handleMouseMove = (e) => {
      xSpring.set(e.clientX);
      ySpring.set(e.clientY);
    };

    const handleMouseEnter = () => {
      opacitySpring.set(1);
      scaleSpring.set(1);
    };

    const handleMouseLeave = () => {
      opacitySpring.set(0);
      scaleSpring.set(0);
    };

    // Add event listeners to the document
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Show cursor when component mounts
    opacitySpring.set(1);
    scaleSpring.set(1);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [xSpring, ySpring, opacitySpring, scaleSpring]);

  return (
    <motion.div
      style={{
        x: xSpring,
        y: ySpring,
        opacity: opacitySpring,
        scale: scaleSpring,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600 mix-blend-difference"
    />
  );
}
