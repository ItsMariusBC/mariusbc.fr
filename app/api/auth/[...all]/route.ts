import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return auth.handler(request);
}

export async function POST(request: NextRequest) {
  return auth.handler(request);
}

export async function PUT(request: NextRequest) {
  return auth.handler(request);
}

export async function DELETE(request: NextRequest) {
  return auth.handler(request);
}