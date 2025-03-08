
var refresh_token="";


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



export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if(url.pathname=="/api/get_list"){
      var access_token=await env.access_token_kv.get("access_token");
      if (access_token === null) {
        return new Response("access_token not found", { status: 404 });
      }
      var drive_id=await env.access_token_kv.get("drive_id");
      if (drive_id === null) {
        return new Response("drive_id not found", { status: 404 });

      }

      //res
      const url = "https://openapi.alipan.com/adrive/v1.0/openFile/list";
      const body = {
        drive_id:drive_id,
        parent_file_id: "root",

      };


      const init = {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Authorization": "Bearer "+access_token,
        },
      };
      const response = await fetch(url, init);
      const results = await gatherResponse(response);

      const modifiedResponse1 = new Response(results, { status: 200 });
        modifiedResponse1.headers.set('Access-Control-Allow-Origin', '*');
        console.log(modifiedResponse1);
        return modifiedResponse1;


    }else if(url.pathname=="/api/get_access_token"){
      try {
        const value = await env.access_token_kv.get("access_token");
  
        if (value === null) {
          return new Response("Value not found", { status: 404 });
        }

        console.log(value);

        

        const modifiedResponse = new Response(value, { status: 200 });
        modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
        return modifiedResponse;
        //return new Response(value,{ status: 200 });
      } catch (e) {
        return new Response(e.message, { status: 500 });
      }



    }else if(url.pathname=="/api/get_access_token_new"){
      const url = "https://api-cf.nn.ci/alist/ali_open/token";
      const body = {
        grant_type:"refresh_token",
        refresh_token: refresh_token,

      };


      const init = {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      };
      const response = await fetch(url, init);
      const results = await gatherResponse(response);

      var tmp=JSON.parse(results);
        var access_token_new=tmp["access_token"];
        console.log(access_token_new);

      try{
        await env.access_token_kv.put("access_token", access_token_new);
      }catch(e){
        return new Response(e.message, { status: 500 });
      }


      
      //drive_id
      const url1 = "https://openapi.alipan.com/adrive/v1.0/user/getDriveInfo";
      const body1 = {
        
      };


      const init1 = {
        body: JSON.stringify(body1),
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Authorization": "Bearer "+access_token_new,
        },
      };
      const response1 = await fetch(url1, init1);
      const results1 = await gatherResponse(response1);


      console.log(results1);


      var tmp2=JSON.parse(results1);

      try{
        await env.access_token_kv.put("drive_id", tmp2["resource_drive_id"]);
      }catch(e){
        return new Response(e.message, { status: 500 });
      }

      return new Response(access_token_new+"\n"+tmp2["resource_drive_id"], { status: 200 });
    }else if(url.pathname=="/api/get_ip"){

      return fetch(`https://httpbin.org/ip`);
    }else if(url.pathname=="/api/file"){
      const params = new URLSearchParams(new URL(url).search);

      var access_token=await env.access_token_kv.get("access_token");
      if (access_token === null) {
        return new Response("access_token not found", { status: 404 });
      }
      var drive_id=await env.access_token_kv.get("drive_id");
      if (drive_id === null) {
        return new Response("drive_id not found", { status: 404 });

      }

      //src

      const url1 = "https://openapi.alipan.com/adrive/v1.0/openFile/getDownloadUrl";
      const body = {
        drive_id:drive_id,
        file_id:params.get("name"),

      };


      const init = {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Authorization": "Bearer "+access_token,
        },
      };
      const response = await fetch(url1, init);
      const results = await gatherResponse(response);

     var tmp=JSON.parse(results);
     var durl=tmp["url"];

     const modifiedResponse = new Response("下载地址: \n "+durl+"\n  \n"+"文件ID:"+params.get("name")+"\n 注意:链接将在15分钟后失效，及时下载 \n @gedhspace \n @StuffyWalk \n 开发 ", { status: 302 });
     modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
     modifiedResponse.headers.set('content-type', 'text/text;charset=utf-8');
     return modifiedResponse;

      

    }else{
      return new Response(url, { status: 404 });
    }
  },


  async scheduled(event, env, ctx) {
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
      console.log("ok");
      return new Response(results, init);
  },
};

