import { NextResponse } from "next/server";
import { fetchMarketNews } from "@/lib/news";

export const revalidate = 900; // 15 min — matches the per-source fetch cache

export async function GET() {
  const news = await fetchMarketNews(8);
  return NextResponse.json({ news });
}
