import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { hotels } from '@/data/hotels';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Search } from 'lucide-react';

const Index = () => {
  const { t, currencySymbol, convertPrice } = useLanguage();
  const navigate = useNavigate();
  const featured = hotels.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">{t('hero.title')}</h1>
          <p className="text-lg opacity-90 mb-8">{t('hero.subtitle')}</p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/hotels')}
          >
            <Search className="h-4 w-4 mr-2" />
            {t('search.search')} {t('nav.hotels')}
          </Button>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Featured Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/hotels/${hotel.id}`)}>
              <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" /> {hotel.location}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="text-sm">{hotel.rating}</span>
                  </div>
                  <span className="font-bold text-primary">
                    {currencySymbol}{convertPrice(hotel.price_per_night)}{t('hotel.perNight')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
