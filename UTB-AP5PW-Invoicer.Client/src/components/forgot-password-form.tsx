import { useState, useMemo } from "react";
import { cn } from "@/lib/utils"
import { Link } from "react-router";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@components/theme-toggle";
import { useAxiosPublic } from "@/hooks/use-axios.ts";
import { getValidationErrors } from "@/types/api.ts";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert.tsx";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod.ts";
import { AuthService } from "@/services/auth.service.ts";

const forgotPasswordSchema = z.object({
  email: z
    .email("Zadejte platnou e-mailovou adresu.")
    .min(1, "E-mail je povinné pole."),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const api = useAxiosPublic();
  const authService = useMemo(() => new AuthService(api), [api]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(false);
    setFieldErrors({});

    const parseResult = forgotPasswordSchema.safeParse({ email });

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword({
        email: parseResult.data.email,
      });

      setSuccess(true);
      setEmail("");
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else {
        setError("Došlo k chybě. Zkuste to prosím znovu.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Zapomenuté heslo</CardTitle>
          <CardDescription>
            Zadejte svůj e-mail a my vám pošleme odkaz pro obnovení hesla.
          </CardDescription>
          <CardAction>
            <ThemeToggle size="lg" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field data-invalid={!!fieldErrors.email}>
                <FieldLabel htmlFor="email">E-mailová adresa</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="petr.novak@domena.cz"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <FieldError errors={fieldErrors.email.map(message => ({ message }))} />
                )}
              </Field>
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>Chyba</AlertTitle>
                  <AlertDescription>
                    <p>{error}</p>
                  </AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <CheckCircle2Icon className="h-4 w-4" />
                  <AlertTitle>E-mail odeslán</AlertTitle>
                  <AlertDescription>
                    <p>
                      Pokud účet s touto e-mailovou adresou existuje, byl odeslán e-mail s instrukcemi pro obnovení hesla.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              <Field>
                <Button type="submit" disabled={loading || success}>
                  {loading ? "Odesílám…" : "Odeslat odkaz"}
                </Button>
                <FieldDescription className="text-center">
                  <Link to="/login">Zpět na přihlášení</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
