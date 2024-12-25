import { getUserCredits } from "@/service/order";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  //获取当前登录用户标识
  const user = await currentUser();

  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return NextResponse.json("not login");
  }
  const user_email = user.emailAddresses[0].emailAddress;
  const user_credits = await getUserCredits(user_email);
  console.log(user_credits);

  return NextResponse.json({
    code: 0,
    message: "success",
    data: {
      credits: user_credits,
    },
  });
}
