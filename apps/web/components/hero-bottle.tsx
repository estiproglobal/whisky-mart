import Image from "next/image";

const SRC = "/hero/whiskymart-bottle.webp";
const W = 389;
const H = 1376;
const SIZES = "(min-width: 1024px) 200px, 1px";

/**
 * Hero visual — the WhiskyMart "Cabinet Selection" bottle (a fictional house
 * bottling, isolated to transparency) staged on the dark hero like a lit
 * collector's-cabinet object. Layered, restrained lighting: a wide ambient
 * cabinet glow, a focused warm backlight halo, a soft overhead spotlight, a
 * warm rim + glass enrichment on the bottle, and a grounded base (contact
 * shadow, faded reflection, warm floor pool, brass shelf line). Decorative
 * (aria-hidden); lazy so the desktop-only image isn't fetched on mobile.
 */
export function HeroBottle() {
  return (
    <div className="relative mx-auto w-full max-w-[18rem]" aria-hidden="true">
      {/* Ambient cabinet glow — wide, very soft */}
      <div
        className="pointer-events-none absolute left-1/2 top-[46%] h-[100%] w-[155%] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(46% 50% at 50% 50%, rgba(201,122,43,0.15), transparent 70%)" }}
      />
      {/* Focused warm backlight halo directly behind the bottle */}
      <div
        className="pointer-events-none absolute left-1/2 top-[43%] h-[74%] w-[82%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(40% 47% at 50% 49%, rgba(216,146,66,0.42), rgba(201,122,43,0.08) 52%, transparent 74%)",
        }}
      />

      {/* Contact shadow grounding the base */}
      <div
        className="pointer-events-none absolute bottom-[-1%] left-1/2 h-[30px] w-[56%] -translate-x-1/2"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.62), transparent 72%)",
          filter: "blur(6px)",
        }}
      />

      {/* Bottle — warm rim + glass enrichment + grounding shadow */}
      <Image
        src={SRC}
        alt=""
        width={W}
        height={H}
        sizes={SIZES}
        className="relative z-10 mx-auto block h-auto w-[58%]"
        style={{
          filter:
            "saturate(1.07) contrast(1.05) brightness(1.02) drop-shadow(0 -1px 6px rgba(245,234,210,0.18)) drop-shadow(0 2px 12px rgba(216,150,72,0.3)) drop-shadow(0 28px 44px rgba(0,0,0,0.6))",
        }}
      />

      {/* Soft overhead spotlight grazing the bottle */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-8%] z-20 h-[56%] w-[70%] -translate-x-1/2"
        style={{ background: "radial-gradient(54% 64% at 50% 0%, rgba(245,234,210,0.12), transparent 70%)" }}
      />

      {/* Floor reflection */}
      <div
        className="pointer-events-none absolute left-1/2 top-full z-0 -mt-1 w-[58%] -translate-x-1/2 overflow-hidden"
        style={{
          height: "84px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
        }}
      >
        <Image src={SRC} alt="" width={W} height={H} sizes={SIZES} className="block h-auto w-full -scale-y-100 opacity-25" />
      </div>

      {/* Warm floor pool + brass shelf hairline */}
      <div
        className="pointer-events-none absolute left-1/2 top-full h-[16px] w-[64%] -translate-x-1/2"
        style={{ background: "radial-gradient(62% 100% at 50% 0%, rgba(201,140,60,0.22), transparent 72%)" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-full h-px w-[72%] -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,110,0.45), transparent)" }}
      />
    </div>
  );
}
