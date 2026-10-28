import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { REGIONS, PLACES, openRegions, regionPages, regionEncodedPath, pagePath, pageEncodedPath, inSitemap } from '../../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead } from '../../../components/Common';
import { BRAND, shareMeta } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return openRegions().map((region) => ({ region }));
}
const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
const KIND: Record<string, string> = { 시구: '시·구', 생활권: '생활권·역세권' };

export function generateMetadata({ params }: { params: { region: string } }): Metadata {
  const r = dec(params.region);
  if (!REGIONS[r]) return {};
  const title = `${r} 철거·원상복구·폐업 매입 지역 안내 | ${BRAND}`;
  const description = `${REGIONS[r].full} 생활권별 철거, 원상복구, 공장철거, 에어컨·주방가전 매입 안내 모음. ${r} 시·구와 생활권 페이지로 이어집니다.`;
  return { title, description, alternates: { canonical: regionEncodedPath(r) }, ...shareMeta(`area-${r}`, `${r} 지역 안내`, { title, description, url: regionEncodedPath(r) }) };
}

export default function RegionHub({ params }: { params: { region: string } }) {
  const r = dec(params.region);
  const R = REGIONS[r];
  if (!R) notFound();
  const pages = regionPages(r);
  const keys = Array.from(new Set(pages.map((p) => p.place)));
  const kinds = ['시구', '생활권'].filter((k) => keys.some((x) => PLACES[x].kind === k));
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${r} 지역 안내`, path: regionEncodedPath(r) }]),
        itemListJsonLd(pages.filter(inSitemap).map((p) => ({ name: p.kw, path: pageEncodedPath(p), image: `/og/${encodeURIComponent(p.slug)}.jpg` }))),
      ]} />
      <div className="wrap content page-top">
        <p className="eyebrow dark">{R.full}</p>
        <h1 className="page-title">{r} 철거·원상복구·폐업 매입 지역 안내</h1>
        <p className="prose-p">{R.full}는 {R.traits}입니다. {R.work}입니다.</p>
        <Actions />
        <section className="sec">
          <SectionHead no="01" title={`${r} 생활권별 현장 사정`} />
          <dl className="spec" data-reveal>{keys.map((k) => <div key={k}><dt>{PLACES[k].name}</dt><dd>{PLACES[k].bldg}. {PLACES[k].note}.</dd></div>)}</dl>
        </section>
        {kinds.map((k, i) => (
          <section key={k} className="sec">
            <SectionHead no={String(i + 2).padStart(2, '0')} title={`${r} ${KIND[k]}`} />
            {keys.filter((x) => PLACES[x].kind === k).map((key) => (
              <div key={key} className="area-block" data-reveal>
                <h3>{PLACES[key].name} <small style={{ fontWeight: 500, color: 'var(--muted)' }}>· {PLACES[key].admin}</small></h3>
                <ul className="area-list">
                  {pages.filter((p) => p.place === key).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}
                </ul>
              </div>
            ))}
          </section>
        ))}
        <p><Link href="/area/" className="more">다른 권역 보기 <IconArrow /></Link></p>
      </div>
    </main>
  );
}
