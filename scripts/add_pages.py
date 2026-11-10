"""오픈 뒤 추가 키워드(wave 5·6) → data/site-pages.json 뒤에 붙이고 keywords/퍼펙트철거_추가키워드.xlsx

  python -I scripts/add_pages.py        # 여러 번 돌려도 같다(기존 1,000개 뒤를 지우고 다시 붙임)

원본 키워드 파일(1,000행)은 전부 페이지가 됐으므로, 업체 출장 범위(화성 중심·주변 지역) 안에서
아직 없는 장소 × 기존 단어 5 × 수식어 3 을 본사(화성 병점) 가까운 순으로 붙인다.
기존 페이지의 wave·슬러그는 건드리지 않는다. 앞 절반 = wave 5, 뒤 절반 = wave 6.
build_pages.py 를 다시 돌리면 이 추가분이 지워지므로 그 뒤에 rebatch → 이 스크립트 순서로 다시 돌린다.
"""
import json, sys
from collections import Counter
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

sys.path.insert(0, str(Path(__file__).resolve().parent))
from places_src import P  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
JSON = ROOT / 'data' / 'site-pages.json'
OUT_XLSX = ROOT / 'keywords' / '퍼펙트철거_추가키워드.xlsx'
BASE = 1000  # 원본 엑셀로 만든 페이지 수
WORDS = ['철거', '원상복구', '공장철거', '에어컨매입', '주방가전매입']
MODS = ['업체', '가격', '추천']
OPEN_DATE = {5: '11-12', 6: '11-14'}
URL = 'https://퍼펙트철거.kr'

# 가까운 순: 본사 동 → 붙어 있는 오산 → 화성 생활권 → 기존 권역 빈칸·시구 → 주변 시 → 동
ORDER = ['화성 안녕동', '오산', '화성 기배동', '화성 정남', '화성 매송', '화성 양감', '오산 세교', '오산역',
         '안산', '단원구', '상록구', '용인', '기흥구', '평택',
         '화성 우정', '화성 장안', '화성 마도', '화성 서신', '새솔동',
         '매탄동', '수원 원천동', '수원 정자동', '수원 조원동', '율전동', '고색동', '화서동', '일직',
         '오산 가장동', '용인 흥덕', '신갈', '용인 동백', '보정동', '수지구', '처인구', '용인 죽전',
         '송탄', '평택 고덕', '평택역', '평택 진위', '평택 포승', '평택 안중',
         '의왕', '의왕역', '내손동', '군포', '산본', '금정역',
         '원곡동', '고잔', '반월공단', '초지동', '안산 사동', '본오동']

pages = json.loads(JSON.read_text(encoding='utf-8'))['pages'][:BASE]
assert len(pages) == BASE and pages[-1]['n'] == BASE
have = {(p['place'], p['word'], p['mod']) for p in pages}
slugs = {p['slug'] for p in pages}
labels = {p['label'] for p in pages}

new = []
for pl in ORDER:
    assert pl in P, pl
    region, kind = P[pl][0], P[pl][1]
    for w in WORDS:
        for m in MODS:
            if (pl, w, m) in have:
                continue
            kw = f'{pl} {w} {m}'
            new.append(dict(n=BASE + len(new) + 1, no=0, kw=kw, slug=kw.replace(' ', '-'), label=pl, place=pl, region=region,
                            unit=kind, word=w, mod=m, prio=3, wave=0))
half = (len(new) + 1) // 2
for i, p in enumerate(new):
    p['wave'] = 5 if i < half else 6
assert not slugs & {p['slug'] for p in new}, '기존 슬러그와 겹침'
assert len({p['slug'] for p in new}) == len(new)

JSON.write_text(json.dumps({'pages': pages + new}, ensure_ascii=False, indent=0), encoding='utf-8')

wb = Workbook(); sh = wb.active; sh.title = '추가키워드'
sh.append(['키워드', 'URL', '오픈일'])
for p in new:
    sh.append([p['kw'], f"{URL}/{p['slug']}/", OPEN_DATE[p['wave']]])
for c in sh[1]:
    c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='1B1E22'); c.alignment = Alignment(horizontal='center')
for col, w in zip('ABC', [30, 60, 8]):
    sh.column_dimensions[col].width = w
sh.freeze_panes = 'A2'
wb.save(OUT_XLSX)

print('추가', len(new), Counter(p['wave'] for p in new))
print(Counter(p['region'] for p in new))
