import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotels } from '@/data/hotels';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Star, MapPin, ArrowLeft } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, currencySymbol, convertPrice } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const hotel = hotels.find((h) => h.id === id);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState(false);

  if (!hotel) {
    return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">Hotel not found</div>;
  }

  const nights = checkIn && checkOut ? Math.max(differenceInDays(new Date(checkOut), new Date(checkIn)), 0) : 0;
  const totalPrice = nights * hotel.price_per_night;

  const handleBook = async () => {
    if (!user) {
      toast({ title: 'Please login first', variant: 'destructive' });
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      toast({ title: 'Please select valid dates', variant: 'destructive' });
      return;
    }

    setBooking(true);
    try {
      const { data, error } = await supabase.from('bookings').insert({
        user_id: user.id,
        hotel_id: hotel.id,
        hotel_name: hotel.name,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: totalPrice,
      }).select().single();

      if (error) throw error;
      toast({ title: t('booking.success') });
      navigate(`/payment/${data.id}`);
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/hotels')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={hotel.image} alt={hotel.name} className="w-full h-72 object-cover rounded-lg" />
          <h1 className="text-2xl font-bold text-foreground mt-4">{hotel.name}</h1>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" /> {hotel.location}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span className="font-medium">{hotel.rating}</span>
          </div>
          <p className="text-muted-foreground mt-4">{hotel.description}</p>
          <div className="mt-4">
            <h3 className="font-semibold text-foreground mb-2">{t('hotel.amenities')}</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((a) => (
                <span key={a} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('booking.title')}</CardTitle>
            <p className="text-lg font-bold text-primary">
              {currencySymbol}{convertPrice(hotel.price_per_night)}{t('hotel.perNight')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('search.checkin')}</Label>
              <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={format(new Date(), 'yyyy-MM-dd')} />
            </div>
            <div>
              <Label>{t('search.checkout')}</Label>
              <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || format(new Date(), 'yyyy-MM-dd')} />
            </div>
            <div>
              <Label>{t('booking.guests')}</Label>
              <Input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
            </div>

            {nights > 0 && (
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currencySymbol}{convertPrice(hotel.price_per_night)} × {nights} {t('common.nights')}</span>
                  <span>{currencySymbol}{convertPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground mt-2">
                  <span>{t('booking.total')}</span>
                  <span>{currencySymbol}{convertPrice(totalPrice)}</span>
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleBook} disabled={booking || nights <= 0}>
              {booking ? t('common.loading') : t('booking.confirm')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HotelDetailPage;
