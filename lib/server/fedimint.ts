import { FedimintClientBuilder } from "fedimint-ts";

export const createFedimintClient = async () => {
  const clientBuilder = new FedimintClientBuilder()
    .setBaseUrl(process.env.BASE_URL)
    .setPassword(process.env.PASSWORD)
    .setActiveFederationId(process.env.FEDERATION_ID);

  const client = clientBuilder.build();
  const gateways = await client.lightning.listGateways();
  const { federationIds } = await client.federationIds();

  if (!federationIds.includes(process.env.FEDERATION_ID)) {
    throw new Error(
      "AI Assistant is not enabled in this federation. Please contact Fedi's Support Team.",
    );
  }

  if (gateways.length === 0) {
    throw new Error("No gateways found");
  }

  client.setActiveGatewayId(gateways[0].info.gateway_id);

  return client;
};
