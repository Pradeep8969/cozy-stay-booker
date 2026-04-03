import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';

const BookingsPage = () => {
  const { user } = useAuth();
  const { t, currencySymbol, convertPrice } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setBookings(data);
    });
    supabase.from('invoices').select('*').eq('user_id', user.id).then(({ data }) => {
      if (data) setInvoices(data);
    });
  }, [user]);

  const getInvoice = (bookingId: string) => invoices.find((inv) => inv.booking_id === bookingId);

  const printInvoice = (booking: any, invoice: any) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>${t('invoice.title')} - ${invoice.invoice_number}</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:auto}h1{color:#2563eb}table{width:100%;border-collapse:collapse;margin-top:20px}td{padding:8px;border-bottom:1px solid #eee}.total{font-size:1.2em;font-weight:bold}</style></head>
      <body>
        <h1>StayEase - ${t('invoice.title')}</h1>
        <p><strong>${t('invoice.bookingId')}:</strong> ${booking.id.slice(0,8)}</p>
        <p><strong>${t('invoice.date')}:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
        <table>
          <tr><td>Hotel</td><td>${booking.hotel_name}</td></tr>
          <tr><td>${t('search.checkin')}</td><td>${booking.check_in}</td></tr>
          <tr><td>${t('search.checkout')}</td><td>${booking.check_out}</td></tr>
          <tr><td>${t('booking.guests')}</td><td>${booking.guests}</td></tr>
          <tr><td>${t('booking.total')}</td><td>${currencySymbol}${convertPrice(booking.total_price)}</td></tr>
          <tr class="total"><td>${t('invoice.amount')}</td><td>${currencySymbol}${convertPrice(invoice.amount)}</td></tr>
        </table>
        <p style="margin-top:40px;color:#666;font-size:12px">${invoice.invoice_number}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">{t('booking.history')}</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No bookings yet. Start by browsing hotels!
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>{t('search.checkin')}</TableHead>
                  <TableHead>{t('search.checkout')}</TableHead>
                  <TableHead>{t('booking.guests')}</TableHead>
                  <TableHead>{t('booking.total')}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>{t('invoice.title')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => {
                  const invoice = getInvoice(b.id);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.hotel_name}</TableCell>
                      <TableCell>{b.check_in}</TableCell>
                      <TableCell>{b.check_out}</TableCell>
                      <TableCell>{b.guests}</TableCell>
                      <TableCell>{currencySymbol}{convertPrice(b.total_price)}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {b.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {invoice ? (
                          <Button variant="ghost" size="sm" onClick={() => printInvoice(b, invoice)}>
                            <FileText className="h-4 w-4 mr-1" />
                            {t('invoice.print')}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingsPage;
