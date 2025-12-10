import { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs.tsx";
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
import { useAxiosAdmin } from "@/hooks/use-axios";
import { toast } from "sonner";
import type { UserDto } from "@/types/user";
import type { Customer } from "@/types/customer";
import type { Invoice } from "@/types/invoice";
import { Trash2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function AdminPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: string;
    id: number;
  } | null>(null);

  const api = useAxiosAdmin();

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [usersData, customersData, invoicesData] = await Promise.all([
        api.get<UserDto[]>("/users"),
        api.get<Customer[]>("/customers"),
        api.get<Invoice[]>("/invoices"),
      ]);
      setUsers(usersData.data);
      setCustomers(customersData.data);
      setInvoices(invoicesData.data);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      toast.error("Nepodařilo se načíst data", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(type: string, id: number) {
    try {
      await api.delete(`/${type}/${id}`);
      toast.success(`${type} byl úspěšně smazán`, { position: "top-center" });
      await loadAllData();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      toast.error(`Nepodařilo se smazat ${type}`, { position: "top-center" });
    } finally {
      setDeleteDialog(null);
    }
  }

  const renderUsersTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="text-left p-3">ID</TableHead>
            <TableHead className="text-left p-3">Email</TableHead>
            <TableHead className="text-left p-3">Jméno</TableHead>
            <TableHead className="text-left p-3">Role</TableHead>
            <TableHead className="text-left p-3">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-t">
              <TableCell className="p-3">{user.id}</TableCell>
              <TableCell className="p-3">{user.email}</TableCell>
              <TableCell className="p-3">{user.fullName}</TableCell>
              <TableCell className="p-3">{user.role}</TableCell>
              <TableCell className="p-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialog({ open: true, type: "users", id: user.id })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderCustomersTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="text-left p-3">ID</TableHead>
            <TableHead className="text-left p-3">Název</TableHead>
            <TableHead className="text-left p-3">IČ</TableHead>
            <TableHead className="text-left p-3">Email</TableHead>
            <TableHead className="text-left p-3">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="border-t">
              <TableCell className="p-3">{customer.id}</TableCell>
              <TableCell className="p-3">{customer.name}</TableCell>
              <TableCell className="p-3">{customer.ico || "-"}</TableCell>
              <TableCell className="p-3">{customer.contactEmail}</TableCell>
              <TableCell className="p-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialog({ open: true, type: "customers", id: customer.id })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderInvoicesTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="text-left p-3">ID</TableHead>
            <TableHead className="text-left p-3">Číslo faktury</TableHead>
            <TableHead className="text-left p-3">Datum vystavení</TableHead>
            <TableHead className="text-left p-3">Částka</TableHead>
            <TableHead className="text-left p-3">Stav</TableHead>
            <TableHead className="text-left p-3">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="border-t">
              <TableCell className="p-3">{invoice.id}</TableCell>
              <TableCell className="p-3">{invoice.invoiceNumber}</TableCell>
              <TableCell className="p-3">{new Date(invoice.issueDate).toLocaleDateString('cs-CZ')}</TableCell>
              <TableCell className="p-3">{invoice.totalAmount.toLocaleString()} Kč</TableCell>
              <TableCell className="p-3">{invoice.status}</TableCell>
              <TableCell className="p-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialog({ open: true, type: "invoices", id: invoice.id })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Přehled</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </SiteHeader>
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Přehled</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Admin</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SiteHeader>
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Správa databáze</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="users">
                <TabsList>
                  <TabsTrigger value="users">Uživatelé ({users.length})</TabsTrigger>
                  <TabsTrigger value="customers">Zákazníci ({customers.length})</TabsTrigger>
                  <TabsTrigger value="invoices">Faktury ({invoices.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="mt-4">
                  {renderUsersTable()}
                </TabsContent>
                <TabsContent value="customers" className="mt-4">
                  {renderCustomersTable()}
                </TabsContent>
                <TabsContent value="invoices" className="mt-4">
                  {renderInvoicesTable()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      <AlertDialog open={deleteDialog?.open || false} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tuto položku?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Data budou trvale odstraněna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog.type, deleteDialog.id)}
            >
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
