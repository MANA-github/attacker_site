import { join, extname } from "https://deno.land/std/path/mod.ts";

const DOWNLOAD_DIR = "./downloads";
const PUBLIC_DIR = "./public";

Deno.serve({ port: 80 }, async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ============================
  // 1. ファイル一覧の取得
  // ============================
  if (pathname === "/data") {
    const files = [];

    for await (const entry of Deno.readDir(DOWNLOAD_DIR)) {
      if (entry.isFile) {
        const filePath = join(DOWNLOAD_DIR, entry.name);
        const info = await Deno.stat(filePath);
        files.push({
          name: entry.name,
          size: info.size,
          modified: info.mtime,
          url: `/downloads?file=${encodeURIComponent(entry.name)}`
        });
      }
    }

    return new Response(JSON.stringify(files, null, 2), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }

  // ============================
  // 2. ファイルダウンロード
  // ============================
  if (pathname === "/downloads") {
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

  // ============================
  // 3. 静的ファイルの配信（CSS/JS/画像など）
  // ============================
  try {
    const publicFilePath = join(PUBLIC_DIR, pathname);
    const file = await Deno.readFile(publicFilePath);

    const ext = extname(publicFilePath);
    const contentType = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    }[ext] ?? "application/octet-stream";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    // 無視して次のルートへ
  }

  // ============================
  // 4. トップページ（index.html）
  // ============================
  if (pathname === "/") {
    try {
      const html = await Deno.readFile(join(PUBLIC_DIR, "index.html"));
      const htmlText = new TextDecoder().decode(html);

      return new Response(htmlText, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/html",
        },
      });
    } catch {
      return new Response("index.html not found", { status: 500 });
    }
  }

  // ============================
  // 5. その他（404 Not Found）
  // ============================
  return new Response("API Not Found", { status: 404 });
});

console.log("✅ サーバー起動: http://localhost:80");
