import { useCallback, useEffect, useRef, useState } from 'react';
import { formEmbedUrl, formId } from '../data/content';
import type { UiLabels } from '../data/content';

interface CurationFormModalProps {
  labels: UiLabels;
  open: boolean;
  onClose: () => void;
  onSubmitted: (submissionId: string) => boolean;
}

export default function CurationFormModal({ labels, open, onClose, onSubmitted }: CurationFormModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const submittedRef = useRef(false);
  const [frameAttempt, setFrameAttempt] = useState(0);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [pendingSubmissionId, setPendingSubmissionId] = useState<string | null>(null);

  const closeForm = useCallback(() => {
    setFrameLoaded(false);
    setPendingSubmissionId(null);
    onClose();
  }, [onClose]);

  function reloadForm() {
    setFrameLoaded(false);
    setFrameAttempt((current) => current + 1);
  }

  useEffect(() => {
    if (!open) return undefined;

    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeForm();
    };
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://tally.so'
        || event.source !== iframeRef.current?.contentWindow
        || typeof event.data !== 'string') return;

      try {
        const message = JSON.parse(event.data) as {
          event?: unknown;
          payload?: { formId?: unknown; id?: unknown };
        };
        if (message.payload?.formId !== formId) return;
        if (message.event === 'Tally.FormLoaded') {
          setFrameLoaded(true);
          return;
        }
        if (submittedRef.current
          || message.event !== 'Tally.FormSubmitted'
          || typeof message.payload.id !== 'string'
          || !message.payload.id) return;
        submittedRef.current = true;
        if (!onSubmitted(message.payload.id)) setPendingSubmissionId(message.payload.id);
      } catch {
        // Tally가 아닌 메시지나 불완전한 이벤트는 무시합니다.
      }
    };

    submittedRef.current = false;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('message', handleMessage);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
      previousActiveElement?.focus();
    };
  }, [open, closeForm, onSubmitted]);

  function retryCheckout() {
    if (pendingSubmissionId && onSubmitted(pendingSubmissionId)) setPendingSubmissionId(null);
  }

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
            <button
              ref={closeButtonRef}
              type="button"
              className="form-modal-close"
              aria-label={labels.closeForm}
              onClick={closeForm}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>
        <div className="form-modal-body">
          {pendingSubmissionId && (
            <div className="form-modal-loading" role="alert">
              <p>{labels.formStorageError}</p>
              <button type="button" onClick={retryCheckout}>{labels.retryCheckout}</button>
            </div>
          )}
          {!frameLoaded && !pendingSubmissionId && (
            <div className="form-modal-loading" role="status">
              <p>{labels.formLoading}</p>
              <button type="button" onClick={reloadForm}>{labels.reloadForm}</button>
            </div>
          )}
          <iframe
            key={frameAttempt}
            ref={iframeRef}
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
