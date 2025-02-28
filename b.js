function generateBarcode() {
    let input = document.getElementById("barcodeInput").value;
    let barcodeSvg = document.getElementById("barcodeSvg");

    if (input.trim() === "") {
        alert("Enter valid text or number!");
        return;
    }

    // Generate Barcode using JsBarcode
    JsBarcode(barcodeSvg, input, {
        format: "CODE128",
        displayValue: true,
        fontSize: 18,
        background: "#ffffff", // White background
        lineColor: "#000000"   // Black barcode color
    });
}

// Download barcode as PDF
function downloadBarcode() {
    let barcodeSvg = document.getElementById("barcodeSvg");

    if (!barcodeSvg) {
        alert("No barcode to download!");
        return;
    }

    let svgData = new XMLSerializer().serializeToString(barcodeSvg);
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(svgData);

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const { jsPDF } = window.jspdf;
        let pdf = new jsPDF();
        let imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 50, 50, 100, 30);
        pdf.save("barcode.pdf");
    };
}
function refreshpage()
{
window.location.reload();
}

function printBarcode() {
    let input = document.getElementById("barcodeInput").value;
    if (input.trim() === "") {
        alert("No barcode to print!");
        return;
    }

    let printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Labels</title>
            <style>
                @page { size: 90mm 15mm; margin: 0; }
                body { display: flex; justify-content: space-between; padding: 0; }
                .label { width: 30mm; height: 15mm; display: flex; align-items: center; justify-content: center; border: 1px solid black; }
                svg { width: 100%; height: auto; }
            </style>
        </head>
        <body>
    `);

    // Generate 3 barcodes per row
    for (let i = 0; i < 3; i++) {
        printWindow.document.write(`
            <div class="label">
                <svg id="barcode${i}"></svg>
            </div>
        `);
    }

    printWindow.document.write(`</body></html>`);
    printWindow.document.close();

    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            JsBarcode(`#barcode${i}`, input, { format: "CODE128", width: 1.5, height: 14, displayValue: false });
        }
        printWindow.focus(); // Ensure window is focused before opening preview
        printWindow.print(); // Opens Windows Print Preview
    }, 500);
}

function saveToDatabase() {
    let barcodeValue = document.getElementById("barcodeInput").value;

    const newLocal = fetch("http://localhost:7071/save-barcode", {  // Change to the correct port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: barcodeValue })
    })
    newLocal
    .then(response => response.json())
    .then(data => {
        alert("Saved successfully: " + data.message);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to save barcode.");
    });
} 