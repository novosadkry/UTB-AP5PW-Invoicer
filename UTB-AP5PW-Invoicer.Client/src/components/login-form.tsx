import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
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
import type { AxiosError } from "axios";

const loginSchema = z.object({
  email: z
    .email("Zadejte platnou e-mailovou adresu.")
    .min(1, "E-mail je povinný."),
  password: z
    .string()
    .min(5, "Heslo musí být alespoň 5 znaků dlouhé."),
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
  const { search } = useLocation();
  const [searchParams] = useSearchParams();
  const { setAccessToken, user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(
        searchParams.get("redirect") ?? "/dashboard",
        { replace: true }
      );
    }
  }, []);

  // If user is already logged in, do not show the login form
  if (user) {
    return null;
  }

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

      navigate(
        searchParams.get("redirect") ?? "/dashboard",
        { replace: true }
      );
    } catch (err) {
      const validation = getValidationErrors(err);
      if (validation?.errors) {
        setFieldErrors(validation.errors);
        setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      } else if ((err as AxiosError)?.response?.status === 401) {
        setError("Neplatné přihlašovací údaje.");
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
                  disabled={loading}
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <FieldError errors={fieldErrors.email.map(message => ({ message }))} />
                )}
              </Field>
              <Field data-invalid={!!fieldErrors.password}>
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
                  aria-invalid={!!fieldErrors.password}
                />
                {fieldErrors.password && (
                  <FieldError errors={fieldErrors.password.map(message => ({ message }))} />
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
                  Ještě nemáte účet? <Link to={{ pathname: "/signup", search }}>Registrovat se</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
