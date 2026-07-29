const required = ["MONGODB_URI", "ADMIN_PASSWORD", "SESSION_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.log("⚠️  Missing environment variables:", missing.join(", "));
  console.log("   Copy .env.example to .env.local and fill these in.");
} else {
  console.log("✅ All required environment variables are set.");
}
