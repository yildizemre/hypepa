import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTour } from '../contexts/TourContext';

const PADDING = 12;
const POPUP_OFFSET = 16;

export default function ProductTour() {
  const { isActive, stepIndex, steps, nextStep, prevStep, skipTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const step = steps[stepIndex];
  const isCenter = !step?.target || step.placement === 'center';
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!isActive || !step) return;

    const updatePosition = () => {
      if (step.target) {
        const el = document.querySelector(step.target);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetRect(new DOMRect(rect.left - PADDING, rect.top - PADDING, rect.width + PADDING * 2, rect.height + PADDING * 2));

          const placement = step.placement ?? 'bottom';
          const popupWidth = 320;
          const popupHeight = 180;
          let top = 0;
          let left = 0;

          if (placement === 'center') {
            top = window.innerHeight / 2 - popupHeight / 2;
            left = window.innerWidth / 2 - popupWidth / 2;
          } else if (placement === 'bottom') {
            top = rect.bottom + POPUP_OFFSET;
            left = rect.left + rect.width / 2 - popupWidth / 2;
          } else if (placement === 'top') {
            top = rect.top - popupHeight - POPUP_OFFSET;
            left = rect.left + rect.width / 2 - popupWidth / 2;
          } else if (placement === 'right') {
            top = rect.top + rect.height / 2 - popupHeight / 2;
            left = rect.right + POPUP_OFFSET;
          } else {
            top = rect.top + rect.height / 2 - popupHeight / 2;
            left = rect.left - popupWidth - POPUP_OFFSET;
          }

          left = Math.max(16, Math.min(window.innerWidth - popupWidth - 16, left));
          top = Math.max(16, Math.min(window.innerHeight - popupHeight - 16, top));
          setPopupPosition({ top, left });
        } else {
          setTargetRect(null);
          setPopupPosition({ top: window.innerHeight / 2 - 90, left: window.innerWidth / 2 - 160 });
        }
      } else {
        setTargetRect(null);
        setPopupPosition({
          top: window.innerHeight / 2 - 90,
          left: window.innerWidth / 2 - 160,
        });
      }
    };

    updatePosition();
    const resizeObs = new ResizeObserver(updatePosition);
    const el = step.target ? document.querySelector(step.target) : null;
    if (el) resizeObs.observe(el);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObs.disconnect();
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isActive, stepIndex, step?.target, step?.placement]);

  if (!isActive || !step) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-auto"
        style={{ isolation: 'isolate' }}
      >
        {/* Overlay: 4 panel ile hedef dışını karartma */}
        <div className="absolute inset-0 pointer-events-auto">
          {targetRect ? (
            <>
              <div
                className="absolute bg-slate-900/70 left-0 right-0 top-0"
                style={{ height: targetRect.top }}
              />
              <div
                className="absolute bg-slate-900/70 left-0 right-0 bottom-0"
                style={{ height: window.innerHeight - targetRect.bottom, top: 'auto' }}
              />
              <div
                className="absolute bg-slate-900/70"
                style={{
                  left: 0,
                  top: targetRect.top,
                  width: targetRect.left,
                  height: targetRect.height,
                }}
              />
              <div
                className="absolute bg-slate-900/70"
                style={{
                  left: targetRect.right,
                  top: targetRect.top,
                  width: window.innerWidth - targetRect.right,
                  height: targetRect.height,
                }}
              />
              <div
                className="absolute rounded-xl ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent pointer-events-none"
                style={{
                  left: targetRect.left,
                  top: targetRect.top,
                  width: targetRect.width,
                  height: targetRect.height,
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-slate-900/70" />
          )}
        </div>

        {/* Popup */}
        {popupPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-10 w-80 max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-xl border border-slate-200 p-5"
            style={{ top: popupPosition.top, left: popupPosition.left }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <button
                type="button"
                onClick={skipTour}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-5">{step.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {stepIndex + 1} / {steps.length}
              </span>
              <div className="flex gap-2">
                {!isFirst && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Geri
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isLast ? 'Bitir' : 'İleri'}
                  {!isLast && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
