import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;
async function sendImgToApi(base64Img) {
    if (!CLIENT_ID || !AUTHORIZATION) {
        throw "Missing required environment variables `CLIENT_ID` and `AUTHORIZATION";
    }
    const payload = JSON.stringify({ file_data: base64Img });
    const url = "https://api.veryfi.com/api/v8/partner/documents";
    const options = {
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
async function mock_sendImgToApi(_) {
    const textbuff = fs.readFileSync("sampleresponses/sample1.json");
    return JSON.parse(textbuff.toString("utf-8"));
}
function tmp_getImgBase64() {
    const imgBuff = fs.readFileSync("sampleresponses/img1.jpg");
    const b64Img = imgBuff.toString("base64");
    return b64Img;
}
const resp = await mock_sendImgToApi(tmp_getImgBase64());
console.log(resp);
