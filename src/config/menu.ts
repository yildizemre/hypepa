/** Menü başlıkları ve alt öğeleri. pageId varsa mevcut sayfaya, yoksa module sayfasına gider. */
export type PageId = 'dashboard' | 'hse' | 'yangin' | 'alan-ihlali' | 'product-counting' | 'module' | 'user-management' | 'settings';

export interface MenuItem {
  id: string;
  labelTr: string;
  /** Ek açıklama (Türkçe) */
  description?: string;
  required?: boolean;
  pageId?: 'hse' | 'yangin' | 'alan-ihlali' | 'product-counting';
}

export interface MenuSection {
  id: string;
  titleTr: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    id: 'emergency',
    titleTr: 'Acil Durum Alarmları',
    items: [
      { id: 'fire-alert', labelTr: 'Yangın Tespiti', pageId: 'yangin' },
      { id: 'theft-notification', labelTr: 'Hırsızlık Bildirimi' },
      { id: 'camera-lens-closed', labelTr: 'Kamera Lensinin Kapatılması' },
      { id: 'gas-leakage', labelTr: 'Gaz Kaçağı Algılama' },
    ],
  },
  {
    id: 'area-object',
    titleTr: 'Alan ve Nesne Kontrolleri',
    items: [
      { id: 'area-violation', labelTr: 'Yasaklı Alan İhlali Kontrolü', pageId: 'alan-ihlali' },
      { id: 'unattended-objects', labelTr: 'Sahipsiz Cisim / Nesne Tespiti' },
      { id: 'pedestrian-ways', labelTr: 'Güvenli Yaya Yolu Analizi' },
      { id: 'vehicle-roads', labelTr: 'Güvenli Araç Yolu Analizi' },
      { id: 'object-tracking', labelTr: 'Nesne Takibi ve Kontrolü' },
    ],
  },
  {
    id: 'ppe',
    titleTr: 'Kişisel Koruyucu Donanım Kontrolleri',
    items: [
      { id: 'hse-general', labelTr: 'İSG Genel', pageId: 'hse' },
      { id: 'helmet', labelTr: 'Baret Kontrolü' },
      { id: 'mask-ppe', labelTr: 'Maske Kontrolü' },
      { id: 'glove', labelTr: 'Eldiven Kontrolü' },
      { id: 'apron', labelTr: 'Önlük Kontrolü' },
    ],
  },
  {
    id: 'vehicle',
    titleTr: 'Araç Kontrolleri',
    items: [
      { id: 'forklift-distance', labelTr: 'İnsan - Makine (Forklift) Yakınlaşma Tespiti' },
      { id: 'machine-movement', labelTr: 'Çalışan İş Makinesinin Hareketi' },
      { id: 'machine-usage-time', labelTr: 'İş Makineleri Çalışma Süreleri' },
      { id: 'machine-mapping', labelTr: 'İş Makinelerinin Saha İçerisinde Haritalandırılması' },
      { id: 'machine-location', labelTr: 'İş Makinelerinin Yerinde Olup Olmadığı' },
    ],
  },
  {
    id: 'behavioral',
    titleTr: 'Davranışsal Güvenlik Kontrolleri',
    items: [
      { id: 'slips-falls', labelTr: 'Düşme veya Bayılma Tespiti' },
      { id: 'ergonomics', labelTr: 'Güvenli Olmayan Vücut Hareketlerini Algılama' },
      { id: 'working-at-heights', labelTr: 'Yüksek Alanlarda Çalışma Kontrolü' },
      { id: 'lifting-safety', labelTr: 'Ekipman Kaldırırken Açı ve Altındaki İnsan Kontrolü' },
      { id: 'phone-usage', labelTr: 'Telefon Görüşmesi Yapan Personel Algılama' },
      { id: 'smoking', labelTr: 'Sigara İçen Personel Algılama' },
    ],
  },
  {
    id: 'pandemic',
    titleTr: 'Pandemi Kontrolleri',
    items: [
      { id: 'mask-pandemic', labelTr: 'Maske Kontrolü' },
      { id: 'object-people-count', labelTr: 'Nesne ve İnsan Sayımı' },
      { id: 'heatmap-pandemic', labelTr: 'Yoğunluk Isı Haritası' },
    ],
  },
  {
    id: 'retail',
    titleTr: 'Perakende Analizi',
    items: [
      { id: 'age-analysis', labelTr: 'Yaş Analizi' },
      { id: 'gender-analysis', labelTr: 'Cinsiyet Analizi' },
      { id: 'emotion-analysis', labelTr: 'Duygu Durumu' },
      { id: 'heatmap-retail', labelTr: 'Yoğunluk Isı Haritası' },
      { id: 'retail-counting', labelTr: 'Nesne ve İnsan Sayımı', pageId: 'product-counting' },
      { id: 'face-recognition', labelTr: 'Yüz Tanıma ile Personel Giriş Çıkışları' },
    ],
  },
];

/** Tüm modül id'leri (module sayfasında gösterim için) */
export function getModuleInfo(moduleId: string): MenuItem | undefined {
  for (const section of menuSections) {
    const item = section.items.find((i) => i.id === moduleId);
    if (item) return item;
  }
  return undefined;
}
