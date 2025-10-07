import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export const AmountInput = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: AmountInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Monto (COP) *</Label>
      <Input
        id="amount"
        type="text"
        inputMode="numeric"
        placeholder="10000"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {value && !error && (
        <p className="text-xs text-muted-foreground">
          {formatCurrency(Number(value))}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Mín: 1.000 COP - Máx: 100.000 COP
      </p>
    </div>
  );
};