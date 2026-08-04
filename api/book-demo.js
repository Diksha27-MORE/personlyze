export default async function handler(req, res) {
  console.log("API HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  return res.status(200).json({
    success: true,
    message: "API is working",
  });
}