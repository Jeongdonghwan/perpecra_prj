"""업체 사진 원본(source/raw) → public/img (긴 변 1200, jpg+webp)
   python -I scripts/prepare_images.py
출처: 2026-10-28 네이버 플레이스(m.place) 사진 탭이 IP 요청 제한(429)으로 열리지 않아,
      플레이스 정보 탭의 '홈페이지' 링크(http://01083536611.smb114.kr/) 갤러리에 업체가 직접 올린 시공 사진을 썼다.
      배너 2장(hp_01·hp_10)과 다른 업체 전화번호 간판이 보이는 사진(hp_02)은 쓰지 않는다.
      플레이스 사진 탭이 열리면 업체 사진으로 교체할 것(data/photos.json src 만 바꾸면 된다).
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'source' / 'raw'
OUT = ROOT / 'public' / 'img'
OUT.mkdir(parents=True, exist_ok=True)
d = json.loads((ROOT / 'data' / 'photos.json').read_text(encoding='utf-8'))
for c in d['photos']:
    im = ImageOps.exif_transpose(Image.open(RAW / f"{c['src']}.jpg")).convert('RGB')
    im.thumbnail((1200, 1200), Image.LANCZOS)
    im.save(OUT / f"{c['img']}.jpg", 'JPEG', quality=80, optimize=True, progressive=True)
    im.save(OUT / f"{c['img']}.webp", 'WEBP', quality=78)
    c['w'], c['h'] = im.size
    print(c['img'], im.size)
(ROOT / 'data' / 'photos.json').write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding='utf-8')
