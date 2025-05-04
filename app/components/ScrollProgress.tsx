"use client";

import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-2 z-50"
      style={{ direction: "ltr" }}
    >
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(to right, #6366f1, #8b5cf6, #d946ef)",
          boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
          position: "absolute",
          left: 0,
          animation: "pulse 2s infinite",
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollProgress;
