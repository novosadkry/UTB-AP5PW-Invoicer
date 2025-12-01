import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";
import { ArrowRight, Plus, Trash2, Pencil } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent } from "@components/ui/card.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@components/ui/drawer.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem, PaginationLink, PaginationNext,
  PaginationPrevious
} from "@components/ui/pagination.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@components/ui/breadcrumb.tsx";
import { useAxiosPrivate } from "@/hooks/use-axios";
import { InvoiceService } from "@/services/invoice.service";
import { CustomerService } from "@/services/customer.service";
import type { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from "@/types/invoice";
import type { Customer } from "@/types/customer";
import { InvoiceForm } from "@/components/invoice-form";
import { toast } from "sonner";
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

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const api = useAxiosPrivate();
  const invoiceService = useMemo(() => new InvoiceService(api), [api]);
  const customerService = useMemo(() => new CustomerService(api), [api]);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      return invoiceService.getAll();
    } catch (error) {
      console.error("Failed to load invoices:", error);
      toast.error("Nepodařilo se načíst faktury", { position: "top-center" });
    } finally {
      setLoading(false);
    }
    return null;
  }, [invoiceService]);

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

  useEffect(() => {
    loadInvoices().then((invoices) => setInvoices(invoices));
  }, []);

  async function handleCreateInvoice(invoice: CreateInvoiceDto) {
    setFormLoading(true);

    const promise = (async () => {
      await invoiceService.create(invoice);
      setIsDrawerOpen(false);
      setInvoices(await loadInvoices());
    })();

    toast.promise(promise, {
      position: "top-center",
      loading: "Vytvářím fakturu...",
      success: () => {
        setFormLoading(false);
        return "Faktura byla úspěšně vytvořena";
      },
      error: () => {
        setFormLoading(false);
        return "Nepodařilo se vytvořit fakturu";
      },
    });

    return promise;
  }

  async function handleUpdateInvoice(invoice: UpdateInvoiceDto) {
    setFormLoading(true);

    const promise = (async () => {
      await invoiceService.update(invoice);
      setIsDrawerOpen(false);
      setEditingInvoice(null);
      setInvoices(await loadInvoices());
    })();

    toast.promise(promise, {
      position: "top-center",
      loading: "Aktualizuji fakturu...",
      success: () => {
        setFormLoading(false);
        return "Faktura byla úspěšně aktualizována";
      },
      error: () => {
        setFormLoading(false);
        return "Nepodařilo se aktualizovat fakturu";
      },
    });

    return promise;
  }

  async function handleDelete(id: number) {
    toast.promise(
      async () => {
        await invoiceService.delete(id);
        setInvoices(await loadInvoices());
      },
      {
        position: "top-center",
        loading: "Mažu fakturu...",
        success: "Faktura byla úspěšně smazána",
        error: "Nepodařilo se smazat fakturu",
      }
    );
    setDeletingInvoiceId(null);
  }

  function openCreateDrawer() {
    setEditingInvoice(null);
    if (!customersLoading && customers.length === 0) {
      void loadCustomers();
    }
    setIsDrawerOpen(true);
  }

  function openEditDrawer(invoice: Invoice) {
    setEditingInvoice(invoice);
    if (!customersLoading && customers.length === 0) {
      void loadCustomers();
    }
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setEditingInvoice(null);
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
          <div className="flex w-full items-center justify-between gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">Přehled</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Faktury</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Button size="sm" onClick={openCreateDrawer}>
              <Plus className="w-4 h-4 mr-2" />
              Nová faktura
            </Button>
          </div>
        </SiteHeader>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {loading ? (
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : invoices && invoices.length > 0 ? (
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                  {invoices.map((invoice) => (
                    <Card
                      key={invoice.id}
                      className="transition-all hover:shadow-md hover:border-primary/30"
                    >
                      <CardContent className="p-4 flex flex-wrap justify-between items-start gap-4">
                        <div className="space-y-1 flex-1">
                          <p className="text-md font-semibold">
                            Faktura {invoice.invoiceNumber}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">
                              {invoice.totalAmount.toFixed(2)} Kč
                            </p>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Splatnost: {new Date(invoice.dueDate).toLocaleDateString('cs-CZ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <Link to={`/dashboard/invoices/${invoice.id}`}>
                              Zobrazit
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => openEditDrawer(invoice)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setDeletingInvoiceId(invoice.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <p className="text-muted-foreground text-center">
                    Zatím nemáte žádné faktury. Vytvořte si první fakturu pomocí tlačítka výše.
                  </p>
                </div>
              )}
              {invoices && invoices.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious to="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink to="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext to="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {editingInvoice ? "Upravit fakturu" : "Nová faktura"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[80vh]">
            <InvoiceForm
              invoice={editingInvoice || undefined}
              onSubmit={(invoice) => {
                if (editingInvoice) {
                  return handleUpdateInvoice(invoice as UpdateInvoiceDto);
                } else {
                  return handleCreateInvoice(invoice as CreateInvoiceDto);
                }
              }}
              onCancel={closeDrawer}
              isLoading={formLoading}
              customers={customers}
              customersLoading={customersLoading}
              customersError={customersError}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        open={deletingInvoiceId !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setDeletingInvoiceId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tuto fakturu?</AlertDialogTitle>
            <AlertDialogDescription>
              Tuto akci nelze vrátit zpět. Faktura bude trvale odstraněna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingInvoiceId !== null) {
                  void handleDelete(deletingInvoiceId);
                }
              }}
            >
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
