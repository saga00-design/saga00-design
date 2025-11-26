import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_PRODUCTS, DEFAULT_THEME } from './constants';
import { Product, ThemeConfig } from './types';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { Settings, Sliders, ChevronDown, Wand2, Grid, LayoutTemplate, PlusCircle } from 'lucide-react';

const App = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize to adjust columns automatically on smaller screens
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine effective column count based on screen size
  const effectiveColumns = useMemo(() => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    if (windowWidth < 1440) return Math.min(3, theme.columnCount);
    return theme.columnCount;
  }, [windowWidth, theme.columnCount]);

  // Split products into columns for independent scrolling visual
  const productColumns = useMemo(() => {
    const cols: Product[][] = Array.from({ length: effectiveColumns }, () => []);
    products.forEach((product, index) => {
      cols[index % effectiveColumns].push(product);
    });
    return cols;
  }, [products, effectiveColumns]);

  const handleProductUpdate = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedProduct(updated);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto...",
      price: 0,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500", // Default placeholder
      category: "General",
      tags: ["Nuevo"]
    };
    setProducts([newProduct, ...products]);
    setSelectedProduct(newProduct);
    setSidebarOpen(false);
  };

  return (
    <div className={`h-screen w-screen flex flex-col bg-dark overflow-hidden ${theme.titleFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
      
      {/* Header / Hero */}
      <header className="flex-none z-40 bg-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
               <LayoutTemplate className="text-white" size={24} />
             </div>
             <div>
               <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                 Pepe Comala
               </h1>
               <p className="text-xs text-gray-400">Colección Selecta</p>
             </div>
          </div>
          
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-gray-300"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content - Independent Scroll Columns */}
      <main className="flex-grow flex overflow-hidden relative">
        <div className="w-full h-full flex px-4 pb-4 pt-2 gap-4">
           {productColumns.map((colProducts, colIndex) => (
             <div 
                key={colIndex} 
                className="flex-1 h-full overflow-y-auto no-scrollbar pt-2 pb-20 space-y-4 min-w-[300px] snap-y snap-proximity"
                style={{
                  transitionDelay: `${colIndex * 100}ms`
                }}
             >
               {colProducts.map((product) => (
                 <div key={product.id} className="snap-start">
                   <ProductCard 
                     product={product} 
                     onClick={setSelectedProduct}
                     fontClass={theme.titleFont === 'serif' ? 'font-serif' : 'font-sans'}
                   />
                 </div>
               ))}
               
               {/* Decorative footer for each column */}
               <div className="h-24 flex items-center justify-center opacity-20">
                 <div className="w-1 h-12 bg-gradient-to-b from-gray-500 to-transparent rounded-full" />
               </div>
             </div>
           ))}
        </div>

        {/* Customization Sidebar */}
        <div className={`
          absolute top-0 right-0 h-full w-80 bg-gray-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders size={20} /> Personalizar
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <ChevronDown className="rotate-[-90deg]" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Add Product Button */}
              <div>
                 <label className="block text-sm font-medium text-gray-400 mb-3">Acciones</label>
                 <button 
                   onClick={handleAddProduct}
                   className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                 >
                   <PlusCircle size={18} className="text-primary" />
                   Agregar Producto
                 </button>
              </div>

              {/* Column Control */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Grid size={16} /> Columnas ({theme.columnCount})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setTheme({ ...theme, columnCount: num })}
                      className={`
                        py-2 rounded-md font-medium text-sm transition-all
                        ${theme.columnCount === num 
                          ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                      `}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Ajusta la densidad del diseño.</p>
              </div>

              {/* Typography */}
              <div>
                 <label className="block text-sm font-medium text-gray-400 mb-3">Tipografía</label>
                 <div className="flex bg-white/5 p-1 rounded-lg">
                   <button 
                     onClick={() => setTheme({...theme, titleFont: 'sans'})}
                     className={`flex-1 py-2 rounded-md text-sm ${theme.titleFont === 'sans' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                   >
                     Moderno
                   </button>
                   <button 
                     onClick={() => setTheme({...theme, titleFont: 'serif'})}
                     className={`flex-1 py-2 rounded-md text-sm font-serif ${theme.titleFont === 'serif' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                   >
                     Clásico
                   </button>
                 </div>
              </div>

              {/* Regenerate All Button (Mock AI Action) */}
              <div className="pt-6 border-t border-white/10">
                <button 
                  className="w-full py-3 bg-gradient-to-r from-secondary to-primary rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  onClick={() => {
                    // Simple shuffle for demo effect
                    const shuffled = [...products].sort(() => 0.5 - Math.random());
                    setProducts(shuffled);
                  }}
                >
                  <Wand2 size={18} />
                  Mezclar Diseño
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">Aleatoriza la ubicación del contenido.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
};

export default App;