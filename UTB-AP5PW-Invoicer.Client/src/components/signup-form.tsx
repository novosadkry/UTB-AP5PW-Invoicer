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
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAxiosPublic } from "@/hooks/use-axios";
import { useAuth } from "@/hooks/use-auth";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useAxiosPublic();
  const { setAccessToken, setUser } = useAuth();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (password.length < 5) {
      setError("Heslo musí být alespoň 5 znaků dlouhé.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Hesla se neshodují.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/signup",
        { fullName, email, password }
      );

      if (res.status !== 200) {
        if (res.status === 409) {
          setError("Uživatel s tímto e-mailem již existuje.");
        } else {
          setError("Registrace se nezdařila. Zkuste to prosím znovu.");
        }
        return;
      }

      const { accessToken, user } = await res.data;
      setAccessToken(accessToken);
      setUser(user);

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Došlo k chybě při připojení k serveru.");
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
            <Field>
              <FieldLabel htmlFor="name">Vaše jméno</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mailová adresa</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="vase-jmeno@vesela-domena.cz"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Heslo</FieldLabel>
              <Input id="password" type="password" required minLength={5} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              <FieldDescription>
                Musí být minimálně 5 znaků dlouhé.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Heslo znovu
              </FieldLabel>
              <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
            </Field>
            {error && (
              <Field>
                <FieldDescription className="text-red-600">
                  {error}
                </FieldDescription>
              </Field>
            )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? "Registruji…" : "Registrovat se"}</Button>
                <FieldDescription className="px-6 text-center">
                  Už máte účet? <Link to="/login">Přihlásit se</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
