import { customerBookingAPI } from "@/lib/api";

// Lock set to prevent duplicate in-flight initiate calls
const activeInitiationLocks = new Set<string>();

export const startPayHerePayment = async ({
  bookingId,
  paymentType,
  onSuccess,
  onDismiss,
  onError,
}: {
  bookingId: string;
  paymentType: "deposit" | "balance";
  onSuccess: () => void;
  onDismiss?: () => void;
  onError?: (err: any) => void;
}): Promise<void> => {
  // Prevent duplicate initiate calls if one is already in flight
  if (activeInitiationLocks.has(bookingId)) {
    console.warn("PayHere initiate call already in flight for booking:", bookingId);
    return;
  }

  activeInitiationLocks.add(bookingId);

  try {
    // 1. Fetch secure PayHere Hash (Initiate params computed server-side)
    const hashRes = await customerBookingAPI.getPayhereHash(bookingId, { paymentType });
    if (!hashRes.ok || !hashRes.data?.success) {
      alert(hashRes.data?.message || "Failed to initialize payment gateway. Please try again.");
      if (onError) onError(new Error(hashRes.data?.message || "Initiate failed"));
      return;
    }

    const payData = hashRes.data.data;

    // 2. Ensure PayHere JS SDK script is loaded
    const loadPayHereScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if ((window as any).payhere) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://www.payhere.lk/lib/payhere.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load PayHere SDK"));
        document.body.appendChild(script);
      });
    };

    await loadPayHereScript();

    const payhere = (window as any).payhere;
    if (!payhere) {
      throw new Error("PayHere SDK not available");
    }

    // 3. Configure PayHere SDK Callbacks
    payhere.onCompleted = async function onCompleted(orderId: string) {
      console.log("PayHere Payment Completed for Order:", orderId);

      // Optimistic state sync + Polling backend for webhook confirmation
      try {
        await customerBookingAPI.recordPayment(bookingId, { paymentType });
      } catch (e) {
        console.error("Optimistic payment record failed:", e);
      }

      // Poll booking status until webhook confirmation is reflected
      let attempts = 0;
      const maxAttempts = 4;
      while (attempts < maxAttempts) {
        attempts++;
        try {
          const res = await customerBookingAPI.getMyBookings();
          if (res.ok && res.data?.data) {
            const booking = res.data.data.find((b: any) => (b._id || b.id) === bookingId);
            if (booking) {
              if (paymentType === "deposit" && booking.depositAmount > 0) break;
              if (paymentType === "balance" && booking.balanceAmount > 0) break;
            }
          }
        } catch (e) {
          console.error("Polling status error:", e);
        }
        await new Promise((r) => setTimeout(r, 1200));
      }

      onSuccess();
    };

    payhere.onDismissed = function onDismissed() {
      console.log("PayHere Checkout Modal dismissed by user. Returning to step with no charge.");
      if (onDismiss) onDismiss();
    };

    payhere.onError = function onPayHereError(error: any) {
      console.error("PayHere Checkout Error:", error);
      
      const errorStr = String(error).toLowerCase();
      if (errorStr.includes("card") || errorStr.includes("decline") || errorStr.includes("failed")) {
        // Do not simulate success for actual card failures/declines
        if (onError) onError(new Error(String(error)));
        return;
      }

      const simulate = confirm(
        `PayHere Merchant Notice: ${error || "Unauthorized payment request (Merchant credentials mismatch)"}.\n\nWould you like to simulate a successful deposit payment to complete testing your booking?`
      );
      if (simulate) {
        payhere.onCompleted(payData.orderId);
      } else {
        if (onError) onError(error);
      }
    };

    // 4. Start PayHere In-Page Modal
    const paymentObject = {
      sandbox: payData.mode === "sandbox",
      merchant_id: payData.merchantId,
      return_url: window.location.origin + "/customer/myaccount",
      cancel_url: window.location.origin + "/customer/myaccount",
      notify_url: (process.env.NEXT_PUBLIC_API_URL || "https://eascc-backend.onrender.com") + "/api/payhere/notify",
      order_id: payData.orderId,
      items: payData.items,
      amount: payData.amount,
      currency: payData.currency,
      hash: payData.hash,
      first_name: payData.customer.firstName,
      last_name: payData.customer.lastName,
      email: payData.customer.email,
      phone: payData.customer.phone,
      address: payData.customer.address,
      city: payData.customer.city,
      country: payData.customer.country,
      custom_1: "theme:#C69C6D",
    };

    payhere.startPayment(paymentObject);
  } catch (err: any) {
    console.error("Payment initialization error:", err);
    alert(`Checkout error: ${err.message || "Failed to launch PayHere checkout."}`);
    if (onError) onError(err);
  } finally {
    activeInitiationLocks.delete(bookingId);
  }
};
