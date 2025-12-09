import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { InvoiceItem } from "@/types/invoice-item";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod";
import { getValidationErrors } from "@/types/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export interface CreateInvoiceItemDto {
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateInvoiceItemDto extends CreateInvoiceItemDto {
  id: number;
}

interface InvoiceItemFormProps {
  invoiceId: number;
  invoiceItem?: InvoiceItem;
  onSubmit: (item: CreateInvoiceItemDto | UpdateInvoiceItemDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Popis je povinné pole."),
  quantity: z.number().int().min(1, "Množství musí být alespoň 1."),
  unitPrice: z.number().min(0, "Jednotková cena nemůže být záporná."),
});

export function InvoiceItemForm({
  invoiceId,
  invoiceItem,
  onSubmit,
  onCancel,
  isLoading = false,
}: InvoiceItemFormProps) {
  const [formData, setFormData] = useState({
    description: invoiceItem?.description ?? "",
    quantity: invoiceItem?.quantity ?? 1,
    unitPrice: invoiceItem?.unitPrice ?? 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);
    setFieldErrors({});

    const parseResult = invoiceItemSchema.safeParse(formData);

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    const { description, quantity, unitPrice } = parseResult.data;

    try {
      const base: CreateInvoiceItemDto = {
        invoiceId,
        description,
        quantity,
        unitPrice,
      };
      const payload = invoiceItem ? { ...base, id: invoiceItem.id } : base;
      await onSubmit(payload);
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else {
        setFormError("Nastala chyba při ukládání položky");
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEdit = !!invoiceItem;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Upravit položku" : "Přidat položku"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Upravte údaje položky faktury."
            : "Přidejte novou položku k této faktuře."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.description}>
              <FieldLabel htmlFor="description">Popis</FieldLabel>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!fieldErrors.description}
              />
              {fieldErrors.description && (
                <FieldError
                  errors={fieldErrors.description.map((message) => ({ message }))}
                />
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.quantity}>
              <FieldLabel htmlFor="quantity">Množství</FieldLabel>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  handleChange("quantity", isNaN(value) ? 1 : value);
                }}
                disabled={isLoading}
                required
                aria-invalid={!!fieldErrors.quantity}
              />
              {fieldErrors.quantity && (
                <FieldError
                  errors={fieldErrors.quantity.map((message) => ({ message }))}
                />
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.unitPrice}>
              <FieldLabel htmlFor="unitPrice">Jednotková cena (Kč)</FieldLabel>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  handleChange("unitPrice", isNaN(value) ? 0 : value);
                }}
                disabled={isLoading}
                required
                aria-invalid={!!fieldErrors.unitPrice}
              />
              {fieldErrors.unitPrice && (
                <FieldError
                  errors={fieldErrors.unitPrice.map((message) => ({ message }))}
                />
              )}
            </Field>

            {formError && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Ukládání selhalo</AlertTitle>
                <AlertDescription>
                  <p>{formError}</p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Zrušit
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ukládání..." : isEdit ? "Uložit změny" : "Přidat položku"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
