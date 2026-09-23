import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useEvents, useCategories } from '../../hooks/useEvents';
import { EventCard } from '../../../shared/components/EventCard';
import { Button } from '../../../shared/components/Button';

export const EventList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get('search') || searchParams.get('keyword') || '';
  const categoryIdParam = searchParams.get('categoryId') || undefined;

  const [search, setSearch] = useState(searchParam);
  const [categoryId, setCategoryId] = useState<string | undefined>(categoryIdParam);
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useCategories();

  const { data: eventsData, isLoading } = useEvents({
    search: searchParam,
    categoryId: categoryIdParam,
    page,
    pageSize: 12,
  });

  // Sync state with URL params when they change externally
  useEffect(() => {
    setSearch(searchParams.get('search') || searchParams.get('keyword') || '');
    setCategoryId(searchParams.get('categoryId') || undefined);
    setPage(1);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.delete('keyword');

    if (categoryId) params.set('categoryId', categoryId);
    else params.delete('categoryId');

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryId(undefined);
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-16">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Bộ lọc
            </h3>
            {(searchParam || categoryIdParam) && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
                Xóa lọc
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tên sự kiện..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cat-all"
                    name="category"
                    checked={!categoryId}
                    onChange={() => setCategoryId(undefined)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="cat-all" className="ml-2 text-sm text-gray-700">Tất cả</label>
                </div>
                {categoriesData?.data?.map(cat => (
                  <div key={cat.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`cat-${cat.id}`}
                      name="category"
                      checked={categoryId === String(cat.id)}
                      onChange={() => setCategoryId(String(cat.id))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={`cat-${cat.id}`} className="ml-2 text-sm text-gray-700">{cat.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">Áp dụng</Button>
          </form>
        </div>
      </div>

      {/* Event Grid */}
      <div className="flex-1">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {searchParam ? `Kết quả tìm kiếm cho "${searchParam}"` : 'Tất cả sự kiện'}
          </h1>
          {!isLoading && eventsData?.data && (
            <span className="text-sm text-gray-500 mt-2 sm:mt-0">
              Tìm thấy {eventsData.data.totalItems} sự kiện
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />)}
          </div>
        ) : eventsData?.data?.items && eventsData.data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsData.data.items.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {eventsData.data.totalPages > 1 && (
              <div className="mt-12 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Trước
                </Button>
                {[...Array(eventsData.data.totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? 'primary' : 'outline'}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={page === eventsData.data.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sự kiện nào</h3>
            <p className="text-gray-500">Hãy thử thay đổi điều kiện tìm kiếm của bạn.</p>
            {(searchParam || categoryIdParam) && (
              <Button onClick={clearFilters} variant="outline" className="mt-6">
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
