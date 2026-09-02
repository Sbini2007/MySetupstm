import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { reviews } from "@/lib/data";

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-300">
            Reviews
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
            Feedback da chi gira davvero.
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/62">
            Commenti brevi, concreti, centrati su stabilita, usura e fiducia in
            pista.
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          {reviews.map((quote, index) => (
            <figure
              key={quote}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[0_0_30px_rgba(139,92,246,0.06)]"
            >
              <div className="mb-5 flex gap-1 text-violet-300">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <span key={starIndex}>*</span>
                ))}
              </div>
              <blockquote className="text-lg leading-8 text-white/78">
                "{quote}"
              </blockquote>
              <figcaption className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-white/36">
                Driver #{index + 1}
              </figcaption>
            </figure>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
