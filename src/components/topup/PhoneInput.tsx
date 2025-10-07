import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export const PhoneInput = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: PhoneInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Número de Celular *</Label>
      <Input
        id="phone"
        type="tel"
        placeholder="3XX XXX XXXX"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Debe iniciar con 3 y tener 10 dígitos
      </p>
    </div>
  );
};