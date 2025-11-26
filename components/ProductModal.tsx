import React, { useState, useEffect } from 'react';
import { Product, AIState } from '../types';
import { X, Sparkles, Tag, ShoppingCart, Edit2, Save, RotateCcw, ZoomIn, Maximize2 } from 'lucide-react';
import { enhanceProductDescription, suggestPrice } from '../services/geminiService';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

// Helper to convert Google Drive links to direct image links
const processImageUrl = (url: string) => {
  if (!url) return '';
  // Check if it's a Google Drive link
  if (url.includes('drive.google.com')) {
    // Try to extract the file ID
    const idMatch = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }
  return url;
};

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onUpdate }) => {
  const [aiState, setAiState] = useState<AIState>({ isGenerating: false, error: null });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Product>(product);
  
  // Zoom State
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset form data when product changes
  useEffect(() => {
    setFormData(product);
  }, [product]);

  if (!isOpen) return null;

  const handleEnhanceDescription = async () => {
    setAiState({ isGenerating: true, error: null });
    try {
      const baseDesc = isEditing ? formData.description : product.description;
      const baseTitle = isEditing ? formData.title : product.title;
      
      const newDesc = await enhanceProductDescription(baseTitle, baseDesc);
      
      if (isEditing) {
        setFormData(prev => ({ ...prev, description: newDesc }));
      } else {
        onUpdate({ ...product, description: newDesc });
      }
    } catch (err) {
      setAiState({ isGenerating: false, error: "Error al generar descripción" });
    } finally {
      setAiState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleSuggestPrice = async () => {
    setAiState({ isGenerating: true, error: null });
    try {
      const baseDesc = isEditing ? formData.description : product.description;
      const baseTitle = isEditing ? formData.title : product.title;

      const newPrice = await suggestPrice(baseTitle, baseDesc);
      
      if (isEditing) {
        setFormData(prev => ({ ...prev, price: newPrice }));
      } else {
        onUpdate({ ...product, price: newPrice });
      }
    } catch (err) {
      setAiState({ isGenerating: false, error: "Error al sugerir precio" });
    } finally {
      setAiState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleSave = () => {
    const processedData = {
        ...formData,
        imageUrl: processImageUrl(formData.imageUrl)
    };
    onUpdate(processedData);
    setFormData(processedData); 
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(product);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditing) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierPos({ x, y });
  };

  const currentImageUrl = processImageUrl(isEditing ? formData.imageUrl : product.imageUrl);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row border border-white/10 animate-[fadeIn_0.2s_ease-out]">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Edit Controls (Top Left) */}
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-primary hover:text-white transition-colors"
              title="Editar Producto"
            >
              <Edit2 size={18} />
            </button>
          ) : (
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button 
                onClick={handleSave}
                className="p-2 bg-green-600 rounded-full text-white hover:bg-green-700 transition-colors shadow-lg"
                title="Guardar Cambios"
              >
                <Save size={18} />
              </button>
              <button 
                onClick={handleCancel}
                className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                title="Cancelar"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          )}

          {/* Image Section */}
          <div 
            className="w-full md:w-1/2 relative h-64 md:h-auto group bg-black/20 overflow-hidden cursor-crosshair"
            onMouseEnter={() => !isEditing && setShowMagnifier(true)}
            onMouseLeave={() => setShowMagnifier(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Main Image */}
            <img 
              src={currentImageUrl} 
              alt={product.title} 
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                isEditing ? 'opacity-50' : (showMagnifier ? 'opacity-0' : 'opacity-100')
              }`}
            />
            
            {/* Magnified View */}
            {showMagnifier && !isEditing && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${currentImageUrl})`,
                  backgroundPosition: `${magnifierPos.x}% ${magnifierPos.y}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}
            
            {/* Edit Mode Overlay */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-full max-w-xs space-y-2 pointer-events-auto cursor-default">
                  <label className="text-xs font-bold uppercase text-white/80 tracking-wider shadow-sm">URL de Imagen</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full bg-black/80 border border-white/30 text-white p-3 rounded-lg text-sm focus:outline-none focus:border-primary backdrop-blur-md"
                    placeholder="Pega el enlace de la imagen..."
                  />
                  <p className="text-[10px] text-gray-400 text-center">Soporta enlaces de Google Drive</p>
                </div>
              </div>
            )}

            {!isEditing && (
              <>
                <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur text-xs font-medium text-white rounded-full uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Zoom Icon Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 pointer-events-auto"
                  title="Pantalla Completa"
                >
                  <Maximize2 size={18} />
                </button>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <div className="mb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nombre del Producto</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xl font-bold text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Precio ($)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-32 bg-white/5 border border-white/10 rounded-lg p-2 text-lg font-bold text-primary focus:outline-none focus:border-primary"
                      />
                      <button 
                        onClick={handleSuggestPrice}
                        disabled={aiState.isGenerating}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center gap-1 text-gray-400"
                        title="Sugerir Precio con IA"
                      >
                        <Tag size={14} className={aiState.isGenerating ? 'animate-pulse' : ''} />
                        Sugerir
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-2">{product.title}</h2>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-xl font-bold">${product.price}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mb-8 flex-grow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">Descripción</h3>
                <button 
                  onClick={handleEnhanceDescription}
                  disabled={aiState.isGenerating}
                  className="flex items-center gap-1 text-xs text-secondary hover:text-white transition-colors"
                >
                  <Sparkles size={12} />
                  {aiState.isGenerating ? 'Generando...' : 'Mejorar con IA'}
                </button>
              </div>
              
              {isEditing ? (
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 leading-relaxed focus:outline-none focus:border-primary resize-none"
                />
              ) : (
                <p className="text-gray-300 leading-relaxed text-lg">
                  {product.description}
                </p>
              )}
              
              {aiState.error && (
                <p className="text-red-400 text-xs mt-2">{aiState.error}</p>
              )}
            </div>

            <div className="mt-auto space-y-4">
              {!isEditing && (
                <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                  <ShoppingCart size={20} />
                  Agregar al Carrito
                </button>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                  <span className="block text-xs text-gray-500 uppercase">Categoría</span>
                  <span className="font-medium text-white">{product.category}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                  <span className="block text-xs text-gray-500 uppercase">Stock</span>
                  <span className="font-medium text-green-400">Disponible</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={32} />
          </button>
          <img 
            src={currentImageUrl} 
            alt={product.title}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
          />
        </div>
      )}
    </>
  );
};