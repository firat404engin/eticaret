// Bu component artık kullanılmıyor. Tüm ürün sayfası kodları app/products/page.js altında yönetiliyor.
const Products = ({ initialProducts = [] }) => {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('popular');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Tüm Ürünler', icon: <FaLayerGroup /> },
    { id: 'web', name: 'Web Uygulamaları', icon: <FaLaptopCode /> },
    { id: 'mobile', name: 'Mobil Uygulamalar', icon: <FaMobileAlt /> },
    { id: 'desktop', name: 'Masaüstü Yazılımlar', icon: <FaServer /> },
    { id: 'api', name: 'API Servisleri', icon: <FaCode /> },
  ];
  
  const sortOptions = [
    { id: 'popular', name: 'Popülerlik', icon: <FaStar /> },
    { id: 'price-asc', name: 'Fiyat: Düşükten Yükseğe', icon: <FaSort /> },
    { id: 'price-desc', name: 'Fiyat: Yüksekten Düşüğe', icon: <FaSort /> },
    { id: 'newest', name: 'En Yeni', icon: <FaArrowRight /> },
  ];

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        console.log('Ürünler Supabase\'den getiriliyor...');
        
        let query = supabase.from('products').select('*');
        
        // Kategori filtresi uygula
        if (activeFilter !== 'all') {
          query = query.eq('category', activeFilter);
        }
        
        // Sıralama seçeneği uygula
        switch (activeSort) {
          case 'popular':
            query = query.order('popular', { ascending: false });
            break;
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('popular', { ascending: false });
        }
        
        const { data, error: supabaseError } = await query;
        
        console.log('Supabase cevabı:', { data, error: supabaseError });
        
        if (supabaseError) {
          throw new Error(supabaseError.message || 'Ürünler alınırken bir hata oluştu');
        }
        
        if (isMounted) {
          console.log('Ürün sayısı:', data ? data.length : 0);
          setProducts(data || []);
          setError(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        if (isMounted) {
          setError(error.message || 'Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
          setIsLoading(false);
        }
      }
    };

    if (initialProducts.length === 0) {
      fetchProducts();
    }
    
    return () => {
      isMounted = false;
    };
  }, [activeFilter, activeSort]);

  // Arama filtreleme işlevi
  const filteredProducts = searchTerm.trim() 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 transition-colors">
      {/* Hero Section - Modern Tasarım */}
      <section className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-purple-900 overflow-hidden">
        {/* Arka plan desenleri */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          
          {/* Animasyonlu grid deseni */}
          <div className="absolute inset-0 bg-[url('https://cdn.jsdelivr.net/gh/htmlstrap/assets@main/grid.svg')] bg-center opacity-[0.07]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-1.5 bg-white dark:bg-gray-800 text-indigo-200 dark:text-indigo-400 rounded-full text-sm font-medium backdrop-blur-sm border border-white dark:border-gray-700">
              Yazılım Çözümleri Kataloğu
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-gray-200 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Yazılım Çözümlerimiz
              </span>
            </h1>
            <p className="text-gray-200 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              İşletmeniz için özel olarak tasarlanmış yazılım çözümlerimizi keşfedin. 
              Yenilikçi, ölçeklenebilir ve güvenli uygulamalarımızla dijital dönüşümünüze katkıda bulunuyoruz.
            </p>
            
            {/* Arama kutusu */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Yazılım çözümü arayın..." 
                  className="w-full py-4 px-6 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl backdrop-blur-md text-white dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500/50 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Dalgalı alt kenar */}
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L80,144C160,160,320,192,480,186.7C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full dark:block hidden">
            <path fill="#111827" fillOpacity="1" d="M0,128L80,144C160,160,320,192,480,186.7C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Mobil Filtreler Butonu */}
        <div className="md:hidden mb-6">
          <button 
            className="w-full py-4 px-5 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-xl flex items-center justify-center font-medium text-gray-700 dark:text-gray-300 transition-all border border-gray-100 dark:border-gray-700"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          >
            <FaSlidersH className="mr-2" />
            Filtreler ve Sıralama
            <FaChevronDown className={`ml-2 transition-transform ${showFiltersMobile ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtreler */}
          <div className={`md:w-1/4 md:block ${showFiltersMobile ? 'block' : 'hidden'}`}>
            <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Kategoriler */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-4">
                  <FaFilter className="mr-2 text-blue-600 dark:text-blue-400" />
                  Kategoriler
                </h3>
                
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all flex items-center ${
                        activeFilter === category.id 
                          ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setActiveFilter(category.id)}
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-md mr-3 ${
                        activeFilter === category.id 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {category.icon}
                      </span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sıralama */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-4">
                  <FaSort className="mr-2 text-blue-600 dark:text-blue-400" />
                  Sıralama
                </h3>
                
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all flex items-center ${
                        activeSort === option.id 
                          ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setActiveSort(option.id)}
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-md mr-3 ${
                        activeSort === option.id 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {option.icon}
                      </span>
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Ürün Listesi */}
          <div className="md:w-3/4">
            {/* Özet Bilgisi */}
            <div className="flex flex-wrap items-center justify-between mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <div className="mb-2 md:mb-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm 
                    ? `"${searchTerm}" için ${filteredProducts.length} sonuç bulundu` 
                    : `${products.length} ürün listeleniyor`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">Görünüm:</span>
                <button className="p-2 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FaThLarge size={14} />
                </button>
                <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  <FaThList size={14} />
                </button>
              </div>
            </div>
            
            {/* Yükleme, Hata ve Boş Durumlar */}
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Ürünler Yükleniyor</h3>
                <p className="text-gray-500 dark:text-gray-400">Lütfen bekleyin, ürünlerimiz hazırlanıyor...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-200">Ürünlerimiz</h3>
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Yükleme Hatası</h3>
                <p className="text-red-700 dark:text-red-400 mb-6">{error}</p>
                <button 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center"
                  onClick={() => window.location.reload()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Yeniden Dene
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <FaRegLightbulb className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-200">Ürünlerimiz</h3>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {searchTerm ? 'Arama sonucu bulunamadı' : 'Bu kategoride henüz ürün bulunmamaktadır'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm 
                    ? 'Farklı anahtar kelimelerle aramayı deneyin veya filtreleri değiştirin.' 
                    : 'Lütfen başka bir kategori seçin veya daha sonra tekrar kontrol edin.'}
                </p>
                {searchTerm && (
                  <button 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    onClick={() => setSearchTerm('')}
                  >
                    Aramayı Temizle
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Sayfalama */}
                {filteredProducts.length > 0 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button 
                        className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        disabled
                      >
                        Önceki
                      </button>
                      
                      <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                      <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">2</button>
                      <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">3</button>
                      
                      <span className="text-gray-500 dark:text-gray-400">...</span>
                      
                      <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">12</button>
                      
                      <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        Sonraki
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* JavaScript tarafında yürütülebilecek animasyonlar için stil tanımlamaları */}
      <style jsx>{`
        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Products;