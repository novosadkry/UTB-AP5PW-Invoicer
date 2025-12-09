import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAxiosPrivate } from "@/hooks/use-axios";
import { InvoiceItemService } from "@/services/invoice-item.service";
import type { InvoiceItem } from "@/types/invoice-item";
import { toast } from "sonner";

interface InvoiceItemsManagerProps {
  invoiceId: number;
  onItemsChange?: () => void;
  onAddItem?: () => void;
  onEditItem?: (item: InvoiceItem) => void;
}

export function InvoiceItemsManager({ invoiceId, onItemsChange, onAddItem, onEditItem }: InvoiceItemsManagerProps) {
  const api = useAxiosPrivate();
  const itemService = useMemo(() => new InvoiceItemService(api), [api]);

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<InvoiceItem | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await itemService.getByInvoiceId(invoiceId);
      setItems(data);
    } catch (error) {
      console.error("Failed to load invoice items:", error);
      toast.error("Nepodařilo se načíst položky faktury");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const handleDelete = (item: InvoiceItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await itemService.delete(invoiceId, deletingItem.id);
      toast.success("Položka byla odstraněna", { position: "top-center" });
      setIsDeleteDialogOpen(false);
      await loadItems();
      onItemsChange?.();
    } catch (error) {
      console.error("Failed to delete invoice item:", error);
      toast.error("Nepodařilo se odstranit položku");
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Položky faktury</CardTitle>
              <CardDescription>Spravujte položky této faktury</CardDescription>
            </div>
            <Button onClick={onAddItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Přidat položku
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Načítání...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">Žádné položky</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Popis</TableHead>
                  <TableHead className="text-right">Množství</TableHead>
                  <TableHead className="text-right">Jedn. cena</TableHead>
                  <TableHead className="text-right">Celkem</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('cs-CZ', {
                        style: 'currency',
                        currency: 'CZK'
                      }).format(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('cs-CZ', {
                        style: 'currency',
                        currency: 'CZK'
                      }).format(item.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditItem?.(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Celková částka:
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {new Intl.NumberFormat('cs-CZ', {
                      style: 'currency',
                      currency: 'CZK'
                    }).format(totalAmount)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete odstranit tuto položku?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Položka bude trvale odstraněna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Odstranit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Re-export the loadItems function for parent components to use
export function useInvoiceItemsReload(invoiceId: number) {
  const api = useAxiosPrivate();
  const itemService = useMemo(() => new InvoiceItemService(api), [api]);

  return async () => {
    return await itemService.getByInvoiceId(invoiceId);
  };
}
