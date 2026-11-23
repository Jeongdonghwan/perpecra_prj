// 키워드 페이지 본문 — 레이 모범 구조(2026-11-24, programmatic-seo composer-patterns §5-1·5-2)
// 분류 줄 → h1(키워드 + 수식어) → 설명 → 핵심 요약(결론 + 정보 4칸) → 번호 절 6개(한 문단) → FAQ → 관련 링크.
// 문장 재료는 lib/compose.ts 가 만든 것(플레이스·업체 홈페이지·places.json 사실)만 다시 엮는다. 새 사실 없음.
import { Page, PLACES, REGIONS, seedOf } from './data';
import { compose, W } from './compose';
import { BRAND, BIZ, CONTACT } from './site';
import { j } from './ko';

// FNV 아랫비트는 슬러그 끝 글자에 따라 짝수·홀수가 같이 움직여(수식어만 다른 페이지가 같은 쪽을 고름) 윗비트로 고른다
const hi = (k: string) => seedOf(k) >>> 15;
const pick = <T,>(arr: T[], seed: string, salt: string): T => arr[hi(`${seed}::${salt}`) % arr.length];
const shuffle = <T,>(arr: T[], seed: string, salt: string) => arr.map((x, i) => [hi(`${i}::${salt}::${seed}`), x] as [number, T]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const end = (s: string) => (/[.?!]$/.test(s) ? s : `${s}.`);
// 문장을 차례로 넣되 max 를 넘기는 문장은 건너뛴다 → 문단 길이를 230~270자 안에
const para = (sents: string[], max = 268) => {
  let out = '';
  for (const t of sents) { if (!t) continue; const n = out ? `${out} ${t}` : t; if (n.length <= max) out = n; }
  return out.replace(/\s+/g, ' ');
};
const item = (x: { name: string; d: string }) => `${x.name} — ${x.d.replace(/\.$/, '')}.`;

const WORD_CAT: Record<string, string> = { 철거: '실내 철거', 원상복구: '임대 원상복구', 공장철거: '공장·창고 설비 철거', 에어컨매입: '폐업 에어컨 매입', 주방가전매입: '업소용 주방기기 매입' };
const MOD_CAT: Record<string, string> = { 업체: '작업 범위', 가격: '비용 기준', 추천: '업체 고르기' };
const CTX_NOUN: Record<string, string> = { office: '사무실·업무 공간', retail: '매장·음식점', resi: '단지 상가·생활 매장', factory: '공장·창고', old: '오래된 상가·주택' };

export function composeRay(p: Page) {
  const c = compose(p);
  const P = PLACES[p.place];
  const R = REGIONS[p.region];
  const d = W[p.word];
  const s = p.slug;
  const kw = p.kw;
  const nm = P.name;
  const lb = p.label;
  const cn = CTX_NOUN[P.ctx];
  // 수식어·문장에 쓸 주변 장소 — 키워드에 이미 든 지역명은 빼고
  const sp0 = c.region.spots.filter((x) => !x.includes(lb) && !x.includes(nm));
  const sp = sp0.length ? sp0 : c.region.spots;
  const mi = c.mod.list.map((x) => x.name);
  const buy = p.word === '에어컨매입' || p.word === '주방가전매입';
  const first = buy ? mi[0] : c.view.table[0][1].replace(`${nm} `, '');
  const tb = c.view.table;
  const b0 = P.bldg.split(',')[0].trim();

  const h1sub = pick({
    업체: [`${sp[0]} 주변 현장, 범위부터 반출까지`, `견적부터 ${d.steps[3].title}까지 순서`, `${mi[0]}·${mi[1]} 포함 작업 범위`, `${first} 먼저 확인`],
    가격: [`${mi[0]}·${mi[1]}로 갈리는 견적`, `${sp[0]} 주변 현장 견적 항목`, `${first}부터 보는 비용`, `${cn} 현장 견적 기준`],
    추천: [`${d.picks[0].name} 먼저 볼 것`, `${sp[0]} 주변 현장 업체 고르는 기준`, `${cn} 현장 업체 고르는 법`, `${d.picks[1].name}부터 확인`],
  }[p.mod], s, 'h1sub');

  const cat = `${P.admin.split(' ').slice(0, 2).join(' ')} · ${WORD_CAT[p.word]} · ${MOD_CAT[p.mod]}`;

  // ---- 핵심 요약: 결론 3~4문장 + 정보 4칸 ----
  const summary = para([
    c.answer,
    buy ? end(P.note) : pick([end(P.note), `${nm}에는 ${j(P.bldg, '이')} 있어 ${first}부터 봅니다.`], s, 'sum2'),
    pick([`${nm} 현장 상담과 견적은 무료로 안내하고, 전화는 ${BIZ.hoursShort}로 받습니다.`, `${BIZ.hoursShort}로 전화를 받고, ${lb} 문의도 무료견적상담으로 시작합니다.`], s, 'sum3'),
  ], 330);

  // ---- 번호 절 6개 (한 절 = 한 문단) ----
  const steps = d.steps;
  const sig = pick(c.signs.items, s, 'sg');
  const modLead = {
    업체: `${nm} ${cn} 현장은 다음 가운데 필요한 일만 골라 견적에 넣습니다.`,
    가격: `${BRAND}는 정해진 단가표 대신 ${nm} 현장을 보고 견적을 냅니다.`,
    추천: `${lb} ${d.short} 업체를 고를 때는 광고 문구보다 다음 질문이 확실합니다.`,
  }[p.mod];
  const secs: { sub: string[]; p: string }[] = [
    { sub: [`${nm} 현장 사정`, `${nm} 건물에서 먼저 볼 것`, c.view.heading.replace(`${nm} `, '')],
      p: para([...c.view.paras, `${nm}에는 ${j(P.bldg, '이')} 있습니다.`, end(P.note)]) },
    { sub: [c.mod.heading.replace(`${lb} `, '').replace(`${nm} `, ''), `${MOD_CAT[p.mod]}, ${sp[0]} 주변 현장 기준`, p.mod === '가격' ? '견적이 달라지는 이유' : p.mod === '추천' ? '업체에 물어볼 것' : '맡기면 하는 일'],
      p: para([
        modLead,
        `${lb} ${d.short}${p.mod === '가격' ? ' 견적은' : p.mod === '추천' ? ' 업체는' : '에서는'} ${mi.slice(0, 3).join('·')} 순서로 확인합니다.`,
        ...shuffle(c.mod.list, s, 'm1').slice(0, 1).map(item),
        `${nm} 현장은 ${tb[2][0]}(${tb[2][1].replace(`${nm} `, '')})${j(tb[2][0], '과').slice(-1)} ${tb[3][0]}(${tb[3][1].replace(`${nm} `, '')})도 상담 때 함께 정리해 둡니다.`,
        ...shuffle(c.mod.list, s, 'm1').slice(1, 2).map(item),
      ]) },
    { sub: [`${d.short} 진행 순서`, `${steps[0].title}에서 ${steps[4].title}까지`, `${nm} 현장 작업 순서`],
      p: para([
        `${nm} ${j(d.short, '은')} ${steps.map((x) => x.title).join(' → ')} 순서로 진행합니다.`,
        steps[hi(`${s}::st`) % 5].text,
        steps[(seedOf(`${s}::st`) + 2) % 5].text,
        ...shuffle(c.steps, s, 'tl').slice(0, 3).map((x) => x.text.split(/(?<=\.)\s+/)[1]),
        `${sp.slice(0, 2).join('·')} 주변처럼 차를 세우기 어려운 곳은 반출 시간을 따로 맞춥니다.`,
      ]) },
    { sub: [`${d.short} 전에 알아 둘 것`, '법령과 확인 사항', `${nm} 현장 확인 사항`],
      p: para([
        pick([`${lb} 현장도 작업 전에 다음 원칙을 함께 확인합니다.`, `${nm} 현장 규모와 공사 내용에 따라 해당 여부가 달라 현장 확인 때 같이 봅니다.`], s, 'r0'),
        ...shuffle(d.rules, s, 'r1').slice(0, 1).map((r) => `${r.name} — ${r.d}`),
        buy ? `${nm}처럼 ${j(b0, '이')} 있는 곳은 ${tb[0][1].replace(`${nm} `, '')} 같은 ${p.word === '에어컨매입' ? '제품이' : '기기가'} 많고, ${j(tb[1][0], '은')} ${tb[1][1]} 쪽을 먼저 봅니다.`
          : `${nm}처럼 ${j(b0, '이')} 있는 곳은 ${j(tb[0][1].replace(`${nm} `, ''), '을')} 먼저 확인하고 ${tb[1][1].split(' · ').slice(0, 2).join('·')}의 범위를 정합니다.`,
        `${sp.slice(0, 3).join('·')} 주변 건물도 같은 기준으로 봅니다.`,
        ...shuffle(d.rules, s, 'r1').slice(1, 2).map((r) => `${r.name} — ${r.d}`),
      ]) },
    { sub: [`${nm} 상담 전 준비할 것`, '연락 주실 때 알려 주시면 좋은 것', '이런 때 연락 주세요'],
      p: para([
        `${c.tell.items.join(', ')}${j(c.tell.items[3], '을').slice(c.tell.items[3].length)} 알려 주시면 ${nm} 현장 확인 때 인원과 차량을 미리 정할 수 있습니다.`,
        `${sig}면 첫 통화에서 날짜부터 말씀해 주세요.`,
        c.tell.text,
        pick([`${nm} 건물 이름을 알려 주시면 주차·반입 위치도 미리 봅니다.`, `${lb} 현장이 몇 층인지, 엘리베이터를 쓸 수 있는지도 함께 알려 주세요.`, `끝내야 하는 날짜가 있으면 ${nm} 주소와 함께 처음에 말씀해 주세요.`], s, 't9'),
      ]) },
    { sub: [`${BRAND}가 일하는 방식`, `${nm} 출장과 일정`, `${BRAND} 작업 원칙`],
      p: para([...shuffle(c.intro.filter((x) => !x.startsWith(R.full) || hi(`${s}::rg`) % 2), s, 'i0'), ...c.region.paras.slice(1)]) },
  ];
  const KW_AT = new Set([0, 1, 2, 5]); // 6개 중 4개 h2 에 키워드 전체
  const sections = secs.map((x, i) => {
    const sub = pick(x.sub, s, `h${i}`);
    return { h: KW_AT.has(i) ? `${kw}${i % 2 ? ' — ' : ': '}${sub}` : sub, p: x.p };
  });

  // description 45~80자: 키워드 — 하는 일 2~3개 + 장소 사실 + 전화 (80자 넘으면 문장 단위로 줄임)
  const t = shuffle(d.items, s, 'dt').map((x) => x.name);
  const fact = pick([`${sp[0]} 주변 ${cn} 현장 확인`, `${nm} ${cn} 현장 견적`], s, 'df');
  const description = [
    `${kw} — ${t[0]}, ${j(t[1], '과')} ${t[2]}까지. ${fact} ${CONTACT.phone}`,
    `${kw} — ${j(t[0], '과')} ${t[1]}까지. ${fact} ${CONTACT.phone}`,
    `${kw} — ${j(t[0], '과')} ${t[1]}까지. 현장 견적 ${CONTACT.phone}`,
    `${kw} — ${t[0]}부터. 현장 견적 ${CONTACT.phone}`,
  ].find((x) => x.length <= 80)!;

  return { ...c, h1sub, cat, summaryText: summary, facts: c.summary, sections, description };
}
