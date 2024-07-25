"use server";

import { getClient } from "@/lib/Connection";
import { NextResponse } from "next/server";

export async function GET(req) {
  const client = await getClient(
    `${process.env.DATABASE_URL_1}${process.env.DATABASE_ACCOUNT_USER}${process.env.DATABASE_URL_2}`
  );

  try {
    const token = await req.headers.get("token");

    if (!token) {
      return NextResponse.json({
        status: 400,
        message: "Please provide a token",
      });
    }

    const isVerified = await client.query(
      `SELECT * FROM "Owner" WHERE token = '${token}'`
    );

    if (!isVerified.rows[0]) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized",
      });
    }

    const parentCategories = await client.query(
      `SELECT * FROM parent_categories WHERE user_email = '${isVerified.rows[0].email}'`
    );

    return NextResponse.json({
      status: 200,
      message: "Parent Categories fetched",
      data: parentCategories.rows
    });
  } catch (error) {
    console.error("Error in fetching parent categories:", error);
    return NextResponse.json({
      status: 500,
      message: "Unable to fetch parent categories",
      error,
    });
  } finally {
    await client.end();
  }
}
