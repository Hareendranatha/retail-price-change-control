# Setup guide

1. Create a Google Form with required questions in this order: Branch, Item Code, Cost, MRP, Cost Type, Request Reason. Enable email collection so the linked response columns are Timestamp, Email, then those six fields. Confirm the actual column order matches the data dictionary before installing the script.
2. Use dropdowns for branches and cost types. Cost and MRP must be numbers greater than zero. Item Code must match `^[0-9]{1,6}$`. Disable response editing to preserve submitted evidence.
3. Link the form to a spreadsheet and rename its response tab `Form_Responses`. Add I:X headers from the data dictionary. Set the spreadsheet timezone to your operational timezone, e.g. Asia/Colombo.
4. Create Settings, Items, Requesters and Dashboard tabs. Populate master data using synthetic examples first. Format item-code and phone columns as plain text before importing.
5. Open Extensions → Apps Script. Paste `src/Code.gs`, save, and add an **installable spreadsheet On form submit** trigger for `handleFormSubmit`. Choose the spreadsheet event, not the Google Forms event. Authorize under the designated owner account. Do not run the event handler manually.
6. Add formulas from FORMULAS.md to row 2 and fill down into a suitable prepared range. Avoid placing formulas in I, M, O or X: the handler writes these fields. Monitor formula coverage as the response table grows.
7. Add a status dropdown PENDING, IN REVIEW, DONE, REJECT to M. Restrict response/master/formula columns to the owner; permit designated reviewers to edit only decision fields. Requesters should submit the Form without spreadsheet edit access.
8. Validate a submitted request, claim it by filling V and selecting IN REVIEW, compare its margin, and check supplier evidence. If accepted, update ERP through authorized roles, then record its change reference in N, completion timestamp in W and status DONE. For rejection, record a reason and completion timestamp, then select REJECT.
9. Click the WhatsApp link, verify recipient and content, and manually send. Notification delivery is outside the starter's audit coverage.
10. Test all acceptance scenarios below using the actual Google account before using real requests.

## Acceptance scenarios
| Scenario | Expected behavior |
|---|---|
| Code 2626 or 002626 | Stored as text 002626 |
| Cost=100, tax=18%, type Cost | System cost 118.00 |
| Cost=100, type V.Cost | System cost 100.00 |
| Cost=100, type Non Vat Cost | System cost 100.00 |
| Invalid type, zero cost or invalid code | Validation error; review blocked operationally |
| Missing item agreement | Blank agreement, flagged for manual investigation |
| Request at 23:59 on selected end date | Included in dashboard |
| PENDING request | No WhatsApp decision link |
| REJECT without note | No WhatsApp decision link |
| Replayed submission event | Same request ID; existing status retained |

Protect configuration cells and document every tax-rate change. The handler stores the calculated cost as a value, so later settings changes do not recalculate historical submissions. Direct edits to submitted input cells do not rerun the handler; correct errors using a new request linked to the old request ID.

## Publishing to GitHub
Suggested name: `retail-price-change-control`. Create a repository in your account, extract this package and upload its contents with README.md at the repository root. Add the description and topics from PORTFOLIO.md, then pin the repository on your profile. Add sanitized screenshots only after running your own demo. No screenshots or live dashboard are supplied in this package.

Do not publish real employee emails, phone numbers, supplier terms, ERP exports, spreadsheet IDs, or access tokens. Choose an open-source license only after confirming you own the material and have permission to publish it. This package intentionally does not grant an open-source license.
