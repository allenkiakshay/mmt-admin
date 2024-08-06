"use server";

import { getClient } from "@/lib/Connection";
import { NextResponse } from "next/server";

export async function GET(request) {
  const client = await getClient(
    `${process.env.DATABASE_URL_1}${process.env.DATABASE_ACCOUNT_USER}${process.env.DATABASE_URL_2}`
  );
  try {
    const token = await request.headers.get("token");
    const category = await request.headers.get("category");
    const sub_category = await request.headers.get("sub_category");

    if (!token || !category || !sub_category) {
      return NextResponse.json({
        status: 400,
        message: "Please provide required fields",
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

    const productsWithDetails = await client.query(`
  SELECT 
    p.product_id,
    p.parent_category_id,
    p.sub_category_id,
    p.product_name,
    p.user_email AS product_user_email,
    pi.image_id,
    pi.image_link,
    pi.created_at AS image_created_at,
    pi.user_email AS image_user_email
  FROM 
    products p
  LEFT JOIN LATERAL (
    SELECT * 
    FROM product_images pi 
    WHERE pi.product_id = p.product_id
    ORDER BY pi.created_at
    LIMIT 1
  ) pi ON true
  WHERE 
    p.parent_category_id = '${category}' 
    AND 
    p.sub_category_id = '${sub_category}'
`);

    if (productsWithDetails.rows.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "No products found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Products fetched",
      data: productsWithDetails.rows,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: 500,
      message: "Unable to fetch products",
    });
  } finally {
    await client.end();
  }
}
