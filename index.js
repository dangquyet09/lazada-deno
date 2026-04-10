import http from "node:http";
import crypto from "node:crypto";

const appKey = "105827";
const appSecret = "r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF";
const accessToken = "3596c94c71b8484b9f9431cc";

const server = http.createServer(async (req, res) => {
  try {
    const method = "lazada.affiliate.product.feed";
    const timestamp = Date.now();

    const params = {
      app_key: appKey,
      method,
      timestamp,
      access_token: accessToken,
      sign_method: "sha256",
      page_no: 1,
      page_size: 20,
    };

    // sort params
    const sorted = Object.keys(params).sort();

    let signStr = method;
    sorted.forEach((k) => {
      signStr += k + params[k];
    });

    const sign = crypto
      .createHmac("sha256", appSecret)
      .update(signStr)
      .digest("hex")
      .toUpperCase();

    // ✅ FIX ENDPOINT (QUAN TRỌNG)
    const url =
      "https://api.lazada.vn/rest?" +
      new URLSearchParams({ ...params, sign });

    console.log("CALL API:", url);

    const response = await fetch(url);

    // 👉 nếu API lỗi sẽ thấy rõ
    if (!response.ok) {
      const text = await response.text();
      throw new Error("API ERROR: " + text);
    }

    const data = await response.json();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));

  } catch (err) {
    console.error("ERROR:", err);

    res.writeHead(500);
    res.end(JSON.stringify({
      error: err.message
    }));
  }
});

const port = process.env.PORT || 10000;
server.listen(port, "0.0.0.0", () => {
  console.log("Server running on port " + port);
});
