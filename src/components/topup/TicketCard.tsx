import { Ticket } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketCard = ({ ticket, onClose }: TicketCardProps) => {
  const isSuccess = ticket.status === 'success';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          {isSuccess ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive" />
          )}
        </div>
        <CardTitle className="text-center">
          {isSuccess ? 'Transacción Exitosa' : 'Transacción Fallida'}
        </CardTitle>
        <CardDescription className="text-center">
          {formatDate(ticket.date)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">ID Transacción</p>
            <p className="font-medium">{ticket.transactionId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Código Autorización</p>
            <p className="font-medium">{ticket.authorizationCode}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Número Celular</p>
            <p className="font-medium">{formatPhone(ticket.number)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monto</p>
            <p className="font-medium">{formatCurrency(ticket.amount)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Proveedor</p>
            <p className="font-medium">{ticket.supplier}</p>
          </div>
        </div>

        {ticket.message && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">{ticket.message}</p>
          </div>
        )}

        <Button onClick={onClose} className="w-full">
          Nueva Transacción
        </Button>
      </CardContent>
    </Card>
  );
};