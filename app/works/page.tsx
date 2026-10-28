import type { Metadata } from 'next';
import Link from 'next/link';
import { PHOTOS, OPEN_PAGES, inSitemap, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd } from '../../components/Common';
import { BRAND, SITE_URL, PHOTO_SRC, shareMeta } from '../../lib/site';

const TITLE = `작업 사진 | ${BRAND} 철거·원상복구 현장`;
const DESC = `${BRAND} 시공 사진 모음 — 상가·음식점 매장 내부 철거, 바닥 타일 철거, 철거 후 비운 상가와 폐기물 정리 현장.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/works/' },
  ...shareMeta('works', `${BRAND} 작업 사진`, { title: TITLE, description: DESC, url: '/works/' }),
};

export default function Works() {
  const links = OPEN_PAGES.filter((p) => inSitemap(p) && p.place === '화성' && p.mod === '업체');
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '작업 사진', path: '/works/' }]),
        {
          '@context': 'https://schema.org', '@type': 'ItemList',
          itemListElement: PHOTOS.map((k, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'ImageObject', contentUrl: `${SITE_URL}/img/${k.img}.jpg`, name: `${BRAND} ${k.scene}` } })),
        },
        itemListJsonLd(links.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <div className="wrap content page-top">
        <p className="eyebrow dark">시공 사진</p>
        <h1 className="page-title">작업 사진</h1>
        <p className="prose-p">{BRAND}이 {PHOTO_SRC}에 직접 올린 시공 사진 {PHOTOS.length}장입니다. 방문자 리뷰 사진은 넣지 않았고, 설명은 사진에 보이는 것만 적었습니다.</p>
        <section className="sec">
          <h2 className="area-h">현장 사진</h2>
          <div className="gallery">
            {PHOTOS.map((k, i) => (
              <figure key={k.img} data-reveal style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                <img src={`/img/${k.img}.webp`} alt={`${BRAND} ${k.scene}`} loading="lazy" />
                <figcaption>{k.scene}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="sec">
          <h2 className="area-h">화성 안내 페이지</h2>
          <ul className="linklist">{links.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
        </section>
        <section className="sec">
          <h2 className="area-h">현장 사진을 보내 주시면</h2>
          <p className="prose-p">걷어 낼 곳과 반출 동선(출입구·계단·엘리베이터)을 찍어 문자로 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <Actions />
        </section>
      </div>
    </main>
  );
}
