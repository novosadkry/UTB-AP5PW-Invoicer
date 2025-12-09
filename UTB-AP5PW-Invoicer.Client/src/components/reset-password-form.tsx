import { useState, useMemo } from "react";
import { cn } from "@/lib/utils"
import { Link, useNavigate, useSearchParams } from "react-router";
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
import { AlertCircleIcon } from "lucide-react";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod.ts";
import type { AxiosError } from "axios";
import { AuthService } from "@/services/auth.service.ts";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(5, "Heslo musí být alespoň 5 znaků dlouhé."),
  confirmPassword: z
    .string()
    .min(1, "Potvrzení hesla je povinné pole."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hesla se neshodují.",
  path: ["confirmPassword"],
});

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const api = useAxiosPublic();
  const authService = useMemo(() => new AuthService(api), [api]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Neplatný odkaz</CardTitle>
            <CardDescription>
              Tento odkaz pro obnovení hesla je neplatný nebo chybí.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forgot-password">
              <Button className="w-full">Požádat o nový odkaz</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setFieldErrors({});

    const parseResult = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    setLoading(true);

    try {
      // token is guaranteed to be non-null due to the check above
      await authService.resetPassword({
        token: token!,
        newPassword: parseResult.data.newPassword,
      });

      navigate("/login", { 
        replace: true,
        state: { message: "Heslo bylo úspěšně obnoveno. Nyní se můžete přihlásit." }
      });
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else if ((err as AxiosError)?.response?.status === 400) {
        setError("Neplatný nebo vypršený odkaz pro obnovení hesla.");
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
          <CardTitle>Obnovit heslo</CardTitle>
          <CardDescription>
            Zadejte nové heslo pro váš účet.
          </CardDescription>
          <CardAction>
            <ThemeToggle size="lg" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field data-invalid={!!fieldErrors.newPassword}>
                <FieldLabel htmlFor="newPassword">Nové heslo</FieldLabel>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!fieldErrors.newPassword}
                />
                {fieldErrors.newPassword && (
                  <FieldError errors={fieldErrors.newPassword.map(message => ({ message }))} />
                )}
              </Field>
              <Field data-invalid={!!fieldErrors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">Potvrdit heslo</FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!fieldErrors.confirmPassword}
                />
                {fieldErrors.confirmPassword && (
                  <FieldError errors={fieldErrors.confirmPassword.map(message => ({ message }))} />
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
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Ukládám…" : "Obnovit heslo"}
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
