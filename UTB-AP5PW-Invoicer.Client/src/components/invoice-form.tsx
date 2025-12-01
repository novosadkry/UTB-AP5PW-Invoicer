import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateInvoiceDto, UpdateInvoiceDto, Invoice } from "@/types/invoice";
import type { Customer } from "@/types/customer";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (invoice: CreateInvoiceDto | UpdateInvoiceDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  customers: Customer[];
  customersLoading?: boolean;
  customersError?: string | null;
}

export function InvoiceForm({
  invoice,
  onSubmit,
  onCancel,
  isLoading = false,
  customers,
  customersLoading = false,
  customersError = null
}: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || null,
    invoiceNumber: invoice?.invoiceNumber || "",
    issueDate: invoice?.issueDate
      ? invoice.issueDate.split('T')[0]
      : new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate
      ? invoice.dueDate.split('T')[0]
      : "",
    status: invoice?.status || "draft",
    totalAmount: invoice?.totalAmount || 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.invoiceNumber) {
      setError("Číslo faktury je povinné");
      return;
    }

    if (!formData.dueDate) {
      setError("Datum splatnosti je povinné");
      return;
    }

    try {
      const invoiceData = {
        ...formData,
        issueDate: new Date(formData.issueDate).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        ...(invoice && { id: invoice.id })
      };
      await onSubmit(invoiceData as CreateInvoiceDto | UpdateInvoiceDto);
    } catch (err) {
      setError("Nastala chyba při ukládání faktury");
      console.error(err);
    }
  };

  const handleChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <Field>
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
                  <SelectValue placeholder={
                    customersLoading
                      ? "Načítání zákazníků..."
                      : customersError
                        ? "Chyba načítání zákazníků"
                        : "Vyberte zákazníka"
                  } />
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
            </Field>

            <Field>
              <FieldLabel htmlFor="invoiceNumber">Číslo faktury</FieldLabel>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                disabled={isLoading}
                required
              />
            </Field>

            <Field>
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
                  <SelectItem value="Draft">Koncept</SelectItem>
                  <SelectItem value="Sent">Odesláno</SelectItem>
                  <SelectItem value="Paid">Zaplaceno</SelectItem>
                  <SelectItem value="Overdue">Po splatnosti</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="issueDate">Datum vystavení</FieldLabel>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange("issueDate", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="dueDate">Datum splatnosti</FieldLabel>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="totalAmount">Celková částka (Kč)</FieldLabel>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => handleChange("totalAmount", parseFloat(e.target.value) || 0)}
                  disabled={isLoading}
                  required
                />
              </Field>
            </div>

            {error && (
              <Field>
                <FieldDescription className="text-red-600">
                  {error}
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
