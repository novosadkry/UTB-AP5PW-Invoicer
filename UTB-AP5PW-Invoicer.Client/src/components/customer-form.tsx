import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from "@/types/customer";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: CreateCustomerDto | UpdateCustomerDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CustomerForm({ customer, onSubmit, onCancel, isLoading = false }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    ico: customer?.ico || "",
    dic: customer?.dic || "",
    address: customer?.address || "",
    contactEmail: customer?.contactEmail || "",
    contactPhone: customer?.contactPhone || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name) {
      setError("Název zákazníka je povinný");
      return;
    }

    if (!formData.contactEmail) {
      setError("Kontaktní e-mail je povinný");
      return;
    }

    try {
      const customerData = {
        ...formData,
        ico: formData.ico || null,
        dic: formData.dic || null,
        ...(customer && { id: customer.id })
      };
      await onSubmit(customerData as CreateCustomerDto | UpdateCustomerDto);
    } catch (err) {
      setError("Nastala chyba při ukládání zákazníka");
      console.error(err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <Field>
              <FieldLabel htmlFor="name">Název</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
                required
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="ico">IČO</FieldLabel>
                <Input
                  id="ico"
                  value={formData.ico}
                  onChange={(e) => handleChange("ico", e.target.value)}
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="dic">DIČ</FieldLabel>
                <Input
                  id="dic"
                  value={formData.dic}
                  onChange={(e) => handleChange("dic", e.target.value)}
                  disabled={isLoading}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="address">Adresa</FieldLabel>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={isLoading}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="contactEmail">Kontaktní e-mail</FieldLabel>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="contactPhone">Telefon</FieldLabel>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  disabled={isLoading}
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
                {isLoading ? "Ukládání..." : customer ? "Uložit změny" : "Vytvořit zákazníka"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
