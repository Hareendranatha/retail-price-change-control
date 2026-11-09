# Controls and management measures

## Roles
| Role | Responsibility |
|---|---|
| Requester | Submit accurate unit cost, MRP, cost type and supporting reason |
| Price reviewer | Claim request, validate evidence and supplier terms, update ERP or reject |
| Purchasing / Finance | Maintain approved agreement definitions and resolve exceptions |
| System owner | Maintain access, master data, triggers and recovery procedures |

ERP permission restrictions are a prerequisite. Sheet protections reduce accidental edits but are not an immutable audit system. Owners can change data. UUIDs identify requests; they do not authenticate requesters. Collected email authenticity depends on Form configuration.

Assignment is an operational convention, not an atomic lock: reviewers must coordinate before editing ERP. IN REVIEW reduces duplicate effort but cannot eliminate concurrent claims. The script lock only serializes submission handling. A controlled review app would be needed for enforceable claiming and transitions.

Completion time and reviewer identity are manual in this starter. Version history can support investigation but does not replace a dedicated audit log. Do not claim automatic SLA proof from these fields. Supplier/master formulas show the current agreement; capture an approved agreement snapshot in an extended implementation when historical evidence is required.

## Dashboard measures
Use the filtered dataset at Dashboard!A7:X with headers in row 7. Build pivot tables below or on separate tabs.

| Measure | Definition / interpretation |
|---|---|
| Total requests | Count nonblank request IDs |
| Done / Rejected / Pending / In review | Count each explicit status |
| Open requests | Pending plus In review |
| Branch / requester / supplier / category volume | Request count grouped by dimension |
| Requests over time | Count by submission date, week or month |
| Review turnaround | Completed At minus Timestamp for closed valid rows |
| Margin exception | GP% below comparable agreed margin |
| Rejection rate | Rejected divided by closed requests |

Example total: `=COUNTA(O8:O)`; Done: `=COUNTIF(M8:M,"DONE")`. Return 0 rather than divide by zero when no requests are closed. Show missing master-data count separately. Exclude invalid rows from financial calculations and disclose the count.

## Decision quality
Request volume alone does not measure officer accuracy: busy branches and legitimate supplier revisions generate more requests. Combine substantiated requester errors with GRN volume and comparable responsibilities. Suggested error rate: confirmed requester-caused errors / GRNs processed.

A margin gap is a signal for investigation, not proof of a supplier agreement violation. Check effective dates, item identity, invoice units, promotions, tax basis and approved exceptions before attributing responsibility.

## Evidence to collect for a credible case study
Measure comparable periods before and after deployment: median and 90th percentile completion time, duplicate requests, unresolved backlog age, manually reworked calculations and missing decisions. State sample sizes and measurement limitations. No actual business-impact figures are included here.
