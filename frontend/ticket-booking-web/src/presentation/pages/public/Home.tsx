import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Flame, Clock, Music, MonitorPlay, Dumbbell, MapPin, ChevronDown } from 'lucide-react';
import { useFeaturedEvents, useUpcomingEvents, useCategories } from '../../hooks/useEvents';
import { EventCard } from '../../../shared/components/EventCard';
import { Button } from '../../../shared/components/Button';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<{ id: string; name: string } | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  
  const { data: featuredData, isLoading: isFeaturedLoading } = useFeaturedEvents(6);
  const { data: upcomingData, isLoading: isUpcomingLoading } = useUpcomingEvents(6);
  const { data: categoriesData } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory) params.set('categoryId', selectedCategory.id);
    navigate(`/events?${params.toString()}`);
  };

  // Mock category icons based on name
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('âm nhạc') || n.includes('music')) return <Music className="w-6 h-6" />;
    if (n.includes('thể thao') || n.includes('sport')) return <Dumbbell className="w-6 h-6" />;
    return <MonitorPlay className="w-6 h-6" />;
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-slate-900 rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/90 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Khám phá Sự kiện <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Đỉnh Cao</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
            Đặt vé tham gia các buổi hòa nhạc, hội thảo, và giải đấu thể thao hot nhất ngay hôm nay.
          </p>
          
          {/* Advanced Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2">
              
              {/* Keyword / Location input */}
              <div className="flex-1 flex items-center pl-3 border border-gray-200 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Tên sự kiện hoặc địa điểm..." 
                  className="w-full py-3 px-3 outline-none text-gray-700 bg-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 px-2">✕</button>
                )}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px bg-gray-200 my-1" />

              {/* Category Dropdown */}
              <div className="relative flex-shrink-0 min-w-[180px]">
                <button
                  type="button"
                  className="w-full h-full flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-blue-300 transition-colors bg-white"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-left truncate">
                    {selectedCategory ? selectedCategory.name : 'Tất cả danh mục'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1 max-h-56 overflow-y-auto">
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${!selectedCategory ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => { setSelectedCategory(null); setIsCategoryOpen(false); }}
                    >
                      Tất cả danh mục
                    </button>
                    {categoriesData?.data?.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory?.id === cat.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="rounded-xl px-8 shadow-md hover:shadow-lg flex-shrink-0">
                Tìm kiếm
              </Button>
            </div>

            {/* Active filters */}
            {(searchQuery || selectedCategory) && (
              <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                    <Search className="w-3 h-3" /> {searchQuery}
                    <button type="button" className="ml-1 hover:text-red-300" onClick={() => setSearchQuery('')}>✕</button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                    <MapPin className="w-3 h-3" /> {selectedCategory.name}
                    <button type="button" className="ml-1 hover:text-red-300" onClick={() => setSelectedCategory(null)}>✕</button>
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Danh mục nổi bật</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesData?.data?.map((category) => (
            <Link 
              key={category.id} 
              to={`/events?categoryId=${category.id}`}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getCategoryIcon(category.name)}
              </div>
              <h3 className="font-semibold text-gray-900 text-center">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sự kiện nổi bật</h2>
          </div>
          <Link to="/events" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            Xem tất cả <span className="ml-1">&rarr;</span>
          </Link>
        </div>
        
        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />)}
          </div>
        ) : featuredData?.data && featuredData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData.data.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
            Không có sự kiện nổi bật nào
          </div>
        )}
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sắp diễn ra</h2>
          </div>
          <Link to="/events?sort=date" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            Xem tất cả <span className="ml-1">&rarr;</span>
          </Link>
        </div>
        
        {isUpcomingLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />)}
          </div>
        ) : upcomingData?.data && upcomingData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingData.data.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
            Không có sự kiện sắp diễn ra
          </div>
        )}
      </section>
    </div>
  );
};

