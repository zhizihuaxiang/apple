import { getWallpapers } from "@/models/wallpaper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { page, limit } = await req.json();
  console.log("page", page, "limit", limit);

  const wallpapers = await getWallpapers(page, limit);

  return Response.json({
    code: 0,
    message: "ok",
    data: wallpapers,
  });
}
