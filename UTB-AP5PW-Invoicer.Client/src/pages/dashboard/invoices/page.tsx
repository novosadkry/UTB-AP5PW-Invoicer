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
import type { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from "@/types/invoice";
import { InvoiceForm } from "@/components/invoice-form";
import { toast } from "sonner";

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const api = useAxiosPrivate();
  const invoiceService = useMemo(() => new InvoiceService(api), [api]);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      return invoiceService.getAll();
    } catch (error) {
      console.error("Failed to load invoices:", error);
      toast.error("Nepodařilo se načíst faktury");
    } finally {
      setLoading(false);
    }
    return null;
  }, [invoiceService]);

  useEffect(() => {
    loadInvoices().then((invoices) => setInvoices(invoices));
  }, []);

  async function handleCreateInvoice(invoice: CreateInvoiceDto) {
    setFormLoading(true);
    try {
      await invoiceService.create(invoice);
      toast.success("Faktura byla úspěšně vytvořena");
      setIsDrawerOpen(false);
      setInvoices(await loadInvoices());
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast.error("Nepodařilo se vytvořit fakturu");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdateInvoice(invoice: UpdateInvoiceDto) {
    setFormLoading(true);
    try {
      await invoiceService.update(invoice);
      toast.success("Faktura byla úspěšně aktualizována");
      setIsDrawerOpen(false);
      setEditingInvoice(null);
      setInvoices(await loadInvoices());
    } catch (error) {
      console.error("Failed to update invoice:", error);
      toast.error("Nepodařilo se aktualizovat fakturu");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Opravdu chcete smazat tuto fakturu?")) {
      return;
    }

    try {
      await invoiceService.delete(id);
      toast.success("Faktura byla úspěšně smazána");
      setInvoices(await loadInvoices());
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Nepodařilo se smazat fakturu");
    }
  }

  function openCreateDrawer() {
    setEditingInvoice(null);
    setIsDrawerOpen(true);
  }

  function openEditDrawer(invoice: Invoice) {
    setEditingInvoice(invoice);
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setEditingInvoice(null);
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
                <BreadcrumbPage>Faktury</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SiteHeader>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex justify-between items-center px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Faktury</h1>
                <Button onClick={openCreateDrawer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nová faktura
                </Button>
              </div>
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
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDrawer(invoice)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-1"
                          >
                            <Link to={`/dashboard/invoices/${invoice.id}`}>
                              Zobrazit
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(invoice.id)}
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
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SidebarProvider>
  );
}
