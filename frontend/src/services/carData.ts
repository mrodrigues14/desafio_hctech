// Dados estáticos de marcas de carros populares no Brasil
export const CAR_BRANDS = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Citroën',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Kia',
  'Land Rover',
  'Mercedes-Benz',
  'Mitsubishi',
  'Nissan',
  'Peugeot',
  'Renault',
  'Subaru',
  'Toyota',
  'Volkswagen',
  'Volvo'
];

// Cores mais comuns para carros
export const CAR_COLORS = [
  'Amarelo',
  'Azul',
  'Bege',
  'Branco',
  'Cinza',
  'Dourado',
  'Laranja',
  'Marrom',
  'Prata',
  'Preto',
  'Rosa',
  'Roxo',
  'Verde',
  'Vermelho',
  'Vinho'
];

// Função para buscar marcas (pode ser expandida para usar API externa)
export async function getCarBrands(): Promise<string[]> {
  try {
    // Aqui você pode integrar com uma API externa como:
    // - FIPE API
    // - Webmotors API
    // - Parallelum BR API
    
    // Por enquanto, retorna dados estáticos
    return new Promise((resolve) => {
      setTimeout(() => resolve(CAR_BRANDS), 100);
    });
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    return CAR_BRANDS;
  }
}

// Função para buscar cores
export async function getCarColors(): Promise<string[]> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => resolve(CAR_COLORS), 100);
    });
  } catch (error) {
    console.error('Erro ao buscar cores:', error);
    return CAR_COLORS;
  }
}

// Função para buscar modelos por marca (pode ser implementada no futuro)
export async function getCarModelsByBrand(brand: string): Promise<string[]> {
  // Dados mockados - pode ser integrado com API externa
  const modelsByBrand: Record<string, string[]> = {
    'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Fit', 'City'],
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Prius', 'Etios'],
    'Ford': ['Focus', 'Fiesta', 'EcoSport', 'Ka', 'Fusion', 'Edge'],
    'Volkswagen': ['Golf', 'Jetta', 'Passat', 'Polo', 'Tiguan', 'Amarok'],
    'Chevrolet': ['Onix', 'Cruze', 'Tracker', 'S10', 'Camaro', 'Equinox'],
    'Fiat': ['Uno', 'Palio', 'Strada', 'Toro', 'Argo', 'Cronos'],
    'BMW': ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5'],
    'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    'Mercedes-Benz': ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC', 'GLE']
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(modelsByBrand[brand] || []);
    }, 100);
  });
}
