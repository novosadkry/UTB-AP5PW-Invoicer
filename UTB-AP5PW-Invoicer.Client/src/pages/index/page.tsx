import { Link } from "react-router";
import { Button } from "@components/ui/button.tsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui/card.tsx";
import { useAuth } from "@/hooks/use-auth.tsx";

export default function Page() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen flex flex-col bg-linear-to-b from-background via-background/90 to-background">
      <header className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold">
              I
            </span>
            <span className="font-semibold tracking-tight">Invoicer</span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">Přejít na dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/login">Přihlásit se</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Začít zdarma</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-5xl w-full grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Faktury, platby a přehledy na jednom místě</span>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-500 delay-100">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Mějte svoje faktury a cashflow vždy pod kontrolou.
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                Invoicer vám pomůže vystavovat faktury, sledovat platby, spravovat zákazníky
                a generovat přehledné reporty pro vaše podnikání – bez zbytečného chaosu v tabulkách.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-left-2 duration-500 delay-150">
              <Button asChild size="lg">
                <Link to={user ? "/dashboard" : "/signup"}>
                  {user ? "Přejít na dashboard" : "Začít zdarma"}
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="ghost" size="lg">
                  <Link to="/login">Mám už účet</Link>
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground animate-in fade-in slide-in-from-left-2 duration-500 delay-200">
              Bez závazků, registrace za pár vteřin. První fakturu vytvoříte během několika minut.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-right-2 duration-500 delay-150">
            <Card className="w-full xl:max-w-md mx-auto border-primary/20 shadow-lg shadow-primary/10 bg-background/80">
              <CardHeader className="space-y-1 text-left">
                <CardTitle className="text-base font-semibold">
                  Rychlý přehled vašeho podnikání
                </CardTitle>
                <CardDescription>
                  Ukázka dashboardu s přehledem faktur, tržeb a neuhrazených plateb.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left text-xs text-muted-foreground">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border bg-background/60 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
                      Tento měsíc
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      124 320 Kč
                    </div>
                    <div className="text-[10px] text-emerald-500 mt-1">+18 % oproti minulému měsíci</div>
                  </div>
                  <div className="rounded-lg border bg-background/60 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
                      Neuhrazené
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      12 800 Kč
                    </div>
                    <div className="text-[10px] text-amber-500 mt-1">4 faktury po splatnosti</div>
                  </div>
                  <div className="rounded-lg border bg-background/60 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
                      Zákazníci
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      56
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">Aktivní odběratelé</div>
                  </div>
                </div>

                <div className="h-[120px] rounded-lg border bg-gradient-to-tr from-primary/10 via-primary/5 to-emerald-500/10 flex items-end p-3 gap-1 overflow-hidden">
                  <div className="flex-1 rounded-t-md bg-primary/40 h-[30%]" />
                  <div className="flex-1 rounded-t-md bg-primary/60 h-[55%]" />
                  <div className="flex-1 rounded-t-md bg-primary/30 h-[40%]" />
                  <div className="flex-1 rounded-t-md bg-primary/70 h-[75%]" />
                  <div className="flex-1 rounded-t-md bg-primary/40 h-[50%]" />
                  <div className="flex-1 rounded-t-md bg-primary/80 h-[90%]" />
                  <div className="flex-1 rounded-t-md bg-primary/50 h-[65%]" />
                </div>

                <p>
                  V reálné aplikaci zde uvidíte skutečná data z vašich faktur a plateb, včetně trendů
                  a meziročních srovnání.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
