import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotels } from '@/data/hotels';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, MapPin, Search } from 'lucide-react';

const HotelsPage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { t, currencySymbol, convertPrice } = useLanguage();
  const navigate = useNavigate();

  const filteredHotels = hotels.filter((hotel) => {
    const matchesLocation = !searchLocation || 
      hotel.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
      hotel.name.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesMin = !minPrice || hotel.price_per_night >= Number(minPrice);
    const matchesMax = !maxPrice || hotel.price_per_night <= Number(maxPrice);
    return matchesLocation && matchesMin && matchesMax;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">{t('nav.hotels')}</h1>

      {/* Search Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t('search.location')}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={t('search.location')}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>{t('search.priceRange')} (Min)</Label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <Label>{t('search.priceRange')} (Max)</Label>
              <Input
                type="number"
                placeholder="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => {}}>
                <Search className="h-4 w-4 mr-2" />
                {t('search.search')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-foreground">{hotel.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3" />
                {hotel.location}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-sm font-medium">{hotel.rating}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-primary">
                  {currencySymbol}{convertPrice(hotel.price_per_night)}{t('hotel.perNight')}
                </span>
                <Button size="sm" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                  {t('hotel.details')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No hotels found matching your criteria.</p>
      )}
    </div>
  );
};

export default HotelsPage;
