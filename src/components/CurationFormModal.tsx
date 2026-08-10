import { useEffect, useRef } from 'react';
import { formEmbedUrl, formUrl } from '../data/content';
import type { UiLabels } from '../data/content';

interface CurationFormModalProps {
  labels: UiLabels;
  open: boolean;
  onClose: () => void;
}

export default function CurationFormModal({ labels, open, onClose }: CurationFormModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="form-modal-backdrop">
      <section
        className="form-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="curation-form-title"
      >
        <header className="form-modal-header">
          <div>
            <span className="form-modal-eyebrow">DEEP PLATE · SEOUL</span>
            <h2 id="curation-form-title">{labels.formTitle}</h2>
          </div>
          <div className="form-modal-actions">
            <a href={formUrl} target="_blank" rel="noopener noreferrer">
              {labels.openExternal}
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              className="form-modal-close"
              aria-label={labels.closeForm}
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>
        <div className="form-modal-body">
          <iframe
            className="form-modal-iframe"
            src={formEmbedUrl}
            title={labels.formTitle}
            loading="eager"
          />
        </div>
      </section>
    </div>
  );
}
