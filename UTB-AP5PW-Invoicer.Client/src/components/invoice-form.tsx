import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateInvoiceDto, UpdateInvoiceDto, Invoice } from "@/types/invoice";
import type { Customer } from "@/types/customer";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod";
import { getValidationErrors } from "@/types/api.ts";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (invoice: CreateInvoiceDto | UpdateInvoiceDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  customers: Customer[];
  customersLoading?: boolean;
  customersError?: string | null;
}

const invoiceSchema = z.object({
  customerId: z.number().int().positive().nullable().optional(),
  invoiceNumber: z.string().min(1, "Číslo faktury je povinné"),
  issueDate: z.string().min(1, "Datum vystavení je povinné"),
  dueDate: z.string().min(1, "Datum splatnosti je povinné"),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  totalAmount: z.number().gt(0, "Částka musí být větší než 0"),
});

export function InvoiceForm({
  invoice,
  onSubmit,
  onCancel,
  isLoading = false,
  customers,
  customersLoading = false,
  customersError = null,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || null,
    invoiceNumber: invoice?.invoiceNumber || "",
    issueDate: invoice?.issueDate
      ? invoice.issueDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
    dueDate: invoice?.dueDate
      ? invoice.dueDate.split("T")[0]
      : "",
    status: invoice?.status || "draft",
    totalAmount: invoice?.totalAmount || 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);
    setFieldErrors({});

    const parseResult = invoiceSchema.safeParse(formData);

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    const data = parseResult.data;

    try {
      const invoiceData = {
        ...data,
        issueDate: new Date(data.issueDate).toISOString(),
        dueDate: new Date(data.dueDate).toISOString(),
        ...(invoice && { id: invoice.id }),
      };
      await onSubmit(invoiceData as CreateInvoiceDto | UpdateInvoiceDto);
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else {
        setFormError("Nastala chyba při ukládání faktury");
      }
    }
  };

  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{invoice ? "Upravit fakturu" : "Nová faktura"}</CardTitle>
        <CardDescription>
          {invoice ? "Upravte údaje o faktuře" : "Vytvořte novou fakturu"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.customerId}>
              <FieldLabel htmlFor="customerId">Zákazník</FieldLabel>
              <Select
                value={formData.customerId !== null ? String(formData.customerId) : ""}
                onValueChange={(value) => {
                  const parsed = value ? Number(value) : null;
                  handleChange("customerId", Number.isNaN(parsed) ? null : parsed);
                }}
                disabled={isLoading || customersLoading}
              >
                <SelectTrigger id="customerId">
                  <SelectValue
                    placeholder={
                      customersLoading
                        ? "Načítání zákazníků..."
                        : customersError
                          ? "Chyba načítání zákazníků"
                          : "Vyberte zákazníka"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.name} (IČO: {customer.ico})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customersError && !customersLoading && (
                <FieldDescription className="text-red-600 mt-1">
                  {customersError}
                </FieldDescription>
              )}
              {fieldErrors.customerId && (
                <FieldError errors={fieldErrors.customerId.map((message) => ({ message }))} />
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.invoiceNumber}>
              <FieldLabel htmlFor="invoiceNumber">Číslo faktury</FieldLabel>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!fieldErrors.invoiceNumber}
              />
              {fieldErrors.invoiceNumber && (
                <FieldError
                  errors={fieldErrors.invoiceNumber.map((message) => ({ message }))}
                />
              )}
            </Field>

            <Field data-invalid={!!fieldErrors.status}>
              <FieldLabel htmlFor="status">Stav</FieldLabel>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Vyberte stav" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Koncept</SelectItem>
                  <SelectItem value="sent">Odesláno</SelectItem>
                  <SelectItem value="paid">Zaplaceno</SelectItem>
                  <SelectItem value="overdue">Po splatnosti</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.status && (
                <FieldError errors={fieldErrors.status.map((message) => ({ message }))} />
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!fieldErrors.issueDate}>
                <FieldLabel htmlFor="issueDate">Datum vystavení</FieldLabel>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange("issueDate", e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!fieldErrors.issueDate}
                />
                {fieldErrors.issueDate && (
                  <FieldError errors={fieldErrors.issueDate.map((message) => ({ message }))} />
                )}
              </Field>

              <Field data-invalid={!!fieldErrors.dueDate}>
                <FieldLabel htmlFor="dueDate">Datum splatnosti</FieldLabel>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!fieldErrors.dueDate}
                />
                {fieldErrors.dueDate && (
                  <FieldError errors={fieldErrors.dueDate.map((message) => ({ message }))} />
                )}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!fieldErrors.totalAmount}>
                <FieldLabel htmlFor="totalAmount">Celková částka (Kč)</FieldLabel>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    handleChange("totalAmount", parseFloat(e.target.value) || 0)
                  }
                  disabled={isLoading}
                  required
                  aria-invalid={!!fieldErrors.totalAmount}
                />
                {fieldErrors.totalAmount && (
                  <FieldError
                    errors={fieldErrors.totalAmount.map((message) => ({ message }))}
                  />
                )}
              </Field>
            </div>

            {formError && (
              <Field>
                <FieldDescription className="text-destructive font-normal text-sm">
                  {formError}
                </FieldDescription>
              </Field>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Zrušit
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ukládání..." : invoice ? "Uložit změny" : "Vytvořit fakturu"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
