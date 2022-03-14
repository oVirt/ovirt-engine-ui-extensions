 Translation Guide
 ======

This project uses [ICU message format](https://formatjs.io/docs/core-concepts/icu-syntax/).

 ## Formatted arguments

[Formatted arguments](https://formatjs.io/docs/core-concepts/icu-syntax/#formatted-argument) are the preferred way of formatting. Custom formatting functions are allowed if the output is not part of the message (i.e. non translated value embeded directly in the markup) or if required formatting cannot be achieved using ICU format.
 
 ### Number skeleton

Common number formatting options (in concise syntax) and their mapping to Intl.NumberFormat properties (used for custom formatting functions):
1. `minimumIntegerDigits: 1` -> `0` ([integer-width](https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width))
2. `minimumFractionDigits: 0`, `maximumFractionDigits: 0` -> `.` (equivalent to [precision-integer](https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#precision) )
3. `minimumFractionDigits: 1`, `maximumFractionDigits: 1` -> `.0` ([fraction-precision](https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#fraction-precision))
4. `useGrouping: false` -> `,_` ([group-off](https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#grouping))
5. `style: 'percent'` -> `%` ([percent](https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#unit) unit)

Given the following message:
```console
 dashboardUtilizationCardAvailableOfPercent: {
    id: 'dashboard.utilizationCardAvailableOfPercent',
    defaultMessage: 'of {percent, number, :: scale/0.01 % .  0 ,_ }',
    description: 'part of utilization card\'s summary',
 }
```
when we call `msg.dashboardUtilizationCardAvailableOfPercent({ percent: 1234.5 })`, using `en-US` locales, the output will be:

```
of 1235%
```


 Full reference is available [here](https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html).
 
 


