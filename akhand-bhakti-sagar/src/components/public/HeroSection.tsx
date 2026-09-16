import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2D0A0A 0%, #7B1B1B 35%, #E85D04 70%, #FF6B00 100%)',
        minHeight: '480px',
      }}
    >
      {/* Decorative mandala-like rings */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 rounded-full opacity-10"
        style={{
          width: '400px',
          height: '400px',
          border: '2px solid #D4AF37',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-8 -right-8 rounded-full opacity-8"
        style={{
          width: '320px',
          height: '320px',
          border: '1px solid #FFD700',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 rounded-full opacity-5"
        style={{
          width: '480px',
          height: '480px',
          border: '2px solid #D4AF37',
        }}
      />

      {/* Lotus pattern overlay (CSS only) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #FFD700 1px, transparent 1px),
                            radial-gradient(circle at 80% 20%, #FFD700 1px, transparent 1px),
                            radial-gradient(circle at 50% 50%, #FFD700 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        {/* Sanskrit greeting */}
        <p
          className="text-base sm:text-lg mb-4 tracking-widest"
          style={{
            fontFamily: 'var(--font-devanagari)',
            color: '#D4AF37',
            letterSpacing: '0.25em',
          }}
        >
          ॥ श्री हरि विष्णु सहस्रनाम ॥
        </p>

        {/* Main heading */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          style={{
            fontFamily: 'var(--font-devanagari)',
            color: '#FFFFFF',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            textWrap: 'balance',
          }}
        >
          अखंड भक्ति सागर
        </h1>

        {/* Subheading */}
        <p
          className="text-lg sm:text-xl mb-2 font-medium"
          style={{
            fontFamily: 'var(--font-devanagari)',
            color: '#FFD9A0',
            letterSpacing: '0.12em',
          }}
        >
          भजन • आरती • चालीसा • मंत्र • स्तोत्र
        </p>

        <p
          className="text-sm sm:text-base mb-10 max-w-xl mx-auto"
          style={{
            fontFamily: 'var(--font-devanagari)',
            color: 'rgba(255,220,176,0.75)',
            lineHeight: '1.8',
          }}
        >
          हिंदी भक्ति साहित्य का विशाल संग्रह — पढ़ें, गाएं और ईश्वर की भक्ति में डूब जाएं।
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/bhajan"
            className="px-8 py-3 rounded-lg font-bold text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              fontFamily: 'var(--font-devanagari)',
              background: '#D4AF37',
              color: '#2D0A0A',
              boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
            }}
          >
            भजन पढ़ें
          </Link>
          <Link
            href="/aarti"
            className="px-8 py-3 rounded-lg font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
            style={{
              fontFamily: 'var(--font-devanagari)',
              background: 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              border: '2px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(4px)',
            }}
          >
            आज का भजन
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { num: '५०००+', label: 'भजन' },
            { num: '५००+', label: 'आरती' },
            { num: '१००+', label: 'चालीसा' },
            { num: '१०००+', label: 'मंत्र' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-bold"
                style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700' }}
              >
                {stat.num}
              </div>
              <div
                className="text-xs sm:text-sm mt-1"
                style={{ fontFamily: 'var(--font-devanagari)', color: 'rgba(255,220,176,0.7)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
