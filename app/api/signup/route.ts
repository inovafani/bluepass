import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(6).max(40),
  roles: z.array(z.enum(["OPERATOR", "CREATOR"])).min(1).max(2),
});

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 },
    );
  }

  const lead = await prisma.signupLead.create({
    data: parsed.data,
    select: {
      id: true,
      roles: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, lead });
}
