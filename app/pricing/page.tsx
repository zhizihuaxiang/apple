"use client";

import { loadStripe } from "@stripe/stripe-js";

export default function () {
  const handleCheckout = async () => {
    const params = {
      amount: 990,
      plan: "subscribe",
      credits: 50,
    };
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const { code, message, data } = await response.json();
    if (!data) {
      return;
    }
    const { public_key, session_id } = data;
    console.log("checkout res", public_key, session_id);

    const stripe = await loadStripe(public_key);
    if (!stripe) {
      return;
    }
    const result = await stripe.redirectToCheckout({
      sessionId: session_id,
    });
    console.log("result", result);
    if (result.error) {
      // 处理错误
      console.log(result.error.message);
    }
  };
  return (
    <section>
      {/* Container */}
      <div className="flex flex-col items-center px-5 py-16 md:px-10 md:py-20">
        {/* Heading Container */}
        <div className="mb-8 w-full max-w-3xl text-center md:mb-12 lg:mb-16">
          {/* Heading */}
          <h2 className="text-3xl font-bold md:text-5xl">
            Simple & Affordable Pricing
          </h2>
          {/* Subheading */}
          <p className="mt-4 text-sm text-gray-500 sm:text-base">
            Simple & fixed pricing. 30 days money-back guarantee
          </p>
        </div>
        {/* Price Container */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Price */}
          <div className="flex max-w-md flex-col items-start rounded-md border border-gray-300 p-8">
            <div className="mb-4 rounded-md bg-black px-4 py-1.5">
              <p className="text-sm font-bold text-white sm:text-sm">BASIC</p>
            </div>
            <p className="mb-6 text-base font-light text-gray-500 md:mb-10 lg:mb-12">
              Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam,
              purus sit
            </p>
            <h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-5xl lg:mb-8">
              $99<span className="text-sm font-light sm:text-sm">/month</span>
            </h2>
            <button
              className="mb-5 w-full rounded-md bg-black px-6 py-3 text-center font-semibold text-white lg:mb-8"
              onClick={handleCheckout}
            >
              付款
            </button>
            <div className="mt-2 flex items-center">
              <img
                src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg"
                alt=""
                className="mr-2 inline-block w-4"
              />
              <p className="text-base">Premium Designs</p>
            </div>
            <div className="mt-2 flex items-center">
              <img
                src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg"
                alt=""
                className="mr-2 inline-block w-4"
              />
              <p className="text-base">Exclusive Freebies</p>
            </div>
            <div className="mt-2 flex items-center">
              <img
                src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg"
                alt=""
                className="mr-2 inline-block w-4"
              />
              <p className="text-base">Monthly Free Exclusive</p>
            </div>
            <div className="mt-2 flex items-center">
              <img
                src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94a84be6cf60_check-mark.svg"
                alt=""
                className="mr-2 inline-block w-4"
              />
              <p className="text-base">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
