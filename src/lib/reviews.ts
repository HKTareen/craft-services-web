import type { GoogleReview } from "./types";

const FALLBACK_REVIEWS: GoogleReview[] = [
  {
    authorName: "Marie Tremblay",
    rating: 5,
    text: "Outstanding kitchen renovation. The cabinets are flawless and the team was professional from start to finish.",
    relativeTime: "2 months ago",
  },
  {
    authorName: "Jean Dupont",
    rating: 5,
    text: "They restored our heritage iron gate beautifully. It looks brand new but keeps its original character.",
    relativeTime: "4 months ago",
  },
  {
    authorName: "Sarah Mitchell",
    rating: 5,
    text: "Fast, reliable commercial build-out. Our storefront was ready ahead of schedule. Highly recommend.",
    relativeTime: "6 months ago",
  },
];

export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return FALLBACK_REVIEWS;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return FALLBACK_REVIEWS;

    const data = await res.json();
    const reviews = data.reviews as Array<{
      authorAttribution?: { displayName?: string; photoUri?: string };
      rating?: number;
      text?: { text?: string };
      relativePublishTimeDescription?: string;
    }>;

    if (!reviews?.length) return FALLBACK_REVIEWS;

    return reviews.slice(0, 6).map((r) => ({
      authorName: r.authorAttribution?.displayName ?? "Anonymous",
      rating: r.rating ?? 5,
      text: r.text?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
      profilePhotoUrl: r.authorAttribution?.photoUri,
    }));
  } catch {
    return FALLBACK_REVIEWS;
  }
}

export function getGoogleReviewUrl(): string {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (placeId) {
    return `https://search.google.com/local/writereview?placeid=${placeId}`;
  }
  return "https://www.google.com/maps";
}
