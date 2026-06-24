import { FLAVOUR_AXES, type FlavourProfile } from "@whiskymart/types";

const LABELS: Record<string, string> = {
  smoky: "Smoky",
  peaty: "Peaty",
  sweet: "Sweet",
  fruity: "Fruity",
  spicy: "Spicy",
  floral: "Floral",
  maritime: "Maritime",
  rich: "Rich",
};

/** Visual flavour profile (see docs/04 — PDP flavour wheel/bars). */
export function FlavourBars({ flavour }: { flavour: FlavourProfile }) {
  const axes = FLAVOUR_AXES.filter((axis) => flavour[axis] > 0).sort((a, b) => flavour[b] - flavour[a]);

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {axes.map((axis) => (
        <div key={axis} className="flex items-center gap-3">
          <dt className="w-20 shrink-0 text-sm text-charcoal/70">{LABELS[axis]}</dt>
          <dd className="flex-1">
            <div
              className="h-2 rounded-full bg-whisky-100"
              role="meter"
              aria-valuenow={flavour[axis]}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${LABELS[axis]} intensity`}
            >
              <div
                className="h-2 rounded-full bg-whisky-500"
                style={{ width: `${flavour[axis]}%` }}
              />
            </div>
          </dd>
        </div>
      ))}
    </dl>
  );
}
