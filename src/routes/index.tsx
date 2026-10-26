import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { COUNTDOWN_SECONDS, PHOTOS, nextLink } from "@/lib/ads";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EarnX Photos — Free HD Wallpapers" },
      { name: "description", content: "Download 100 beautiful free HD photos and wallpapers." },
      { property: "og:title", content: "EarnX Photos — Free HD Wallpapers" },
      { property: "og:description", content: "Download 100 beautiful free HD photos and wallpapers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Photo = (typeof PHOTOS)[number];

function Index() {
  const [active, setActive] = useState<Photo | null>(null);

  const start = (p: Photo) => {
    window.open(nextLink(), "_blank", "noopener");
    setActive(p);
  };

  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto max-w-6xl px-5 pt-10 pb-8">
        <div className="font-display text-2xl font-extrabold tracking-tight">
          Earn<span className="text-primary">X</span>
          <span className="ml-2 text-sm font-medium text-muted-foreground">Photos</span>
        </div>
        <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          100 free <span className="text-primary">HD photos</span>.
          <br />
          One tap to download.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Wallpapers for your phone and desktop. Free to use, high resolution.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 pb-16 sm:grid-cols-3 lg:grid-cols-4">
        {PHOTOS.map((p) => (
          <figure key={p.id} className="group relative overflow-hidden rounded-xl bg-card">
            <img
              src={p.thumb}
              alt={`Photo ${p.id}`}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button
              onClick={() => start(p)}
              className="absolute inset-x-2 bottom-2 rounded-lg bg-primary py-2 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-95"
            >
              Download
            </button>
          </figure>
        ))}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © EarnX Photos
      </footer>

      {active && <CountdownModal photo={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function CountdownModal({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  const [left, setLeft] = useState(COUNTDOWN_SECONDS);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(photo.full);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `earnx-photo-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      window.open(photo.full, "_blank");
    }
    setBusy(false);
    onClose();
  };

  const pct = ((COUNTDOWN_SECONDS - left) / COUNTDOWN_SECONDS) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-5 text-center">
        <img src={photo.thumb} alt="" className="mx-auto aspect-[3/4] w-40 rounded-lg object-cover" />
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
        {left > 0 ? (
          <p className="mt-4 font-display text-lg font-bold">Preparing download… {left}s</p>
        ) : (
          <button
            onClick={download}
            disabled={busy}
            className="mt-4 w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground shadow-glow"
          >
            {busy ? "Downloading…" : "Download now"}
          </button>
        )}
        <button onClick={onClose} className="mt-3 text-sm text-muted-foreground">
          Cancel
        </button>
      </div>
    </div>
  );
}
