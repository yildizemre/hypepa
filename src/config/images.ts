/** public/ klasöründeki resimler (isimlere göre modüllere eşlendi) */
export const publicImages = {
  yanginvegaz: '/yanginvegaz.jpg',
  baretmaske: '/baretmaske.jpg',
  eldivenonluk: '/eldivenonluk.jpg',
  dusmebayilma: '/dusmebayilma.jpg',
  duygudurumu: '/duygudurumu.jpg',
  ergonemiktasima: '/ergonemiktasima.jpg',
  forkliftinsanmesafe: '/forkliftinsanmesafe.jpg',
  guvenliaraac: '/guvenliaraac.jpg',
  guvenliyaya: '/guvenliyaya.jpg',
  insanmakineyaklasmasi: '/insanmakineyaklasmasi.jpg',
  isiharitasi: '/isiharitasi.jpg',
  ismakinelericalismasuresi: '/ismakinelericalismasuresi.jpg',
  kameralenskapatilmasi: '/kameralenskapatilmasi.jpg',
  kameralenskapatma: '/kameralenskapatma.jpg',
  makineverimlilik: '/makineverimlilik.jpg',
  personelverimlikik: '/personelverimlikik.jpg',
  sahaharitalama: '/sahaharitalama.jpg',
  sahipsizcisim: '/sahipsizcisim.jpg',
  telefon: '/telefon.jpg',
  yasaklialan: '/yasaklialan.jpg',
  yascinsiyetanalizi: '/yascinsiyetanalizi.jpg',
  yuksektecalisma: '/yuksektecalisma.jpg',
  yuztanima: '/yuztanima.jpg',
} as const;

const U = (id: string, w = 400, h = 300) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

export const images = {
  dashboard: {
    hero: publicImages.yanginvegaz,
    controlRoom: U('1558618666-fcd25c85cd64', 600, 400),
    factory: U('1565793298595-6a879b1d9492', 800, 500),
    warehouse: publicImages.sahaharitalama,
  },
  safety: {
    helmet: publicImages.baretmaske,
    vest: publicImages.baretmaske,
    gloves: publicImages.eldivenonluk,
    workplace: publicImages.eldivenonluk,
  },
  fire: {
    smoke: publicImages.yanginvegaz,
    extinguisher: publicImages.yanginvegaz,
    alarm: publicImages.yanginvegaz,
    depot: publicImages.yanginvegaz,
  },
  area: {
    restricted: publicImages.yasaklialan,
    warehouse: publicImages.sahipsizcisim,
    fence: publicImages.yasaklialan,
  },
  vehicle: {
    forklift: publicImages.forkliftinsanmesafe,
    warehouse: publicImages.guvenliaraac,
    industrial: publicImages.insanmakineyaklasmasi,
  },
  retail: {
    store: publicImages.yascinsiyetanalizi,
    crowd: publicImages.duygudurumu,
    shelf: publicImages.yascinsiyetanalizi,
  },
  camera: {
    cctv: publicImages.kameralenskapatilmasi,
    surveillance: publicImages.kameralenskapatma,
  },
  conveyor: {
    belt: publicImages.isiharitasi,
    packaging: publicImages.isiharitasi,
  },
  theft: {
    security: publicImages.kameralenskapatilmasi,
    warehouse: publicImages.yasaklialan,
  },
  pandemic: {
    mask: publicImages.baretmaske,
    distance: publicImages.guvenliyaya,
  },
  behavioral: {
    slip: publicImages.dusmebayilma,
    phone: publicImages.telefon,
  },
  /** Verimlilik (ana sayfa sekmeleri) */
  verimlilik: {
    personel: publicImages.personelverimlikik,
    makine: publicImages.makineverimlilik,
  },
} as const;

/** Modül id → public/ resmi */
export function getImageForModule(moduleId: string): string {
  const map: Record<string, string> = {
    'fire-alert': publicImages.yanginvegaz,
    'theft-notification': publicImages.kameralenskapatilmasi,
    'camera-lens-closed': publicImages.kameralenskapatma,
    'gas-leakage': publicImages.yanginvegaz,
    'area-violation': publicImages.yasaklialan,
    'unattended-objects': publicImages.sahipsizcisim,
    'pedestrian-ways': publicImages.guvenliyaya,
    'vehicle-roads': publicImages.guvenliaraac,
    'object-tracking': publicImages.isiharitasi,
    'helmet': publicImages.baretmaske,
    'mask-ppe': publicImages.baretmaske,
    'glove': publicImages.eldivenonluk,
    'apron': publicImages.eldivenonluk,
    'forklift-distance': publicImages.forkliftinsanmesafe,
    'machine-movement': publicImages.insanmakineyaklasmasi,
    'machine-usage-time': publicImages.ismakinelericalismasuresi,
    'machine-mapping': publicImages.sahaharitalama,
    'machine-location': publicImages.sahaharitalama,
    'slips-falls': publicImages.dusmebayilma,
    'ergonomics': publicImages.ergonemiktasima,
    'working-at-heights': publicImages.yuksektecalisma,
    'lifting-safety': publicImages.ergonemiktasima,
    'phone-usage': publicImages.telefon,
    'smoking': publicImages.baretmaske,
    'mask-pandemic': publicImages.baretmaske,
    'object-people-count': publicImages.isiharitasi,
    'heatmap-pandemic': publicImages.isiharitasi,
    'age-analysis': publicImages.yascinsiyetanalizi,
    'gender-analysis': publicImages.yascinsiyetanalizi,
    'emotion-analysis': publicImages.duygudurumu,
    'heatmap-retail': publicImages.isiharitasi,
    'retail-counting': publicImages.isiharitasi,
    'face-recognition': publicImages.yuztanima,
  };
  return map[moduleId] || publicImages.kameralenskapatilmasi;
}
