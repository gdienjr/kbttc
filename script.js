// GANTIKAN dengan URL Google Sheets (Publish to Web → CSV)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTaG67Zk3UTsX3Ydk3oPTsA54ApG7Xsozec7pTJKFc10IPGmequeZjHr3Ho06obZ4dAZIp8PXUF_W9/pub?output=csv";

async function sha256(text) {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function semak() {
  const ic = document.getElementById("ic").value.trim();
  const msg = document.getElementById("msg");
  const result = document.getElementById("result");

  msg.innerText = "";
  result.innerHTML = "";

  if (!/^\d{5,8}$/.test(ic)) {
    msg.innerText = "Sila masukkan nombor yang sah.";
    return;
  }

  const hash = await sha256(ic);

  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const rows = text.split("\n").map(r => r.split(","));
for (let i = 1; i < rows.length; i++) {
  const sheetHash = rows[i][0]?.trim();
  if (sheetHash === hash) {
    let html = "<h3>Status Yuran</h3><table>";
    for (let j = 1; j < rows[0].length; j++) {
      html += `<tr>
        <td>${rows[0][j]}</td>
        <td>${rows[i][j] || "-"}</td>
      </tr>`;
    }
    html += "</table>";
    result.innerHTML = html;
    return;
  }
}

 
  msg.innerText = "Rekod tidak ditemui.";
}
