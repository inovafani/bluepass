"use client";

import { useEffect, useState } from "react";

type MotionBackgroundVideoProps = {
  className?: string;
  poster: string;
  sources: {
    src: string;
    type: string;
  }[];
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

export function MotionBackgroundVideo({
  className = "",
  poster,
  sources,
}: MotionBackgroundVideoProps) {
  const [canPlayMotion, setCanPlayMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator as NavigatorWithConnection;

    function updateMotionPreference() {
      setCanPlayMotion(
        !motionQuery.matches && !connection.connection?.saveData,
      );
    }

    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  if (!canPlayMotion) {
    return null;
  }

  return (
    <video
      aria-hidden="true"
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
