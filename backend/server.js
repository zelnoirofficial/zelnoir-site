import express from "express";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------
// RAZORPAY
// -----------------------------

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// -----------------------------
// BASIC SETTINGS
// -----------------------------

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true
  })
);

// -----------------------------
// LOCAL ORDER STORAGE
// -----------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, "[]");
}

function readOrders() {
  return JSON.parse(fs.readFileSync(ordersFile, "utf8"));
}

function writeOrders(orders) {
  fs.writeFileSync(
    ordersFile,
    JSON.stringify(orders, null, 2)
  );
}

function createOrderNumber() {
  return `ZN${Date.now().toString().slice(-8)}`;
}

// -----------------------------
// HEALTH CHECK
// -----------------------------

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    brand: "ZELNOIR",
    message: "ZELNOIR API is running"
  });
});

// -----------------------------
// RAZORPAY CREATE ORDER
// -----------------------------

app.post("/api/orders/create", express.json(), async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.pincode ||
      !items?.length ||
      !total
    ) {
      return res.status(400).json({
        message: "Missing order details"
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Number(total),
      currency: "INR",
      receipt: `ZN_${Date.now()}`,
      notes: {
        brand: "ZELNOIR",
        customer_phone: String(customer.phone)
      }
    });

    const localOrder = {
      orderNumber: createOrderNumber(),
      razorpayOrderId: razorpayOrder.id,
      customer,
      items,
      total: Number(total),
      status: "payment_pending",
      createdAt: new Date().toISOString()
    };

    const orders = readOrders();

    orders.push(localOrder);

    writeOrders(orders);

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      orderNumber: localOrder.orderNumber
    });

  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Unable to create payment order"
    });
  }
});

// -----------------------------
// RAZORPAY PAYMENT VERIFICATION
// -----------------------------

app.post("/api/orders/verify", express.json(), (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      total
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details missing"
      });
    }

    const orders = readOrders();

    const existingOrder = orders.find(
      (order) =>
        order.razorpayOrderId === razorpay_order_id
    );

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature"
      });
    }

    existingOrder.paymentId = razorpay_payment_id;
    existingOrder.status = "paid";
    existingOrder.customer = customer;
    existingOrder.items = items;
    existingOrder.total = Number(total);
    existingOrder.paidAt = new Date().toISOString();

    writeOrders(orders);

    res.json({
      ok: true,
      orderNumber: existingOrder.orderNumber,
      message: "Payment verified successfully"
    });

  } catch (error) {
    console.error("Verification error:", error);

    res.status(500).json({
      message: "Payment verification failed"
    });
  }
});

// -----------------------------
// CASH ON DELIVERY
// -----------------------------

app.post("/api/orders/cod", express.json(), (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.pincode ||
      !items?.length ||
      !total
    ) {
      return res.status(400).json({
        message: "Missing order details"
      });
    }

    const localOrder = {
      orderNumber: createOrderNumber(),
      customer,
      items,
      total: Number(total),
      status: "cod_pending",
      createdAt: new Date().toISOString()
    };

    const orders = readOrders();

    orders.push(localOrder);

    writeOrders(orders);

    res.json({
      ok: true,
      orderNumber: localOrder.orderNumber,
      message: "COD order placed successfully"
    });

  } catch (error) {
    console.error("COD error:", error);

    res.status(500).json({
      message: "Unable to place COD order"
    });
  }
});

// -----------------------------
// RAZORPAY WEBHOOK
// -----------------------------

app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const signature =
        req.headers["x-razorpay-signature"];

      if (!signature) {
        return res.status(400).send(
          "Webhook signature missing"
        );
      }

      if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
        return res.status(500).send(
          "Webhook secret not configured"
        );
      }

      const expectedSignature = crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(req.body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).send(
          "Invalid webhook signature"
        );
      }

      const event = JSON.parse(
        req.body.toString()
      );

      if (
        event.event === "order.paid" ||
        event.event === "payment.captured"
      ) {
        const paymentEntity =
          event.payload?.payment?.entity;

        const orderEntity =
          event.payload?.order?.entity;

        const razorpayOrderId =
          paymentEntity?.order_id ||
          orderEntity?.id;

        if (razorpayOrderId) {
          const orders = readOrders();

          const localOrder = orders.find(
            (order) =>
              order.razorpayOrderId === razorpayOrderId
          );

          if (localOrder) {
            localOrder.status = "paid";
            localOrder.webhookEvent = event.event;
            localOrder.webhookUpdatedAt =
              new Date().toISOString();

            writeOrders(orders);
          }
        }
      }

      res.json({
        received: true
      });

    } catch (error) {
      console.error("Webhook error:", error);

      res.status(400).send(
        "Webhook processing failed"
      );
    }
  }
);

// -----------------------------
// START SERVER
// -----------------------------

app.listen(PORT, () => {
  console.log(
    `ZELNOIR API running on port ${PORT}`
  );
});
