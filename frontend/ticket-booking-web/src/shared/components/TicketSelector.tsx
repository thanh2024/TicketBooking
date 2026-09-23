import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Ticket } from 'lucide-react';
import type { TicketType } from '../../domain/entities/TicketType';
import { Button } from './Button';
import { useAuth } from '../../presentation/hooks/useAuth';

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  eventId: string;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({ ticketTypes, eventId }) => {
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleIncrement = (id: string | number, max: number) => {
    const key = String(id);
    setSelectedTickets((prev) => {
      const current = prev[key] || 0;
      if (current >= max || current >= 10) return prev; // limit max 10 per type
      return { ...prev, [key]: current + 1 };
    });
  };

  const handleDecrement = (id: string | number) => {
    const key = String(id);
    setSelectedTickets((prev) => {
      const current = prev[key] || 0;
      if (current <= 0) return prev;
      const newState = { ...prev, [key]: current - 1 };
      if (newState[key] === 0) delete newState[key];
      return newState;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    let count = 0;
    ticketTypes.forEach((ticket) => {
      const quantity = selectedTickets[String(ticket.id)] || 0;
      total += ticket.price * quantity;
      count += quantity;
    });
    return { total, count };
  };

  const { total, count } = calculateTotal();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${eventId}` } });
      return;
    }

    const items = Object.entries(selectedTickets).map(([ticketTypeId, quantity]) => {
      const ticketType = ticketTypes.find(t => String(t.id) === String(ticketTypeId));
      return {
        ticketTypeId,
        quantity,
        ticketTypeName: ticketType?.name || `Vé ${ticketType ? ticketType.name : ticketTypeId}`,
        price: ticketType?.price || 0,
      };
    });

    navigate('/checkout', { state: { items, eventId } });
  };

  if (ticketTypes.length === 0) {
    return <div className="text-gray-500 py-4">Hiện chưa có loại vé nào được mở bán.</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Ticket className="w-5 h-5 mr-2 text-blue-600" /> Chọn vé
        </h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {ticketTypes.map((ticket) => {
          const available = ticket.totalQuantity - ticket.soldQuantity;
          const isSoldOut = available <= 0;
          const quantity = selectedTickets[ticket.id] || 0;

          return (
            <div key={ticket.id} className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between ${isSoldOut ? 'opacity-60' : ''}`}>
              <div className="mb-4 sm:mb-0">
                <h4 className="font-semibold text-gray-900 text-lg">{ticket.name}</h4>
                {ticket.description && <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>}
                <div className="text-blue-600 font-bold mt-2 text-xl">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticket.price)}
                </div>
              </div>

              <div className="flex flex-col items-end">
                {isSoldOut ? (
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium text-sm">Hết vé</span>
                ) : (
                  <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <button
                      onClick={() => handleDecrement(ticket.id)}
                      disabled={quantity === 0}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => handleIncrement(ticket.id, available)}
                      disabled={quantity >= available || quantity >= 10}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {!isSoldOut && <span className="text-xs text-gray-500 mt-2">Còn {available} vé</span>}
              </div>
            </div>
          );
        })}
      </div>

      {count > 0 && (
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between sticky bottom-0 z-10">
          <div className="mb-4 sm:mb-0">
            <span className="text-slate-400 block text-sm">Tổng cộng ({count} vé)</span>
            <span className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
            </span>
          </div>
          <Button onClick={handleCheckout} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white border-none">
            Tiến hành thanh toán
          </Button>
        </div>
      )}
    </div>
  );
};
