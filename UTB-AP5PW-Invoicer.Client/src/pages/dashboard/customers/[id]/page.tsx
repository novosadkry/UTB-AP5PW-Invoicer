import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card.tsx";
import { Button } from "@components/ui/button.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@components/ui/drawer.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useAxiosPrivate } from "@/hooks/use-axios";
import { CustomerService } from "@/services/customer.service";
import type { Customer, UpdateCustomerDto } from "@/types/customer";
import { CustomerForm } from "@/components/customer-form";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useAxiosPrivate();
  const customerService = useMemo(() => new CustomerService(api), [api]);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadCustomer = useCallback(async () => {
    setLoading(true);

    if (!id) {
      navigate("/dashboard/customers");
      return null;
    }

    try {
      const customerId = Number(id);
      if (Number.isNaN(customerId)) {
        toast.error("Neplatné ID zákazníka", { position: "top-center" });
        navigate("/dashboard/customers");
        return null;
      }
      const data = await customerService.getById(customerId);
      if (!data) {
        toast.error("Zákazník nebyl nalezen", { position: "top-center" });
        return null;
      }
      return data;
    } catch (error) {
      console.error("Failed to load customer:", error);
      toast.error("Nepodařilo se načíst zákazníka", { position: "top-center" });
    } finally {
      setLoading(false);
    }
    return null;
  }, [id, customerService, navigate]);

  useEffect(() => {
    loadCustomer().then(customer => setCustomer(customer));
  }, []);

  async function handleUpdateCustomer(updated: UpdateCustomerDto) {
    if (!customer) return;
    setFormLoading(true);
    toast.promise(
      (async () => {
        await customerService.update(updated);
        setIsDrawerOpen(false);
        setCustomer(await loadCustomer());
      })(),
      {
        position: "top-center",
        loading: "Aktualizuji zákazníka...",
        success: () => {
          setFormLoading(false);
          return "Zákazník byl úspěšně aktualizován";
        },
        error: () => {
          setFormLoading(false);
          return "Nepodařilo se aktualizovat zákazníka";
        },
      }
    );
  }

  async function handleDelete() {
    if (!customer) return;

    toast.promise(
      async () => {
        await customerService.delete(customer.id);
        navigate("/dashboard/customers");
      },
      {
        position: "top-center",
        loading: "Mažu zákazníka...",
        success: "Zákazník byl úspěšně smazán",
        error: "Nepodařilo se smazat zákazníka",
      }
    );

    setIsDeleteDialogOpen(false);
  }

  const renderContent = () => {
    if (loading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      );
    }

    if (!customer) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Zákazník nebyl nalezen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Zkontrolujte prosím URL adresu nebo se vraťte zpět na seznam zákazníků.
            </p>
            <Button asChild>
              <Link to="/dashboard/customers">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zpět na seznam zákazníků
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{customer.name}</CardTitle>
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              {customer.contactEmail && <span>{customer.contactEmail}</span>}
              {customer.contactPhone && <span>{customer.contactPhone}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Fakturační údaje</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Jméno / název</dt>
                  <dd>{customer.name}</dd>
                </div>
                {customer.ico && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">IČO</dt>
                    <dd>{customer.ico}</dd>
                  </div>
                )}
                {customer.dic && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">DIČ</dt>
                    <dd>{customer.dic}</dd>
                  </div>
                )}
                {customer.address && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Adresa</dt>
                    <dd>{customer.address}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
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
                <BreadcrumbLink asChild>
                  <Link to="/dashboard/customers">Zákazníci</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {customer ? customer.name : "Detail zákazníka"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SiteHeader>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" asChild>
                  <Link to="/dashboard/customers">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zpět na seznam
                  </Link>
                </Button>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Upravit zákazníka</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[80vh]">
            {customer && (
              <CustomerForm
                customer={customer}
                onSubmit={(data) => handleUpdateCustomer(data as UpdateCustomerDto)}
                onCancel={() => setIsDrawerOpen(false)}
                isLoading={formLoading}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tohoto zákazníka?</AlertDialogTitle>
            <AlertDialogDescription>
              Tuto akci nelze vrátit zpět. Zákazník bude trvale odstraněn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleDelete()}>
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
