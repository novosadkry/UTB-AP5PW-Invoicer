import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreatePaymentDto, Payment } from "@/types/payment";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod";

interface PaymentFormProps {
  invoiceId: number;
  payment?: Payment;
  onSubmit: (payment: CreatePaymentDto | (CreatePaymentDto & { id?: number })) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, "Částka je povinná")
    .transform((val) => Number.parseFloat(val.replace(",", ".")))
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: "Částka musí být větší než 0",
    }),
  paymentMethod: z
    .string()
    .trim()
    .min(1, "Způsob platby je povinný"),
  paymentDate: z
    .string()
    .min(1, "Datum platby je povinné"),
});

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
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);
    setFieldErrors({});

    const parseResult = paymentSchema.safeParse(formData);

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    const { amount, paymentMethod, paymentDate } = parseResult.data;

    try {
      const base: CreatePaymentDto = {
        invoiceId,
        amount,
        paymentMethod,
        paymentDate,
      };

      const payload = payment ? { ...base, id: payment.id } : base;

      await onSubmit(payload);
    } catch (err) {
      console.error(err);
      setFormError("Nastala chyba při ukládání platby");
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
            <Field data-invalid={!!fieldErrors.amount}>
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
                aria-invalid={!!fieldErrors.amount}
              />
              {fieldErrors.amount && (
                <FieldError errors={fieldErrors.amount.map((message) => ({ message }))} />
              )}
            </Field>
            <Field data-invalid={!!fieldErrors.paymentMethod}>
              <FieldLabel htmlFor="paymentMethod">Způsob platby</FieldLabel>
              <Input
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                disabled={isLoading}
                required
                placeholder="např. Bankovní převod"
                aria-invalid={!!fieldErrors.paymentMethod}
              />
              {fieldErrors.paymentMethod && (
                <FieldError errors={fieldErrors.paymentMethod.map((message) => ({ message }))} />
              )}
            </Field>
            <Field data-invalid={!!fieldErrors.paymentDate}>
              <FieldLabel htmlFor="paymentDate">Datum platby</FieldLabel>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleChange("paymentDate", e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!fieldErrors.paymentDate}
              />
              {fieldErrors.paymentDate && (
                <FieldError errors={fieldErrors.paymentDate.map((message) => ({ message }))} />
              )}
            </Field>

            {formError && (
              <Field>
                <FieldDescription className="text-red-600">
                  {formError}
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
