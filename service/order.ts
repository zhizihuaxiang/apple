import { getUserOrders, updateOrderStatus } from "@/models/order";
import { getUserWallpapersCounts } from "@/models/wallpaper";
import { Order } from "@/types/order";
import { UserCredits } from "@/types/user";
import Stripe from "stripe";

export async function handleOrderSession(session_id: string) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("order session: ", session);
    if (!session || !session.metadata || !session.metadata.order_no) {
      console.log("invalid session", session_id);
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paied_at = new Date().toISOString();
    updateOrderStatus(order_no, 2, paied_at);
    console.log("update success order status: ", order_no, paied_at);
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
}

export async function getUserCredits(user_email: string): Promise<UserCredits> {
  //初始化用户积分
  let user_credits: UserCredits = {
    one_time_credits: 2,
    monthly_credits: 1,
    total_credits: 3,
    used_credits: 0,
    left_credits: 3,
  };

  try {
    const used_credits = await getUserWallpapersCounts(user_email);
    user_credits.used_credits = used_credits;

    const orders = await getUserOrders(user_email);
    if (!orders) {
      return user_credits;
    }

    orders.forEach((order: Order) => {
      if (order.plan === "monthly") {
        user_credits.monthly_credits += order.credits;
      } else {
        user_credits.one_time_credits += order.credits;
      }
      user_credits.total_credits += order.credits;
    });

    user_credits.left_credits =
      user_credits.total_credits - user_credits.used_credits;

    return user_credits;
  } catch (e) {
    console.log("get user credits failed: ", e);
    return user_credits;
  }
}
