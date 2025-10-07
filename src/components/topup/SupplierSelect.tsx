import { Supplier } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface SupplierSelectProps {
  value: string;
  onChange: (value: string) => void;
  suppliers: Supplier[];
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export const SupplierSelect = ({
  value,
  onChange,
  suppliers,
  loading,
  error,
  disabled,
}: SupplierSelectProps) => {
  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Proveedor</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Proveedor</Label>
        <div className="text-sm text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="supplier">Proveedor *</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="supplier">
          <SelectValue placeholder="Selecciona un proveedor" />
        </SelectTrigger>
        <SelectContent>
          {suppliers.map((supplier) => (
            <SelectItem key={supplier.productCode} value={supplier.productCode}>
              {supplier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};