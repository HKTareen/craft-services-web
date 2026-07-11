import type { Dictionary } from "@/i18n/locales/en";
import type { GoogleReview } from "@/lib/types";
import { getGoogleReviewUrl } from "@/lib/reviews";

interface ReviewsProps {
  dict: Dictionary;
  reviews: GoogleReview[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-stone-900" : "text-stone-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews({ dict, reviews }: ReviewsProps) {
  const reviewUrl = getGoogleReviewUrl();

  return (
    <section className="border-t border-stone-200 bg-white py-16 sm:py-24" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="reviews-title" className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {dict.reviews.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            {dict.reviews.subtitle}
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <blockquote
                key={`${review.authorName}-${i}`}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-sm"
              >
                <StarRating rating={review.rating} />
                <p className="mt-4 text-stone-700">&ldquo;{review.text}&rdquo;</p>
                <footer className="mt-4 flex items-center justify-between gap-3">
                  <cite className="not-italic font-semibold text-stone-900">
                    {review.authorName}
                  </cite>
                  <span className="shrink-0 text-sm text-stone-500">{review.relativeTime}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-stone-500">{dict.reviews.noReviews}</p>
        )}

        <div className="mt-12 text-center">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border-2 border-stone-950 bg-stone-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            {dict.reviews.leaveReview}
          </a>
        </div>
      </div>
    </section>
  );
}
