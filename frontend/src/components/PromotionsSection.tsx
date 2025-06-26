'use client';

import { Button } from '@/components/ui/Button';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  discount?: string;
}

const promotions: Promotion[] = [
  {
    id: 'summer',
    title: 'Evento de Poupança de Verão',
    description: 'Ofertas incríveis acabaram em modelos selecionados durante o nosso Evento de Poupança de Verão.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ctaText: 'Ver Ofertas',
    discount: 'Até 15% OFF',
  },
  {
    id: 'financing',
    title: 'Especiais de Financiamento',
    description: 'Aproveite as nossas taxas especiais de financiamento com taxas de APR baixas.',
    image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ctaText: 'Saiba Mais',
    discount: '2.9% APR',
  },
  {
    id: 'exchange',
    title: 'Bônus de Troca',
    description: 'Obtenha valor extra pelo seu veículo de troca quando atualizar para um carro novo.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ctaText: 'Avaliar Troca',
    discount: 'Até R$ 5.000',
  },
];

export function PromotionsSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Promoções Atuais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <div
            key={promotion.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={promotion.image}
                alt={promotion.title}
                className="w-full h-full object-cover"
              />
              {promotion.discount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {promotion.discount}
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {promotion.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {promotion.description}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                {promotion.ctaText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
