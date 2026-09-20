import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ServiceDetail } from "@/lib/kleanup-content";

/**
 * Full service breakdown for the selected section. The panel is deliberately
 * see-through: the office stays visible behind it, so opening the list reads as
 * a layer over the room rather than leaving it.
 */
export function ServiceDetails({
  detail,
  open,
  onClose,
  onQuote,
}: {
  detail: ServiceDetail;
  open: boolean;
  onClose: () => void;
  onQuote: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="kc-details-overlay fixed inset-0 z-50" />
        <Dialog.Content className="kc-details-dialog text-cream">
          <header className="kc-details-head">
            <div className="pr-10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-lime">
                What we cover
              </p>
              <Dialog.Title className="mt-1 text-lg font-semibold leading-snug sm:text-xl">
                {detail.title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/85">
                {detail.intro}
              </Dialog.Description>
            </div>
            <Dialog.Close className="kc-details-close kc-focus" aria-label="Close service details">
              <X size={16} aria-hidden="true" />
            </Dialog.Close>
          </header>

          <div className="kc-details-scroll">
            {detail.groups.map((group) => (
              <section key={group.heading} className="kc-details-group">
                <h3 className="kc-details-heading">{group.heading}</h3>
                <dl className="mt-2 space-y-2.5">
                  {group.items.map((item) => (
                    <div key={item.name} className="kc-details-item">
                      <dt className="text-sm font-semibold text-cream">{item.name}</dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed text-cream/80">
                        {item.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <footer className="kc-details-foot">
            <p className="text-[12px] leading-relaxed text-cream/70">{detail.note}</p>
            <button
              type="button"
              className="kc-btn shrink-0"
              onClick={() => {
                onClose();
                onQuote();
              }}
            >
              Get a free quote
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
