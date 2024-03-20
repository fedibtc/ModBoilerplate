import { FedimintClientBuilder } from "fedimint-ts";

const { BASE_URL, PASSWORD, NEXT_PUBLIC_DEFAULT_FEDERATION_ID } = process.env;

if (!BASE_URL) throw new Error("Environment Variable BASE_URL is required");

if (!PASSWORD) throw new Error("Environment Variable PASSWORD is required");

if (!NEXT_PUBLIC_DEFAULT_FEDERATION_ID)
  throw new Error(
    "Environment Variable NEXT_PUBLIC_DEFAULT_FEDERATION_ID is required",
  );

export const createFedimintClient = async () => {
  const clientBuilder = new FedimintClientBuilder()
    .setBaseUrl(BASE_URL)
    .setPassword(PASSWORD)
    .setActiveFederationId(NEXT_PUBLIC_DEFAULT_FEDERATION_ID);

  return clientBuilder.build();
};
