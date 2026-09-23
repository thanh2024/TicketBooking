import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Share2, Heart, Clock, User as UserIcon } from 'lucide-react';
import { useEventDetail } from '../../hooks/useEvents';
import { useTicketTypes } from '../../hooks/useTicketTypes';
import { TicketSelector } from '../../../shared/components/TicketSelector';
import { Button } from '../../../shared/components/Button';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: eventData, isLoading: isEventLoading } = useEventDetail(id || '');
  const { data: ticketTypesData, isLoading: isTicketsLoading } = useTicketTypes(id || '');

  if (isEventLoading) {
    return (
      <div className="animate-pulse max-w-5xl mx-auto pb-16">
        <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="w-full md:w-96 space-y-4">
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const event = eventData?.data;

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sự kiện</h2>
        <Link to="/events" className="text-blue-600 hover:underline mt-4 inline-block">Quay lại danh sách</Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Cover Image */}
      <div className="relative h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden mb-8 shadow-lg">
        <img 
          src={event.thumbnailUrl || event.imageUrls?.[0] || 'https://images.unsplash.com/photo-1540039155732-6761b54cbaca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between">
          <div className="text-white">
            <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              {event.categoryName || 'Sự kiện'}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{event.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-200">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(event.startTime)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-6 md:mt-0">
            <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition hover:text-red-400">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu sự kiện</h2>
            <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line">
              {event.description}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ban tổ chức</h2>
            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-900">{event.organizerName || 'Unknown Organizer'}</h3>
                <p className="text-gray-500 text-sm">Ban tổ chức uy tín</p>
              </div>
              <Button variant="outline" className="ml-auto rounded-full">Theo dõi</Button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Location Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-500" /> Địa điểm
            </h3>
            <p className="text-gray-700 font-medium mb-4">{event.location}</p>
            {/* Map Placeholder */}
            <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm overflow-hidden border border-gray-200">
               Bản đồ sẽ hiển thị ở đây
            </div>
          </div>

          {/* Ticket Selection */}
          <div id="ticket-selection">
            {isTicketsLoading ? (
              <div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
            ) : (
              <TicketSelector 
                ticketTypes={ticketTypesData?.data || []} 
                eventId={event.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
