import * as React from "react";
import { cn } from "../../lib/utils";

interface VideoTextProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  children: React.ReactNode;
  as?: React.ElementType;
  fontSize?: string | number;
  fontWeight?: string | number;
  textAnchor?: string;
  dominantBaseline?: string;
  fontFamily?: string;
}

export function VideoText({
  src,
  children,
  className,
  as: Component = "div",
  fontSize = "120",
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  ...props
}: VideoTextProps) {
  return (
    <Component 
      className={cn("relative h-full w-full flex items-center justify-center", className)} 
      {...props}
    >
      <div
        className="relative"
        style={{
          backgroundImage: `url(${src}), linear-gradient(135deg, rgb(157, 122, 255), rgb(254, 139, 187))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontSize: typeof fontSize === 'number' ? 
            `clamp(60px, ${fontSize/2}px + 5vw, ${fontSize}px)` : 
            fontSize,
          fontWeight,
          fontFamily,
          textAlign: 'center',
          lineHeight: '1',
        }}
      >
        {children}
      </div>
    </Component>
  );
}