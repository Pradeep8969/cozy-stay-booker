import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, currencySymbol, convertPrice } = useLanguage();
  const { toast } = useToast();

  const [booking, setBooking] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<'full' | 'advance'>('full');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!bookingId || !user) return;
    supabase.from('bookings').select('*').eq('id', bookingId).single().then(({ data }) => {
      if (data) setBooking(data);
    });
  }, [bookingId, user]);

  if (!booking) {
    return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">{t('common.loading')}</div>;
  }

  const paymentAmount = paymentType === 'full' ? booking.total_price : booking.total_price * 0.3;

  const handlePayment = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      // Simulate payment delay
      await new Promise((r) => setTimeout(r, 1500));

      const { data: payment, error: payError } = await supabase.from('payments').insert({
        booking_id: booking.id,
        user_id: user.id,
        amount: paymentAmount,
        payment_type: paymentType,
        status: 'completed',
      }).select().single();

      if (payError) throw payError;

      // Generate invoice
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
      const { error: invError } = await supabase.from('invoices').insert({
        booking_id: booking.id,
        payment_id: payment.id,
        user_id: user.id,
        invoice_number: invoiceNumber,
        amount: paymentAmount,
      });

      if (invError) throw invError;

      toast({ title: t('payment.success') });
      navigate('/bookings');
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('payment.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hotel</span>
              <span className="font-medium text-foreground">{booking.hotel_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('search.checkin')}</span>
              <span className="text-foreground">{booking.check_in}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('search.checkout')}</span>
              <span className="text-foreground">{booking.check_out}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-semibold text-foreground">{t('booking.total')}</span>
              <span className="font-bold text-primary">{currencySymbol}{convertPrice(booking.total_price)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('payment.method')}</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-secondary">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === 'full'}
                  onChange={() => setPaymentType('full')}
                />
                <div>
                  <p className="font-medium text-foreground">{t('payment.full')}</p>
                  <p className="text-sm text-muted-foreground">{currencySymbol}{convertPrice(booking.total_price)}</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-secondary">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === 'advance'}
                  onChange={() => setPaymentType('advance')}
                />
                <div>
                  <p className="font-medium text-foreground">{t('payment.advance')}</p>
                  <p className="text-sm text-muted-foreground">{currencySymbol}{convertPrice(Math.round(booking.total_price * 0.3))}</p>
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">{t('payment.title')}</span>
              <span className="text-primary">{currencySymbol}{convertPrice(Math.round(paymentAmount))}</span>
            </div>
          </div>

          <Button className="w-full" onClick={handlePayment} disabled={processing}>
            {processing ? t('common.loading') : t('payment.pay')}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            This is a simulated payment. No real charges will be made.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
