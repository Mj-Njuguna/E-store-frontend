"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Phone, Loader2, CheckCircle2, XCircle } from "lucide-react";

import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";

// How often to poll for payment status (ms)
const POLL_INTERVAL = 4000;
// Give up polling after this many ms (2.5 minutes — STK push expires at 3 min)
const POLL_TIMEOUT = 150000;

const STEPS = {
  IDLE: "idle",           // showing order summary + phone input
  PENDING: "pending",     // STK push sent, waiting for user to confirm on phone
  SUCCESS: "success",     // payment confirmed
  FAILED: "failed",       // payment failed or timed out
};

/** Normalise a Kenyan phone number to 2547XXXXXXXX format */
function normalisePhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) return "254" + digits.slice(1);
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("7") && digits.length === 9) return "254" + digits;
  return null;
}

function isValidPhone(raw) {
  return normalisePhone(raw) !== null;
}

export default function Summary() {
  const { userId } = useAuth();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [step, setStep] = useState(STEPS.IDLE);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const pollTimer = useRef(null);
  const pollStart = useRef(null);

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  // Clean up polling on unmount
  useEffect(() => {
    return () => clearTimeout(pollTimer.current);
  }, []);

  // Start polling once we have a checkoutRequestId
  useEffect(() => {
    if (!checkoutRequestId) return;
    pollStart.current = Date.now();
    schedulePoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutRequestId]);

  const schedulePoll = () => {
    pollTimer.current = setTimeout(pollStatus, POLL_INTERVAL);
  };

  const pollStatus = async () => {
    // Timed out — give up
    if (Date.now() - pollStart.current > POLL_TIMEOUT) {
      setStep(STEPS.FAILED);
      setStatusMessage("Payment timed out. Please try again.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mpesa/status/${checkoutRequestId}`
      );
      const data = await res.json();

      if (data.status === "completed") {
        clearTimeout(pollTimer.current);
        setStep(STEPS.SUCCESS);
        setStatusMessage("Payment received. Thank you!");
        removeAll();
        return;
      }

      if (data.status === "failed") {
        clearTimeout(pollTimer.current);
        setStep(STEPS.FAILED);
        setStatusMessage(data.message || "Payment was not completed.");
        return;
      }

      // Still pending — poll again
      schedulePoll();
    } catch {
      // Network hiccup — keep polling
      schedulePoll();
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setPhoneError("");
  };

  const onCheckout = async () => {
    if (!userId) {
      toast.error("Please sign in to checkout");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const normalised = normalisePhone(phone);
    if (!normalised) {
      setPhoneError("Enter a valid Kenyan number e.g. 0712 345 678");
      return;
    }

    setStep(STEPS.PENDING);
    setStatusMessage("Sending payment request to your phone…");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mpesa/stkpush`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalised,
          amount: Math.ceil(totalPrice),   // M-Pesa requires whole KES
          userId,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity || 1,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStep(STEPS.FAILED);
        setStatusMessage(data.message || "Failed to initiate payment.");
        return;
      }

      // Backend returns the CheckoutRequestID from Daraja
      setCheckoutRequestId(data.checkoutRequestId);
    } catch {
      setStep(STEPS.FAILED);
      setStatusMessage("Network error. Please try again.");
    }
  };

  const reset = () => {
    clearTimeout(pollTimer.current);
    setStep(STEPS.IDLE);
    setCheckoutRequestId(null);
    setStatusMessage("");
    setPhoneError("");
  };

  // ── Pending screen ──────────────────────────────────────────────────────────
  if (step === STEPS.PENDING) {
    return (
      <div className="mt-16 rounded-lg bg-gray-50 px-4 py-8 sm:p-8 lg:col-span-5 lg:mt-0 flex flex-col items-center text-center gap-4">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900">Check your phone</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          A payment prompt has been sent to <span className="font-medium text-gray-800">{phone}</span>.
          Enter your M-Pesa PIN to complete the purchase.
        </p>
        <p className="text-xs text-gray-400">{statusMessage}</p>
        <button
          onClick={reset}
          className="mt-2 text-sm text-gray-400 underline hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === STEPS.SUCCESS) {
    return (
      <div className="mt-16 rounded-lg bg-gray-50 px-4 py-8 sm:p-8 lg:col-span-5 lg:mt-0 flex flex-col items-center text-center gap-4">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">Payment successful!</h3>
        <p className="text-sm text-gray-500">{statusMessage}</p>
      </div>
    );
  }

  // ── Failed screen ───────────────────────────────────────────────────────────
  if (step === STEPS.FAILED) {
    return (
      <div className="mt-16 rounded-lg bg-gray-50 px-4 py-8 sm:p-8 lg:col-span-5 lg:mt-0 flex flex-col items-center text-center gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Payment failed</h3>
        <p className="text-sm text-gray-500">{statusMessage}</p>
        <Button onClick={reset} className="mt-2">Try again</Button>
      </div>
    );
  }

  // ── Idle / default screen ───────────────────────────────────────────────────
  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      {/* Line items */}
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span className="truncate max-w-[180px]">
              {item.name}
              {(item.quantity || 1) > 1 && (
                <span className="text-gray-400 ml-1">×{item.quantity}</span>
              )}
            </span>
            <Currency value={Number(item.price) * (item.quantity || 1)} />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-base font-medium text-gray-900">Total</span>
        <Currency value={totalPrice} />
      </div>

      {userId ? (
        <div className="mt-6 space-y-3">
          {/* Phone input */}
          <label className="block text-sm font-medium text-gray-700">
            M-Pesa phone number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="0712 345 678"
              className={`w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                phoneError ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
          </div>
          {phoneError && (
            <p className="text-xs text-red-500">{phoneError}</p>
          )}

          <Button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 mt-2"
          >
            Pay with M-Pesa
          </Button>

          <p className="text-xs text-center text-gray-400">
            You will receive an STK push on your phone to confirm payment
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-4">
            Please sign in to proceed with checkout
          </p>
          <SignInButton mode="modal">
            <Button className="w-full">Sign in to Checkout</Button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}
