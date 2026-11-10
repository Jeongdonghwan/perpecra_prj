// 공통 UI — 이모지 없이 선 아이콘, 각진 버튼, 번호 붙은 섹션 머리.
// 사용자 요청: 네이버 플레이스 링크를 헤더·히어로·푸터·하단 고정바에 고정 → PlaceLink 를 전화번호와 한 묶음으로 쓴다.
import Link from 'next/link';
import { BRAND, CONTACT, BIZ, PLACE_URL, tel } from '../lib/site';
import { regionText } from '../lib/data';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}</>
);

const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconPin = () => <Svg d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconOut = () => <Svg d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" size={14} />;

// 네이버 플레이스 링크
export const PlaceLink = ({ className = 'place-link', label = '네이버 플레이스에서 사진·리뷰 보기' }: { className?: string; label?: string }) => (
  <a className={className} href={PLACE_URL} target="_blank" rel="noopener" aria-label={`${BRAND} ${label}`}><IconPin /><span>{label}</span><IconOut /></a>
);

// 본문 버튼 묶음: 전화(주) · 네이버 플레이스(보조)
export const Actions = ({ place = true }: { place?: boolean }) => (
  <div className="actions">
    <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
    {place && <PlaceLink className="btn-text" />}
  </div>
);

export const SectionHead = ({ no, title, sub }: { no: string; title: string; sub?: string }) => (
  <header className="sh" data-reveal>
    <span className="sh-no" aria-hidden="true">{no}</span>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

export const Ticker = ({ items }: { items: string[] }) => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker-track">{[...items, ...items].map((x, i) => <span key={i}>{x}</span>)}</div>
  </div>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <span><b>{BRAND}</b><small>철거 · 원상복구 · 폐업 정리</small></span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/area/" className="hide-m">지역</Link>
        <Link href="/works/" className="hide-m">작업 사진</Link>
        <PlaceLink className="nav-place" label="네이버 플레이스" />
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>{BIZ.category} · 실내 철거 · 원상복구 · 공장철거 · 폐업 에어컨·주방기기 매입 상담<br />{regionText(' · ')} 지역 안내</p>
        <p><Link href="/area/">지역 안내</Link> · <Link href="/works/">작업 사진</Link> · <a href="/rss.xml">RSS</a></p>
        <PlaceLink className="foot-place" />
      </div>
      <ul className="foot-info">
        <li><span>상호</span>{BRAND}</li>
        <li><span>주소</span>{BIZ.address}</li>
        <li><span>영업</span>{BIZ.hoursShort}</li>
        <li><span>전화</span><a href={tel}>{CONTACT.phone}</a></li>
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} — 업체 정보는 네이버 플레이스 표기 기준입니다.</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
    <PlaceLink className="sb-place" label="네이버 플레이스" />
  </div>
);
