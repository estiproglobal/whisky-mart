import Image from "next/image";

const SRC = "/hero/whiskymart-bottle.webp";
const W = 389;
const H = 1376;
const SIZES = "(min-width: 1024px) 180px, 1px";

/**
 * Hero visual — the WhiskyMart "Cabinet Selection" bottle (a fictional house
 * bottling, isolated to transparency) staged on the dark hero like a collector's
 * cabinet object: a warm amber glow, a soft drop shadow, and a faded floor
 * reflection on a brass shelf line. Decorative (aria-hidden); lazy so the
 * desktop-only image isn't fetched on mobile where the hero hides it.
 */
export function HeroBottle() {
  return (
    <div className="relative mx-auto w-full max-w-[18rem]" aria-hidden="true">
      {/* Warm amber glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[44%] h-[84%] w-[124%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(44% 46% at 50% 50%, rgba(201,122,43,0.36), rgba(201,122,43,0.06) 56%, transparent 74%)",
        }}
      />

      {/* Bottle */}
      <Image
        src={SRC}
        alt=""
        width={W}
        height={H}
        sizes={SIZES}
        className="relative z-10 mx-auto block h-auto w-[56%] drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
      />

      {/* Floor reflection */}
      <div
        className="pointer-events-none absolute left-1/2 top-full z-0 -mt-0.5 w-[56%] -translate-x-1/2 overflow-hidden"
        style={{
          height: "80px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)",
        }}
      >
        <Image src={SRC} alt="" width={W} height={H} sizes={SIZES} className="block h-auto w-full -scale-y-100 opacity-30" />
      </div>

      {/* Shelf hairline */}
      <div
        className="pointer-events-none absolute left-1/2 top-full h-px w-[72%] -translate-x-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,110,0.42), transparent)" }}
      />
    </div>
  );
}
