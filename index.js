(async () => {
  const DATA_URL = "http://localhost:80/data";
  const DOWNLOAD_URL_BASE = "http://localhost:80/downloads?file=";

  function formatBytes(bytes) {
    if (bytes === 0 || bytes == null) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1) + " " + sizes[i];
  }

  const tbody = document.querySelector(".file-table tbody");

  function showError(message) {
    tbody.innerHTML = "";
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.textContent = message;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  function renderFiles(files) {
    tbody.innerHTML = "";

    if (!Array.isArray(files) || files.length === 0) {
      showError("ダウンロード可能なファイルはありません。");
      return;
    }

    files.forEach((file) => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.setAttribute("data-label", "file name");
      tdName.textContent = file.name ?? "unknown";
      tr.appendChild(tdName);

      const tdLink = document.createElement("td");
      tdLink.setAttribute("data-label", "link");
      const a = document.createElement("a");
      a.className = "link";
      a.href = DOWNLOAD_URL_BASE + encodeURIComponent(file.name ?? "");
      a.textContent = a.href;
      a.setAttribute("downloads", file.name ?? "");
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      tdLink.appendChild(a);
      tr.appendChild(tdLink);
      const tdSize = document.createElement("td");
      tdSize.setAttribute("data-label", "size");
      tdSize.textContent = formatBytes(file.size ?? 0);
      tr.appendChild(tdSize);

      tbody.appendChild(tr);
    });
  }

  async function loadAndRender() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`データ取得に失敗しました: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();

      renderFiles(data);
    } catch (err) {
      console.error(err);
      showError("サーバーからデータを取得できませんでした。コンソールを確認してください。");
    }
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", loadAndRender);
  } else {
    loadAndRender();
  }
})();
