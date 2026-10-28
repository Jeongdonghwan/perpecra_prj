import { SITE_URL, SITE_NAME, BRAND, CONTACT, BIZ, PLACE_URL } from './site';

// 업체 — 네이버 플레이스 표기(상호·전화·주소·영업시간·업종)만
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/${BIZ.heroImg}.jpg`,
  telephone: CONTACT.phone,
  address: { '@type': 'PostalAddress', addressCountry: 'KR', ...BIZ.postal },
  ...(BIZ.hoursSpec ? { openingHoursSpecification: BIZ.hoursSpec } : {}),
  sameAs: [PLACE_URL, ...BIZ.links],
  areaServed: ['서울특별시 강남구', '경기도 화성시', '경기도 수원시', '경기도 광명시', '경기도 안산시'],
  knowsAbout: ['실내 철거', '원상복구', '공장철거', '폐업 정리', '에어컨 매입', '주방기기 매입'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string; image: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.type,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  image: `${SITE_URL}${o.image}`,
  areaServed: { '@type': 'Place', name: o.area },
  provider: { '@id': `${SITE_URL}/#business` },
});

// 관련 페이지·허브 목록(캐러셀). path 는 인코딩된 경로
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name, ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}) })),
});
