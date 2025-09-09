// JSONファイルを読み込んで配列にまとめる
export async function loadJsonFiles(downloadDir) {
  const result = [];
  for await (const entry of Deno.readDir(downloadDir)) {
    if (entry.isFile && entry.name.endsWith(".json")) {
      const path = `${downloadDir}/${entry.name}`;
      const text = await Deno.readTextFile(path);
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          for (const f of data) {
            if (f.name && f.size) {
              result.push({
                name: f.name,
                size: f.size,
                url: f.url ?? null,
              });
            }
          }
        }
      } catch {
        console.log(`JSONの読み込みに失敗しました: ${entry.name}`);
      }
    }
  }
  return result;
}
