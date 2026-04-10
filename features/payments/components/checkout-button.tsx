"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CheckoutButtonProps {
  levelId: string;
  levelName: string;
  price: number;
  userId: string;
}

export function CheckoutButton({ levelId, levelName, price }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId, levelName, price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Помилка при створенні платежу");
      }
    } catch {
      toast.error("Щось пішло не так");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full gap-2" onClick={handleCheckout} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      Придбати доступ
    </Button>
  );
}
