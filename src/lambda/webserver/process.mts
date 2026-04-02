import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;

async function sendImgToApi(base64Img: string) {
  if (!CLIENT_ID || !AUTHORIZATION) {
    throw "Missing required environment variables `CLIENT_ID` and `AUTHORIZATION";
  }

  const payload = JSON.stringify({
    file_data: base64Img,
    country: "GB",
    auto_delete: true,
    confidence_details: true,
  });

  const url = "https://api.veryfi.com/api/v8/partner/documents";
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "CLIENT-ID": CLIENT_ID,
      AUTHORIZATION: AUTHORIZATION,
    },
    body: payload,
  };
  const resp = await fetch(url, options);
  return await resp.json();
}

async function mock_sendImgToApi(_: string) {
  const textbuff = fs.readFileSync("sampleresponses/sample1.2.json");
  return JSON.parse(textbuff.toString("utf-8"));
}

function tmp_getImgBase64() {
  const imgBuff = fs.readFileSync("sampleresponses/img1.jpg");
  const b64Img = imgBuff.toString("base64");
  return b64Img;
}

function extract(data: any) {
  // uses sample1.2.json as schema, inlcudes confidence details (however this method doesnt use)
  const items: any[] = data.line_items;
  const itemsMinimal = items
    .filter(({ total }) => !!total) // only take things with price
    .map(({ description, total }) => ({
      name: description as string,
      price: total as number,
    }));
  const total: number = data.total.value;
  // check total = sum(prices)
  const addedPrices = itemsMinimal.reduce((t, i) => t + i.price, 0);

  if (Math.abs(total - addedPrices) < 0.01)
    //account for float pt arithmetic errors
    throw `Reciept reading error: prices did not add up to total. Prices : ${addedPrices}, Total: ${total}`;
  return itemsMinimal;
}

const resp = await mock_sendImgToApi(tmp_getImgBase64());
// fs.writeFileSync(
//   "sampleresponses/sample1.2.json",
//   JSON.stringify(resp, null, 2),
// );
console.log(extract(resp));
