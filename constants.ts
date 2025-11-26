import { Product } from './types';

const PRODUCT_TEMPLATES = [
  {
    title: "Salsa Habanero",
    description: "Artesanal - Una mezcla ardiente y sabrosa de habanero. Perfecta para dar un toque picante a cualquier plato.",
    imageUrl: "https://images.unsplash.com/photo-1574885014166-70f90e0c3a64?q=80&w=500&auto=format&fit=crop",
    category: "Salsas",
    basePrice: 12
  },
  {
    title: "Salsa Macha",
    description: "Artesanal - Salsa rica en aceite con chiles secos y semillas. Compleja, con nueces y profundamente picante.",
    imageUrl: "https://images.unsplash.com/photo-1623065620822-7994432c69d8?auto=format&fit=crop&q=80&w=500",
    category: "Salsas",
    basePrice: 15
  },
  {
    title: "Pastor",
    description: "Artesanal - Adobo auténtico para el clásico Al Pastor. Una mezcla sabrosa de chiles y especias.",
    imageUrl: "https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&q=80&w=500",
    category: "Adobos",
    basePrice: 14
  },
  {
    title: "Adobo",
    description: "Artesanal - Pasta de adobo tradicional mexicana. Profunda, ahumada y perfecta para carnes cocinadas a fuego lento.",
    imageUrl: "https://images.unsplash.com/photo-1623592676837-56e63286348c?q=80&w=500&auto=format&fit=crop",
    category: "Adobos",
    basePrice: 14
  },
  {
    title: "Salsa de Tomatillo Verde",
    description: "Artesanal - Salsa verde fresca y picante hecha de tomatillos. Perfil de sabor cítrico y brillante.",
    imageUrl: "https://images.unsplash.com/photo-1597405230985-7967b5c87900?auto=format&fit=crop&q=80&w=500",
    category: "Salsas",
    basePrice: 12
  },
  {
    title: "Base para Barbacoa",
    description: "Artesanal - La base de condimentos esencial para la auténtica Barbacoa cocinada a fuego lento.",
    imageUrl: "https://images.unsplash.com/photo-1606756623668-2a0334812f86?auto=format&fit=crop&q=80&w=500",
    category: "Condimentos",
    basePrice: 16
  }
];

// Generate 36 diverse items based on the templates
export const INITIAL_PRODUCTS: Product[] = Array.from({ length: 36 }).map((_, i) => {
  const template = PRODUCT_TEMPLATES[i % PRODUCT_TEMPLATES.length];
  const variation = Math.floor(i / PRODUCT_TEMPLATES.length) + 1;
  
  return {
    id: `prod-${i}`,
    title: template.title,
    description: `${template.description} (Lote #${variation})`,
    price: template.basePrice + (i % 5), // Slight price variation
    imageUrl: template.imageUrl,
    category: template.category,
    tags: i % 3 === 0 ? ["Más Vendido"] : i % 5 === 0 ? ["Novedad"] : ["Artesanal"]
  };
});

export const DEFAULT_THEME = {
  columnCount: 4,
  gap: 4,
  primaryColor: '#6366f1',
  titleFont: 'sans' as const,
};