import Image from "next/image";

const SRC = "/hero/whiskymart-bottle.webp";
const W = 640;
const H = 1368;
const SIZES = "(min-width: 1024px) 300px, 1px";

/**
 * Hero visual — the WhiskyMart "Cabinet Selection" bottle (a fictional house
 * bottling, isolated to transparency) staged on the dark hero like a collector's
 * cabinet object: a warm amber glow, a soft drop shadow, and a faded floor
 * reflection on a brass shelf line. Decorative (aria-hidden); lazy so the
 * desktop-only image isn't fetched on mobile where the hero hides it.
 */
export function HeroBottle() {
  return (
    <div className="relative mx-auto w-full max-w-[20rem]" aria-hidden="true">
      {/* Warm amber glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[82%] w-[112%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(46% 44% at 50% 50%, rgba(201,122,43,0.34), rgba(201,122,43,0.06) 56%, transparent 74%)",
        }}
      />

      {/* Bottle + glass */}
      <Image
        src={SRC}
        alt=""
        width={W}
        height={H}
        sizes={SIZES}
        className="relative z-10 mx-auto block h-auto w-[76%] drop-shadow-[0_30px_48px_rgba(0,0,0,0.6)]"
      />

      {/* Floor reflection */}
      <div
        className="pointer-events-none absolute left-1/2 top-full z-0 -mt-0.5 w-[76%] -translate-x-1/2 overflow-hidden"
        style={{
          height: "88px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
        }}
      >
        <Image src={SRC} alt="" width={W} height={H} sizes={SIZES} className="block h-auto w-full -scale-y-100 opacity-30" />
      </div>

      {/* Shelf hairline */}
      <div
        className="pointer-events-none absolute left-1/2 top-full h-px w-[88%] -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,110,0.42), transparent)" }}
      />
    </div>
  );
}
