"use server";

import { getClient } from "@/lib/Connection";
import { NextResponse } from "next/server";

export async function POST(req) {
  const client = await getClient(
    `${process.env.DATABASE_URL_1}${process.env.DATABASE_ACCOUNT_USER}${process.env.DATABASE_URL_2}`
  );

  try {
    const {
      productName,
      parentcategoryId,
      description,
      images,
      subcategoryId,
      productid,
      mrp,
      length,
      width,
      height,
      weight,
      sizes,
    } = await req.json();

    const token = await req.headers.get("token");

    if (
      !productName ||
      !parentcategoryId ||
      !description ||
      !images ||
      !subcategoryId ||
      !productid ||
      !mrp ||
      !length ||
      !width ||
      !height ||
      !weight ||
      !sizes
    ) {
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

    const parentCategory = await client.query(
      `SELECT * FROM "parent_categories" WHERE category_id = '${parentcategoryId}'`
    );

    if (!parentCategory.rows[0]) {
      return NextResponse.json({
        status: 400,
        message: "Parent Category not found",
      });
    }
    const subCategory = await client.query(
      `SELECT * FROM "sub_categories" WHERE parent_category_id = '${parentcategoryId}' AND sub_category_id = '${subcategoryId}'`
    );

    if (!subCategory.rows[0]) {
      return NextResponse.json({
        status: 400,
        message: "Sub Category not found",
      });
    }

    const res = await client.query(
      `INSERT INTO "products" (product_id,parent_category_id,sub_category_id,product_name,description,length,width,height,weight,created_at,updated_at,created_by,user_email) VALUES ('${productid}', '${parentcategoryId}', '${subcategoryId}', '${productName}', '${description}', '${length}', '${width}', '${height}', '${weight}', DEFAULT, DEFAULT, '${isVerified.rows[0].firstName}', '${isVerified.rows[0].email}')`
    );

    if (res.rowCount === 0) {
      return NextResponse.json({
        status: 400,
        message: "Product not created Due to some error",
      });
    }

    for (let i = 0; i < images.length; i++) {
      await client.query(
        `INSERT INTO "product_images" (image_id,product_id,image_link,created_at,user_email) VALUES ('${
          productid + "_image_" + i
        }','${productid}', '${images[i]}', DEFAULT, '${
          isVerified.rows[0].email
        }')`
      );
    }

    for (let i = 0; i < sizes.length; i++) {
      await client.query(
        `INSERT INTO "product_variations" (variation_id,product_id,variation,quantity,price,created_at,user_email) VALUES ('${
          productid + "_size_" + i
        }','${productid}', '${sizes[i].size}', '${sizes[i].quantity}', '${
          sizes[i].price
        }', DEFAULT, '${isVerified.rows[0].email}')`
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Product created Successfully",
      res,
    });
  } catch (error) {
    console.error("Error in creating category:", error);
    return NextResponse.json({
      status: 500,
      message: "Unable to create Product",
      error,
    });
  } finally {
    await client.end();
  }
}

// Path: src/app/api/products/create/route.jsx
// {
//     "productName": "test",
//   "parentcategoryId": "ELE001",
//   "description": "test",
//   "images": [
//         "https://mahesh-mens-touch.s3.ap-south-1.amazonaws.com/1722866271944-Screenshot from 2024-08-05 19-09-46.png",
//         "https://mahesh-mens-touch.s3.ap-south-1.amazonaws.com/1722866271948-Screenshot from 2024-08-05 19-09-24.png",
//         "https://mahesh-mens-touch.s3.ap-south-1.amazonaws.com/1722866271948-Screenshot from 2024-08-05 11-45-44.png"
//     ],
//   "subcategoryId": "1",
//   "productid": "1",
//   "mrp": "1999",
//   "length": "10",
//   "width": "9",
//   "height": "30",
//   "weight": "0.5",
//   "sizes": [
//         { "size": "free size", "quantity": "100", "price": "1199"
//         }
//     ]
// }
