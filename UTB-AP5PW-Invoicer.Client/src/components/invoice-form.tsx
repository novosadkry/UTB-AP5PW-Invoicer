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
import { DateInput } from "@components/date-input.tsx";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";

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
  invoiceNumber: z.string().nonempty("Číslo faktury je povinné pole."),
  issueDate: z.date("Datum vystavení je povinné pole."),
  dueDate: z.date("Datum splatnosti je povinné pole."),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
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
    issueDate: new Date(invoice?.issueDate
      ? Date.parse(invoice.issueDate)
      : Date.now()),
    dueDate: new Date(invoice?.dueDate
      ? Date.parse(invoice.dueDate)
      : Date.now()),
    status: invoice?.status || "draft",
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

  const handleChange = (field: string, value: any) => {
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
                <DateInput
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(date) => handleChange("issueDate", date)}
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
                <DateInput
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(date) => handleChange("dueDate", date)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!fieldErrors.dueDate}
                />
                {fieldErrors.dueDate && (
                  <FieldError errors={fieldErrors.dueDate.map((message) => ({ message }))} />
                )}
              </Field>
            </div>

            {invoice && (
              <Field>
                <FieldLabel htmlFor="totalAmount">Celková částka (Kč)</FieldLabel>
                <Input
                  id="totalAmount"
                  type="text"
                  value={new Intl.NumberFormat('cs-CZ', { 
                    style: 'currency', 
                    currency: 'CZK' 
                  }).format(invoice.totalAmount)}
                  disabled
                  readOnly
                  className="bg-muted"
                />
                <FieldDescription>
                  Částka se počítá automaticky z položek faktury.
                </FieldDescription>
              </Field>
            )}

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
                {isLoading ? "Ukládání..." : invoice ? "Uložit změny" : "Vytvořit fakturu"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
