import { join, extname } from "https://deno.land/std/path/mod.ts";

const DOWNLOAD_DIR = "./downloads";

Deno.serve({ port: 80 }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/data") {
    const files = [];
    for await (const entry of Deno.readDir(DOWNLOAD_DIR)) {
      if (entry.isFile) {
        const filePath = join(DOWNLOAD_DIR, entry.name);
        const info = await Deno.stat(filePath);
        files.push({
          name: entry.name,
          size: info.size,
          modified: info.mtime,
          url: `/downloads?file=${encodeURIComponent(entry.name)}`,
        });
      }
    }

    return new Response(JSON.stringify(files, null, 2), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
    });
  }

  if (url.pathname === "/downloads") {
    const fileName = url.searchParams.get("file");
    if (!fileName) {
      return new Response("Specified No File Name", { status: 400 });
    }

    try {
      const filePath = join(DOWNLOAD_DIR, fileName);
      const file = await Deno.readFile(filePath);
      const contentType = {
        ".pdf": "application/pdf",
        ".txt": "text/plain",
        ".zip": "application/zip",
        ".jpg": "image/jpeg",
        ".png": "image/png",
      }[extname(fileName)] ?? "application/octet-stream";

      return new Response(file, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } catch {
      return new Response("File Not Found", { status: 404 });
    }
  }

  return new Response("API Not Found", { status: 404 });
});

console.log("Server running at http://localhost:80");
