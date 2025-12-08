import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreatePaymentDto, UpdatePaymentDto, Payment } from "@/types/payment";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod";
import { getValidationErrors } from "@/types/api.ts";
import { DateInput } from "@components/date-input.tsx";

interface PaymentFormProps {
  invoiceId: number;
  payment?: Payment;
  onSubmit: (payment: CreatePaymentDto | UpdatePaymentDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const paymentSchema = z.object({
  amount: z
    .number("Částka je povinné pole.")
    .gt(0, "Částka nesmí být záporná nebo nulová hodnota."),
  paymentMethod: z
    .string()
    .trim()
    .min(1, "Způsob platby je povinné pole."),
  paymentDate: z
    .date("Datum platby je povinné pole."),
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
    paymentDate: new Date(payment?.paymentDate
      ? Date.parse(payment.paymentDate)
      : Date.now()),
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
        paymentDate: paymentDate.toISOString(),
      };
      const payload = payment ? { ...base, id: payment.id } : base;
      await onSubmit(payload);
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else {
        setFormError("Nastala chyba při ukládání platby");
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEdit = !!payment;

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
                onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                disabled={isLoading}
                required
                placeholder="0,00"
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
              <DateInput
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(date) => handleChange("paymentDate", date)}
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
                <FieldDescription className="text-destructive font-normal text-sm">
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
