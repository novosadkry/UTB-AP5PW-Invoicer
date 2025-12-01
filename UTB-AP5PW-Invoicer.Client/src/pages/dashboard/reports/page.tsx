import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Download } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card.tsx";
import { Button } from "@components/ui/button.tsx";
import { Input } from "@components/ui/input.tsx";
import { Label } from "@components/ui/label.tsx";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table.tsx";
import { useAxiosPrivate } from "@/hooks/use-axios";
import { ReportService } from "@/services/report.service";
import type { Report } from "@/types/report";
import { toast } from "sonner";

export default function Page() {
  const api = useAxiosPrivate();
  const reportService = useMemo(() => new ReportService(api), [api]);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Date filter state
  const [periodStart, setPeriodStart] = useState<string>(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  });
  const [periodEnd, setPeriodEnd] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setLoading(true);
    try {
      const data = await reportService.getReport(periodStart, periodEnd);
      setReport(data);
    } catch (error) {
      console.error("Failed to load report:", error);
      toast.error("Nepodařilo se načíst report", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCsv() {
    setExporting(true);
    toast.promise(
      (async () => {
        const blob = await reportService.exportCsv(periodStart, periodEnd);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${periodStart}-${periodEnd}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })(),
      {
        position: "top-center",
        loading: "Exportuji report do CSV...",
        success: () => {
          setExporting(false);
          return "Report byl úspěšně exportován";
        },
        error: () => {
          setExporting(false);
          return "Nepodařilo se exportovat report";
        },
      }
    );
  }

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadReport();
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
    }).format(value);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
      'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
    ];
    return months[month - 1] || '';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!report) {
      return (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Nepodařilo se načíst data reportu
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Celkové tržby</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(report.totalRevenue)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Zaplaceno</CardDescription>
              <CardTitle className="text-2xl text-green-600">{formatCurrency(report.paidAmount)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Nezaplaceno</CardDescription>
              <CardTitle className="text-2xl text-orange-600">{formatCurrency(report.unpaidAmount)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Celkem faktur</CardDescription>
              <CardTitle>{report.totalInvoices}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Zaplacených</CardDescription>
              <CardTitle className="text-green-600">{report.paidInvoices}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Nezaplacených</CardDescription>
              <CardTitle className="text-orange-600">{report.unpaidInvoices}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Po splatnosti</CardDescription>
              <CardTitle className="text-red-600">{report.overdueInvoices}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tržby podle zákazníků</CardTitle>
            <CardDescription>Přehled tržeb za sledované období</CardDescription>
          </CardHeader>
          <CardContent>
            {report.revenueByCustomer.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zákazník</TableHead>
                    <TableHead className="text-right">Počet faktur</TableHead>
                    <TableHead className="text-right">Tržby</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.revenueByCustomer.map((customer) => (
                    <TableRow key={customer.customerId}>
                      <TableCell className="font-medium">{customer.customerName}</TableCell>
                      <TableCell className="text-right">{customer.invoiceCount}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Žádné tržby za sledované období
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Měsíční přehled</CardTitle>
            <CardDescription>Tržby podle měsíců</CardDescription>
          </CardHeader>
          <CardContent>
            {report.monthlyRevenue.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Období</TableHead>
                    <TableHead className="text-right">Počet faktur</TableHead>
                    <TableHead className="text-right">Tržby</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.monthlyRevenue.map((month) => (
                    <TableRow key={`${month.year}-${month.month}`}>
                      <TableCell className="font-medium">
                        {getMonthName(month.month)} {month.year}
                      </TableCell>
                      <TableCell className="text-right">{month.invoiceCount}</TableCell>
                      <TableCell className="text-right">{formatCurrency(month.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Žádné tržby za sledované období
              </p>
            )}
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
                <BreadcrumbPage>Reporty</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SiteHeader>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Reporty a statistiky</h1>
                <Button onClick={handleExportCsv} disabled={exporting || loading}>
                  <Download className="w-4 h-4 mr-2" />
                  {exporting ? "Exportuji..." : "Export CSV"}
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="periodStart">Od</Label>
                      <Input
                        id="periodStart"
                        type="date"
                        value={periodStart}
                        onChange={(e) => setPeriodStart(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periodEnd">Do</Label>
                      <Input
                        id="periodEnd"
                        type="date"
                        value={periodEnd}
                        onChange={(e) => setPeriodEnd(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Načítám..." : "Filtrovat"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
