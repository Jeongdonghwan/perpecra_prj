// 사이트 설정 — 연락처·업체 정보·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: 네이버 플레이스 https://m.place.naver.com/place/1319052327 (홈·정보·사진·리뷰 탭, 2026-10-28 확인)

// TODO(도메인 확정 후): SITE_URL 환경변수로 넘기거나 기본값 교체. 배포: bash scripts/deploy.sh <단계> <URL>
export const SITE_URL = process.env.SITE_URL || 'https://perfect-demo.example';
export const BRAND = '퍼펙트철거';
export const SITE_NAME = `${BRAND} | 철거·원상복구·공장철거·폐업 매입`;

// 네이버 플레이스 — 사용자 요청: 헤더·히어로·푸터·하단 고정바에 고정
export const PLACE_URL = 'https://m.place.naver.com/place/1319052327';

// 전화: 업체가 홈페이지(플레이스 '홈페이지' 링크)에 적은 대표번호를 쓴다.
//   플레이스 안심번호 0507-1492-6612 와 다르다 → 보고에 둘 다 적음.
export const CONTACT = {
  phone: '010-8353-6611',
  placePhone: '0507-1492-6612',
};

// 업체 홈페이지(http://01083536611.smb114.kr/) — 플레이스 정보 탭의 홈페이지 링크
export const HOMEPAGE = 'http://01083536611.smb114.kr/';

// 사진 출처 — 플레이스 사진 탭이 열리면 '네이버 플레이스'로 바꾸고 scripts/prepare_images.py 원본 교체
export const PHOTO_SRC = '업체 홈페이지 갤러리';

export const BIZ = {
  // 플레이스 정보 탭 주소
  address: '경기 화성시 병점구 안녕길24번길 43 지하4호',
  postal: { addressRegion: '경기도', addressLocality: '화성시 병점구', streetAddress: '안녕길24번길 43 지하4호' },
  // 플레이스 영업시간: 24시간 영업 · 연중무휴
  hoursShort: '24시간 영업 · 연중무휴',
  hoursSpec: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  category: '철거 · 폐기물 처리',
  // 업체 홈페이지 인사말: "화성 지역을 중심으로 작업하고 있으며, 주변 지역 또한 상담을 통해 출장 작업"
  areaAnswer: '퍼펙트철거는 화성 지역을 중심으로 작업하고, 주변 지역도 상담을 거쳐 출장합니다(업체 소개 문구).',
  // 업체 홈페이지 영업안내 '주요업무' 그대로
  works: ['화성시 전지역 및 기타 지역 출장(상담문의)', '상가철거 · 인테리어철거 · 건물철거 · 내부철거 · 공장철거 · 모든 철거 공사', '완파 · 원상복구 · 각종 폐기물 수거/운반/처리 작업'],
  links: ['http://01083536611.smb114.kr/'],
  heroImg: 'ph-01',
};

// 순차 오픈: 이 단계 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다.
//   OPEN_WAVE=1 npx next build  (1 = 우선순위1 권역 대표 25 / 2 = +우선순위2 시·구 425 / 3 = 전체 1,000)
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 3);

// 표기만 다른 키워드(강남/강남구/서울 강남, 수원/수원시, 장안구/수원 장안구 …)는 대표 페이지로 canonical + 사이트맵 제외
export const MERGE_VARIANTS = true;

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py 로 생성)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: SITE_NAME, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};
