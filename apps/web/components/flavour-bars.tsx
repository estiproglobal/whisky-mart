import type { FlavourProfile } from "@whiskymart/types";
import { FLAVOUR_LABELS, rankedAxes } from "@/lib/catalog/flavour";

/**
 * Visual flavour profile — refined tasting meters (see docs/04 — PDP flavour
 * wheel/bars). Axes are ranked by intensity; `limit` trims to the strongest
 * notes for compact "signature" displays.
 */
export function FlavourBars({
  flavour,
  limit,
  showValues = true,
}: {
  flavour: FlavourProfile;
  limit?: number;
  showValues?: boolean;
}) {
  const ranked = rankedAxes(flavour);
  const axes = limit ? ranked.slice(0, limit) : ranked;

  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-3.5 sm:grid-cols-2">
      {axes.map((axis) => {
        const v = flavour[axis];
        return (
          <div key={axis} className="flex items-center gap-3">
            <dt className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-smoke">
              {FLAVOUR_LABELS[axis]}
            </dt>
            <dd className="flex flex-1 items-center gap-2.5">
              <span
                role="meter"
                aria-valuenow={v}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${FLAVOUR_LABELS[axis]} intensity ${v} of 100`}
                className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-charcoal/[0.06] ring-1 ring-inset ring-charcoal/[0.04]"
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-whisky-300 via-whisky-400 to-whisky-500"
                  style={{ width: `${v}%` }}
                />
              </span>
              {showValues ? (
                <span className="w-5 shrink-0 text-right text-[11px] tabular-nums text-charcoal/35">{v}</span>
              ) : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
