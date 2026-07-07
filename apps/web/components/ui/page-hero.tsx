import { getPhoto } from "@/lib/photo";
import { Photo } from "@/components/ui/photo";

/**
 * PageHero: the dark editorial header for listing/content pages (PLP,
 * category, guides, search, taste). Takes an optional atmosphere photo slot
 * (category headers); degrades to the plain ground until the binary exists.
 * Server components only (photo lookup touches the filesystem).
 */
export function PageHero({
  title,
  intro,
  photoId,
  children,
}: {
  title: string;
  intro?: string;
  photoId?: string;
  children?: React.ReactNode;
}) {
  const photo = photoId ? getPhoto(photoId) : null;
  return (
    <section className="relative overflow-hidden border-b border-line-dark bg-ground text-cream">
      {photo ? (
        <>
          <Photo src={photo.src} alt="" fill sizes="100vw" className="absolute inset-0" />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(52deg, rgba(23,18,16,0.94) 30%, rgba(23,18,16,0.6) 62%, rgba(23,18,16,0.25) 100%)" }}
          />
        </>
      ) : null}
      <div className="container-page relative py-14 sm:py-16">
        <h1 className="max-w-3xl font-display text-d1 text-cream">{title}</h1>
        <span aria-hidden="true" className="pour-line" />
        {intro ? <p className="mt-5 max-w-2xl text-body-sm text-cream-muted">{intro}</p> : null}
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </section>
  );
}
