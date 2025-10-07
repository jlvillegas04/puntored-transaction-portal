import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useTopUp } from '@/hooks/useTopUp';
import { SupplierSelect } from '@/components/topup/SupplierSelect';
import { PhoneInput } from '@/components/topup/PhoneInput';
import { AmountInput } from '@/components/topup/AmountInput';
import { TicketCard } from '@/components/topup/TicketCard';
import { validatePhone, validateAmount, generateTrace } from '@/lib/validators';
import { BuyRechargeRequest, ApiError } from '@/types';
import { storageService } from '@/services/storageService';

export const TopUpPage = () => {
  const { suppliers, loading: loadingSuppliers, error: suppliersError } = useSuppliers();
  const { buyTopUp, loading: buyingTopUp, ticket, reset } = useTopUp();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    supplier: '',
    phone: '',
    amount: '',
    terminal: '',
    transactionalPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'supplier':
        if (!value) error = 'Proveedor es requerido';
        break;
      case 'phone':
        const phoneResult = validatePhone(value);
        if (!phoneResult.isValid) error = phoneResult.error || '';
        break;
      case 'amount':
        const amountResult = validateAmount(Number(value));
        if (!amountResult.isValid) error = amountResult.error || '';
        break;
      case 'terminal':
        if (!value) error = 'Terminal es requerido';
        break;
      case 'transactionalPassword':
        if (!value) error = 'Contraseña es requerida';
        break;
    }

    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (!validateField(field, value)) {
        isValid = false;
        newErrors[field] = errors[field];
      }
    });

    setErrors(newErrors);
    setTouched({
      supplier: true,
      phone: true,
      amount: true,
      terminal: true,
      transactionalPassword: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      toast({
        variant: 'error',
        title: 'Error de Validación',
        description: 'Por favor corrige todos los errores antes de enviar.',
      });
      return;
    }

    try {
      const request: BuyRechargeRequest = {
        pointOfSale: Number(import.meta.env.VITE_POINT_OF_SALE),
        terminal: formData.terminal,
        transactionalPassword: formData.transactionalPassword,
        number: formData.phone,
        amount: Number(formData.amount),
        trace: generateTrace(),
        productCode: formData.supplier,
        Ciudad: import.meta.env.VITE_CITY_CODE,
        Latitud: import.meta.env.VITE_DEFAULT_LATITUDE,
        Longitud: import.meta.env.VITE_DEFAULT_LONGITUDE,
      };

      // Save to history
      const supplierName = suppliers.find(s => s.productCode === formData.supplier)?.name || 'Unknown';
      const ticketData = await buyTopUp(request, supplierName);
      storageService.addTransaction({
        id: request.trace,
        date: ticketData.date,
        number: ticketData.number,
        amount: ticketData.amount,
        supplier: ticketData.productCode,
        supplierName,
        authorizationCode: ticketData.authorizationCode,
        transactionId: ticketData.transactionId,
        status: ticketData.status,
        productCode: ticketData.productCode,
      });

      toast({
        title: 'Éxito',
        description: '¡Transacción de recarga completada exitosamente!',
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: 'error',
        title: 'Transacción Fallida',
        description: apiError.message || 'Por favor intenta de nuevo.',
      });
    }
  };

  const handleNewTransaction = () => {
    reset();
    setFormData({
      supplier: '',
      phone: '',
      amount: '',
      terminal: '',
      transactionalPassword: '',
    });
    setErrors({});
    setTouched({});
  };

  if (ticket) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <TicketCard ticket={ticket} onClose={handleNewTransaction} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Recarga de Celular</CardTitle>
          <CardDescription>
            Selecciona un proveedor e ingresa los detalles para completar una transacción de recarga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <SupplierSelect
              value={formData.supplier}
              onChange={(value) => setFormData({ ...formData, supplier: value })}
              suppliers={suppliers}
              loading={loadingSuppliers}
              error={suppliersError}
              disabled={buyingTopUp}
            />

            <PhoneInput
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              onBlur={() => handleBlur('phone')}
              error={touched.phone ? errors.phone : undefined}
              disabled={buyingTopUp}
            />

            <AmountInput
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              onBlur={() => handleBlur('amount')}
              error={touched.amount ? errors.amount : undefined}
              disabled={buyingTopUp}
            />

            <div className="space-y-2">
              <Label htmlFor="terminal">Terminal *</Label>
              <Input
                id="terminal"
                type="text"
                placeholder="Ingresa el ID del terminal"
                value={formData.terminal}
                onChange={(e) => setFormData({ ...formData, terminal: e.target.value })}
                onBlur={() => handleBlur('terminal')}
                disabled={buyingTopUp}
                className={touched.terminal && errors.terminal ? 'border-destructive' : ''}
              />
              {touched.terminal && errors.terminal && (
                <p className="text-sm text-destructive">{errors.terminal}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña Transaccional *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa la contraseña"
                value={formData.transactionalPassword}
                onChange={(e) => setFormData({ ...formData, transactionalPassword: e.target.value })}
                onBlur={() => handleBlur('transactionalPassword')}
                disabled={buyingTopUp}
                className={touched.transactionalPassword && errors.transactionalPassword ? 'border-destructive' : ''}
              />
              {touched.transactionalPassword && errors.transactionalPassword && (
                <p className="text-sm text-destructive">{errors.transactionalPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={buyingTopUp || loadingSuppliers}
            >
              {buyingTopUp ? 'Procesando...' : 'Comprar Recarga'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};