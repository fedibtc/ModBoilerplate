export async function mutateWithBody<T>(
  path: string,
  body: Record<string, any>,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
): Promise<T> {
  try {
    const res = await window
      .fetch(path, {
        method,
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
      })
      .then((r) => r.json());

    if (!res.success) {
      throw new Error(res.message);
    }

    return res.data as T;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function queryGet<T>(path: string) {
  try {
    const res = await window.fetch(path).then((r) => r.json());

    if (!res.success) {
      throw new Error(res.message);
    }

    return res.data as T;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
