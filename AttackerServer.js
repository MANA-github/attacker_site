import { loadJsonFiles } from "./function.js";
import { generateFileListPage } from "./view.js";


const DOWNLOAD_DIR = "./Download";

Deno.serve({ port: 80 }, async (req) => {
  const url = new URL(req.url);

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
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } catch {
      return new Response("ファイルが存在しないです", { status: 404 });
    }
  }

  return new Response("Not Found", { status: 404 });
});

console.log("Server running at http://localhost:80");
