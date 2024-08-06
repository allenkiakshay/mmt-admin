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
    const product_id = await request.headers.get("product_id");

    if (!token || !category || !sub_category || !product_id) {
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

    const products = await client.query(
      `SELECT * FROM products WHERE parent_category_id = '${category}' AND sub_category_id = '${sub_category}' AND product_id = '${product_id}'`
    );

    const data = [];
    for (let i = 0; i < products.rows.length; i++) {
      const product = products.rows[i];
      const images = await client.query(
        `SELECT * FROM product_images WHERE product_id = '${product.product_id}'`
      );
      const sizes = await client.query(
        `SELECT * FROM product_variations WHERE product_id = '${product.product_id}'`
      );
      product.images = images.rows;
      product.sizes = sizes.rows;
      data.push(product);
    }

    if (products.rows.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "No product found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Product fetched",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: 500,
      message: "Unable to fetch product",
    });
  } finally {
    await client.end();
  }
}
