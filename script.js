document.addEventListener("DOMContentLoaded", function () {
  const deviceKWH = {
    smartphone: 0.02,
    laptop: 0.05,
    tv: 0.1,
    refrigerator: 0.2,
    ricecooker: 0.15,
  };

  const regionKWH = {
    jawa: 0.6,
    bali: 0.5,
    madura: 0.55,
  };

  const acKWH = {
    0.5: 0.3,
    0.75: 0.5,
    1: 0.7,
    1.5: 1.0,
    2: 1.5,
    2.5: 2.0,
    3: 2.5,
  };

  function updateTotalEmissions() {
    let total = 0;
    document.querySelectorAll(".history div").forEach(item => {
        const match = item.textContent.match(/([\d\.]+) kg CO₂/);
        if (match) total += parseFloat(match[1]);
    });
    document.getElementById("total-emissions").textContent = total.toFixed(2);
  }

  function addResultToHistory(text) {
    const historyContainer = document.querySelector(".history");
    const resultItem = document.createElement("div");
    resultItem.textContent = text;
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", function () {
        historyContainer.removeChild(resultItem);
        updateTotalEmissions();
    });
    
    resultItem.appendChild(deleteButton);
    historyContainer.appendChild(resultItem);
    updateTotalEmissions();
  }

  document
    .getElementById("alat-elektronik")
    .addEventListener("click", function () {
      const device = document.querySelector(".device").value;
      const jumlah = parseFloat(
        document.querySelector("input[placeholder='Jumlah Satuan']").value
      );
      const lamaPenggunaan = parseFloat(
        document.querySelector("input[placeholder='Lama Penggunaan']")
          .value
      );
      const periode = document.querySelector(".pemakaian").value;

      if (
        !device ||
        isNaN(jumlah) ||
        isNaN(lamaPenggunaan) ||
        jumlah <= 0 ||
        lamaPenggunaan <= 0
      ) {
        alert("Masukkan semua data yang valid.");
        return;
      }

      let faktorPeriode =
        periode === "bulanan" ? 30 : periode === "tahunan" ? 365 : 1;
      const emissionFactor = deviceKWH[device] || 0;
      const totalEmissions =
        jumlah * lamaPenggunaan * faktorPeriode * emissionFactor;
      addResultToHistory(
        `Perkiraan Jejak Karbon Elektronik: ${totalEmissions.toFixed(
          2
        )} kg CO₂`
      );
    });

  document.getElementById("rumah").addEventListener("click", function () {
    const region = document.querySelector(".region").value;
    const batasDaya = parseFloat(
      document.querySelector("input[placeholder='Batas Daya Dalam Watt']")
        .value
    );
    const periodeRumah = document.querySelector(".pemakaian-rumah").value;

    if (!region || isNaN(batasDaya) || batasDaya <= 0) {
      alert("Masukkan semua data yang valid.");
      return;
    }

    let faktorPeriodeRumah =
      periodeRumah === "bulanan"
        ? 30
        : periodeRumah === "tahunan"
        ? 365
        : 1;
    const regionEmission = regionKWH[region] || 0;
    const totalHouseEmissions =
      batasDaya * faktorPeriodeRumah * regionEmission;
    addResultToHistory(
      `Perkiraan Jejak Karbon Rumah: ${totalHouseEmissions.toFixed(
        2
      )} kg CO₂`
    );
  });

  document
    .getElementById("calculate-ac")
    .addEventListener("click", function () {
      const acCapacity = document.querySelector(".acCapacity").value;
      const jumlahAC = parseFloat(
        document.querySelector(".ac-quantity").value
      );
      const durasiAC = parseFloat(
        document.querySelector(".ac-duration").value
      );
      const hariAC = parseFloat(document.querySelector(".ac-days").value);
      const periodeAC = document.querySelector(".pemakaian-ac").value;

      if (
        !acCapacity ||
        isNaN(jumlahAC) ||
        jumlahAC <= 0 ||
        isNaN(durasiAC) ||
        durasiAC <= 0 ||
        isNaN(hariAC) ||
        hariAC <= 0
      ) {
        alert("Masukkan semua data yang valid.");
        return;
      }

      let faktorPeriode =
        periodeAC === "bulanan" ? 30 : periodeAC === "tahunan" ? 365 : 1;
      const acEmission = acKWH[acCapacity] || 0;
      const totalACEmissions =
        jumlahAC * durasiAC * hariAC * faktorPeriode * acEmission;
      addResultToHistory(
        `Perkiraan Jejak Karbon AC: ${totalACEmissions.toFixed(2)} kg CO₂`
      );
    });
});