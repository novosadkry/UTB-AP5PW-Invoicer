import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card.tsx";
import { Button } from "@components/ui/button.tsx";
import { Input } from "@components/ui/input.tsx";
import { Label } from "@components/ui/label.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
import { Separator } from "@components/ui/separator.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb.tsx";
import { useAxiosPrivate } from "@/hooks/use-axios";
import { UserService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service.ts";
import type { UserDto, UpdateUserDto } from "@/types/user";
import type { ChangePasswordDto } from "@/types/auth.ts";
import { toast } from "sonner";

export default function Page() {
  const api = useAxiosPrivate();
  const userService = useMemo(() => new UserService(api), [api]);
  const authService = useMemo(() => new AuthService(api), [api]);

  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    void loadProfile();
  }, []);

  function setProfileData(key: keyof UserDto, value: string) {
    if (!profile) return;
    const data = { ...profile, [key]: value };
    setProfile(data);
  }

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Nepodařilo se načíst profil", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (!profile) {
      toast.error("Profil nebyl načten", { position: "top-center" });
      setSaving(false);
      return;
    }

    const updateData: UpdateUserDto = { ...profile };

    toast.promise(
      (async () => {
        await userService.updateProfile(updateData);
        await loadProfile();
      })(),
      {
        position: "top-center",
        loading: "Aktualizuji profil...",
        success: () => {
          setSaving(false);
          return "Profil byl úspěšně aktualizován";
        },
        error: () => {
          setSaving(false);
          return "Nepodařilo se aktualizovat profil";
        },
      }
    );
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují.", { position: "top-center" });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Nové heslo musí mít alespoň 6 znaků.", { position: "top-center" });
      return;
    }
    setChangingPassword(true);
    const data: ChangePasswordDto = {
      currentPassword,
      newPassword,
    };

    toast.promise(
      (async () => {
        await authService.changePassword(data);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })(),
      {
        position: "top-center",
        loading: "Měním heslo...",
        success: () => {
          setChangingPassword(false);
          return "Heslo bylo úspěšně změněno.";
        },
        error: () => {
          setChangingPassword(false);
          return "Aktuální heslo je neplatné.";
        },
      }
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Osobní údaje</CardTitle>
            <CardDescription>Aktualizujte své osobní informace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email}
                    onChange={(e) => setProfileData("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Celé jméno</Label>
                  <Input
                    id="fullName"
                    value={profile?.fullName}
                    onChange={(e) => setProfileData("fullName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Údaje o firmě</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Název firmy</Label>
                    <Input
                      id="companyName"
                      value={profile?.companyName}
                      onChange={(e) => setProfileData("companyName", e.target.value)}
                      placeholder="Volitelné"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ico">IČO</Label>
                    <Input
                      id="ico"
                      value={profile?.ico}
                      onChange={(e) => setProfileData("ico", e.target.value)}
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dic">DIČ</Label>
                    <Input
                      id="dic"
                      value={profile?.dic}
                      onChange={(e) => setProfileData("dic", e.target.value)}
                      placeholder="CZ12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Telefon firmy</Label>
                    <Input
                      id="companyPhone"
                      value={profile?.companyPhone}
                      onChange={(e) => setProfileData("companyPhone", e.target.value)}
                      placeholder="+420 123 456 789"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyAddress">Adresa firmy</Label>
                    <Input
                      id="companyAddress"
                      value={profile?.companyAddress}
                      onChange={(e) => setProfileData("companyAddress", e.target.value)}
                      placeholder="Ulice 123, 123 45 Město"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Ukládám..." : "Uložit změny"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Změna hesla</CardTitle>
            <CardDescription>Zadejte aktuální a nové heslo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuální heslo</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nové heslo</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potvrdit nové heslo</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? "Měním heslo..." : "Změnit heslo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Přehled</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SiteHeader>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Můj profil</h1>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
