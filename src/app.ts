import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { Payload } from "./types";
import { initDb } from "./database";
import { registerUser, getUser, updateUser } from "./handlers/user";
import {
  addProduct,
  updateProduct,
  getVendorProducts,
} from "./handlers/vendor";
import {
  getProduct,
  getAllProducts,
  addReview,
  getProductReviews,
} from "./handlers/product";
import {
  createOrder,
  updateOrderStatus,
  getUserOrders,
} from "./handlers/order";
import { hexToString, stringToHex } from "./utils";

const ROLLUP_SERVER =
  process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004";

export const app = createApp({ url: ROLLUP_SERVER });

// Initialize the database
initDb().catch(console.error);

app.addAdvanceHandler(async ({ payload }) => {
  let strPayload = hexToString(payload);
  let payloadProcessed: Payload = JSON.parse(strPayload);
  let result;

  try {
    switch (payloadProcessed.action) {
      case "REGISTER_USER":
        result = await registerUser(
          payloadProcessed.name,
          payloadProcessed.email,
          payloadProcessed.type,
        );
        break;
      case "UPDATE_USER":
        result = await updateUser(
          payloadProcessed.userId,
          payloadProcessed.name,
          payloadProcessed.email,
        );
        break;
      case "ADD_PRODUCT":
        result = await addProduct(
          payloadProcessed.vendorId,
          payloadProcessed.name,
          payloadProcessed.description,
          payloadProcessed.price,
          payloadProcessed.stock,
        );
        break;
      case "UPDATE_PRODUCT":
        result = await updateProduct(
          payloadProcessed.productId,
          payloadProcessed.name,
          payloadProcessed.description,
          payloadProcessed.price,
          payloadProcessed.stock,
        );
        break;
      case "CREATE_ORDER":
        result = await createOrder(
          payloadProcessed.userId,
          payloadProcessed.productId,
          payloadProcessed.quantity,
        );
        break;
      case "UPDATE_ORDER_STATUS":
        result = await updateOrderStatus(
          payloadProcessed.orderId,
          payloadProcessed.status,
        );
        break;
      case "ADD_REVIEW":
        result = await addReview(
          payloadProcessed.userId,
          payloadProcessed.productId,
          payloadProcessed.rating,
          payloadProcessed.comment,
        );
        break;
      default:
        throw new Error("Invalid action");
    }

    app.createNotice({
      payload: stringToHex(JSON.stringify({ success: true, data: result })),
    });
  } catch (error) {
    app.createNotice({
      payload: stringToHex(
        JSON.stringify({ success: false, error: error.message }),
      ),
    });
  }

  return "accept";
});

const router = createRouter({ app });

router.add("user/:userId", async ({ params: { userId } }) => {
  const user = await getUser(userId);
  return JSON.stringify(user);
});

router.add("products", async () => {
  const products = await getAllProducts();
  return JSON.stringify(products);
});

router.add("product/:productId", async ({ params: { productId } }) => {
  const product = await getProduct(productId);
  return JSON.stringify(product);
});

router.add("product/:productId/reviews", async ({ params: { productId } }) => {
  const reviews = await getProductReviews(productId);
  return JSON.stringify(reviews);
});

router.add("vendor/:vendorId/products", async ({ params: { vendorId } }) => {
  const products = await getVendorProducts(vendorId);
  return JSON.stringify(products);
});

router.add("user/:userId/orders", async ({ params: { userId } }) => {
  const orders = await getUserOrders(userId);
  return JSON.stringify(orders);
});

app.addInspectHandler(router.handler);
