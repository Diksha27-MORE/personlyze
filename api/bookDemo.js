export async function submitBookDemoRequest(payload) {
  const response = await fetch("/api/book-demo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  console.log("Status:", response.status);
  console.log("Response:", text);

  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}