import { insertOrder, updateOrderSession } from "@/models/order";
import { Order } from "@/types/order";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  //获取当前登录用户标识
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return NextResponse.json("not login");
  }
  const user_email = user.emailAddresses[0].emailAddress;
  //获取下单参数
  const params = await req.json();

  //获取当前时间，和一个月后时间
  const currentDate = new Date();
  const oneMonthLater = new Date(currentDate);
  oneMonthLater.setMonth(currentDate.getMonth() + 1);
  const created_at = currentDate.toISOString();
  const expired_at = oneMonthLater.toISOString();

  //创建订单的唯一标识，这里用时间戳方式
  const order_no = new Date().getMilliseconds();

  //创建订单
  const order: Order = {
    order_no: order_no.toString(),
    created_at: created_at,
    user_email: user_email,
    amount: params.amount,
    plan: params.plan,
    expired_at: expired_at,
    order_status: 1,
    credits: params.credits,
  };
  console.log(order);
  //把订单保存到数据库
  await insertOrder(order);
  //调用stripe的下单
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

  const session = await stripe.checkout.sessions.create({
    customer_email: user_email,
    payment_method_types: ["card"], //接受信用卡支付
    line_items: [
      {
        price_data: {
          currency: "usd", //美元
          product_data: {
            name: "aiwallpaper.demo credits plan",
          },
          unit_amount: params.amount,
          recurring:
            params.plan === "monthly"
              ? {
                  interval: "month", //月付方案
                }
              : undefined,
        },
        quantity: 1,
      },
    ],
    allow_promotion_codes: false, //没有促销，付原款
    //自定义参数
    metadata: {
      project: "aiwallpaper-demo",
      pay_scene: "buy-credits", //购买积分
      order_no: order_no.toString(), //订单号
      user_email: user_email,
      credits: params.credits,
    },
    mode: params.plan === "monthly" ? "subscription" : "payment",
    //如果成功，跳转到pay-success页面，需要带上CHECKOUT_SESSION_ID，回调会自动填充
    success_url: `${process.env.WEB_BASE_URI}/api/pay-success/{CHECKOUT_SESSION_ID}`,
    //如果取消，跳转到pricing页面
    cancel_url: `${process.env.WEB_BASE_URI}/pricing`,
  });

  //更新支付标识，跟新订单表
  const stripe_session_id = session.id;
  await updateOrderSession(order_no.toString(), stripe_session_id);

  return NextResponse.json({
    code: 200,
    message: "success",
    data: {
      public_key: process.env.STRIPE_PUBLIC_KEY,
      order_no: order_no.toString(),
      session_id: stripe_session_id,
    },
  });
}
