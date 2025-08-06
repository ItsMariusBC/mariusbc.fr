import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface DockContextType {
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
}

const DockContext = React.createContext<DockContextType>({
  hovered: false,
  setHovered: () => {},
});

export const useDock = () => React.useContext(DockContext);

interface DockProps {
  children: React.ReactNode;
  direction?: "middle" | "left" | "right";
}

export function Dock({ children, direction = "middle" }: DockProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <DockContext.Provider value={{ hovered, setHovered }}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed bottom-4 flex h-20 items-center gap-2 rounded-2xl bg-white/10 px-4 backdrop-blur-xl border border-white/20"
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export function DockIcon({ children }: { children: React.ReactNode }) {
  const { hovered } = useDock();
  const ref = React.useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const springConfig = { stiffness: 400, damping: 25 };

  const [hovering, setHovering] = React.useState(false);

  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    mouseX.set(x);
  };

  const width = useSpring(48, springConfig);
  const height = useSpring(48, springConfig);

  React.useEffect(() => {
    if (!hovered) {
      mouseX.set(48);
      width.set(48);
      height.set(48);
      scale.set(1);
    }
    if (hovering) {
      width.set(64);
      height.set(64);
      scale.set(1.2);
    } else {
      width.set(48);
      height.set(48);
      scale.set(1);
    }
  }, [hovered, hovering, mouseX, width, height, scale]);

  return (
    <motion.div
      ref={ref}
      style={{
        width,
        height,
        scale,
      }}
      className="flex items-center justify-center"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
    </motion.div>
  );
}