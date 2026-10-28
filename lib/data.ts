// 데이터 로더 — data/site-pages.json(키워드 페이지), places.json(지역), photos.json(업체 시공 사진). 빌드 전용.
import pagesData from '../data/site-pages.json';
import placesData from '../data/places.json';
import photosData from '../data/photos.json';
import { OPEN_WAVE, MERGE_VARIANTS } from './site';

export type Word = '철거' | '원상복구' | '공장철거' | '에어컨매입' | '주방가전매입';
export type Mod = '업체' | '가격' | '추천';
export type Ctx = 'office' | 'retail' | 'resi' | 'factory' | 'old';
export interface Page {
  n: number; no: number; kw: string; slug: string; label: string; place: string; region: string; unit: string;
  word: Word; mod: Mod; prio: number; wave: number; variantOf?: string;
}
export interface Place { key: string; name: string; region: string; kind: string; ctx: Ctx; admin: string; bldg: string; spots: string[]; note: string }
export interface Region { full: string; short: string; traits: string; work: string }
export interface Photo { img: string; w: number; h: number; scene: string; tags: string[] }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
const openSet = new Set(OPEN_PAGES.map((p) => p.slug));
export const isOpen = (slug: string) => openSet.has(slug);

export const PLACES = placesData.places as Record<string, Place>;
export const REGIONS = placesData.regions as Record<string, Region>;
export const REGION_ORDER = placesData.regionOrder as string[];
export const PHOTOS = photosData.photos as Photo[];

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const regionPath = (r: string) => `/area/${r}/`;
export const regionEncodedPath = (r: string) => `/area/${encodeURIComponent(r)}/`;

// canonical: 스위치가 켜져 있고 대표 페이지가 열려 있으면 대표 페이지로
export const canonicalPath = (p: Page) =>
  MERGE_VARIANTS && p.variantOf && openSet.has(p.variantOf) ? `/${encodeURIComponent(p.variantOf)}/` : pageEncodedPath(p);
export const inSitemap = (p: Page) => canonicalPath(p) === pageEncodedPath(p);

export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return OPEN_PAGES.find((p) => p.slug === key);
}

export const openRegions = () => REGION_ORDER.filter((r) => OPEN_PAGES.some((p) => p.region === r));
export const regionPages = (r: string) => OPEN_PAGES.filter((p) => p.region === r);

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 단어 묶음 — 사진 태그와 같은 이름 (철거·원상복구 = 내부철거 / 공장철거 / 매입)
export const wordGroup = (w: Word) => (w === '에어컨매입' || w === '주방가전매입' ? '매입' : w === '공장철거' ? '공장' : '내부');

// 관련 페이지 — 열린 대표 페이지만. 같은 장소 다른 단어 / 같은 권역 같은 단어 / 다른 권역 같은 단어
export function related(p: Page) {
  const pool = OPEN_PAGES.filter((x) => x.slug !== p.slug && inSitemap(x));
  const samePlace = rotate(pool.filter((x) => x.place === p.place && (x.word !== p.word || x.mod !== p.mod)), p.slug, 'rp').slice(0, 8);
  const sameRegion = rotate(pool.filter((x) => x.region === p.region && x.place !== p.place && x.word === p.word && x.mod === p.mod), p.slug, 'rel').slice(0, 8);
  const otherRegions = pool.filter((x) => x.region !== p.region && PLACES[x.place].kind === '시구' && x.place === x.region && x.word === p.word && x.mod === p.mod).slice(0, 4);
  return { samePlace, sameRegion, otherRegions };
}

// 사진 배정 — 단어 묶음 태그가 맞는 사진을 앞에 두고 슬러그 해시로 돌린다.
export function photosFor(p: Page, n = 3): Photo[] {
  const want = wordGroup(p.word);
  const fit = rotate(PHOTOS.filter((c) => c.tags.includes(want)), p.slug, 'ph');
  const rest = rotate(PHOTOS.filter((c) => !c.tags.includes(want)), p.slug, 'ph2');
  return [...fit, ...rest].slice(0, n);
}
