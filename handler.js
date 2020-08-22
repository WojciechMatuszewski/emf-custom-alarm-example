const { ApolloServer, gql } = require("apollo-server-lambda");
const { createMetricsLogger, Unit } = require("aws-embedded-metrics");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const server = new ApolloServer({
  typeDefs,
  mockEntireSchema: true
});

const gqlServer = server.createHandler();

async function runApollo(event, context, apollo) {
  return new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));
    apollo(event, context, callback);
  });
}

const handler = async (event, context) => {
  try {
    const metrics = await createMetricsLogger();

    metrics.setNamespace(process.env.METRIC_NAMESPACE);
    metrics.putMetric("Requests", 1, Unit.Count);
    metrics.setDimensions({
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME
    });

    await metrics.flush();

    return await runApollo(event, context, gqlServer);
  } catch (e) {
    const metrics = await createMetricsLogger();

    metrics.setNamespace(process.env.METRIC_NAMESPACE);
    metrics.putMetric("Errors", 1, Unit.Count);
    metrics.setDimensions({
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME
    });

    await metrics.flush();
  }
};

module.exports.handler = handler;
