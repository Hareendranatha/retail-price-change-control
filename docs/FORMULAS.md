# Google Sheets formulas

These formulas use comma separators and the exact schema in DATA_DICTIONARY.md. Fill down J:L, P:T and U. Format K, L and P as percentages. P is a percentage-point gap, not a relative percentage change.

## Retail spread and agreement
J2:
```excel
=IF(OR(X2<>"VALID",I2="",F2<=0),"",F2-I2)
```
K2:
```excel
=IF(J2="","",J2/F2)
```
L2:
```excel
=IFERROR(VLOOKUP(D2,Items!A:E,5,FALSE),"")
```
P2:
```excel
=IF(OR(K2="",L2=""),"",K2-L2)
```
Q2 (Supplier):
```excel
=IFERROR(VLOOKUP(D2,Items!A:E,3,FALSE),"")
```
R2 (Category):
```excel
=IFERROR(VLOOKUP(D2,Items!A:E,4,FALSE),"")
```
S2 (Name):
```excel
=IFERROR(VLOOKUP(B2,Requesters!A:C,2,FALSE),"")
```
T2 (Phone):
```excel
=IFERROR(VLOOKUP(B2,Requesters!A:C,3,FALSE),"")
```

## Cost normalization
The script writes I as a value at submission time using Settings!B1. Reference formula for an alternative formula-only implementation:
```excel
=IF(OR(E2="",E2<=0),"",IF(G2="Cost",ROUNDUP(E2*(1+Settings!$B$1),2),IF(OR(G2="V.Cost",G2="Non Vat Cost"),ROUNDUP(E2,2),"")))
```
Do not use this formula together with the script in I. Unlike stored script values, formulas recalculate historical costs when the rate changes. `Cost` means excluding VAT for a taxable item; `V.Cost` means already including VAT; `Non Vat Cost` means a non-taxable item. Item tax eligibility should be checked against an approved tax master in a production extension. The sample 18% is configuration, not legal tax advice or a statement of the current applicable rate.

## Prefilled WhatsApp link — U2
```excel
=IF(AND(X2="VALID",T2<>"",OR(M2="DONE",AND(M2="REJECT",N2<>""))),HYPERLINK("https://wa.me/"&T2&"?text="&ENCODEURL("Hello "&S2&CHAR(10)&"Request: "&O2&CHAR(10)&"Supplier: "&Q2&CHAR(10)&"Item: "&D2&CHAR(10)&"Cost type: "&G2&CHAR(10)&"Submitted cost: "&TEXT(E2,"0.00")&CHAR(10)&"MRP: "&TEXT(F2,"0.00")&CHAR(10)&IF(M2="DONE","Your request has been completed.","Your request was rejected. Reason: "&N2)),"Open WhatsApp"),"")
```
Phones must use international digits, without spaces, punctuation or a plus sign. Sample phones are intentionally blank to avoid contacting anyone. Opening the link does not send a message or prove delivery.

## Date and optional branch filter — Dashboard A7
```excel
=IFERROR(QUERY(Form_Responses!A1:X,"select * where A >= datetime '"&TEXT(N3,"yyyy-MM-dd")&" 00:00:00' and A < datetime '"&TEXT(N4+1,"yyyy-MM-dd")&" 00:00:00'"&IF(N5<>""," and C = "&CHAR(34)&N5&CHAR(34),""),1),"No matching requests / check filters")
```
The exclusive next-day boundary includes all submissions on the end date. Set valid start/end dates with end >= start. N5 should be a controlled branch dropdown; branch labels must not contain double quotes for this query construction. Use actual date/time values in A, not text dates. The error label can also indicate a query problem; investigate unexpected empty results. Edit source request rows only, never the QUERY result.
