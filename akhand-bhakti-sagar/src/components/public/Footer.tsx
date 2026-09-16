import Link from 'next/link';

const categoryLinks = [
  { label: 'भजन', href: '/bhajan' },
  { label: 'आरती', href: '/aarti' },
  { label: 'चालीसा', href: '/chalisa' },
  { label: 'मंत्र', href: '/mantra' },
  { label: 'स्तोत्र', href: '/stotra' },
  { label: 'भक्ति लेख', href: '/article' },
  { label: 'त्योहार', href: '/festival' },
  { label: 'देवी-देवता', href: '/deity' },
];

const importantLinks = [
  { label: 'हमारे बारे में', href: '/about' },
  { label: 'संपर्क करें', href: '/contact' },
  { label: 'गोपनीयता नीति', href: '/privacy' },
  { label: 'नियम और शर्तें', href: '/terms' },
  { label: 'अस्वीकरण', href: '/disclaimer' },
  { label: 'साइटमैप', href: '/sitemap.xml' },
];

const socialLinks = [
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'linear-gradient(180deg, #2D0A0A 0%, #1A0505 100%)' }}>
      {/* Om divider */}
      <div
        className="py-3 text-center text-lg"
        style={{
          fontFamily: 'var(--font-devanagari)',
          color: '#D4AF37',
          borderBottom: '1px solid rgba(212,175,55,0.2)',
          letterSpacing: '0.2em',
        }}
      >
        ॐ नमः शिवाय • हरे कृष्ण • जय माता दी • राधे राधे
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="lg:col-span-1">
            <div
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700' }}
            >
              🕉 अखंड भक्ति सागर
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#C8A07A', fontFamily: 'var(--font-devanagari)' }}>
              भजन, आरती, चालीसा, मंत्र और स्तोत्र का पवित्र संग्रह। ईश्वर की भक्ति में अपना मन लगाएं।
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:scale-110"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    color: '#D4AF37',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3
              className="text-base font-bold mb-4 pb-2"
              style={{
                fontFamily: 'var(--font-devanagari)',
                color: '#FFD700',
                borderBottom: '2px solid rgba(212,175,55,0.3)',
              }}
            >
              भक्ति श्रेणियाँ
            </h3>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-yellow-400 flex items-center gap-2"
                    style={{ color: '#C8A07A', fontFamily: 'var(--font-devanagari)' }}
                  >
                    <span style={{ color: '#FF6B00', fontSize: '0.6rem' }}>◆</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important links */}
          <div>
            <h3
              className="text-base font-bold mb-4 pb-2"
              style={{
                fontFamily: 'var(--font-devanagari)',
                color: '#FFD700',
                borderBottom: '2px solid rgba(212,175,55,0.3)',
              }}
            >
              महत्वपूर्ण लिंक
            </h3>
            <ul className="space-y-2">
              {importantLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-yellow-400 flex items-center gap-2"
                    style={{ color: '#C8A07A', fontFamily: 'var(--font-devanagari)' }}
                  >
                    <span style={{ color: '#FF6B00', fontSize: '0.6rem' }}>◆</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Daily shloka */}
          <div>
            <h3
              className="text-base font-bold mb-4 pb-2"
              style={{
                fontFamily: 'var(--font-devanagari)',
                color: '#FFD700',
                borderBottom: '2px solid rgba(212,175,55,0.3)',
              }}
            >
              आज का श्लोक
            </h3>
            <blockquote
              className="text-sm leading-relaxed italic"
              style={{
                fontFamily: 'var(--font-devanagari)',
                color: '#D4AF37',
                borderLeft: '3px solid #FF6B00',
                paddingLeft: '1rem',
              }}
            >
              यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।
              अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥
            </blockquote>
            <p className="text-xs mt-2" style={{ color: '#8B6A4A', fontFamily: 'var(--font-devanagari)' }}>
              — श्रीमद् भगवद्गीता ४.७
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="py-4 text-center text-xs"
        style={{
          borderTop: '1px solid rgba(212,175,55,0.15)',
          color: '#6B4A2A',
          fontFamily: 'var(--font-devanagari)',
        }}
      >
        © {year} अखंड भक्ति सागर। सर्वाधिकार सुरक्षित।{' '}
        <span style={{ color: '#FF6B00' }}>🕉</span>{' '}
        भक्ति में बना, भक्ति के लिए।
      </div>
    </footer>
  );
}
