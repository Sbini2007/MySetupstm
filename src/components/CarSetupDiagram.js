import Image from "next/image";
import Link from "next/link";

const setupComponents = [
  {
    label: "Aerodinamica",
    topic: "aerodinamica",
    path: "M 8 42 L 8 16 L 13 16",
    labelPosition: { left: "13%", top: "16%" },
    anchor: { left: "8%", top: "42%" },
  },
  {
    label: "Trasmissione",
    topic: "trasmissione",
    path: "M 29 56 L 29 13 L 35 13",
    labelPosition: { left: "35%", top: "13%" },
    anchor: { left: "29%", top: "56%" },
  },
  {
    label: "Geometria sospensioni",
    topic: "geometria-sospensioni",
    path: "M 53 49 L 53 9 L 57 9",
    labelPosition: { left: "57%", top: "9%" },
    anchor: { left: "53%", top: "49%" },
  },
  {
    label: "Sospensioni",
    topic: "sospensioni",
    path: "M 75 49 L 75 25 L 80 25",
    labelPosition: { left: "80%", top: "25%" },
    anchor: { left: "75%", top: "49%" },
  },
  {
    label: "Pressione freni",
    topic: "pressione-freni",
    path: "M 82 61 L 82 78 L 86 78",
    labelPosition: { left: "86%", top: "78%" },
    anchor: { left: "82%", top: "61%" },
  },
  {
    label: "Pressione pneumatici",
    topic: "pressione-pneumatici",
    path: "M 7 59 L 7 78 L 23 78",
    labelPosition: { left: "23%", top: "78%" },
    anchor: { left: "7%", top: "59%" },
  },
];

export default function CarSetupDiagram() {
  return (
    <figure className="home-car-diagram mx-auto mt-14 mb-2 w-full max-w-[60rem] sm:mt-16">
      <div className="home-car-diagram__desktop relative aspect-[1086/470] w-full">
        <div className="pointer-events-none absolute inset-x-0 top-[23%] h-[54%]">
          <Image
            src="/assets/mysetups-f1-car.webp"
            alt="Vettura di Formula 1 viola MySetups vista di lato"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            loading="eager"
            fetchPriority="high"
            unoptimized
            className="object-contain"
          />
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {setupComponents.map(({ label, path }) => (
            <path
              key={label}
              className="home-car-diagram__line"
              d={path}
            />
          ))}
        </svg>

        {setupComponents.map(({ label, anchor }) => (
          <span
            key={label}
            aria-hidden="true"
            className="home-car-diagram__point absolute"
            style={anchor}
          />
        ))}

        {setupComponents.map(({ label, labelPosition, topic }) => (
          <Link
            key={label}
            href={`/guide/setup?topic=${encodeURIComponent(topic)}`}
            className="home-car-diagram__label absolute"
            style={labelPosition}
            aria-label={`Apri la guida: ${label}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <figcaption className="sr-only">
        Seleziona una sezione della vettura per aprire la relativa guida al setup.
      </figcaption>
    </figure>
  );
}
