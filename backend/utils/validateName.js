/**
 * NameAPI Risk Detector
 * Detects fake / random / garbage names (jhfsb, gd hjsd, yte jh hc, asdfgh, etc.)
 * 
 * Returns: true  → name is safe
 *          false → name is risky / should be rejected
 */

export async function isNameSafe(name) {
  console.log("🔍 Checking name with NameAPI:", name);

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    console.log("❌ Name is empty or too short");
    return false;
  }

  const cleanedName = name.trim();

  try {
    const response = await fetch(
      `https://api.nameapi.org/rest/v5.3/riskdetector/person?apiKey=${process.env.NAMEAPI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: {
            priority: "REALTIME",
            properties: [],
          },
          inputPerson: {
            type: "NaturalInputPerson",
            personName: {
              nameFields: [
                {
                  string: cleanedName,
                  fieldType: "FULLNAME",
                },
              ],
            },
          },
        }),
      }
    );

    console.log("📡 NameAPI Response Status:", response.status);

    if (!response.ok) {
      console.error("❌ NameAPI HTTP error:", response.status);
      return false;
    }

    const data = await response.json();
    console.log("📦 NameAPI Full Response:", data);

    // score > 0 means risk
    if (data.score > 0) {
      console.log(`🚫 NameAPI REJECTED: "${cleanedName}" | Score: ${data.score}`);
      return false;
    }

    console.log(`✅ NameAPI ACCEPTED: "${cleanedName}" | Score: ${data.score}`);
    return true;

  } catch (error) {
    console.error("❌ NameAPI Error:", error.message);
    return false;
  }
}