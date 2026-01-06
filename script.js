const SHEET_ID = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7AvSKtZDxCSOyCviX5IIRj57OAD06nbiPVuHWX02-urpQmyQkYAxlsmT87zD0bzVDZvbPjrb1sL-X/pub?gid=1355133399&single=true&output=csv";

const statusText = document.getElementById("status");
const card = document.getElementById("card");
let qr;

function fetchData(kodeScan) {

  const query = `
    select A,B,C,D,E
    where A='${kodeScan}'
  `;

  const url =
    `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/gviz/tq?` +
    `tq=${encodeURIComponent(query)}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47).slice(0, -2));
      const row = json.table.rows[0];

      if (!row) {
        statusText.innerText = "Data tidak ditemukan";
        return;
      }

      document.getElementById("kode").innerText = row.c[0].v;
      document.getElementById("nama").innerText = row.c[1].v;
      document.getElementById("dept").innerText = row.c[2].v;
      document.getElementById("lokasi").innerText = row.c[3].v;
      document.getElementById("ket").innerText = row.c[4].v;

      card.classList.remove("hidden");
      statusText.innerText = "Data ditemukan";
    });
}

function startScan() {
  qr = new Html5Qrcode("reader");

  qr.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 150 } },
    kode => {
      statusText.innerText = "Kode: " + kode;
      qr.stop();
      fetchData(kode);
    }
  );
}

function scanUlang() {
  card.classList.add("hidden");
  statusText.innerText = "Arahkan kamera ke barcode";
  startScan();
}

startScan();
