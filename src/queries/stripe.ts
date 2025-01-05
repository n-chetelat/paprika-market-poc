import { stripe } from "@/lib/stripe";

// https://docs.stripe.com/tax/tax-for-platforms#set-up
// "txcd_10000000" // General - Electronically Supplied Services
// "txcd_50021003" // Fee for Personal Training/Fitness Classes
export async function getStripeTaxCodes() {
  const { id, object, description, name } = await stripe.taxCodes.retrieve(
    "txcd_10000000"
  );
  const general = { id, object, description, name };

  const {
    id: id2,
    description: desc2,
    name: name2,
  } = await stripe.taxCodes.retrieve("txcd_50021003");
  const training = { id: id2, description: desc2, name: name2, object };

  return [general, training];
}
