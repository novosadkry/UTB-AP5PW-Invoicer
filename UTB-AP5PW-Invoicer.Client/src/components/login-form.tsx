import { cn } from "@/lib/utils"
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button"
import {
  Card, CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription, FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useAxiosPublic } from "@/hooks/use-axios.ts";
import { getValidationErrors } from "@/types/api.ts";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod.ts";

const loginSchema = z.object({
  email: z
    .email("Zadejte platnou e-mailovou adresu.")
    .min(1, "E-mail je povinný."),
  password: z
    .string()
    .min(1, "Heslo je povinné."),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const api = useAxiosPublic();
  const { setAccessToken, setUser } = useAuth();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setFieldErrors({});

    const parseResult = loginSchema.safeParse({
      email,
      password,
    });

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        "/auth/login",
        {
          email: parseResult.data.email,
          password: parseResult.data.password,
        }
      );

      const { accessToken, user } = await res.data;
      setAccessToken(accessToken);
      setUser(user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else {
        setError("Došlo k neznámé chybě. Zkuste to prosím znovu.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Přihlásit se</CardTitle>
          <CardDescription>
            Zadejte své údaje pro přístup k účtu.
          </CardDescription>
          <CardAction>
            <ThemeToggle />
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
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
                  disabled={loading}
                />
                {fieldErrors.Email && (
                  <FieldError errors={fieldErrors.Email.map(message => ({ message }))} />
                )}
              </Field>
              <Field data-invalid={!!fieldErrors.Password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Heslo</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Zapomněli jste heslo?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!fieldErrors.Password}
                />
                {fieldErrors.Password && (
                  <FieldError errors={fieldErrors.Password.map(message => ({ message }))} />
                )}
              </Field>
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>Přihlášení selhalo</AlertTitle>
                  <AlertDescription>
                    <p>{error}</p>
                  </AlertDescription>
                </Alert>
              )}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Přihlašuji…" : "Přihlásit se"}
                </Button>
                <FieldDescription className="text-center">
                  Ještě nemáte účet? <Link to="/signup">Registrovat se</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
