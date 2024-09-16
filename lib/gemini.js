const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI('AIzaSyDR-Vh4DcRCWg2MVgPmXSh-mBZKzO-DSJw');

async function geminiAi(text) {
  return new Promise(async(resolve, reject) => {
  try {
    let model = genAI.getGenerativeModel({ model: "gemini-pro" });
    let result = await model.generateContent(text);
    let response = await result.response;
    let hasil = response.text();
     resolve(hasil)
  } catch (e) {
    resolve('error')
  }
  })
}
exports.geminiAi = geminiAi
