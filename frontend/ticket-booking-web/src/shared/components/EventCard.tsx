import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import type { EventListDto } from '../../infrastructure/repositories/EventRepository';

interface EventCardProps {
  event: EventListDto;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Link to={`/events/${event.id}`} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.thumbnailUrl || event.imageUrl || 'https://images.unsplash.com/photo-1540039155732-6761b54cbaca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
          {event.categoryName || 'Sự kiện'}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        <div className="space-y-2 mb-4 text-sm text-gray-600 flex-1">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDate(event.startTime)}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Giá từ</p>
            <p className="font-bold text-blue-600 text-lg">{formatPrice(event.minPrice)}</p>
          </div>
          <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors">
            Mua vé
          </span>
        </div>
      </div>
    </Link>
  );
};
