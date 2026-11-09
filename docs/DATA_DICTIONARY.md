# Data dictionary

Use the exact columns below; formulas and script refer to these positions. Row 1 contains headers, data starts at row 2.

| Col | Field | Source / definition |
|---|---|---|
| A | Timestamp | Google Form submission time |
| B | Email | Verified collection where account settings permit |
| C | Branch | Form dropdown |
| D | Item Code | Form short text, numeric 1–6 digits; stored as six-character text |
| E | Cost | Positive numeric invoice unit cost |
| F | MRP | Positive numeric requested MRP |
| G | Cost Type | Cost / V.Cost / Non Vat Cost |
| H | Request Reason | Required form explanation |
| I | System Cost | Normalized cost, rounded upward to two decimals |
| J | GP | F minus I; operational retail spread |
| K | GP % | J divided by F |
| L | Agreed Margin % | Item master lookup; same basis as K |
| M | Status | PENDING / IN REVIEW / DONE / REJECT |
| N | Decision Note | Rejection explanation or ERP change reference |
| O | Request ID | UUID assigned by script |
| P | Margin Gap | K minus L in percentage points |
| Q | Supplier | Item master lookup |
| R | Category | Item master lookup |
| S | Requester Name | Requester master lookup |
| T | WhatsApp Phone | Requester master; international digits, no plus sign |
| U | WhatsApp Link | Formula, prefilled decision message |
| V | Assigned To | Reviewer identity, manually maintained |
| W | Completed At | Reviewer-entered completion timestamp |
| X | Validation | VALID or error message from script |

Other tabs:

- **Settings:** A1 `VAT Rate`; B1 `0.18` (illustrative configuration, verify before use).
- **Items:** A Item Code (plain text); B Item Name; C Supplier; D Category; E Agreed Margin % (decimal, e.g. 0.22).
- **Requesters:** A Email; B Name; C WhatsApp Phone (plain text).
- **Dashboard:** N3 start date; N4 end date inclusive; N5 optional branch; A7 filtered dataset.

The starter assumes a single agreed margin per item. Supplier-specific or effective-dated agreements need a composite key and agreement history. Store item codes as text in every master table. Numeric-only code validation is intentional; adapt it explicitly for alphanumeric ERP codes.
