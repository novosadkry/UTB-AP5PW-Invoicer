import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { Button } from "@components/ui/button.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
import { useAxiosPublic } from "@/hooks/use-axios";
import type { Invoice } from "@/types/invoice";
import type { Customer } from "@/types/customer";
import type { InvoiceItem } from "@/types/invoice-item";
import type { Payment } from "@/types/payment";
import { toast } from "sonner";

export default function SharedInvoicePage() {
  const { token } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const publicApi = useAxiosPublic();

  useEffect(() => {
    async function loadSharedInvoice() {
      if (!token) {
        setError("Neplatný odkaz");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await publicApi.get<Invoice>(`/invoices/shared/${token}`);
        const invoiceData = response.data;
        setInvoice(invoiceData);

        // Load invoice items using the shared endpoint
        try {
          const itemsResponse = await publicApi.get<InvoiceItem[]>(`/invoices/shared/${token}/items`);
          setItems(itemsResponse.data);
        } catch (err) {
          console.error("Failed to load invoice items:", err);
        }

        // Load payments using the shared endpoint
        try {
          const paymentsResponse = await publicApi.get<Payment[]>(`/invoices/shared/${token}/payments`);
          setPayments(paymentsResponse.data);
        } catch (err) {
          console.error("Failed to load payments:", err);
        }

        // Load customer using the shared endpoint
        try {
          const customerResponse = await publicApi.get<Customer>(`/invoices/shared/${token}/customer`);
          setCustomer(customerResponse.data);
        } catch (err) {
          console.error("Failed to load customer:", err);
        }
      } catch (err) {
        console.error("Failed to load shared invoice:", err);
        setError("Faktura nebyla nalezena nebo vypršela platnost odkazu");
      } finally {
        setLoading(false);
      }
    }

    loadSharedInvoice();
  }, [token]);

  async function handleDownloadPdf() {
    if (!token) return;

    toast.promise(async () => {
      const response = await publicApi.get(`/invoices/shared/${token}/pdf`, {
        responseType: 'blob'
      });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `faktura-${invoice?.invoiceNumber || 'invoice'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, {
      position: "top-center",
      loading: "Stahuji PDF faktury...",
      success: "PDF bylo úspěšně staženo",
      error: "Nepodařilo se stáhnout PDF",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Faktura nebyla nalezena</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error || "Zkontrolujte prosím URL adresu."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = invoice.totalAmount - totalPaid;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Faktura {invoice.invoiceNumber}</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(invoice.status)}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
            >
              <Download className="w-4 h-4 mr-2" />
              Stáhnout PDF
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Datum vystavení</p>
                <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString('cs-CZ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Datum splatnosti</p>
                <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('cs-CZ')}</p>
              </div>
            </div>

            {/* Customer Info */}
            {customer && (
              <div>
                <h3 className="font-semibold mb-2">Zákazník</h3>
                <div className="space-y-1">
                  <p className="font-medium">{customer.name}</p>
                  {customer.ico && <p className="text-sm text-muted-foreground">IČ: {customer.ico}</p>}
                  {customer.dic && <p className="text-sm text-muted-foreground">DIČ: {customer.dic}</p>}
                  {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}
                  {customer.contactEmail && <p className="text-sm text-muted-foreground">{customer.contactEmail}</p>}
                  {customer.contactPhone && <p className="text-sm text-muted-foreground">{customer.contactPhone}</p>}
                </div>
              </div>
            )}

            {/* Invoice Items */}
            {items.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Položky</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Popis</th>
                        <th className="text-right p-3">Množství</th>
                        <th className="text-right p-3">Jednotková cena</th>
                        <th className="text-right p-3">Celkem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id || index} className="border-t">
                          <td className="p-3">{item.description}</td>
                          <td className="text-right p-3">{item.quantity}</td>
                          <td className="text-right p-3">{item.unitPrice.toLocaleString()} Kč</td>
                          <td className="text-right p-3">{item.totalPrice.toLocaleString()} Kč</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total Amount */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Celková částka:</span>
                <span>{invoice.totalAmount.toLocaleString()} Kč</span>
              </div>
              {payments.length > 0 && (
                <>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Uhrazeno:</span>
                    <span>{totalPaid.toLocaleString()} Kč</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Zbývá k úhradě:</span>
                    <span className={remainingAmount > 0 ? "text-destructive" : "text-green-600"}>
                      {remainingAmount.toLocaleString()} Kč
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
