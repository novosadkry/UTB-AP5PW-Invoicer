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
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from "@/types/user";
import { toast } from "sonner";

export default function Page() {
  const api = useAxiosPrivate();
  const userService = useMemo(() => new UserService(api), [api]);

  const [_profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile form state
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ico, setIco] = useState("");
  const [dic, setDic] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setEmail(data.email);
      setFullName(data.fullName);
      setCompanyName(data.companyName || "");
      setIco(data.ico || "");
      setDic(data.dic || "");
      setCompanyAddress(data.companyAddress || "");
      setCompanyPhone(data.companyPhone || "");
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
    try {
      const updateData: UpdateProfileDto = {
        email,
        fullName,
        companyName: companyName || undefined,
        ico: ico || undefined,
        dic: dic || undefined,
        companyAddress: companyAddress || undefined,
        companyPhone: companyPhone || undefined,
      };
      await userService.updateProfile(updateData);
      toast.success("Profil byl úspěšně aktualizován", { position: "top-center" });
      await loadProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Nepodařilo se aktualizovat profil", { position: "top-center" });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Nová hesla se neshodují", { position: "top-center" });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Nové heslo musí mít alespoň 6 znaků", { position: "top-center" });
      return;
    }
    setChangingPassword(true);
    try {
      const data: ChangePasswordDto = {
        currentPassword,
        newPassword,
      };
      await userService.changePassword(data);
      toast.success("Heslo bylo úspěšně změněno", { position: "top-center" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Nepodařilo se změnit heslo. Zkontrolujte aktuální heslo.", { position: "top-center" });
    } finally {
      setChangingPassword(false);
    }
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Celé jméno</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Volitelné"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ico">IČO</Label>
                    <Input
                      id="ico"
                      value={ico}
                      onChange={(e) => setIco(e.target.value)}
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dic">DIČ</Label>
                    <Input
                      id="dic"
                      value={dic}
                      onChange={(e) => setDic(e.target.value)}
                      placeholder="CZ12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Telefon firmy</Label>
                    <Input
                      id="companyPhone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="+420 123 456 789"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyAddress">Adresa firmy</Label>
                    <Input
                      id="companyAddress"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
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
