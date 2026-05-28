import midtrans from "midtrans-client";
import { env } from "../../config/envConfig";

export const coreClient = new midtrans.CoreApi({
  isProduction: env.isProduction,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
});
