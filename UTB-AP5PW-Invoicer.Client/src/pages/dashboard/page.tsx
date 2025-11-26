import React, { useEffect, useMemo, useState } from "react"
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
import { InvoiceService } from "@/services/invoice.service"
import type { InvoiceDashboardSummary } from "@/types/invoice"

export default function Page() {
  const api = useAxiosPrivate()
  const invoiceService = useMemo(() => new InvoiceService(api), [api])

  const [summary, setSummary] = useState<InvoiceDashboardSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  async function loadSummary() {
    setLoading(true)
    setError(null)
    try {
      const data = await invoiceService.getDashboardSummary()
      setSummary(data)
    } catch (e) {
      console.error("Failed to load dashboard summary", e)
      setError("Nepodařilo se načíst data pro přehled.")
    } finally {
      setLoading(false)
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

        <div className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-6 gap-6">
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

          {error && (
            <Card>
              <CardContent className="py-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </CardContent>
            </Card>
          )}

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
                    <table className="w-full text-sm">
                      <thead className="border-b text-left text-xs text-muted-foreground">
                        <tr>
                          <th className="py-2 pr-4">Číslo</th>
                          <th className="py-2 pr-4">Zákazník</th>
                          <th className="py-2 pr-4">Vystaveno</th>
                          <th className="py-2 pr-4">Splatnost</th>
                          <th className="py-2 pr-4">Stav</th>
                          <th className="py-2 pr-4 text-right">Částka</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestInvoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b last:border-0">
                            <td className="py-2 pr-4 font-medium">{invoice.invoiceNumber}</td>
                            <td className="py-2 pr-4">
                              {invoice.customerName ?? "-"}
                            </td>
                            <td className="py-2 pr-4">
                              {new Date(invoice.issueDate).toLocaleDateString("cs-CZ")}
                            </td>
                            <td className="py-2 pr-4">
                              {new Date(invoice.dueDate).toLocaleDateString("cs-CZ")}
                            </td>
                            <td className="py-2 pr-4">
                              {invoice.status.toLowerCase() === "paid" && (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                  Uhrazeno
                                </span>
                              )}
                              {invoice.status.toLowerCase() !== "paid" &&
                                invoice.status.toLowerCase() !== "overdue" && (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                    Neuhrazeno
                                  </span>
                                )}
                              {invoice.status.toLowerCase() === "overdue" && (
                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300">
                                  Po splatnosti
                                </span>
                              )}
                            </td>
                            <td className="py-2 pl-4 text-right">
                              {invoice.totalAmount.toLocaleString("cs-CZ", {
                                style: "currency",
                                currency: "CZK",
                                maximumFractionDigits: 0,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                <p className="text-sm text-muted-foreground">
                  TODO: Implementovat přehled plateb
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
