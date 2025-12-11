import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";
import { ArrowRight, Plus, Trash2, Pencil } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent } from "@components/ui/card.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb.tsx";
import { useAxiosPrivate } from "@/hooks/use-axios";
import { CustomerService } from "@/services/customer.service";
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from "@/types/customer";
import { CustomerForm } from "@/components/customer-form";
import { AxiosError } from "axios";
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
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(null);
  const api = useAxiosPrivate();
  const customerService = useMemo(() => new CustomerService(api), [api]);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      return customerService.getAll();
    } catch (error) {
      console.error("Failed to load customers:", error);
      toast.error("Nepodařilo se načíst zákazníky", { position: "top-center" });
    } finally {
      setLoading(false);
    }
    return null;
  }, [customerService]);

  useEffect(() => {
    loadCustomers().then((data) => setCustomers(data));
  }, []);

  async function handleCreateCustomer(customer: CreateCustomerDto) {
    setFormLoading(true);

    const promise = (async () => {
      await customerService.create(customer);
      setIsDrawerOpen(false);
      setCustomers(await loadCustomers());
    })();

    toast.promise(promise, {
      position: "top-center",
      loading: "Vytvářím zákazníka...",
      success: () => {
        setFormLoading(false);
        return "Zákazník byl úspěšně vytvořen";
      },
      error: () => {
        setFormLoading(false);
        return "Nepodařilo se vytvořit zákazníka";
      },
    });

    return promise;
  }

  async function handleUpdateCustomer(customer: UpdateCustomerDto) {
    setFormLoading(true);

    const promise = (async () => {
      await customerService.update(customer);
      setIsDrawerOpen(false);
      setEditingCustomer(null);
      setCustomers(await loadCustomers());
    })();

    toast.promise(promise, {
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
    });

    return promise;
  }

  async function handleDelete(id: number) {
    toast.promise(
      async () => {
        await customerService.delete(id);
        setCustomers(await loadCustomers());
      },
      {
        position: "top-center",
        loading: "Mažu zákazníka...",
        success: "Zákazník byl úspěšně smazán",
        error: (e) => {
          if (e instanceof AxiosError && e.response?.status === 400) {
            return "Zákazníka nelze smazat, jelikož má přiřazené faktury.";
          } else {
            return "Nepodařilo se smazat zákazníka";
          }
        },
      }
    );
    setDeletingCustomerId(null);
  }

  function openCreateDrawer() {
    setEditingCustomer(null);
    setIsDrawerOpen(true);
  }

  function openEditDrawer(customer: Customer) {
    setEditingCustomer(customer);
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setEditingCustomer(null);
  }

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
                  <BreadcrumbPage>Zákazníci</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Button size="sm" onClick={openCreateDrawer}>
              <Plus className="w-4 h-4 mr-2" />
              Nový zákazník
            </Button>
          </div>
        </SiteHeader>
        <div className="flex flex-1 flex-col animate-page">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : customers && customers.length > 0 ? (
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                  {customers.map((customer) => (
                    <Card
                      key={customer.id}
                      className="transition-all hover:shadow-md hover:border-primary/30"
                    >
                      <CardContent className="p-4 flex flex-wrap justify-between items-start gap-4">
                        <div className="space-y-1 flex-1">
                          <p className="text-md font-semibold">
                            {customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customer.contactEmail}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <Link to={`/dashboard/customers/${customer.id}`}>
                              Zobrazit
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => openEditDrawer(customer)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setDeletingCustomerId(customer.id)}
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
                    Zatím nemáte žádné zákazníky. Vytvořte si prvního pomocí tlačítka výše.
                  </p>
                </div>
              )}
              {customers && customers.length > 0 && (
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
              {editingCustomer ? "Upravit zákazníka" : "Nový zákazník"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[80vh]">
            <CustomerForm
              customer={editingCustomer || undefined}
              onSubmit={(customer) => {
                if (editingCustomer) {
                  return handleUpdateCustomer(customer as UpdateCustomerDto);
                }
                return handleCreateCustomer(customer as CreateCustomerDto);
              }}
              onCancel={closeDrawer}
              isLoading={formLoading}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        open={deletingCustomerId !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setDeletingCustomerId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tohoto zákazníka?</AlertDialogTitle>
            <AlertDialogDescription>
              Tuto akci nelze vrátit zpět. Zákazník bude trvale odstraněn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCustomerId !== null) {
                  void handleDelete(deletingCustomerId);
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
