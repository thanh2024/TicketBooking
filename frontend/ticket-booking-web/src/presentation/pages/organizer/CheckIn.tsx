import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  ScanLine, CheckCircle2, XCircle, AlertCircle,
  Ticket, User, Mail, Calendar, Clock, Hash, Loader2, RotateCcw
} from 'lucide-react';
import { OrganizerPortalRepository } from '../../../infrastructure/repositories/OrganizerPortalRepository';

type ScanResult = {
  isSuccess: boolean;
  message: string;
  ticketCode: string;
  eventTitle: string;
  ticketTypeName: string;
  holderName: string;
  holderEmail: string;
  ticketStatus: string;
  checkedInAt?: string;
  scannedAt: string;
};

type HistoryEntry = {
  id: string;
  result: ScanResult;
  apiSuccess: boolean;
};

const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

export const OrganizerCheckIn: React.FC = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [lastResult, setLastResult] = useState<{ result: ScanResult; apiSuccess: boolean } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  const scanMutation = useMutation({
    mutationFn: (code: string) => OrganizerPortalRepository.scanTicket(code),
    onSuccess: (data: any, code: string) => {
      const result: ScanResult = data.data ?? {
        isSuccess: false,
        message: data.message ?? 'Lỗi không xác định',
        ticketCode: code,
        eventTitle: '',
        ticketTypeName: '',
        holderName: '',
        holderEmail: '',
        ticketStatus: '',
        scannedAt: new Date().toISOString()
      };
      const apiSuccess = data.isSuccess;

      setLastResult({ result, apiSuccess });
      setHistory(prev => [
        { id: Date.now().toString(), result, apiSuccess },
        ...prev.slice(0, 19)  // keep last 20
      ]);
      setTicketCode('');
      // Re-focus for next scan
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    onError: (err: any, code: string) => {
      const errData = err.response?.data;
      const result: ScanResult = errData?.data ?? {
        isSuccess: false,
        message: errData?.message ?? 'Kết nối thất bại',
        ticketCode: code,
        eventTitle: '',
        ticketTypeName: '',
        holderName: '',
        holderEmail: '',
        ticketStatus: '',
        scannedAt: new Date().toISOString()
      };
      setLastResult({ result, apiSuccess: false });
      setHistory(prev => [
        { id: Date.now().toString(), result, apiSuccess: false },
        ...prev.slice(0, 19)
      ]);
      setTicketCode('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = ticketCode.trim();
    if (!code || scanMutation.isPending) return;
    scanMutation.mutate(code);
  };

  const handleReset = () => {
    setLastResult(null);
    setTicketCode('');
    inputRef.current?.focus();
  };

  const ResultIcon = lastResult
    ? lastResult.apiSuccess
      ? CheckCircle2
      : lastResult.result.ticketStatus === 'USED'
        ? AlertCircle
        : XCircle
    : null;

  const resultColor = lastResult
    ? lastResult.apiSuccess
      ? { bg: 'bg-green-50 border-green-200', icon: 'text-green-500', title: 'text-green-800', badge: 'bg-green-100 text-green-700' }
      : lastResult.result.ticketStatus === 'USED'
        ? { bg: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-500', title: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-700' }
        : { bg: 'bg-red-50 border-red-200', icon: 'text-red-500', title: 'text-red-800', badge: 'bg-red-100 text-red-700' }
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ScanLine className="w-7 h-7 mr-3 text-blue-600" /> Soát Vé (Check-in)
        </h1>
        <p className="text-sm text-gray-500 mt-1">Nhập mã vé hoặc quét QR để xác nhận vào cửa</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Input + Result */}
        <div className="space-y-4">
          {/* Input form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center">
              <Hash className="w-4 h-4 mr-2 text-blue-500" /> Nhập mã vé
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={ticketCode}
                  onChange={e => setTicketCode(e.target.value)}
                  placeholder="VD: TKT-A1B2C3D4 hoặc quét QR..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl text-base font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
                  disabled={scanMutation.isPending}
                  autoComplete="off"
                />
                {ticketCode && (
                  <button
                    type="button"
                    onClick={() => setTicketCode('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!ticketCode.trim() || scanMutation.isPending}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {scanMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Đang kiểm tra...</>
                ) : (
                  <><ScanLine className="w-5 h-5" /> Xác nhận Check-in</>
                )}
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3 text-center">
              💡 Kết nối máy quét QR để quét tự động — mã sẽ tự điền vào ô trên
            </p>
          </div>

          {/* Result card */}
          {lastResult && ResultIcon && resultColor && (
            <div className={`rounded-2xl border-2 p-5 ${resultColor.bg}`}>
              <div className="flex items-start gap-4">
                <ResultIcon className={`w-10 h-10 flex-shrink-0 ${resultColor.icon}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-lg font-bold ${resultColor.title}`}>
                      {lastResult.result.message}
                    </h3>
                    <button
                      onClick={handleReset}
                      className="text-gray-400 hover:text-gray-600"
                      title="Soát vé mới"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {lastResult.result.ticketCode && (
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Ticket className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">Mã vé:</span>
                        <span className="font-mono font-bold text-gray-900">{lastResult.result.ticketCode}</span>
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${resultColor.badge}`}>
                          {lastResult.result.ticketStatus}
                        </span>
                      </div>

                      {lastResult.result.eventTitle && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">Sự kiện:</span>
                          <span className="font-semibold text-gray-900 truncate">{lastResult.result.eventTitle}</span>
                        </div>
                      )}

                      {lastResult.result.ticketTypeName && (
                        <div className="flex items-center gap-2 text-sm">
                          <Ticket className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">Loại vé:</span>
                          <span className="text-gray-900">{lastResult.result.ticketTypeName}</span>
                        </div>
                      )}

                      {lastResult.result.holderName && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">Khách hàng:</span>
                          <span className="font-semibold text-gray-900">{lastResult.result.holderName}</span>
                        </div>
                      )}

                      {lastResult.result.holderEmail && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">Email:</span>
                          <span className="text-gray-700">{lastResult.result.holderEmail}</span>
                        </div>
                      )}

                      {lastResult.result.checkedInAt && lastResult.result.ticketStatus === 'USED' && !lastResult.apiSuccess && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          <span className="text-gray-600">Đã check-in lúc:</span>
                          <span className="font-semibold text-yellow-700">{formatTime(lastResult.result.checkedInAt)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 pt-1 border-t border-black/10">
                        <Clock className="w-3 h-3" />
                        <span>Quét lúc: {formatTime(lastResult.result.scannedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Idle state */}
          {!lastResult && !scanMutation.isPending && (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
              <ScanLine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Kết quả soát vé sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>

        {/* RIGHT: Scan history */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Lịch sử soát vé
            </h2>
            {history.length > 0 && (
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  {history.filter(h => h.apiSuccess).length} thành công
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle className="w-3 h-3" />
                  {history.filter(h => !h.apiSuccess).length} lỗi
                </span>
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có vé nào được soát</p>
              </div>
            ) : (
              history.map(entry => (
                <div key={entry.id} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                  <div className={`mt-0.5 rounded-full p-1 flex-shrink-0 ${
                    entry.apiSuccess ? 'bg-green-100' : entry.result.ticketStatus === 'USED' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {entry.apiSuccess
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      : entry.result.ticketStatus === 'USED'
                        ? <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />
                        : <XCircle className="w-3.5 h-3.5 text-red-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-gray-700">{entry.result.ticketCode}</span>
                      <span className="text-xs text-gray-400">{formatTime(entry.result.scannedAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {entry.result.eventTitle
                        ? `${entry.result.eventTitle}${entry.result.ticketTypeName ? ' · ' + entry.result.ticketTypeName : ''}`
                        : entry.result.message}
                    </p>
                    {entry.result.holderName && (
                      <p className="text-xs text-gray-400 truncate">{entry.result.holderName}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats bar */}
          {history.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between text-xs text-gray-500">
              <span>Tổng: <strong className="text-gray-700">{history.length}</strong> lượt soát</span>
              <button
                onClick={() => setHistory([])}
                className="text-red-400 hover:text-red-600 font-medium"
              >
                Xóa lịch sử
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
