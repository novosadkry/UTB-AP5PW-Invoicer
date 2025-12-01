import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreatePaymentDto, Payment } from "@/types/payment";

interface PaymentFormProps {
  invoiceId: number;
  payment?: Payment;
  onSubmit: (payment: CreatePaymentDto | (CreatePaymentDto & { id?: number })) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PaymentForm({
  invoiceId,
  payment,
  onSubmit,
  onCancel,
  isLoading = false,
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: payment ? String(payment.amount) : "",
    paymentMethod: payment?.paymentMethod ?? "",
    paymentDate: payment?.paymentDate
      ? payment.paymentDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amountNumber = parseFloat(formData.amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setError("Částka musí být větší než 0");
      return;
    }
    if (!formData.paymentMethod.trim()) {
      setError("Způsob platby je povinný");
      return;
    }
    if (!formData.paymentDate) {
      setError("Datum platby je povinné");
      return;
    }

    try {
      const base: CreatePaymentDto = {
        invoiceId,
        amount: amountNumber,
        paymentMethod: formData.paymentMethod.trim(),
        paymentDate: formData.paymentDate,
      };

      const payload = payment ? { ...base, id: payment.id } : base;

      await onSubmit(payload);
    } catch (err) {
      setError("Nastala chyba při ukládání platby");
      console.error(err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEdit = Boolean(payment);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Upravit platbu" : "Přidat platbu"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Upravte údaje o platbě k této faktuře."
            : "Vyplňte údaje o platbě k této faktuře."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="paymentAmount">Částka (Kč)</FieldLabel>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                disabled={isLoading}
                required
                placeholder="0.00"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="paymentMethod">Způsob platby</FieldLabel>
              <Input
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                disabled={isLoading}
                required
                placeholder="např. Bankovní převod"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="paymentDate">Datum platby</FieldLabel>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleChange("paymentDate", e.target.value)}
                disabled={isLoading}
                required
              />
            </Field>

            {error && (
              <Field>
                <FieldDescription className="text-red-600">
                  {error}
                </FieldDescription>
              </Field>
            )}

            <div className="flex gap-2 justify-end mt-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Zrušit
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Ukládám..."
                  : isEdit
                    ? "Uložit změny"
                    : "Přidat platbu"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
