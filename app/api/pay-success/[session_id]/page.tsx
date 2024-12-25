import { updateOrderStatus } from "@/models/order";
import { handleOrderSession } from "@/service/order";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export default async function ({ params }: any) {
  try {
    handleOrderSession(params.session_id);
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
  redirect("/");
}
