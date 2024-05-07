import { FedimintClientBuilder } from "fedimint-ts"
import { z } from "zod"
import { fediModName } from "./constants"

export const createFedimintClient = async (federationId: string) => {
  const clientBuilder = new FedimintClientBuilder()
    .setBaseUrl(process.env.FEDIMINT_CLIENTD_URL)
    .setPassword(process.env.FEDIMINT_CLIENTD_PASSWORD)
    .setActiveFederationId(federationId)

  const client = clientBuilder.build()

  await client.useDefaultGateway()

  const { federationIds } = await client.federationIds()

  if (!federationIds.includes(federationId))
    throw new Error(
      fediModName +
        " is not enabled in this federation. Please contact Fedi's Support Team.",
    )

  return client
}

export const federationIdSchema = z
  .string()
  .min(48)
  .max(192)
  .regex(/[a-f0-9]+/)
