import { InfiniteSlider } from "./InfiniteSlider";
import { cn } from "../../lib/utils";

export function LogoCloud({ className, logos, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={80} reverse duration={40} durationOnHover={120}>
        {logos.map((logo, i) => (
          <div key={i} className="flex items-center justify-center">
            {logo.src ? (
              <img
                alt={logo.alt}
                className="pointer-events-none h-6 select-none opacity-40 hover:opacity-100 transition-opacity dark:brightness-0 dark:invert"
                height={logo.height || "auto"}
                loading="lazy"
                src={logo.src}
                width={logo.width || "auto"}
              />
            ) : (
              <div className="px-4">
                {logo.node}
              </div>
            )}
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
