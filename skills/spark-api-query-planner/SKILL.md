---
name: spark-api-query-planner
description: Convert a data question into a Spark API query plan with resources, filters, fields, pagination, authentication, and validation steps.
---
# Spark API Query Planner
1. Define the requested result, MLS scope, dataset, filters, and freshness requirement.
2. Select documented resources and fields only.
3. Plan authentication, pagination, limits, error handling, and validation.
4. Return a request outline and expected response shape.
5. Flag unavailable fields or permissions instead of inventing them.
