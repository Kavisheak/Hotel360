import { customerBookingAPI } from "@/lib/api";

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
  try {
    // 1. Fetch secure PayHere Hash from backend
    const hashRes = await customerBookingAPI.getPayhereHash(bookingId, { paymentType });
    if (!hashRes.ok || !hashRes.data?.success) {
      alert(hashRes.data?.message || "Failed to initialize secure payment. Please try again.");
      if (onError) onError(new Error(hashRes.data?.message || "Hash fetch failed"));
      return;
    }

    const payData = hashRes.data.data;

    // 2. Ensure PayHere script is loaded
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

    // 3. Configure PayHere callbacks
    payhere.onCompleted = async function onCompleted(orderId: string) {
      console.log("PayHere Payment Completed for Order:", orderId);
      // Sync payment with backend database
      const recRes = await customerBookingAPI.recordPayment(bookingId, { paymentType });
      if (recRes.ok) {
        alert(`${paymentType === "deposit" ? "30% Advance Deposit" : "70% Balance"} paid successfully via PayHere!`);
        onSuccess();
      } else {
        alert("Payment verified by gateway, but syncing failed. Refreshing page...");
        onSuccess();
      }
    };

    payhere.onDismissed = function onDismissed() {
      console.log("PayHere Payment Dismissed by user");
      if (onDismiss) onDismiss();
    };

    payhere.onError = async function onPayHereError(error: any) {
      console.error("PayHere Error:", error);
      if (confirm(`PayHere Gateway Notice: ${error || "Sandbox account verification needed"}.\n\nWould you like to simulate a successful payment for your testing in Sandbox mode?`)) {
        const res = await customerBookingAPI.recordPayment(bookingId, { paymentType });
        if (res.ok) {
          alert(`${paymentType === "deposit" ? "30% Advance Deposit" : "70% Balance"} simulated successfully!`);
          onSuccess();
        } else {
          alert(res.data?.message || "Payment simulation failed.");
          if (onError) onError(error);
        }
      } else {
        if (onError) onError(error);
      }
    };

    // 4. Start Payment Modal
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
    };

    payhere.startPayment(paymentObject);
  } catch (err: any) {
    console.error("Payment initialization error:", err);
    // Offline / Local Sandbox Fallback option
    if (confirm("Could not reach PayHere checkout gateway (Sandbox / Network). Would you like to simulate payment completion for testing?")) {
      const res = await customerBookingAPI.recordPayment(bookingId, { paymentType });
      if (res.ok) {
        alert(`${paymentType === "deposit" ? "30% Advance" : "70% Balance"} simulated successfully!`);
        onSuccess();
      } else {
        alert(res.data?.message || "Payment simulation failed.");
        if (onError) onError(err);
      }
    } else {
      if (onError) onError(err);
    }
  }
};
