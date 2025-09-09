export function generateFileListPage(files) {
  let html = `
    <html>
    <head>
      <meta charset="utf-8">
      <title>ファイル一覧</title>
    </head>
    <body>
      <h1>ファイル一覧</h1>
      <ul>
  `;
  for (const f of files) {
    html += `
      <li>
      <a href="/download?file=${encodeURIComponent(f.name)}">${f.name}</a>
       - <a href="${f.name}" target="_blank">URL</a>
       - ${f.size} bytes
      </li>
    `;
  }
  html += `
      </ul>
    </body>
    </html>
  `;
  return html;
}
