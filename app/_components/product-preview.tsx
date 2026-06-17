import { ScenarioRow } from './scenario-row';

export function ProductPreview() {
  return (
    <div className="relative">
      <div
        className="relative z-[2] overflow-hidden rounded-[18px] border border-border bg-white shadow-[0_30px_60px_-25px_rgba(31,41,38,0.25),0_12px_28px_-10px_rgba(31,41,38,0.12)]"
        style={{ transform: 'rotate(-0.6deg)' }}
      >
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-secondary bg-muted px-4 py-3">
          <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#FF6058' }} />
          <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#FFBC2E' }} />
          <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#27CA40' }} />
          <span className="ml-3 font-mono text-[12px] text-[var(--palette-neutral-600)]">
            app.nextest.io / generate
          </span>
        </div>
        {/* Body */}
        <div className="px-6 py-[22px]">
          {/* Input area */}
          <div className="mb-[18px] rounded-[10px] border border-secondary bg-muted p-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--palette-neutral-400)]">
              Gereksinim
            </span>
            <p className="mt-2 text-[14px] leading-[1.55] text-foreground">
              Kullanıcı geçerli e-posta ve şifre ile giriş yapabilmeli. Yanlış girişlerde uyarı
              gösterilmeli, 5 başarısız denemeden sonra hesap 15 dakika kilitlenmeli.
            </p>
          </div>
          {/* Divider */}
          <div className="mb-1.5 flex items-center justify-between border-b border-dashed border-border pb-2.5 text-[12px] text-[var(--palette-neutral-600)]">
            <span>NexTest 12 senaryo üretti</span>
            <span className="font-mono text-[11px] text-[var(--palette-success-600)]">2.4 sn</span>
          </div>
          {/* Scenario rows */}
          <ScenarioRow
            cat="happy_path"
            pri="critical"
            title="Geçerli kimlik bilgileri ile giriş başarılı"
          />
          <ScenarioRow cat="negative" pri="high" title="Hatalı şifrede uyarı görüntülenir" />
          <ScenarioRow
            cat="edge_case"
            pri="medium"
            title="E-posta büyük/küçük harf duyarsız kabul edilir"
          />
          <ScenarioRow
            cat="negative"
            pri="high"
            title="5 başarısız denemeden sonra hesap kilitlenir"
          />
          <ScenarioRow
            cat="happy_path"
            pri="medium"
            title="Beni hatırla tercihi 30 gün saklanır"
            muted
          />
          {/* Footer badges */}
          <div className="mt-3.5 flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--palette-success-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--palette-success-600)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--palette-success-600)]" />8 happy
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--palette-warning-100)] px-2 py-0.5 text-[11px] font-medium text-[var(--palette-warning-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--palette-warning-muted)]" />2 edge
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--palette-danger-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--palette-danger-600)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--palette-danger-600)]" />2 negative
            </span>
          </div>
        </div>
      </div>
      {/* Shadow behind */}
      <div
        className="absolute inset-[8px_-12px_-12px_12px] z-[1] rounded-[18px] bg-primary opacity-[0.08]"
        style={{ transform: 'rotate(1.6deg)' }}
      />
    </div>
  );
}
