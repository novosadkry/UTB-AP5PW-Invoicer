import { useState, useEffect } from "react";
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
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@components/ui/alert.tsx";
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@components/theme-toggle";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
import { useAxiosPublic } from "@/hooks/use-axios";
import { useAuth } from "@/hooks/use-auth";
import { getValidationErrors } from "@/types/api.ts";
import { AlertCircleIcon } from "lucide-react";
import type { AxiosError } from "axios";
import { z } from "zod";
import { getZodFieldErrors } from "@/types/zod.ts";

const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, "Jméno je povinné.")
    .max(100, "Jméno je příliš dlouhé."),
  email: z
    .email("Zadejte platnou e-mailovou adresu.")
    .min(1, "E-mail je povinný."),
  password: z
    .string()
    .min(5, "Heslo musí být alespoň 5 znaků dlouhé."),
  confirmPassword: z
    .string()
    .min(5, "Heslo musí být alespoň 5 znaků dlouhé."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hesla se neshodují.",
  path: ["confirmPassword"],
});

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // If user is already logged in, do not show the signup form
  if (user) {
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setFieldErrors({});

    const parseResult = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!parseResult.success) {
      setFieldErrors(getZodFieldErrors(parseResult.error));
      setError("Formulář obsahuje chyby. Zkontrolujte zvýrazněná pole.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        fullName: parseResult.data.fullName,
        email: parseResult.data.email,
        password: parseResult.data.password,
      });

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
      } else {
        if ((err as AxiosError)?.response?.status === 409) {
          setError("Účet s touto e-mailovou adresou již existuje.");
        } else {
          setError("Došlo k neznámé chybě. Zkuste to prosím znovu.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Registrovat se</CardTitle>
        <CardDescription>
          Zadejte své údaje pro vytvoření nového účtu.
        </CardDescription>
        <CardAction>
          <ThemeToggle />
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.fullName}>
              <FieldLabel htmlFor="name">Vaše jméno</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Petr Novák"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                aria-invalid={!!fieldErrors.fullName}
              />
              {fieldErrors.fullName && (
                <FieldError errors={fieldErrors.fullName.map(message => ({ message }))} />
              )}
            </Field>
            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel htmlFor="email">E-mailová adresa</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="petr.novak@domena.cz"
                required
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
              <FieldLabel htmlFor="password">Heslo</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                minLength={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                aria-invalid={!!fieldErrors.password}
              />
              <FieldDescription>
                Musí být minimálně 5 znaků dlouhé.
              </FieldDescription>
              {fieldErrors.password && (
                <FieldError errors={fieldErrors.password.map(message => ({ message }))} />
              )}
            </Field>
            <Field data-invalid={!!fieldErrors.confirmPassword}>
              <FieldLabel htmlFor="confirm-password">
                Heslo znovu
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
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
                <AlertTitle>Registrace selhala</AlertTitle>
                <AlertDescription>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
            )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? "Registruji…" : "Registrovat se"}</Button>
                <FieldDescription className="px-6 text-center">
                  Už máte účet? <Link to={{ pathname: "/login", search }}>Přihlásit se</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
