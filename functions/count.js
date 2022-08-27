export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  var value = parseInt(await env.VALGKNAPPEN.get("count"));
  var limited = false;

  if (isNaN(value)) value = 0;

  if (request.method.toUpperCase() === "POST") {
    value++;
    try {
      await env.VALGKNAPPEN.put("count", value.toString());
    } catch {
      value--;
      limited = true;
    }
  }

  return new Response(JSON.stringify({ count: value, limited: limited }, null, 2), {
    headers: {
      "content-type": "application/json",
    },
  });
}
