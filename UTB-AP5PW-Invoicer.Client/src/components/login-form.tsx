import { cn } from "@/lib/utils"
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
          <form>
            <FieldGroup>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Heslo</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Zapomněli jste heslo?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Přihlásit se</Button>
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
