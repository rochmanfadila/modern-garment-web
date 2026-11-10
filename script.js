document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
            navbar.classList.remove('py-2');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.add('py-2');
        }
    });

    // Mobile Menu Toggle
    const btnMenu = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (btnMenu && mobileMenu) {
        btnMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- CUSTOM ORDER LOGIC ---
    const productData = {
        tshirt: {
            name: "Kaos (T-Shirt)",
            basePrice: 0,
            fabrics: [
                { id: "c30s", name: "Cotton Combed 30s", price: 45000 },
                { id: "c24s", name: "Cotton Combed 24s", price: 50000 },
                { id: "pe", name: "Polyester (PE)", price: 35000 }
            ]
        },
        polo: {
            name: "Polo Shirt",
            basePrice: 0,
            fabrics: [
                { id: "lacoste_cvc", name: "Lacoste CVC", price: 65000 },
                { id: "lacoste_cotton", name: "Lacoste Cotton Pique", price: 80000 }
            ]
        },
        kemeja: {
            name: "Kemeja (PDH/PDL)",
            basePrice: 0,
            fabrics: [
                { id: "american_drill", name: "American Drill", price: 95000 },
                { id: "nagata_drill", name: "Nagata Drill", price: 110000 },
                { id: "taipan", name: "Taipan Tropical", price: 125000 }
            ]
        },
        jaket: {
            name: "Jaket / Hoodie",
            basePrice: 0,
            fabrics: [
                { id: "fleece", name: "Cotton Fleece", price: 125000 },
                { id: "baby_terry", name: "Baby Terry", price: 115000 },
                { id: "taslan", name: "Taslan (Waterproof)", price: 140000 }
            ]
        }
    };

    const printMethodPricing = {
        sablon_1_sisi: { name: "Sablon 1 Sisi", price: 0 },
        sablon_2_sisi: { name: "Sablon 2 Sisi", price: 15000 },
        bordir_kecil: { name: "Bordir Kecil", price: 5000 },
        bordir_besar: { name: "Bordir Besar", price: 20000 },
        kombinasi: { name: "Sablon & Bordir", price: 25000 },
        polos: { name: "Polos (Tanpa Desain)", price: -5000 }
    };

    const elProduct = document.getElementById('productType');
    const elFabric = document.getElementById('fabricType');
    const elColor = document.getElementById('colorInput');
    const elPrintMethod = document.getElementById('printMethod');
    const elDesignLink = document.getElementById('designLink');
    const elQty = document.getElementById('totalQty');
    const btnMin = document.getElementById('btnMinQty');
    const btnAdd = document.getElementById('btnAddQty');
    const elSizeNotes = document.getElementById('sizeNotes');
    const btnSubmit = document.getElementById('btnSubmitOrder');

    const sumProduct = document.getElementById('summaryProduct');
    const sumFabric = document.getElementById('summaryFabric');
    const sumMethod = document.getElementById('summaryMethod');
    const sumUnitPrice = document.getElementById('summaryUnitPrice');
    const sumQty = document.getElementById('summaryQty');
    const sumTotal = document.getElementById('summaryTotalPrice');

    let currentUnitPrice = 0;

    const formatIDR = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const initForm = () => {
        for (const [key, value] of Object.entries(productData)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = value.name;
            elProduct.appendChild(opt);
        }
    };

    elProduct.addEventListener('change', (e) => {
        const selectedProductKey = e.target.value;
        const product = productData[selectedProductKey];

        elFabric.innerHTML = '<option value="" disabled selected>-- Pilih Bahan --</option>';
        elFabric.disabled = false;
        elFabric.classList.remove('opacity-70', 'cursor-not-allowed', 'bg-slate-100');
        elFabric.classList.add('bg-slate-50', 'cursor-pointer');

        product.fabrics.forEach(fab => {
            const opt = document.createElement('option');
            opt.value = fab.id;
            opt.dataset.price = fab.price;
            opt.innerHTML = `${fab.name} (${formatIDR(fab.price)}/pcs)`;
            elFabric.appendChild(opt);
        });

        sumProduct.innerText = product.name;
        sumFabric.innerText = '-';
        calculateTotal();
    });

    const calculateTotal = () => {
        if (!elProduct.value || !elFabric.value) return;

        const selectedFabricOpt = elFabric.options[elFabric.selectedIndex];
        const fabricPrice = parseInt(selectedFabricOpt.dataset.price) || 0;
        const methodPrice = printMethodPricing[elPrintMethod.value].price;

        let qty = parseInt(elQty.value) || 12;
        if (qty < 12) {
            qty = 12;
            elQty.value = 12;
        }

        currentUnitPrice = fabricPrice + methodPrice;

        let discountPerPcs = 0;
        if (qty >= 50 && qty < 100) discountPerPcs = 2000;
        else if (qty >= 100) discountPerPcs = 5000;

        currentUnitPrice -= discountPerPcs;

        const totalPrice = currentUnitPrice * qty;

        sumFabric.innerText = selectedFabricOpt.text.split('(')[0].trim();
        sumMethod.innerText = printMethodPricing[elPrintMethod.value].name;
        sumUnitPrice.innerText = formatIDR(currentUnitPrice);
        sumQty.innerText = `${qty} Pcs`;
        sumTotal.innerText = formatIDR(totalPrice);
    };

    elFabric.addEventListener('change', calculateTotal);
    elPrintMethod.addEventListener('change', calculateTotal);
    elQty.addEventListener('change', calculateTotal);
    elQty.addEventListener('keyup', calculateTotal);

    btnMin.addEventListener('click', () => {
        let val = parseInt(elQty.value);
        if (val > 12) {
            elQty.value = val - 1;
            calculateTotal();
        }
    });

    btnAdd.addEventListener('click', () => {
        elQty.value = parseInt(elQty.value) + 1;
        calculateTotal();
    });

    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        if (!elProduct.value || !elFabric.value) {
            alert('Mohon pilih Jenis Pakaian dan Bahan terlebih dahulu.');
            elProduct.focus();
            return;
        }

        const productName = productData[elProduct.value].name;
        const fabricName = elFabric.options[elFabric.selectedIndex].text.split('(')[0].trim();
        const color = elColor.value || 'Belum ditentukan';
        const method = printMethodPricing[elPrintMethod.value].name;
        const qty = elQty.value;
        const sizeNotes = elSizeNotes.value || '-';
        const designLink = elDesignLink.value || 'Tidak ada link';
        const totalStr = sumTotal.innerText;
        const waNumber = '6285732915213';

        let message = 'Halo ModernGarment, saya ingin melakukan pemesanan custom dengan detail sebagai berikut:%0A%0A';
        message += '*DETAIL PRODUK*%0A';
        message += `- Jenis: ${productName}%0A`;
        message += `- Bahan: ${fabricName}%0A`;
        message += `- Warna: ${color}%0A`;
        message += `- Aplikasi: ${method}%0A%0A`;
        message += '*JUMLAH & UKURAN*%0A';
        message += `- Kuantitas: ${qty} Pcs%0A`;
        message += `- Detail Ukuran: ${sizeNotes}%0A%0A`;
        message += '*DESAIN*%0A';
        message += `- Link File: ${designLink}%0A%0A`;
        message += `*Estimasi Total:* ${totalStr}%0A%0A`;
        message += 'Mohon info lebih lanjut untuk proses fiksasi desain dan pembayaran. Terima kasih.';

        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    });

    // --- TRACKING ORDER LOGIC ---
    const trackingForm = document.getElementById('trackingForm');
    const trackingInput = document.getElementById('trackingInput');
    const trackingResult = document.getElementById('trackingResult');
    const sampleCodeBtns = document.querySelectorAll('.sample-code');

    const trackingDatabase = {
        'MG-202601': {
            customer: 'Komunitas Malang Creative',
            item: 'Kaos Cotton Combed 30s',
            qty: '50 Pcs',
            method: 'Sablon Plastisol 2 Sisi',
            statusText: 'Dalam Produksi (Sablon/Jahit)',
            estDate: '18 November 2026',
            currentStep: 3
        },
        'MG-202602': {
            customer: 'PT Husada Sentosa',
            item: 'Kemeja PDL Nagata Drill',
            qty: '24 Pcs',
            method: 'Bordir Computer Logo + Back',
            statusText: 'Selesai & Ready Kirim',
            estDate: '10 November 2026',
            currentStep: 5
        }
    };

    const renderTracking = (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (!cleanCode) return;

        const data = trackingDatabase[cleanCode] || {
            customer: 'Pelanggan Custom',
            item: 'Pesanan Custom Clothing',
            qty: '24 Pcs',
            method: 'Sablon / Bordir',
            statusText: 'Proses Fiksasi Desain & Bahan',
            estDate: '20 November 2026',
            currentStep: 2
        };

        document.getElementById('resTrackingCode').innerText = cleanCode;
        document.getElementById('resBadgeStatus').innerText = data.statusText;
        document.getElementById('resEstDate').innerText = data.estDate;
        document.getElementById('resCustomer').innerText = data.customer;
        document.getElementById('resItem').innerText = data.item;
        document.getElementById('resQty').innerText = data.qty;
        document.getElementById('resMethod').innerText = data.method;

        const waTrackingLink = `https://wa.me/6285732915213?text=Halo%20ModernGarment,%20saya%20ingin%20menanyakan%20update%20pesanan%20dengan%20kode%20${cleanCode}`;
        document.getElementById('btnAskTrackingWA').href = waTrackingLink;

        for (let i = 1; i <= 5; i++) {
            const stepEl = document.getElementById(`step-${i}`);
            if (i <= data.currentStep) {
                stepEl.classList.remove('opacity-40');
            } else {
                stepEl.classList.add('opacity-40');
            }
        }

        trackingResult.classList.remove('hidden');
        trackingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    trackingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        renderTracking(trackingInput.value);
    });

    sampleCodeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            trackingInput.value = code;
            renderTracking(code);
        });
    });

    initForm();
});
