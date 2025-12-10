import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@components/ui/breadcrumb.tsx"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAxiosPrivate } from "@/hooks/use-axios"
import { SummaryService } from "@/services/summary.service.ts";
import type { DashboardSummary } from "@/types/summary.ts";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export default function Page() {
  const api = useAxiosPrivate()
  const navigate = useNavigate()
  const summaryService = useMemo(() => new SummaryService(api), [api])

  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  async function loadSummary() {
    setLoading(true);
    try {
      const data = await summaryService.getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error("Error loading dashboard summary:", error);
      toast.error("Nepodařilo se načíst přehled", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSummary()
  }, [])

  const totalInvoices = summary?.totalInvoices ?? 0
  const unpaidInvoices = summary?.unpaidInvoices ?? 0
  const totalAmount = summary?.totalAmount ?? 0
  const overdueInvoices = summary?.overdueInvoices ?? 0
  const latestInvoices = summary?.latestInvoices ?? []
  const latestPayments = summary?.latestPayments ?? []

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
                <BreadcrumbPage>Přehled</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SiteHeader>

        <main className="flex flex-1 flex-col animate-page">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Počet faktur</CardTitle>
                    <CardDescription>Celkový počet vystavených faktur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-3xl font-semibold">
                        {totalInvoices}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Neuhrazené faktury</CardTitle>
                    <CardDescription>Faktury, které dosud nebyly uhrazeny</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-3xl font-semibold">
                        {unpaidInvoices}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Celková částka</CardTitle>
                    <CardDescription>Součet všech vystavených faktur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-32" />
                    ) : (
                      <p className="text-3xl font-semibold">
                        {totalAmount.toLocaleString("cs-CZ", {
                          style: "currency",
                          currency: "CZK",
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Po splatnosti</CardTitle>
                    <CardDescription>Faktury, jejichž splatnost již vypršela</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-3xl font-semibold">
                        {overdueInvoices}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Poslední faktury</CardTitle>
                    <CardDescription>Přehled naposledy vystavených faktur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-10/12" />
                        <Skeleton className="h-4 w-9/12" />
                      </div>
                    ) : latestInvoices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Zatím nemáte žádné faktury.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table className="w-full text-sm">
                          <TableHeader className="border-b text-left text-xs text-muted-foreground">
                            <TableRow>
                              <TableHead className="py-2 pr-4">Číslo</TableHead>
                              <TableHead className="py-2 pr-4">Zákazník</TableHead>
                              <TableHead className="py-2 pr-4">Vystaveno</TableHead>
                              <TableHead className="py-2 pr-4">Splatnost</TableHead>
                              <TableHead className="py-2 pr-4">Stav</TableHead>
                              <TableHead className="py-2 pr-4 text-right">Částka</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {latestInvoices.map((invoice) => (
                              <TableRow
                                key={invoice.id}
                                className="border-b last:border-0 cursor-pointer hover:bg-muted/40"
                                onClick={() => navigate(`/dashboard/invoices/${invoice.id}`)}
                              >
                                <TableCell className="py-2 pr-4 font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell className="py-2 pr-4">
                                  {invoice.customerName ?? "-"}
                                </TableCell>
                                <TableCell className="py-2 pr-4">
                                  {new Date(invoice.issueDate).toLocaleDateString("cs-CZ")}
                                </TableCell>
                                <TableCell className="py-2 pr-4">
                                  {new Date(invoice.dueDate).toLocaleDateString("cs-CZ")}
                                </TableCell>
                                <TableCell className="py-2 pr-4">
                                  {invoice.status === "draft" && (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700/50 dark:text-gray-300">
                                      Koncept
                                    </span>
                                  )}
                                  {invoice.status === "paid" && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                      Uhrazeno
                                    </span>
                                  )}
                                  {invoice.status === "sent" && (
                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                      Neuhrazeno
                                    </span>
                                  )}
                                  {invoice.status === "overdue" && (
                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300">
                                      Po splatnosti
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="py-2 pl-4 text-right">
                                  {invoice.totalAmount.toLocaleString("cs-CZ", {
                                    style: "currency",
                                    currency: "CZK",
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Poslední platby</CardTitle>
                    <CardDescription>Rychlý přehled naposledy přijatých plateb</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-10/12" />
                        <Skeleton className="h-4 w-9/12" />
                      </div>
                    ) : latestPayments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Zatím nemáte žádné platby.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table className="w-full text-sm">
                          <TableHeader className="border-b text-left text-xs text-muted-foreground">
                            <TableRow>
                              <TableHead className="py-2 pr-4">Datum</TableHead>
                              <TableHead className="py-2 pr-4">Faktura</TableHead>
                              <TableHead className="py-2 pr-4">Zákazník</TableHead>
                              <TableHead className="py-2 pr-4">Metoda</TableHead>
                              <TableHead className="py-2 pl-4 text-right">Částka</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {latestPayments.map((payment) => (
                              <TableRow
                                key={payment.id}
                                className="border-b last:border-0 cursor-pointer hover:bg-muted/40"
                                onClick={() => navigate(`/dashboard/invoices/${payment.invoiceId}`)}
                              >
                                <TableCell className="py-2 pr-4">
                                  {new Date(payment.paymentDate).toLocaleDateString("cs-CZ")}
                                </TableCell>
                                <TableCell className="py-2 pr-4 font-medium text-primary underline-offset-2">
                                  {payment.invoiceNumber}
                                </TableCell>
                                <TableCell className="py-2 pr-4">{payment.customerName ?? "-"}</TableCell>
                                <TableCell className="py-2 pr-4">{payment.paymentMethod}</TableCell>
                                <TableCell className="py-2 pl-4 text-right">
                                  {payment.amount.toLocaleString("cs-CZ", {
                                    style: "currency",
                                    currency: "CZK",
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
