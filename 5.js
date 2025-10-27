import crypto from "crypto";
import express from "express";

const router = express.Router();

router.post("/api/tylt/webhook", express.json(), (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    const signatureHeader = req.headers["x-tlp-signature"];
    const secret = process.env.API_SECRET;

    // Validate Tylt webhook signature
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (signatureHeader !== computedSignature) {
      console.error("Invalid webhook signature received!");
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    // Example: Check if payment completed
    if (event.status === "Paid" || event.status === "Completed") {
      console.log("✅ Payment completed:", event.orderId);
      // Update your database or trigger notifications here
    }

    // Acknowledge webhook
    res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Server error");
  }
});

export default router;
