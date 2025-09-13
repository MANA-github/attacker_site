<<<<<<< HEAD
import { join, extname } from "https://deno.land/std/path/mod.ts";

const DOWNLOAD_DIR = "./downloads";
=======
import { loadJsonFiles } from "./function.js";
import { generateFileListPage } from "./view.js";


const DOWNLOAD_DIR = "./Download";
>>>>>>> 7de8d7ba4ced6eb7587dccd7ade2b10508942b51

Deno.serve({ port: 80 }, async (req) => {
  const url = new URL(req.url);

<<<<<<< HEAD
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
=======
  // ファイル一覧ページ
  if (url.pathname === "/files") {
    const files = await loadJsonFiles(DOWNLOAD_DIR);
    const html = generateFileListPage(files);
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // ダウンロード処理
  if (url.pathname === "/download") {
    const fileName = url.searchParams.get("file");
    if (!fileName) {
      return new Response("ファイル名が指定されていません", { status: 400 });
    }
    // フォルダの存在確認
    try {
      const filePath = `${DOWNLOAD_DIR}/${fileName}`;
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        headers: {
          "Content-Type": "application/octet-stream",
>>>>>>> 7de8d7ba4ced6eb7587dccd7ade2b10508942b51
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } catch {
<<<<<<< HEAD
      return new Response("File Not Found", { status: 404 });
    }
  }

  return new Response("API Not Found", { status: 404 });
=======
      return new Response("ファイルが存在しないです", { status: 404 });
    }
  }

  return new Response("Not Found", { status: 404 });
>>>>>>> 7de8d7ba4ced6eb7587dccd7ade2b10508942b51
});

console.log("Server running at http://localhost:80");
