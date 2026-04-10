import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import crypto from "node:crypto";

serve(async () => {
  try {
    const appKey = "105827";
    const appSecret = "r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF";
    const accessToken = "3596c94c71b8484b9f9431cc22b3f767";

    const method = "lazada.affiliate.product.feed";
    const timestamp = Date.now();

    const params: Record<string, any> = {
      app_key: appKey,
      method,
      timestamp,
      access_token: accessToken,
      sign_method: "sha256",
      page_no: 1,
      page_size: 20,
    };

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

    const url =
      "https://gw.api.taobao.com/router/rest?" +
      new URLSearchParams({ ...params, sign });

    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }));
  }
});
