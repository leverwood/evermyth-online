import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

// get a specific campaign
export async function GET() {
  const session = await getSession();
  if (session) return Response.json({ session });
  else return Response.json({ session: null });
}

// update a specific campaign
export async function PUT(req: NextApiRequest, res: NextApiResponse) {}

// delete a specific campaign
export async function DELETE() {}
