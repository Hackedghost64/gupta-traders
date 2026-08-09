## 2024-08-08 - Added active state feedback for filters
**Learning:** Missing active visual and accessibility states on filter options and the main filter button causes confusion, leading users to lack immediate context about what filter is currently applied.
**Action:** Always ensure that applied filters are reflected visually (e.g., button highlighting) and accessibly (e.g., `aria-pressed="true"`) to provide clear feedback on application state.
## 2024-08-09 - Added active visual and accessibility states to the Sort button
**Learning:** Missing active visual and accessibility states on dynamic UI controls, such as sort toggle buttons, causes a gap in immediate feedback, leading to user confusion regarding the currently active sorting parameter.
**Action:** Always ensure that applied dynamic states (e.g., sort directions) are reflected visually (e.g., button highlighting, dynamic icons) and accessibly (e.g., `aria-pressed="true"`) to provide clear and unambiguous feedback on application state.
