/** Fixture: argues about security without ever showing the product. */
import { KeyValueTable, KeyValueRow } from '@skene/design-system/sections/key-value-table'
import { TrustPanel, TrustFact } from '@skene/design-system/sections/trust-panel'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[96px] md:py-[128px]">
        <TrustPanel heading="Enterprise-grade security">
          <TrustFact>SOC 2 Type II.</TrustFact>
        </TrustPanel>
      </section>
      <section className="py-[96px] md:py-[128px]">
        <KeyValueTable>
          <KeyValueRow label="Retention" value="30 days" />
        </KeyValueTable>
      </section>
    </>
  )
}
