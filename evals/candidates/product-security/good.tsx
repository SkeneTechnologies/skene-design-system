/**
 * A candidate that follows the contracts. Baseline for the scorer: if this
 * ever fails, either the checks drifted or a contract changed under them.
 */
import { ArtFrame, ArtPanel, ArtTitle, DataTable, DataRow, DataCell } from '@skene/design-system/sections/artifact-shell'
import { KeyValueTable, TableNote } from '@skene/design-system/sections/key-value-table'
import { TrustPanel, TrustFact } from '@skene/design-system/sections/trust-panel'
import { FeatureRow } from '@skene/design-system/sections/feature-row'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[128px] md:py-[176px]">
        <ArtFrame kind="gh">
          <ArtPanel>
            <ArtTitle>Scopes granted</ArtTitle>
            <DataTable columns={['Scope', 'Granted', 'Used']}>
              <DataRow>
                <DataCell mono>contents:read</DataCell>
                <DataCell>yes</DataCell>
                <DataCell muted>on every review</DataCell>
              </DataRow>
            </DataTable>
          </ArtPanel>
        </ArtFrame>
      </section>

      <section className="py-[96px] md:py-[128px]">
        <KeyValueTable
          columns={[{ header: 'Control' }, { header: 'Value', mono: true }]}
          rows={[
            { id: 'residency', cells: ['Data residency', 'eu-west-1'] },
            { id: 'retention', cells: ['Retention', '30 days'] },
          ]}
        />
        <TableNote>Both are set per workspace and shown here as configured.</TableNote>
      </section>

      <section className="py-[96px] md:py-[128px]">
        <div className="grid grid-cols-3 gap-6">
          <FeatureRow title="No write access" lede="Skene opens pull requests. It never pushes to a branch you did not ask for." />
        </div>
      </section>

      <section className="py-[64px] md:py-[80px]">
        <TrustPanel title="What we will not do">
          <TrustFact title="Region pinned">Your source never leaves the region you chose.</TrustFact>
        </TrustPanel>
      </section>
    </>
  )
}
