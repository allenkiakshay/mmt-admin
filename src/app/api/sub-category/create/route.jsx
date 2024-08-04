"use server";

import { getClient } from "@/lib/Connection";
import { NextResponse } from "next/server";

export async function POST(req) {
  const client = await getClient(
    `${process.env.DATABASE_URL_1}${process.env.DATABASE_ACCOUNT_USER}${process.env.DATABASE_URL_2}`
  );
  try {
    const { CategoryId, subCategoryName, description, image, subcategoryId } =
      await req.json();

    const token = req.headers.get("token");

    if (
      !CategoryId ||
      !subCategoryName ||
      !description ||
      !image ||
      !subcategoryId ||
      !token
    ) {
      return NextResponse.json({
        status: 400,
        message: "Please provide all the details",
      });
    }

    const isVerified = await client.query(
      'SELECT * FROM "Owner" WHERE token = $1',
      [token]
    );

    if (!isVerified.rows[0]) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized",
      });
    }

    const checkCategory = await client.query(
      'SELECT * FROM "parent_categories" WHERE category_id = $1',
      [CategoryId]
    );

    if (!checkCategory.rows[0]) {
      return NextResponse.json({
        status: 404,
        message: "Parent Category not found",
      });
    }

    await client.query(
      `INSERT INTO "sub_categories" (parent_category_id, sub_category_name, description, image_url, sub_category_id, created_by, user_email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        CategoryId,
        subCategoryName,
        description,
        image,
        subcategoryId,
        isVerified.rows[0].firstName,
        isVerified.rows[0].email,
      ]
    );

    return NextResponse.json({
      status: 200,
      message: "Sub Category created",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Unable to create Sub Category",
      error: error.message,
    });
  } finally {
    await client.end();
  }
}

// Path: src/app/api/sub-category/create/service.js
// {
// "CategoryId": "Electronics",
// "subCategoryName": "Mobiles",
// "description": "This is the mobiles category",
// "image": "image.png",
// "subcategoryId": "electronics",
// }
