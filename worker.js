
var refresh_token="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMDBlNjA0ZmM4YzM0MWVkOTJiODI3YjM5YmMxOWZkNyIsImF1ZCI6Ijc2OTE3Y2NjY2Q0NDQxYzM5NDU3YTA0ZjYwODRmYjJmIiwiZXhwIjoxNzQ4MDY5MjEzLCJpYXQiOjE3NDAyOTMyMTMsImp0aSI6IjJlNDk4NDk3Y2Y3NzQxNWY5OTcyNDA0NmY3NmRkM2UyIn0.ZDicdlXk8bL5OhI7bYGXHXF-HOeLMPHJCq3agxhAAgdVExmidpxwVD5Ne_StBrUNlO4EJHTCy52wkV45dHl2dw";
var drive_id="604760443";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if(url.pathname=="/api/drive_id"){
      return new Response(request.headers.get('CF-Connecting-IP'), { status: 200 });
    }else if(url.pathname=="/api/info"){
      let html = `{"drive_id": "`+drive_id+`" ,"refresh_token":"`+refresh_token+`"}`;
      return new Response(html, {status:200,headers:{'Content-Type':'text/json; charset=utf-8'}});
    }else if(url.pathname=="/api/get_access_token"){
      const url = "https://api-cf.nn.ci/alist/ali_open/token";
      const body = {
        grant_type:"refresh_token",
        refresh_token: refresh_token,

      };

      /**
       * gatherResponse awaits and returns a response body as a string.
       * Use await gatherResponse(..) in an async function to get the response body
       * @param {Response} response
       */
      async function gatherResponse(response) {
        const { headers } = response;
        const contentType = headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return JSON.stringify(await response.json());
        } else if (contentType.includes("application/text")) {
          return response.text();
        } else if (contentType.includes("text/html")) {
          return response.text();
        } else {
          return response.text();
        }
      }

      const init = {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      };
      const response = await fetch(url, init);
      const results = await gatherResponse(response);
      try{
        await env.access_token_kv.put("access_token", results);
      }catch(e){
        return new Response(e.message, { status: 500 });
      }
      return new Response(results, init);
    }else if(url.pathname=="/api/get_ip"){

      return fetch(`https://httpbin.org/ip`);
    }else{
      return new Response("404", { status: 404 });
    }
  },
};

