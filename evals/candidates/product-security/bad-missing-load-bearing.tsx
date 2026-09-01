/** Fixture: argues about security without ever showing the product. */
import { KeyValueTable } from '@skene/design-system/sections/key-value-table'
import { TrustPanel, TrustFact } from '@skene/design-system/sections/trust-panel'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[96px] md:py-[128px]">
        <TrustPanel title="Enterprise-grade security">
          <TrustFact title="SOC 2 Type II">Audited annually.</TrustFact>
        </TrustPanel>
      </section>
      <section className="py-[96px] md:py-[128px]">
        <KeyValueTable
          columns={[{ header: 'Control' }, { header: 'Value' }]}
          rows={[{ id: 'retention', cells: ['Retention', '30 days'] }]}
        />
      </section>
    </>
  )
}
