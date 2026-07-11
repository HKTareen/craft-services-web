import { NextResponse } from "next/server";
import { fetchGoogleReviews } from "@/lib/reviews";

export async function GET() {
  const reviews = await fetchGoogleReviews();
  return NextResponse.json(reviews);
}
