import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Calendar, CreditCard } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const { t, currencySymbol, convertPrice } = useLanguage();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setProfiles(data);
    });
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setBookings(data);
    });
    supabase.from('payments').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPayments(data);
    });
  }, [isAdmin]);

  if (loading) return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">{t('common.loading')}</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">{t('admin.title')}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
              <p className="text-sm text-muted-foreground">{t('admin.users')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
              <p className="text-sm text-muted-foreground">{t('admin.bookings')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{payments.length}</p>
              <p className="text-sm text-muted-foreground">{t('admin.payments')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
          <TabsTrigger value="bookings">{t('admin.bookings')}</TabsTrigger>
          <TabsTrigger value="payments">{t('admin.payments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('auth.fullName')}</TableHead>
                    <TableHead>{t('auth.email')}</TableHead>
                    <TableHead>{t('auth.phone')}</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.full_name}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.hotel_name}</TableCell>
                      <TableCell>{b.check_in}</TableCell>
                      <TableCell>{b.check_out}</TableCell>
                      <TableCell>{b.guests}</TableCell>
                      <TableCell>{currencySymbol}{convertPrice(b.total_price)}</TableCell>
                      <TableCell>{b.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('invoice.amount')}</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{currencySymbol}{convertPrice(p.amount)}</TableCell>
                      <TableCell>{p.payment_type}</TableCell>
                      <TableCell>{p.status}</TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
