import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Pencil, Trash2, Download, Share2, Copy } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
import { Input } from "@components/ui/input.tsx";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { useAxiosPrivate } from "@/hooks/use-axios";
import { InvoiceService } from "@/services/invoice.service";
import { CustomerService } from "@/services/customer.service";
import { PaymentService } from "@/services/payment.service";
import type { Invoice, UpdateInvoiceDto } from "@/types/invoice";
import type { Customer } from "@/types/customer";
import type { Payment } from "@/types/payment";
import { InvoiceForm } from "@/components/invoice-form";
import { PaymentForm } from "@/components/payment-form";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useAxiosPrivate();
  const invoiceService = useMemo(() => new InvoiceService(api), [api]);
  const customerService = useMemo(() => new CustomerService(api), [api]);
  const paymentService = useMemo(() => new PaymentService(api), [api]);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

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
        toast.error("Neplatné ID faktury", { position: "top-center" });
        navigate("/dashboard/invoices");
        return null;
      }
      const data = await invoiceService.getById(invoiceId);
      if (!data) {
        toast.error("Faktura nebyla nalezena", { position: "top-center" });
        return null;
      }
      return data;
    } catch (error) {
      console.error("Failed to load invoice:", error);
      toast.error("Nepodařilo se načíst fakturu", { position: "top-center" });
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
      // Load payments
      if (invoice) {
        try {
          const paymentsData = await paymentService.getByInvoice(invoice.id);
          setPayments(paymentsData);
        } catch (error) {
          console.error("Failed to load payments:", error);
        }
      }
    });
  }, []);

  async function handleUpdateInvoice(updated: UpdateInvoiceDto) {
    if (!invoice) return;
    setFormLoading(true);
    try {
      await invoiceService.update(updated);
      toast.success("Faktura byla úspěšně aktualizována", { position: "top-center" });
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
      toast.error("Nepodařilo se aktualizovat fakturu", { position: "top-center" });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    if (!invoice) return;

    try {
      await invoiceService.delete(invoice.id);
      toast.success("Faktura byla úspěšně smazána", { position: "top-center" });
      navigate("/dashboard/invoices");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Nepodařilo se smazat fakturu", { position: "top-center" });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }

  async function handleDownloadPdf() {
    if (!invoice) return;
    try {
      const blob = await invoiceService.downloadPdf(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `faktura-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("PDF bylo úspěšně staženo", { position: "top-center" });
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Nepodařilo se stáhnout PDF", { position: "top-center" });
    }
  }

  async function handleShare() {
    if (!invoice) return;
    try {
      const result = await invoiceService.generateShareLink(invoice.id);
      const baseUrl = window.location.origin;
      setShareLink(`${baseUrl}/shared/invoice/${result.shareToken}`);
      setIsShareDialogOpen(true);
    } catch (error) {
      console.error("Failed to generate share link:", error);
      toast.error("Nepodařilo se vygenerovat odkaz pro sdílení", { position: "top-center" });
    }
  }

  function copyShareLink() {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast.success("Odkaz byl zkopírován do schránky", { position: "top-center" });
    }
  }

  async function handleDeletePayment(paymentId: number) {
    if (!invoice) return;
    toast.promise((async () => {
      await paymentService.delete(paymentId);
      const paymentsData = await paymentService.getByInvoice(invoice.id);
      setPayments(paymentsData);
      setInvoice(await loadInvoice());
    }), {
      position: "top-center",
      loading: "Mažu platbu...",
      success: "Platba byla smazána",
      error: "Nepodařilo se smazat platbu",
    });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
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
              onClick={handleDownloadPdf}
              title="Stáhnout PDF"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              title="Sdílet"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDrawerOpen(true)}
              title="Upravit"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              title="Smazat"
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

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Platby</h3>
              <Button variant="outline" size="sm" onClick={() => setIsPaymentDrawerOpen(true)}>
                Přidat platbu
              </Button>
            </div>
            {payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="text-sm">
                      <span className="font-medium">{payment.amount.toFixed(2)} Kč</span>
                      <span className="text-muted-foreground ml-2">
                        {payment.paymentMethod} • {new Date(payment.paymentDate).toLocaleDateString("cs-CZ")}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Celkem zaplaceno:</span>
                  <span className="font-medium">
                    {payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} Kč
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zbývá k úhradě:</span>
                  <span className="font-medium">
                    {(invoice.totalAmount - payments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)} Kč
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                K této faktuře zatím nejsou žádné platby.
              </p>
            )}
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

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sdílet fakturu</DialogTitle>
            <DialogDescription>
              Zkopírujte odkaz pro sdílení faktury s klientem.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input value={shareLink || ""} readOnly className="flex-1" />
            <Button onClick={copyShareLink} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Drawer open={isPaymentDrawerOpen} onOpenChange={setIsPaymentDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Přidat platbu</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {invoice && (
              <PaymentForm
                invoiceId={invoice.id}
                onSubmit={async (payment) => {
                  setSavingPayment(true);
                  toast.promise((async () => {
                    await paymentService.create(payment);
                    setIsPaymentDrawerOpen(false);
                    setSavingPayment(false);
                    // Refresh payments from backend
                    const paymentsData = await paymentService.getByInvoice(invoice.id);
                    setPayments(paymentsData);
                    setInvoice(await loadInvoice());
                  }), {
                    position: "top-center",
                    loading: "Ukládám platbu...",
                    success: "Platba byla přidána",
                    error: "Nepodařilo se přidat platbu",
                  });
                }}
                onCancel={() => setIsPaymentDrawerOpen(false)}
                isLoading={savingPayment}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </SidebarProvider>
  );
}
