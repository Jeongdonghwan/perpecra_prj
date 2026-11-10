import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES, PHOTOS, PLACES, REGIONS, openRegions, regionPages, regionPath, pagePath, pageEncodedPath, inSitemap } from '../lib/data';
import { W } from '../lib/compose';
import { BRAND, BIZ, CONTACT, HOMEPAGE, PHOTO_SRC, shareMeta } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { Actions, IconArrow, JsonLd, PlaceLink, SectionHead } from '../components/Common';

const HOME_TITLE = `${BRAND} | 화성 철거·원상복구·공장철거 업체`;
const HOME_DESC = `화성 병점구 ${BRAND}. 상가·인테리어·내부·공장철거, 원상복구, 폐기물 수거·운반·처리까지 한 번에. 24시간 영업·연중무휴, 무료견적상담 ${CONTACT.phone}.`;
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 철거·원상복구`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

// 업체 홈페이지·플레이스에 적힌 것만
const TRUST = [
  { t: '24시간 영업 · 연중무휴', d: '네이버 플레이스 영업시간 표기' },
  { t: '무료견적상담', d: '업체 홈페이지 표기' },
  { t: '철거부터 폐기물처리까지', d: '각종 폐기물 수거 · 운반 · 처리 작업(주요업무)' },
  { t: '화성 중심 · 주변 지역 출장', d: '화성시 전지역, 기타 지역은 상담 후 출장' },
  { t: '현장 작업자 직접 책임 시공', d: '업체 인사말 문구' },
  { t: '작업 전 안전 교육', d: '필수로 진행하는 안전 교육(업체 인사말)' },
];
const SERVICES: { w: keyof typeof W; t: string; d: string }[] = [
  { w: '철거', t: '실내·상가 철거', d: '상가철거 · 인테리어철거 · 내부철거. 칸막이·천장·바닥·설비를 걷고 폐기물까지 반출.' },
  { w: '원상복구', t: '원상복구', d: '임대 계약이 끝난 매장·사무실을 계약 기준대로 정리하고 청소까지.' },
  { w: '공장철거', t: '공장철거', d: '공장·창고 설비와 판넬·랙 철거, 고철·폐기물 분리 반출.' },
  { w: '에어컨매입', t: '폐업 에어컨 정리', d: '철거와 함께 하는 업소용 에어컨 정리. 매입 여부·금액은 현장 확인 후 안내.' },
  { w: '주방가전매입', t: '폐업 주방기기 정리', d: '음식점·카페 냉장고·제빙기·화구 정리. 매입 여부·금액은 현장 확인 후 안내.' },
];
const PROCESS = [
  { t: '전화·문자 상담', d: `${CONTACT.phone}로 주소·면적·일정과 현장 사진을 보내 주세요.` },
  { t: '현장 확인', d: '걷어 낼 범위, 남길 설비, 반출 동선을 함께 봅니다.' },
  { t: '견적·일정', d: '무료견적상담. 범위를 정리해 작업 날짜를 맞춥니다.' },
  { t: '철거·폐기물 처리', d: '철거 뒤 폐기물 수거·운반·처리까지 이어서 합니다.' },
];
const FAQ = [
  { q: '어느 지역까지 오나요?', a: `업체 소개 기준으로 화성 지역을 중심으로 작업하고, 주변 지역도 상담을 거쳐 출장합니다. ${openRegions().filter((r) => r !== '화성').join('·')} 현장은 통화로 일정부터 맞춥니다.` },
  { q: '견적은 무료인가요?', a: '업체 홈페이지에 무료견적상담으로 적혀 있습니다. 사진을 먼저 보내 주시면 상담이 빨라집니다.' },
  { q: '야간·주말에도 연락되나요?', a: '네이버 플레이스 영업시간은 24시간 영업, 연중무휴입니다.' },
  { q: '폐기물도 같이 처리하나요?', a: '주요업무에 각종 폐기물 수거·운반·처리 작업이 들어 있어 철거와 함께 맡습니다.' },
  { q: '에어컨이나 주방기기도 매입하나요?', a: '폐업 철거와 함께 정리 상담을 합니다. 매입 여부와 금액은 제품을 직접 본 뒤 안내하며, 정해진 단가표는 없습니다.' },
  { q: '건물 전체 철거도 하나요?', a: '주요업무에 건물철거·완파가 있습니다. 건물 해체는 건축물관리법상 허가·신고 절차가 있어 규모를 보고 상담합니다.' },
];

// 업체 홈페이지 '주요업무' 항목
const SVC = ['상가철거', '인테리어철거', '내부철거', '공장철거', '원상복구', '완파', '폐기물 수거·운반·처리'];

export default function Home() {
  const regions = openRegions();
  const hubs = OPEN_PAGES.filter((p) => inSitemap(p)).slice(0, 30);
  const svcLink = (w: string) => OPEN_PAGES.find((p) => inSitemap(p) && p.word === w && p.place === '화성' && p.mod === '업체') || OPEN_PAGES.find((p) => p.word === w);
  const hero = PHOTOS[0];

  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p), image: `/og/${encodeURIComponent(p.slug)}.jpg` })))]} />
      <section className="hero hero-home">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="eyebrow">화성 병점구 · {BIZ.hoursShort}</p>
            <h1><span><i>철거부터 폐기물까지</i></span><span><i>{BRAND}</i></span></h1>
            <p className="hero-lead">상가철거 · 인테리어철거 · 내부철거 · 공장철거 · 원상복구 · 완파. 철거한 자리의 폐기물 수거·운반·처리까지 한 업체가 맡습니다.</p>
            <Actions />
          </div>
          <figure className="hero-photo mask">
            <img src={`/img/${hero.img}.webp`} alt={`${BRAND} ${hero.scene}`} width={hero.w} height={hero.h} />
            <figcaption><b>{BRAND}</b>{hero.scene}</figcaption>
          </figure>
        </div>
      </section>

      <div className="wrap">
        <ul className="trust" aria-label="업체 표기">
          {TRUST.map((x, i) => <li key={x.t} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}><b>{x.t}</b><span>{x.d}</span></li>)}
        </ul>
      </div>

      <div className="svc-marquee" aria-hidden="true">
        <div className="svc-track">{[...SVC, ...SVC].map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="01" title="하는 일" sub="업체 홈페이지 주요업무와, 폐업 정리 때 함께 문의하는 에어컨·주방기기 정리입니다." />
          <ol className="works">
            {SERVICES.map((x, i) => {
              const lk = svcLink(x.w);
              return (
                <li key={x.t} data-reveal style={{ transitionDelay: `${(i % 2) * 80}ms` }}>
                  <span className="works-no">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3>{x.t}</h3><p>{x.d}</p>{lk && <Link href={pagePath(lk)} className="more">{lk.kw} <IconArrow /></Link>}</div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <SectionHead no="02" title="상담부터 폐기물 처리까지, 4단계" sub="현장을 본 뒤 범위와 견적을 정합니다." />
          <ol className="tools reveal-group">{PROCESS.map((t) => <li key={t.t}><div><h3>{t.t}</h3><p>{t.d}</p></div></li>)}</ol>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="03" title="시공 사진" sub={`${BRAND}가 ${PHOTO_SRC}에 올린 시공 사진 ${PHOTOS.length}장입니다.`} />
          <div className="rail-nav">
            <button type="button" data-scroll="-1" data-target="case-rail" aria-label="이전 사진">←</button>
            <button type="button" data-scroll="1" data-target="case-rail" aria-label="다음 사진">→</button>
          </div>
          <div className="rail" id="case-rail">
            {PHOTOS.map((k, i) => (
              <figure key={k.img} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <div className="ph"><img src={`/img/${k.img}.webp`} alt={`${BRAND} ${k.scene}`} loading="lazy" /></div>
                <figcaption>{k.scene}</figcaption>
              </figure>
            ))}
          </div>
          <p data-reveal><Link href="/works/" className="more">사진 전체 보기 <IconArrow /></Link></p>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>매장 폐업, 임대 반납, 공장 정리.<br />철거와 폐기물 처리를 한 번에 상담하세요.</p>
          <Actions place={false} />
        </div>
      </section>

      <div className="wrap content">
        <section className="sec mist">
          <SectionHead no="04" title="업체 소개" sub="업체 홈페이지 인사말·영업안내 문구를 옮겼습니다." />
          <div className="cols">
            <div className="prose" data-reveal>
              <p className="first">{BRAND}는 화성 지역을 중심으로 작업하고, 주변 지역도 상담을 거쳐 출장합니다.</p>
              <p>내부철거, 상가철거, 인테리어철거, 건물철거, 원상복구, 완파 등 철거 현장 작업을 하고, 작업 전 안전 교육을 필수로 진행한다고 소개합니다. 현장 작업자가 직접 공사를 책임지는 방식입니다.</p>
              <p>철거부터 폐기물 수거·운반·처리까지 한 번에 맡는 것이 업체가 내건 방식입니다. 업체 홈페이지: <a href={HOMEPAGE} target="_blank" rel="noopener">01083536611.smb114.kr</a></p>
            </div>
            <aside className="memo" data-reveal>
              <h3>주요업무 (홈페이지 영업안내)</h3>
              <ol>{BIZ.works.map((w) => <li key={w}>{w}</li>)}</ol>
              <PlaceLink className="more" />
            </aside>
          </div>
        </section>

        <section className="sec">
          <SectionHead no="05" title="지역 안내" sub="권역을 고르면 생활권별 철거·원상복구·공장철거·폐업 매입 안내로 이어집니다." />
          <div className="cities">
            {regions.map((r) => (
              <Link key={r} href={regionPath(r)} className="city-row" data-reveal>
                <div><b>{r}</b><span>{REGIONS[r].full}</span></div>
                <em>{regionPages(r).length}</em>
              </Link>
            ))}
          </div>
          <ul className="linklist" style={{ marginTop: 28 }}>
            {hubs.slice(0, 12).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}
          </ul>
          <p data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </section>

        <section className="sec mist">
          <SectionHead no="06" title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>주소와 일정, 사진만 보내 주세요</h2>
          <p>현장을 보고 범위와 견적을 말씀드립니다. {BIZ.hoursShort}.</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
