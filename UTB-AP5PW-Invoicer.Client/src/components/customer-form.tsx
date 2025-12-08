import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from "@/types/customer";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod";
import { getValidationErrors } from "@/types/api.ts";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: CreateCustomerDto | UpdateCustomerDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const customerSchema = z.object({
  name: z.string().nonempty("Název zákazníka je povinné pole"),
  ico: z.string().optional(),
  dic: z.string().optional(),
  address: z.string().nonempty("Adresa je povinné pole."),
  contactEmail: z
    .email("Zadejte platnou e-mailovou adresu.")
    .nonempty( "Kontaktní e-mail je povinné pole."),
  contactPhone: z
    .string()
    .regex(/^\+420\d{9}$/, "Zadejte telefonní číslo v platném formátu (+420XXXXXXXXX).")
    .nonempty("Telefon je povinné pole."),
});

export function CustomerForm({ customer, onSubmit, onCancel, isLoading = false }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    ico: customer?.ico || "",
    dic: customer?.dic || "",
    address: customer?.address || "",
    contactEmail: customer?.contactEmail || "",
    contactPhone: customer?.contactPhone || "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);
    setFieldErrors({});

    const parseResult = customerSchema.safeParse(formData);

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    const data = parseResult.data;

    try {
      const customerData = {
        ...data,
        ico: data.ico || null,
        dic: data.dic || null,
        ...(customer && { id: customer.id }),
      };
      await onSubmit(customerData as CreateCustomerDto | UpdateCustomerDto);
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setFormError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else {
        setFormError("Nastala chyba při ukládání zákazníka");
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{customer ? "Upravit zákazníka" : "Nový zákazník"}</CardTitle>
        <CardDescription>
          {customer ? "Upravte údaje o zákazníkovi" : "Vytvořte nového zákazníka"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel htmlFor="name">Název</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={!!fieldErrors.name}
              />
              {fieldErrors.name && (
                <FieldError errors={fieldErrors.name.map((message) => ({ message }))} />
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!fieldErrors.ico}>
                <FieldLabel htmlFor="ico">IČO</FieldLabel>
                <Input
                  id="ico"
                  value={formData.ico}
                  onChange={(e) => handleChange("ico", e.target.value)}
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.ico}
                />
                {fieldErrors.ico && (
                  <FieldError errors={fieldErrors.ico.map((message) => ({ message }))} />
                )}
              </Field>

              <Field data-invalid={!!fieldErrors.dic}>
                <FieldLabel htmlFor="dic">DIČ</FieldLabel>
                <Input
                  id="dic"
                  value={formData.dic}
                  onChange={(e) => handleChange("dic", e.target.value)}
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.dic}
                />
                {fieldErrors.dic && (
                  <FieldError errors={fieldErrors.dic.map((message) => ({ message }))} />
                )}
              </Field>
            </div>

            <Field data-invalid={!!fieldErrors.address}>
              <FieldLabel htmlFor="address">Adresa</FieldLabel>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={isLoading}
                aria-invalid={!!fieldErrors.address}
              />
              {fieldErrors.address && (
                <FieldError errors={fieldErrors.address.map((message) => ({ message }))} />
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!fieldErrors.contactEmail}>
                <FieldLabel htmlFor="contactEmail">Kontaktní e-mail</FieldLabel>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!fieldErrors.contactEmail}
                />
                {fieldErrors.contactEmail && (
                  <FieldError
                    errors={fieldErrors.contactEmail.map((message) => ({ message }))}
                  />
                )}
              </Field>

              <Field data-invalid={!!fieldErrors.contactPhone}>
                <FieldLabel htmlFor="contactPhone">Telefon</FieldLabel>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors.contactPhone}
                />
                {fieldErrors.contactPhone && (
                  <FieldError
                    errors={fieldErrors.contactPhone.map((message) => ({ message }))}
                  />
                )}
              </Field>
            </div>

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
                {isLoading ? "Ukládání..." : customer ? "Uložit změny" : "Vytvořit zákazníka"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
