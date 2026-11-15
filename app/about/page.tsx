// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 와 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { regionText } from '../../lib/data';
import { BIZ, BRAND, CONTACT, HOMEPAGE, PLACE_URL, UPDATED, shareMeta, tel } from '../../lib/site';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = `철거·원상복구·폐기물 처리를 하는 ${BRAND} 소개입니다. 하는 일, 다니는 지역, 연락 방법, 주소와 영업시간을 사실대로 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <div className="wrap content page-top">
        <h1 className="page-title">{BRAND} 소개</h1>
        <p className="prose-p">{BRAND}는 철거와 원상복구, 폐기물 처리를 하는 업체입니다. 네이버 플레이스 업종은 {BIZ.category}입니다.</p>
        <section className="sec">
          <h2 className="area-h">하는 일</h2>
          {BIZ.works.slice(1).map((w) => <p key={w} className="prose-p">{w}</p>)}
          <p className="prose-p">작업 사진은 <Link href="/works/">작업 사진</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">다니는 지역</h2>
          <p className="prose-p">{BIZ.areaAnswer}</p>
          <p className="prose-p">이 사이트에는 {regionText(', ')} 지역 안내가 있습니다. 동네별 안내는 <Link href="/area/">지역 안내</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">연락 방법</h2>
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a>로 받습니다. 영업시간은 {BIZ.hoursShort}입니다.</p>
          <p className="prose-p">주소는 {BIZ.address}입니다.</p>
          <p className="prose-p"><a href={PLACE_URL} target="_blank" rel="noopener noreferrer">네이버 플레이스</a> · <a href={HOMEPAGE} target="_blank" rel="noopener noreferrer">업체 홈페이지</a></p>
        </section>
        <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
      </div>
    </main>
  );
}
