export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price_per_night: number;
  rating: number;
  image: string;
  amenities: string[];
  rooms_available: number;
}

export const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Hotel Yak & Yeti',
    location: 'Kathmandu, Nepal',
    description: 'A luxurious 5-star hotel in the heart of Kathmandu with stunning views of the Himalayas.',
    price_per_night: 150,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym'],
    rooms_available: 12,
  },
  {
    id: '2',
    name: 'Hyatt Regency',
    location: 'Kathmandu, Nepal',
    description: 'Elegant hotel set amid lush gardens with panoramic mountain views.',
    price_per_night: 200,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
    rooms_available: 8,
  },
  {
    id: '3',
    name: 'Pokhara Grande',
    location: 'Pokhara, Nepal',
    description: 'Lakeside hotel with breathtaking views of the Annapurna range.',
    price_per_night: 120,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Lake View', 'Parking'],
    rooms_available: 15,
  },
  {
    id: '4',
    name: 'Temple Tree Resort',
    location: 'Pokhara, Nepal',
    description: 'Boutique resort nestled in a serene garden setting near Phewa Lake.',
    price_per_night: 95,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['WiFi', 'Pool', 'Garden', 'Restaurant', 'Spa'],
    rooms_available: 10,
  },
  {
    id: '5',
    name: 'Barahi Jungle Lodge',
    location: 'Chitwan, Nepal',
    description: 'Eco-luxury lodge on the banks of the Rapti River near Chitwan National Park.',
    price_per_night: 180,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    amenities: ['WiFi', 'Safari', 'Restaurant', 'Pool', 'Nature Tours'],
    rooms_available: 6,
  },
  {
    id: '6',
    name: 'Hotel Shanker',
    location: 'Kathmandu, Nepal',
    description: 'Heritage hotel in a restored Rana palace with classical architecture.',
    price_per_night: 110,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Garden', 'Heritage Tours'],
    rooms_available: 20,
  },
  {
    id: '7',
    name: 'Dwarika Hotel',
    location: 'Kathmandu, Nepal',
    description: 'Award-winning heritage hotel showcasing traditional Newari craftsmanship.',
    price_per_night: 250,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Heritage', 'Gym'],
    rooms_available: 5,
  },
  {
    id: '8',
    name: 'Tiger Mountain Lodge',
    location: 'Pokhara, Nepal',
    description: 'Mountain lodge perched on a ridge with panoramic Himalayan views.',
    price_per_night: 160,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    amenities: ['WiFi', 'Trekking', 'Restaurant', 'Mountain View', 'Garden'],
    rooms_available: 8,
  },
];
