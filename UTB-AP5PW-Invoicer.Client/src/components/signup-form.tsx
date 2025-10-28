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
import { ThemeToggle } from "@components/theme-toggle.tsx";
import { Link } from "react-router";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
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
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Vaše jméno</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mailová adresa</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="vase-jmeno@vesela-domena.cz"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Heslo</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                Musí být minimálně 5 znaků dlouhé.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Heslo znovu
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Registrovat se</Button>
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
