import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ quiet: true }); // only intended for local testing

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
  if (!resp.ok) {
    console.log(`Veri`);
    console.error(`Veryfi response body: ${await resp.text()}`);
    throw `Error in request to Veryfi, returned ${resp.status}`;
  }

  return await resp.json();
}

function mock_sendImgToApi(_: string) {
  const textbuff = fs.readFileSync("sampleresponses/sample1.2.json");
  return JSON.parse(textbuff.toString("utf-8"));
}

function tmp_getImgBase64() {
  const imgBuff = fs.readFileSync("sampleresponses/img1.jpg");
  const b64Img = imgBuff.toString("base64");
  return b64Img;
}

function singleItemMinimise(item: any) {
  // this should be a simple case of item.total + item.discount
  // however sometimes if there are mutliple discounts, only one is included in 'discount', and the other is only present in the 'text' field

  //sometimes an item with 2 discounts isnt read properly, need to examine .text to check
  const regex = /\t(-?\d+\.?\d\d)/g; // captures \t followed by +ve or -ve number with 2 decimal digits
  const nums = [...item.text.matchAll(regex)].map((m) => parseFloat(m[1])); // extracts numbres from capturing groups
  const priceFromText = nums.reduce((t, i) => t + i, 0);

  // for type=discount, .discount = .total, so adding them doubles the discount
  const discount = item.type === "discount" ? 0 : item.discount;
  const priceFromTotal = ((item.total as number) + discount) as number;

  let price;
  let unsure = false;
  if (nums.length > 2) {
    // multiple discounts, total and discount fields not reliable
    price = priceFromText;
    unsure = true;
  } else {
    // single or no discount, total and discount field reliable
    price = priceFromTotal;
    // if they dont match, report unsure
    unsure = !approxEq(priceFromText, priceFromTotal);
  }

  if (unsure) {
    console.warn(
      `Unsure on item ${item.description}. nums: ${JSON.stringify(nums)}, priceFromText: ${priceFromText}, priceFromTotal: ${priceFromTotal}, item: ${JSON.stringify(item, null, 2)}`,
    );
  }
  return {
    name: item.description as string,
    price: Math.round(price * 100) / 100,
    unsure,
  };
}
function extract(data: any) {
  // uses sample1.2.json as schema, inlcudes confidence details (however this method doesnt use)
  const items: any[] = data.line_items;
  const itemsMinimal = items
    .filter(({ total }) => !!total) // only take things with price
    .map(singleItemMinimise);

  // check total = sum(prices)
  const total: number = data.total.value;
  const addedPrices = itemsMinimal.reduce((t, i) => t + i.price, 0);

  if (!approxEq(total, addedPrices)) {
    console.error(JSON.stringify(data, null, 2));
    //account for float pt arithmetic errors
    throw `Reciept reading error: prices did not add up to total. Prices : ${addedPrices}, Total: ${total}`;
  }

  return itemsMinimal;
}

async function process_image(base64: string) {
  const apiResp = await sendImgToApi(base64);
  const extracted = extract(apiResp);
  return {
    statusCode: 200,
    body: JSON.stringify(extracted),
  };
}

export async function handler(event: any) {
  switch (event.requestContext.http.path) {
    case "/api/wake":
      console.log("Woken");
      return {
        statusCode: 200,
      };
    case "/api/process":
      console.log("Processing");
      return process_image(event.body);
    default:
      return {
        statusCode: 404,
      };
  }
}

function approxEq(x: number, y: number) {
  return Math.abs(x - y) < 0.01;
}
