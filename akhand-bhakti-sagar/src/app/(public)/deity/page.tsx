import type { Metadata } from 'next';
import DeityCard from '@/components/public/DeityCard';
import { getAllDeities } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'देवी-देवता',
  description: 'सभी देवी-देवताओं के भजन, आरती, चालीसा और स्तोत्र। भगवान की भक्ति में जुड़ें।',
};

export const revalidate = 3600;

export default async function DeitiesPage() {
  const deities = await getAllDeities();

  return (
    <div style={{ background: 'var(--color-bg-primary)', minHeight: '80vh' }}>
      {/* Header */}
      <div
        className="py-12 px-4 sm:px-6 lg:px-8 text-center"
        style={{ background: 'linear-gradient(135deg, #2D0A0A 0%, #7B1B1B 60%, #E85D04 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🕉</div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700' }}
          >
            देवी-देवता
          </h1>
          <p
            className="text-base"
            style={{ fontFamily: 'var(--font-devanagari)', color: 'rgba(255,220,176,0.8)' }}
          >
            हिंदू देवी-देवताओं के भजन, आरती, चालीसा और स्तोत्र पढ़ें
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {deities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {deities.map((deity) => (
              <DeityCard key={deity.id} deity={deity} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">🕉</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}
            >
              अभी कोई देवता उपलब्ध नहीं
            </h2>
            <p style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-muted)' }}>
              जल्द ही देवताओं की जानकारी जोड़ी जाएगी।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
