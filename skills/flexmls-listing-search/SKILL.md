---
name: flexmls-listing-search
description: Search Flexmls listings from natural-language property criteria by resolving listing metadata first and then executing the listing search tool. Use for property, listing, open house, map, photo, price, location, feature, and status searches that should run against the current Flexmls MCP data source.
---

# Flexmls Listing Search

1. Parse the request into location, price, property type, status, features, dates, and result preferences.
2. Call the Flexmls metadata search before the listing search whenever a criterion is not already mapped to a verified field.
3. Execute the listing search only with supported fields and valid values.
4. Return matching listings with available photos, map context, open houses, and source links.
5. Explain criteria that could not be applied and never silently drop requested filters.
6. Ask for clarification only when the search cannot be executed safely; otherwise use reasonable defaults and state them.
