import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card.tsx";
import { Badge } from "@components/ui/badge.tsx";
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
import { InvoiceService } from "@/services/invoice.service";
import { CustomerService } from "@/services/customer.service";
import type { Invoice, UpdateInvoiceDto } from "@/types/invoice";
import type { Customer } from "@/types/customer";
import { InvoiceForm } from "@/components/invoice-form";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useAxiosPrivate();
  const invoiceService = useMemo(() => new InvoiceService(api), [api]);
  const customerService = useMemo(() => new CustomerService(api), [api]);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadCustomers = useCallback(async () => {
    setCustomersLoading(true);
    setCustomersError(null);
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomersError("Nepodařilo se načíst zákazníky");
    } finally {
      setCustomersLoading(false);
    }
  }, [customerService]);

  const loadInvoice = useCallback(async () => {
    setLoading(true);

    if (!id) {
      navigate("/dashboard/invoices");
      return null;
    }

    try {
      const invoiceId = Number(id);
      if (Number.isNaN(invoiceId)) {
        toast.error("Neplatné ID faktury");
        navigate("/dashboard/invoices");
        return null;
      }
      const data = await invoiceService.getById(invoiceId);
      if (!data) {
        toast.error("Faktura nebyla nalezena");
        return null;
      }
      return data;
    } catch (error) {
      console.error("Failed to load invoice:", error);
      toast.error("Nepodařilo se načíst fakturu");
    } finally {
      setLoading(false);
    }
    return null;
  }, [id, invoiceService, navigate]);

  useEffect(() => {
    loadInvoice().then(async (invoice) => {
      setInvoice(invoice);
      if (invoice && invoice.customerId) {
        try {
          setCustomer(await customerService.getById(invoice.customerId));
        } catch (error) {
          console.error("Failed to load customer for invoice:", error);
          setCustomer(null);
        }
      } else {
        setCustomer(null);
      }
    });
  }, []);

  async function handleUpdateInvoice(updated: UpdateInvoiceDto) {
    if (!invoice) return;
    setFormLoading(true);
    try {
      await invoiceService.update(updated);
      toast.success("Faktura byla úspěšně aktualizována");
      setIsDrawerOpen(false);
      setInvoice(await loadInvoice());
      if (invoice && invoice.customerId) {
        try {
          setCustomer(await customerService.getById(invoice.customerId));
        } catch (error) {
          console.error("Failed to reload customer for invoice:", error);
          setCustomer(null);
        }
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("Failed to update invoice:", error);
      toast.error("Nepodařilo se aktualizovat fakturu");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    if (!invoice) return;

    try {
      await invoiceService.delete(invoice.id);
      toast.success("Faktura byla úspěšně smazána");
      navigate("/dashboard/invoices");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Nepodařilo se smazat fakturu");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge variant="default">Zaplaceno</Badge>;
      case "sent":
        return <Badge variant="outline">Odesláno</Badge>;
      case "overdue":
        return <Badge variant="destructive">Po splatnosti</Badge>;
      case "draft":
        return <Badge variant="secondary">Koncept</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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

    if (!invoice) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Faktura nebyla nalezena</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Zkontrolujte prosím URL adresu nebo se vraťte zpět na seznam faktur.
            </p>
            <Button asChild>
              <Link to="/dashboard/invoices">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zpět na seznam faktur
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
            <CardTitle>Faktura {invoice.invoiceNumber}</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              {getStatusBadge(invoice.status)}
              <span className="text-sm text-muted-foreground">
                Celková částka: {invoice.totalAmount.toFixed(2)} Kč
              </span>
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
              <h3 className="font-semibold mb-1">Informace o faktuře</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Číslo faktury</dt>
                  <dd>{invoice.invoiceNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Datum vystavení</dt>
                  <dd>{new Date(invoice.issueDate).toLocaleDateString("cs-CZ")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Datum splatnosti</dt>
                  <dd>{new Date(invoice.dueDate).toLocaleDateString("cs-CZ")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">DPH</dt>
                  <dd>{invoice.totalVat.toFixed(2)} Kč</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Zákazník</h3>
              {customer ? (
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Název</dt>
                    <dd>{customer.name}</dd>
                  </div>
                  {customer.contactEmail && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">E-mail</dt>
                      <dd>{customer.contactEmail}</dd>
                    </div>
                  )}
                  {customer.contactPhone && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Telefon</dt>
                      <dd>{customer.contactPhone}</dd>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Adresa</dt>
                      <dd>{customer.address}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  K této faktuře není přiřazen žádný zákazník.
                </p>
              )}
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
                  <Link to="/dashboard/invoices">Faktury</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {invoice ? `Faktura ${invoice.invoiceNumber}` : "Detail faktury"}
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
                  <Link to="/dashboard/invoices">
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

      <Drawer open={isDrawerOpen} onOpenChange={(open) => {
        setIsDrawerOpen(open);
        if (open && !customersLoading && customers.length === 0) {
          void loadCustomers();
        }
      }}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Upravit fakturu</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[80vh]">
            {invoice && (
              <InvoiceForm
                invoice={invoice}
                onSubmit={(data) => handleUpdateInvoice(data as UpdateInvoiceDto)}
                onCancel={() => setIsDrawerOpen(false)}
                isLoading={formLoading}
                customers={customers}
                customersLoading={customersLoading}
                customersError={customersError}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tuto fakturu?</AlertDialogTitle>
            <AlertDialogDescription>
              Tuto akci nelze vrátit zpět. Faktura bude trvale odstraněna.
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
