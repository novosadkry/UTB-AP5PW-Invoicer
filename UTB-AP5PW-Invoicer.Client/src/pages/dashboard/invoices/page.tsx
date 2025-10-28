import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar.tsx";
import { AppSidebar } from "@components/app-sidebar.tsx";
import { SiteHeader } from "@components/site-header.tsx";
import { Card, CardContent } from "@components/ui/card.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

export default function Page() {
  const [invoices, setInvoices] = useState<Array<{
    id: string;
    reference_number: string;
    total_amount: number;
  }> | null>([
    { id: "1", reference_number: "2023-001", total_amount: 1500 },
    { id: "2", reference_number: "2023-002", total_amount: 2500 },
    { id: "3", reference_number: "2023-003", total_amount: 3500 },
    { id: "4", reference_number: "2023-004", total_amount: 4500 },
    { id: "5", reference_number: "2023-005", total_amount: 5500 },
    { id: "6", reference_number: "2023-006", total_amount: 6500 },
    { id: "7", reference_number: "2023-007", total_amount: 7500 },
    { id: "8", reference_number: "2023-008", total_amount: 8500 },
    { id: "9", reference_number: "2023-009", total_amount: 9500 },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalPages = 5;
  const pageSize = 9;

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
              {loading ? (
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                  {Array.from({ length: pageSize }).map((_, i) => (
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
              ) : (
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                  {invoices?.map((invoice) => (
                    <Card
                      key={invoice.id}
                      className="transition-all hover:shadow-md hover:border-primary/30"
                    >
                      <CardContent className="p-4 flex flex-wrap justify-between items-center gap-4">
                        <div className="space-y-1">
                          <p className="text-md font-semibold">
                            Faktura {invoice.reference_number}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">
                              {invoice.total_amount} Kč
                            </p>
                            <Badge variant="outline">Nezaplaceno</Badge>
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="gap-1"
                        >
                          <a href={`/dashboard/invoices/${invoice.id}`}>
                            Zobrazit
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious to="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink to="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink to="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink to="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext to="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
