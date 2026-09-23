import React from 'react';
import { useMyTickets } from '../../hooks/useTickets';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket as TicketIcon, CheckCircle, XCircle } from 'lucide-react';
import { TicketStatus } from '../../../domain/enums/TicketStatus';

export const MyTickets: React.FC = () => {
  const { data: ticketsData, isLoading } = useMyTickets();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />)}
      </div>
    );
  }

  const tickets = ticketsData?.data || [];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Vé điện tử của tôi</h1>
      
      {tickets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Bạn chưa có vé nào</h2>
          <p className="text-gray-500">Hãy tìm kiếm sự kiện và đặt vé ngay!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tickets.map(ticket => {
            const isValid = ticket.status === TicketStatus.VALID;
            const isUsed = ticket.status === TicketStatus.USED;
            
            return (
              <div key={ticket.id} className={`flex flex-col sm:flex-row bg-white rounded-2xl shadow-md border ${isValid ? 'border-blue-100' : 'border-gray-200 opacity-75'} overflow-hidden`}>
                {/* QR Code Section */}
                <div className={`p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-dashed border-gray-300 ${isValid ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="bg-white p-2 rounded-xl shadow-sm mb-3">
                    {isValid ? (
                      <QRCodeSVG value={ticket.qrCode || ticket.ticketCode} size={120} />
                    ) : (
                      <div className="w-[120px] h-[120px] bg-gray-200 flex items-center justify-center rounded text-gray-400">
                        {isUsed ? <CheckCircle className="w-12 h-12 text-green-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-sm tracking-widest text-gray-600 bg-white px-3 py-1 rounded-md border border-gray-200">
                    {ticket.ticketCode}
                  </span>
                </div>
                
                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight pr-4">
                      {ticket.eventTitle || 'Sự kiện không xác định'}
                    </h3>
                    {isValid ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold whitespace-nowrap">HỢP LỆ</span>
                    ) : isUsed ? (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold whitespace-nowrap">ĐÃ DÙNG</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold whitespace-nowrap">HỦY</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    <p className="text-sm font-medium text-blue-600">{ticket.ticketTypeName}</p>
                    {ticket.holderName && (
                      <p className="text-sm text-gray-600"><span className="text-gray-400">Người giữ vé:</span> {ticket.holderName}</p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <span className="text-xs text-gray-400">Ngày mua: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
