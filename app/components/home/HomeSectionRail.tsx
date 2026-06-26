"use client";

import { useEffect, useState } from "react";

export type HomeRailItem = {
  id: string;
  label: string;
};

type HomeSectionRailProps = {
  items: HomeRailItem[];
};

export function HomeSectionRail({ items }: HomeSectionRailProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-scroll]");
    const panels = items
      .map((item) => document.getElementById(item.id))
      .filter((panel): panel is HTMLElement => panel !== null);

    if (!root || panels.length === 0) return;

    let frame = 0;
    const updateActivePanel = () => {
      const rootRect = root.getBoundingClientRect();
      const rootCenter = rootRect.top + rootRect.height / 2;
      const closestPanel = panels.reduce(
        (closest, panel) => {
          const panelRect = panel.getBoundingClientRect();
          const distance = Math.abs(
            panelRect.top + panelRect.height / 2 - rootCenter,
          );

          if (distance < closest.distance) {
            return { panel, distance };
          }

          return closest;
        },
        { panel: panels[0], distance: Number.POSITIVE_INFINITY },
      );

      setActiveId(closestPanel.panel.id);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActivePanel);
    };

    const syncHashTarget = () => {
      const hashTarget = window.location.hash.replace(/^#/, "");

      if (panels.some((panel) => panel.id === hashTarget)) {
        setActiveId(hashTarget);
        return;
      }

      window.setTimeout(scheduleUpdate, 160);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          setActiveId(visible.target.id);
        }
      },
      {
        root,
        threshold: [0.42, 0.55, 0.68],
      },
    );

    panels.forEach((panel) => observer.observe(panel));
    root.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("hashchange", syncHashTarget);
    syncHashTarget();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("hashchange", syncHashTarget);
    };
  }, [items]);

  return (
    <nav
      aria-label="Sections"
      className="bp-home-rail fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
    >
      {items.map((item) => {
        const active = activeId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className="bp-home-rail-button"
            aria-label={item.label}
            aria-current={active ? "true" : undefined}
            data-active={active ? "true" : "false"}
            onClick={() => {
              setActiveId(item.id);
              document
                .getElementById(item.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <span className="bp-home-rail-label">{item.label}</span>
            <span className="bp-home-rail-dot" aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
