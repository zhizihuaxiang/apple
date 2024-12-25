import { updateOrderStatus } from "@/models/order";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export default async function ({ params }: { params: { session_id: string } }) {
  console.log("pay id ", params.session_id);

  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
  try {
    const session = await stripe.checkout.sessions.retrieve(params.session_id);
    console.log("order session: ", session);
    if (!session || !session.metadata || !session.metadata.order_no) {
      console.log("invalid session", params.session_id);
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paied_at = new Date().toISOString();
    updateOrderStatus(order_no, 2, paied_at);
    console.log("update success order status: ", order_no, paied_at);
    redirect("/");
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
}
