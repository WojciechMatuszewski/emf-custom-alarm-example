# Custom Alarams with sls-aws-alerts plugin

This is an example showing how to use `emf` to create custom metric and how to create an alarm based on this metric.

## Learnings

I think the most important learning is that **dimensions explicitly define identity of the metric**. That means that **dimensions of the alarm have to exactly match the dimensions of the metrics you want to attach the alarm to**.

This is very important and I hope you, dear reader, will not have to go through the frustration I went through while setting this example up.
