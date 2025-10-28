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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useAxiosPublic } from "@/hooks/use-axios.ts";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useAxiosPublic();
  const { setAccessToken, setUser } = useAuth();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.status !== 200) {
        if (res.status === 401) {
          setError("Neplatná e-mailová adresa nebo heslo.");
        } else {
          setError("Přihlášení se nezdařilo. Zkuste to prosím znovu.");
        }
        return;
      }

      const { accessToken, user } = res.data;
      setAccessToken(accessToken);
      setUser(user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Došlo k chybě při připojení k serveru.");
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
                  placeholder="vase-jmeno@vesela-domena.cz"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Heslo</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Zapomněli jste heslo?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              </Field>
              {error && (
                <Field>
                  <FieldDescription className="text-red-600">
                    {error}
                  </FieldDescription>
                </Field>
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
