import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Security Utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_key_32_chars_long_1234567"; // Must be 32 chars
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text: string) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function hashSHA256(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

// API Routes
app.post("/api/auth/otp/generate", (req, res) => {
  const { mobileNumber } = req.body;
  // In real app, send SMS. For demo, return success.
  console.log(`OTP generated for ${mobileNumber}`);
  res.json({ success: true, message: "OTP sent" });
});

app.post("/api/auth/otp/verify", (req, res) => {
  const { mobileNumber, otp } = req.body;
  // Mock verification
  if (otp === "1234") {
    const token = jwt.sign({ mobileNumber }, process.env.JWT_SECRET || "secret", { expiresIn: "24h" });
    res.json({ success: true, token });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

app.post("/api/transactions/execute", (req, res) => {
  const { senderId, receiverMobile, amount, location, deviceId } = req.body;
  
  // Simple Fraud Detection Logic
  let riskLevel = "low";
  let riskReason = "";

  if (amount > 10000) {
    riskLevel = "medium";
    riskReason = "High amount transaction";
  }
  
  // Mock response
  res.json({ 
    success: true, 
    transactionId: crypto.randomUUID(),
    riskLevel,
    riskReason
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
