import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const TOUR_STORAGE_KEY = 'orbitra_tour_completed';

export interface TourStep {
  id: string;
  /** CSS selector (e.g. [data-tour="sidebar"]) – boşsa merkez popup */
  target?: string;
  title: string;
  content: string;
  /** Popup konumu: hedefe göre */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const defaultTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Orbitra\'ya Hoş Geldiniz',
    content: 'Bu kısa tur ile arayüzü tanıyacaksınız. İleri butonu ile adımları takip edebilir, isterseniz Atla ile turu kapatabilirsiniz.',
    placement: 'center',
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    title: 'Sol Menü',
    content: 'Kontrol Paneli, tüm analiz modülleri (Yangın, İSG, Alan İhlali, Ürün Sayımı vb.) ve ayarlara buradan ulaşırsınız.',
    placement: 'right',
  },
  {
    id: 'dashboard-link',
    target: '[data-tour="dashboard-link"]',
    title: 'Kontrol Paneli',
    content: 'Ana sayfa. KPI özeti, modül bildirimleri ve canlı aktivite akışı burada.',
    placement: 'right',
  },
  {
    id: 'kpi-metrics',
    target: '[data-tour="kpi-metrics"]',
    title: 'Özet KPI\'lar',
    content: 'İSG uyumu, aktif uyarılar, ürün sayısı ve kamera durumu gibi ana göstergeler tek bakışta.',
    placement: 'bottom',
  },
  {
    id: 'module-summary',
    target: '[data-tour="module-summary"]',
    title: 'Modüllerden Bildirimler',
    content: 'Tüm modüllerden gelen bildirim sayıları. Yangın, İSG, alan ihlali, forklift vb. tek panelde.',
    placement: 'bottom',
  },
  {
    id: 'finish',
    title: 'Tur Tamamlandı',
    content: 'İstediğiniz zaman üst menüden veya Ayarlar sayfasından "Site Turunu Başlat" ile bu tanıtımı tekrarlayabilirsiniz.',
    placement: 'center',
  },
];

interface TourContextType {
  isActive: boolean;
  stepIndex: number;
  steps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  hasCompletedTour: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps] = useState<TourStep[]>(defaultTourSteps);
  const [completed, setCompleted] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem(TOUR_STORAGE_KEY) === 'true'
  );

  const hasCompletedTour = completed;

  const startTour = useCallback(() => {
    setStepIndex(0);
    setIsActive(true);
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setCompleted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
  }, []);

  const nextStep = useCallback(() => {
    setStepIndex((i) => {
      if (i >= steps.length - 1) {
        completeTour();
        return 0;
      }
      return i + 1;
    });
  }, [steps.length, completeTour]);

  const prevStep = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const skipTour = useCallback(() => {
    completeTour();
  }, [completeTour]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        stepIndex,
        steps,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        hasCompletedTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (ctx === undefined) throw new Error('useTour must be used within TourProvider');
  return ctx;
}
