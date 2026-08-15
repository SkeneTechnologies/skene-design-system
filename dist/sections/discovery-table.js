import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { artifactHeader, AppPanel, AppWindow, DataCell, DataRow, DataTable, StatPill, } from './artifact-shell.js';
export function DiscoveryTable({ columns, rows, title, source, separator = '/', summary, summaryStatus = 'bad', actions, className, }) {
    // Both computed as undefined-when-empty rather than as empty elements:
    // `AppWindow` drops the whole bar when neither is present, and an empty flex
    // row above the panel reads as a rendering fault.
    // Both halves undefined-when-empty rather than empty elements: AppWindow
    // drops the whole bar when neither is present, and an empty flex row above
    // the panel reads as a rendering fault. See artifact-shell.
    const { crumb, bar } = artifactHeader({
        title,
        source,
        separator,
        summary,
        summaryStatus,
        actions,
    });
    return (_jsx(AppWindow, { crumb: crumb, actions: bar, className: className, children: _jsx(AppPanel, { children: _jsx(DataTable, { columns: [columns.event, columns.type, columns.foundAt, columns.status], children: rows.map((row, i) => (_jsxs(DataRow, { children: [_jsx(DataCell, { mono: true, children: row.event }), _jsx(DataCell, { children: row.type }), _jsx(DataCell, { mono: true, muted: true, children: row.foundAt }), _jsx(DataCell, { children: _jsx(StatPill, { status: row.status, children: row.statusLabel }) })] }, i))) }) }) }));
}
