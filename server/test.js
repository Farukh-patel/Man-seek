const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCK-kju2JlmNKfavdohtxpFGm7a1EkswZQ");

async function testGemini() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent("Tell me a joke.");
  const text = result.response.text();
  console.log(text);
}

testGemini().catch(console.error);
