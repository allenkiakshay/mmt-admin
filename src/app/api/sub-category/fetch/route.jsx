"use server";

import { getClient } from "@/lib/Connection";
import { NextResponse } from "next/server";

export async function GET(req) {
  const client = await getClient(
    `${process.env.DATABASE_URL_1}${process.env.DATABASE_ACCOUNT_USER}${process.env.DATABASE_URL_2}`
  );

  try {
    const token = await req.headers.get("token");
    const category = await req.headers.get("category");

    if (!token || !category) {
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

    const subCategories = await client.query(
      `SELECT * FROM sub_categories WHERE parent_category_id = '${category}'`
    );

    return NextResponse.json({
      status: 200,
      message: "Parent Categories fetched",
      data: subCategories.rows,
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
