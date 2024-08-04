"use server";

import { getClient } from "@/lib/Connection";
import { NextResponse } from "next/server";

export async function POST(req) {
  const client = await getClient(
    `${process.env.DATABASE_URL_1}${process.env.DATABASE_ACCOUNT_USER}${process.env.DATABASE_URL_2}`
  );
  try {
    const { categoryName, description, image, categoryid } = await req.json();

    const token = await req.headers.get("token");

    if (!categoryName || !description || !image || !categoryid || !token) {
      return NextResponse.json({
        status: 400,
        message: "Please provide all the details",
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

    await client.query(
      `INSERT INTO "parent_categories" (name, description, image_url, category_id,created_by,user_email,updated_at,created_at) VALUES ('${categoryName}', '${description}', '${image}', '${categoryid}','${isVerified.rows[0].firstName}','${isVerified.rows[0].email}',DEFAULT,DEFAULT)`
    );

    return NextResponse.json({
      status: 200,
      message: "Parent Category created",
    });
  } catch (error) {
    console.error("Error in creating category:", error);
    return NextResponse.json({
      status: 500,
      message: "Unable to create Parent Category",
      error,
    });
  } finally {
    await client.end();
  }
}

// Path: src/app/api/parent-category/create/service.js
// {
// "categoryName": "Electronics",
// "description": "This is the electronics category",
// "image": "image.png",
// "categoryid": "electronics",
// }
