document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // Inisialisasi Library & Efek Visual
    // =================================================================
    AOS.init({ duration: 1000, once: true });

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - 75) current = section.getAttribute('id');
        });
        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) a.classList.add('active');
        });
    });

    // =================================================================
    // Efek Ketikan untuk Judul Utama (Hero Section)
    // =================================================================
    const mainTitleElement = document.getElementById('main-title');
    const mainTitleText = "Relasi Rekurensi 🌸";
    let mainTitleIndex = 0;

    function typeWriterMainTitle() {
        if (mainTitleIndex < mainTitleText.length) {
            mainTitleElement.innerHTML += mainTitleText.charAt(mainTitleIndex);
            mainTitleIndex++;
            setTimeout(typeWriterMainTitle, 100);
        }
    }
    // Tambahkan style untuk typewriter sebelum dimulai
    mainTitleElement.style.borderRight = '.15em solid #FF69B4';
    mainTitleElement.style.width = 'fit-content';
    typeWriterMainTitle();

    // =================================================================
    // BAGIAN YANG DIPERBAIKI: Logika Modal Materi dengan Efek Ketikan & HTML
    // =================================================================
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const overlay = document.getElementById('overlay');
    
    let currentModalTextContentElement = null;
    let originalModalHTMLContent = '';
    let typeWriterTimeout;

    // Fungsi untuk mensimulasikan ketikan pada konten HTML
    function typeWriterHTMLContent(text, element, index = 0) {
        if (index < text.length) {
            element.innerHTML = text.substring(0, index + 1);
            typeWriterTimeout = setTimeout(() => typeWriterHTMLContent(text, element, index + 1), 20); // Kecepatan ketikan
        }
    }

    openModalButtons.forEach(card => {
        card.addEventListener('click', () => {
            const modal = document.querySelector(card.dataset.modalTarget);
            if (modal) {
                currentModalTextContentElement = modal.querySelector('.modal-text-content');
                originalModalHTMLContent = currentModalTextContentElement.dataset.textHtml;
                
                currentModalTextContentElement.innerHTML = ''; // Kosongkan dulu
                clearTimeout(typeWriterTimeout);
                
                openModal(modal);
                typeWriterHTMLContent(originalModalHTMLContent, currentModalTextContentElement);
            }
        });
    });

    overlay.addEventListener('click', () => {
        document.querySelectorAll('.modal.active').forEach(closeModal);
    });

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            closeModal(button.closest('.modal'));
        });
    });

    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    }
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            clearTimeout(typeWriterTimeout);
        }
    }

    // =================================================================
    // OTAK CERDAS KALKULATOR V3 (tetap sama)
    // =================================================================
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let activeTab = 'non-homogen';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === activeTab + '-form') {
                    content.classList.add('active');
                }
            });
            solutionSteps.innerHTML = `<p class="placeholder">Pilih tipe relasi, masukkan semua nilai, dan tekan "Pecahkan!".</p>`;
        });
    });

    const solveBtn = document.getElementById('solve-btn');
    const solutionSteps = document.getElementById('solution-steps');

    solveBtn.addEventListener('click', () => {
        solutionSteps.innerHTML = '';
        if (activeTab === 'non-homogen') {
            const r = parseFloat(document.getElementById('nh-r').value);
            const k = parseFloat(document.getElementById('nh-k').value);
            const c = parseInt(document.getElementById('nh-c').value);
            const d = parseFloat(document.getElementById('nh-d').value);
            if ([r, k, c, d].some(isNaN)) {
                solutionSteps.innerHTML = `<p class="placeholder" style="color: #ff8a8a;">Harap isi semua nilai dengan angka!</p>`; return;
            }
            solveNonHomogen(r, k, c, d);
        } else if (activeTab === 'homogen') {
            const c1 = parseFloat(document.getElementById('h-c1').value);
            const c2 = parseFloat(document.getElementById('h-c2').value);
            const a0 = parseFloat(document.getElementById('h-a0').value);
            const a1 = parseFloat(document.getElementById('h-a1').value);
            if ([c1, c2, a0, a1].some(isNaN)) {
                solutionSteps.innerHTML = `<p class="placeholder" style="color: #ff8a8a;">Harap isi semua nilai dengan angka!</p>`; return;
            }
            solveHomogenOrde2(c1, c2, a0, a1);
        }
    });

    function formatNumber(num) {
        if (num % 1 === 0) {
            return num.toString();
        }
        return num.toFixed(2).replace(/\.00$/, '');
    }

    function solveNonHomogen(r, k, c, d) {
        if (c !== 0) { solutionSteps.innerHTML = `<p class="placeholder" style="color: #ffc400;">Maaf, solver ini hanya mendukung a(0).</p>`; return; }
        if (r === 1) { solutionSteps.innerHTML = `<p class="placeholder" style="color: #ffc400;">Kasus r = 1 belum didukung.</p>`; return; }
        const B = -k / (r - 1);
        const A = d - B;
        solutionSteps.innerHTML = `<h4>Solusi untuk a(n) = ${formatNumber(r)}*a(n-1) + ${formatNumber(k)}</h4><hr>` +
        `<p><strong>Langkah 1: Identifikasi Koefisien</strong></p><ul><li>r = ${formatNumber(r)}</li><li>k = ${formatNumber(k)}</li><li>a(0) = ${formatNumber(d)}</li></ul><hr>` +
        `<p><strong>Langkah 2: Hitung B dan A</strong></p><p>B = -k / (r-1) = ${formatNumber(B)}</p><p>A = a(0) - B = ${formatNumber(A)}</p><hr>` +
        `<p><strong>Langkah 3: Solusi Akhir!</strong></p><h4 style="text-align: center;">a(n) = ${formatNumber(A)} * (${formatNumber(r)})<sup>n</sup> + (${formatNumber(B)})</h4>`;
    }

    function solveHomogenOrde2(c1, c2, a0, a1) {
        let stepsHTML = `<h4>Solusi untuk a(n) = ${formatNumber(c1)}*a(n-1) + ${formatNumber(c2)}*a(n-2)</h4><hr>`;
        stepsHTML += `<p><strong>Langkah 1: Bentuk Persamaan Karakteristik</strong></p><p>r² - (${formatNumber(c1)})r - (${formatNumber(c2)}) = 0</p><hr>`;
        
        const diskriminan = c1*c1 - 4*1*(-c2);
        stepsHTML += `<p><strong>Langkah 2: Cari Akar-akar (r₁, r₂)</strong></p><p>Diskriminan (D) = ${formatNumber(c1)}² - 4(1)(${-formatNumber(c2)}) = ${formatNumber(diskriminan)}</p>`;
        
        let r1, r2, k1, k2;
        if (diskriminan > 0) {
            r1 = (c1 + Math.sqrt(diskriminan)) / 2;
            r2 = (c1 - Math.sqrt(diskriminan)) / 2;
            stepsHTML += `<p>D > 0, ada 2 akar real berbeda:</p><p>r₁ = ${formatNumber(r1)}, r₂ = ${formatNumber(r2)}</p>`;
            k2 = (a1 - a0*r1) / (r2 - r1);
            k1 = a0 - k2;
            stepsHTML += `<hr><p><strong>Langkah 3: Hitung Konstanta k₁ & k₂</strong></p><p>k₁ + k₂ = ${formatNumber(a0)}</p><p>${formatNumber(r1)}k₁ + ${formatNumber(r2)}k₂ = ${formatNumber(a1)}</p><p>Ditemukan k₁ = ${formatNumber(k1)}, k₂ = ${formatNumber(k2)}</p>`;
            stepsHTML += `<hr><p><strong>Langkah 4: Solusi Akhir!</strong></p><h4 style="text-align: center;">a(n) = (${formatNumber(k1)}) * (${formatNumber(r1)})<sup>n</sup> + (${formatNumber(k2)}) * (${formatNumber(r2)})<sup>n</sup></h4>`;
        } else if (diskriminan === 0) {
            r1 = c1 / 2;
            stepsHTML += `<p>D = 0, ada akar real kembar:</p><p>r₁ = r₂ = ${formatNumber(r1)}</p>`;
            k1 = a0;
            k2 = (a1/r1) - k1;
            stepsHTML += `<hr><p><strong>Langkah 3: Hitung Konstanta k₁ & k₂</strong></p><p>k₁ = a(0) = ${formatNumber(k1)}</p><p>k₂ = (a(1)/r₁) - k₁ = ${formatNumber(k2)}</p>`;
            stepsHTML += `<hr><p><strong>Langkah 4: Solusi Akhir!</strong></p><h4 style="text-align: center;">a(n) = (${formatNumber(k1)} + ${formatNumber(k2)}n) * (${formatNumber(r1)})<sup>n</sup></h4>`;
        } else {
             stepsHTML += `<p class="placeholder" style="color: #ffc400;">D < 0, akar kompleks belum didukung oleh solver ini.</p>`;
        }
        solutionSteps.innerHTML = stepsHTML;
    }

    // =================================================================
    // ARENA KUIS V2 DENGAN 10 SOAL & RETRY (tetap sama)
    // =================================================================
    const quizData = [
        { question: "Jika a(n) = 2*a(n-1) dan a(0) = 3, berapakah a(3)?", options: ["12", "18", "24", "6"], answer: "24", solution: "a(1)=2*3=6, a(2)=2*6=12, a(3)=2*12=24." },
        { question: "Relasi a(n) = 5a(n-1) - 6a(n-2) adalah contoh dari...", options: ["Non-Linear", "Linear Non-Homogen", "Linear Homogen", "Semua salah"], answer: "Linear Homogen", solution: "Relasi ini linear dan tidak memiliki fungsi f(n) tambahan di sisi kanan." },
        { question: "Bentuk closed-form dari a(n) = a(n-1) + 5 dengan a(0)=2 adalah...", options: ["a(n) = 5n+2", "a(n) = 2n+5", "a(n) = n+5", "a(n) = 5n"], answer: "a(n) = 5n+2", solution: "Ini adalah barisan aritmetika dengan beda 5 dan suku awal 2." },
        { question: "Persamaan karakteristik untuk a(n) = a(n-1) + 2a(n-2) adalah...", options: ["r-1-2=0", "r²+r-2=0", "r²-r-2=0", "r²+r+2=0"], answer: "r²-r-2=0", solution: "Substitusi a(n) dengan r², a(n-1) dengan r, dan a(n-2) dengan 1, lalu pindahkan semua ke satu sisi." },
        { question: "Barisan Fibonacci didefinisikan oleh relasi...", options: ["F(n)=F(n-1)+F(n-2)", "F(n)=F(n-1)+1", "F(n)=2F(n-1)", "F(n)=n*F(n-1)"], answer: "F(n)=F(n-1)+F(n-2)", solution: "Definisi klasik dari barisan Fibonacci adalah jumlah dari dua suku sebelumnya." },
        { question: "Jika a(n) = n*a(n-1) dan a(1) = 1, barisan apakah ini?", options: ["Pangkat", "Eksponensial", "Faktorial", "Aritmetika"], answer: "Faktorial", solution: "a(n) = n * (n-1) * ... * a(1) = n!." },
        { question: "Orde dari relasi a(n) = 2a(n-1) + a(n-3) adalah...", options: ["1", "2", "3", "4"], answer: "3", solution: "Orde ditentukan oleh selisih terbesar antara n dan indeks suku sebelumnya, yaitu n - (n-3) = 3." },
        { question: "Mana di bawah ini yang merupakan relasi non-linear?", options: ["a(n)=a(n-1)+n", "a(n)=2a(n-1)", "a(n)=a(n-1)*a(n-2)", "a(n)=5"], answer: "a(n)=a(n-1)*a(n-2)", solution: "Relasi ini non-linear karena melibatkan perkalian antara dua suku sebelumnya." },
        { question: "Akar-akar dari persamaan karakteristik r²-5r+6=0 adalah...", options: ["1 dan 4", "2 dan 3", "-2 dan -3", "-1 dan -6"], answer: "2 dan 3", solution: "(r-2)(r-3)=0, sehingga r=2 dan r=3." },
        { question: "Jika akar karakteristik kembar (r, r), bentuk solusinya adalah...", options: ["k₁rⁿ + k₂rⁿ", "(k₁+k₂)rⁿ", "(k₁+k₂n)rⁿ", "k₁(nr)ⁿ"], answer: "(k₁+k₂n)rⁿ", solution: "Untuk akar kembar, solusi umumnya menyertakan faktor 'n' untuk suku kedua agar linear independen." },
    ];
    const quizContainer = document.querySelector('.quiz-container');
    const quizResult = document.getElementById('quiz-result');
    const quizSolutions = document.getElementById('quiz-solutions');

    function buildQuiz() {
        let quizHTML = quizData.map((item, index) => `
            <div class="question-block">
                <p>${index + 1}. ${item.question}</p>
                <div class="options" data-question-index="${index}">
                    ${item.options.map(opt => `<label><input type="radio" name="question${index}" value="${opt}"> ${opt}</label>`).join('')}
                </div>
            </div>`).join('');
        quizHTML += `<div class="quiz-buttons"><button id="check-quiz-btn">Periksa Jawaban</button><button id="retry-quiz-btn">Ulangi Kuis</button></div>`;
        quizContainer.innerHTML = quizHTML;
    }
    buildQuiz();

    const checkBtn = document.getElementById('check-quiz-btn');
    const retryBtn = document.getElementById('retry-quiz-btn');

    checkBtn.addEventListener('click', () => {
        let score = 0;
        let solutionsHTML = '<h3>Pembahasan</h3>';
        quizData.forEach((item, index) => {
            const selected = document.querySelector(`input[name="question${index}"]:checked`);
            const userAnswer = selected ? selected.value : "Tidak dijawab";
            const isCorrect = userAnswer === item.answer;
            if (isCorrect) score++;
            solutionsHTML += `<div class="solution-item"><h4>${index + 1}. ${item.question}</h4><p>Jawaban benar: <strong>${item.answer}</strong>. <span class="user-answer ${isCorrect ? 'correct' : 'wrong'}">(Jawabanmu: ${userAnswer})</span></p><p><i>Penyelesaian: ${item.solution}</i></p></div>`;
        });
        quizResult.innerHTML = `Skor Akhir Kamu: ${score} dari ${quizData.length}`;
        quizSolutions.innerHTML = solutionsHTML;
        retryBtn.style.display = 'block';
        checkBtn.style.display = 'none';
    });
    
    retryBtn.addEventListener('click', () => {
        quizResult.innerHTML = '';
        quizSolutions.innerHTML = '';
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        retryBtn.style.display = 'none';
        checkBtn.style.display = 'block';
        document.getElementById('lab').scrollIntoView({ behavior: 'smooth' });
    });
});