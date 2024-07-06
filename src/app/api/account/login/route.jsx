"use server";
import { getClient } from "@/lib/Connection";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createLoginActivity } from "@/lib/Schema";

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function POST(request) {
  const client = await getClient(
    `${process.env.DATABASE_URL_1}${process.env.DATABASE_ACCOUNT_USER}${process.env.DATABASE_URL_2}`
  );
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email) {
      return NextResponse.json(
        { error: "User header is missing" },
        { status: 400 }
      );
    }

    const result = await client.query(
      `SELECT EXISTS (SELECT 1 FROM "Owner" WHERE email = '${atob(email)}');`
    );

    if (result.rows[0].exists === false) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const result1 = await client.query(
      `SELECT * FROM "Owner" WHERE email = '${atob(email)}';`
    );

    const passwordVerified = await verifyPassword(
      password,
      result1.rows[0].password
    );

    if (!passwordVerified) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 400 }
      );
    }

    if (result1.rows[0].isVerified === false) {
      return NextResponse.json(
        { error: "User is not active" },
        { status: 400 }
      );
    }

    const token = jwt.sign({ email: atob(email) }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    await client.query(
      `UPDATE "Owner" SET token = '${token}', last_login = CURRENT_TIMESTAMP WHERE email = '${atob(
        email
      )}';`
    );

    const isexist = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'owner_login_activity';`
    );

    if (isexist.rows.length === 0) {
      createLoginActivity(client);
    }

    await client.query(
      `INSERT INTO "owner_login_activity" (email, jwt_token) VALUES ('${atob(
        email
      )}', '${token}');`
    );

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.end();
  }
}

// data format is as follows:
// {
// "email": "YUBhLmNvbQ==",
// "password": "1234567"
// }
