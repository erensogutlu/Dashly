document.addEventListener("DOMContentLoaded", () => {
	const yukleyici = document.getElementById("yukleyici");
	const anaIcerikDiv = document.getElementById("anaIcerik");
	const navLinkler = document.querySelectorAll(".nav-link");
	const hamburgerMenuBtn = document.getElementById("hamburgerMenu");
	const yanMenu = document.getElementById("yanMenu");

	// loader'ı gizle
	window.addEventListener("load", () => {
		yukleyici.classList.add("gizle");
	});

	// hamburger menü tıklama olay dinleyicisi
	hamburgerMenuBtn.addEventListener("click", () => {
		yanMenu.classList.toggle("acik");
	});

	// yan menüdeki linke tıklandığında menüyü kapat (mobil için)
	navLinkler.forEach((link) => {
		link.addEventListener("click", () => {
			if (window.innerWidth <= 768) {
				// mobil boyutta ise
				yanMenu.classList.remove("acik");
			}
		});
	});

	// api simülasyonu
	const veriCek = async (endpoint) => {
		// gerçek bir api'den veri çeker gibi simülasyon
		return new Promise((resolve) => {
			setTimeout(() => {
				if (endpoint === "dashboardVerileri") {
					resolve({
						toplamSatis: 1250000,
						yeniMusteri: 2345,
						ortalamaSepet: 250.75,
						donusumOrani: 3.2,
						aylikSatislar: {
							etiketler: [
								"Ocak",
								"Şubat",
								"Mart",
								"Nisan",
								"Mayıs",
								"Haziran",
								"Temmuz",
							],
							veriler: [65, 59, 80, 81, 56, 55, 40],
						},
						urunBazliSatislar: {
							etiketler: ["Ürün A", "Ürün B", "Ürün C", "Ürün D", "Ürün E"],
							veriler: [300, 500, 200, 150, 400],
						},
						sonIslemler: [
							{
								id: "#12345",
								musteri: "Ali Yılmaz",
								tarih: "2025-07-25",
								tutar: 120.0,
								durum: "Tamamlandı",
							},
							{
								id: "#12346",
								musteri: "Ayşe Demir",
								tarih: "2025-07-25",
								tutar: 350.5,
								durum: "Beklemede",
							},
							{
								id: "#12347",
								musteri: "Can Kaya",
								tarih: "2025-07-24",
								tutar: 80.0,
								durum: "İptal Edildi",
							},
							{
								id: "#12348",
								musteri: "Elif Su",
								tarih: "2025-07-24",
								tutar: 500.0,
								durum: "Tamamlandı",
							},
							{
								id: "#12349",
								musteri: "Deniz Ak",
								tarih: "2025-07-23",
								tutar: 95.2,
								durum: "Tamamlandı",
							},
						],
					});
				} else if (endpoint === "analizVerileri") {
					resolve({
						trafikKaynaklari: {
							etiketler: ["Organik", "Sosyal Medya", "Referans", "Doğrudan"],
							veriler: [40, 25, 20, 15],
						},
						kullaniciEtkilesimi: {
							etiketler: [
								"Sayfa Görüntüleme",
								"Ort. Oturum Süresi",
								"Hemen Çıkma Oranı",
							],
							veriler: [15000, 180, 45], // sayfa görüntüleme, saniye, yüzde
						},
					});
				} else if (endpoint === "raporVerileri") {
					const ornekVeri = Array.from({ length: 100 }, (_, i) => ({
						id: i + 1,
						urunAdi: `Ürün ${i + 1}`,
						kategori: ["Elektronik", "Giyim", "Ev Eşyası", "Kitap"][
							Math.floor(Math.random() * 4)
						],
						miktar: Math.floor(Math.random() * 10) + 1,
						fiyat: (Math.random() * 100 + 10).toFixed(2),
						toplam: (
							(Math.floor(Math.random() * 10) + 1) *
							(Math.random() * 100 + 10)
						).toFixed(2),
						tarih: `2025-0${Math.floor(Math.random() * 6) + 1}-${
							Math.floor(Math.random() * 28) + 1
						}`,
					}));
					resolve(ornekVeri);
				}
			}, 800); // gecikme ile veri döndür
		});
	};

	// sayfa içeriklerini tutan obje
	const sayfaIcerikleri = {
		anasayfa: `
                    <h2>Ana Sayfa Paneli</h2>
                    <div class="kart-gridi">
                        <div class="kart">
                            <h3>Toplam Satış</h3>
                            <p class="buyuk-sayi" id="toplamSatis"></p>
                            <p>Geçen aya göre %5 artış</p>
                        </div>
                        <div class="kart">
                            <h3>Yeni Müşteri</h3>
                            <p class="buyuk-sayi" id="yeniMusteri"></p>
                            <p>Toplam müşteri sayısı: 15,000</p>
                        </div>
                        <div class="kart">
                            <h3>Ortalama Sepet</h3>
                            <p class="buyuk-sayi" id="ortalamaSepet"></p>
                            <p>Hedef: ₺300</p>
                        </div>
                        <div class="kart">
                            <h3>Dönüşüm Oranı</h3>
                            <p class="buyuk-sayi" id="donusumOrani"></p>
                            <p>Sektör ortalaması: %2.8</p>
                        </div>
                    </div>
                    <div class="grafik-bolumu">
                        <div class="kart grafik-kart">
                            <h3>Aylık Satış Trendleri (Chart.js)</h3>
                            <canvas id="aylikSatisGrafigi"></canvas>
                        </div>
                        <div class="kart grafik-kart">
                            <h3>Ürün Bazlı Satış Dağılımı (ApexCharts)</h3>
                            <div id="urunBazliGrafigi"></div>
                        </div>
                    </div>
                    <div class="son-islemler-tablosu kart">
                        <h3>Son İşlemler</h3>
                        <div class="veri-tablosu-kapsayici">
                            <table>
                                <thead>
                                    <tr>
                                        <th>İşlem ID</th>
                                        <th>Müşteri</th>
                                        <th>Tarih</th>
                                        <th>Tutar</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody id="sonIslemlerTabloVerileri">
                                    <!-- dinamik olarak doldurulacak -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                `,
		analiz: `
                    <h2>Analiz ve Performans</h2>
                    <div class="grafik-bolumu">
                        <div class="kart grafik-kart">
                            <h3>Trafik Kaynakları (Chart.js - Pasta)</h3>
                            <canvas id="trafikKaynaklariGrafigi"></canvas>
                        </div>
                        <div class="kart grafik-kart">
                            <h3>Kullanıcı Etkileşimi (Chart.js - Çubuk)</h3>
                            <canvas id="kullaniciEtkilesimiGrafigi"></canvas>
                        </div>
                    </div>
                    <div class="kart">
                        <h3>Detaylı Analiz Metrikleri</h3>
                        <p>Burada daha detaylı metrikler, ısı haritaları veya kullanıcı akış analizleri gibi içerikler yer alabilir.</p>
                        <ul>
                            <li>Ortalama Oturum Süresi: <span id="ortOturumSuresi"></span> sn</li>
                            <li>Hemen Çıkma Oranı: <span id="hemenCikmaOrani"></span>%</li>
                            <li>Sayfa Görüntüleme: <span id="sayfaGoruntuleme"></span></li>
                        </ul>
                    </div>
                `,
		raporlar: `
                    <h2>Raporlar</h2>
                    <div class="filtre-ve-export-bolumu kart">
                        <div class="filtre-grubu">
                            <label for="filtreKategori">Kategori:</label>
                            <select id="filtreKategori">
                                <option value="tumu">Tümü</option>
                                <option value="Elektronik">Elektronik</option>
                                <option value="Giyim">Giyim</option>
                                <option value="Ev Eşyası">Ev Eşyası</option>
                                <option value="Kitap">Kitap</option>
                            </select>

                            <label for="filtreUrunAdi">Ürün Adı:</label>
                            <input type="text" id="filtreUrunAdi" placeholder="Ürün adı ara...">

                            <label for="filtreBaslangicTarihi">Başlangıç Tarihi:</label>
                            <input type="date" id="filtreBaslangicTarihi">
                            <label for="filtreBitisTarihi">Bitiş Tarihi:</label>
                            <input type="date" id="filtreBitisTarihi">

                            <button id="filtreUygulaDugme" class="dugme birincil">Filtrele</button>
                        </div>
                        <div class="export-grubu">
                            <button id="csvExportDugme" class="dugme ikincil">CSV İndir</button>
                            <button id="excelExportDugme" class="dugme ikincil">Excel İndir</button>
                        </div>
                    </div>

                    <div class="veri-tablosu-kapsayici kart">
                        <table id="raporTablosu">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-hashtag"></i> ID</th>
                                    <th><i class="fas fa-box"></i> Ürün Adı</th>
                                    <th><i class="fas fa-tags"></i> Kategori</th>
                                    <th><i class="fas fa-sort-numeric-up-alt"></i> Miktar</th>
                                    <th><i class="fas fa-money-bill-wave"></i> Fiyat</th>
                                    <th><i class="fas fa-dollar-sign"></i> Toplam</th>
                                    <th><i class="fas fa-calendar-alt"></i> Tarih</th>
                                </tr>
                            </thead>
                            <tbody id="raporTabloVerileri">
                                <!-- veriler js ile buraya yüklenecek -->
                            </tbody>
                        </table>
                        <div class="sayfalama-kontrolu">
                            <button id="oncekiSayfa" class="dugme">Önceki</button>
                            <span id="mevcutSayfa">1</span> / <span id="toplamSayfa">1</span>
                            <button id="sonrakiSayfa" class="dugme">Sonraki</button>
                        </div>
                    </div>
                `,
		ayarlar: `
                    <h2>Ayarlar</h2>
                    <div class="kart">
                        <h3>Genel Ayarlar</h3>
                        <p>Burada kullanıcı profili, bildirim tercihleri veya tema ayarları gibi seçenekler bulunabilir.</p>
                        <form class="ayarlar-formu">
                            <div class="form-grubu">
                                <label for="kullaniciAdi">Kullanıcı Adı:</label>
                                <input type="text" id="kullaniciAdi" value="Yönetici">
                            </div>
                            <div class="form-grubu">
                                <label for="eposta">E-posta:</label>
                                <input type="email" id="eposta" value="admin@example.com">
                            </div>
                            <button type="submit" class="dugme birincil">Ayarları Kaydet</button>
                        </form>
                    </div>
                    <div class="kart">
                        <h3>Veri Yönetimi</h3>
                        <p>Veri tabanı yedekleme, veri temizleme veya API anahtarı yönetimi gibi seçenekler.</p>
                        <button class="dugme ikincil">Verileri Yedekle</button>
                        <button class="dugme vurgu">Verileri Temizle</button>
                    </div>
                `,
	};

	let mevcutSayfaAdi = "anasayfa";
	let raporTumVeriler = [];
	let raporFiltrelenmisVeriler = [];
	let raporMevcutSayfa = 1;
	const raporSayfaBoyutu = 10;

	// sayfa içeriğini yükleme ve gösterme fonksiyonu
	const sayfaYukle = async (sayfaAdi) => {
		yukleyici.classList.remove("gizle"); // loader'ı göster
		anaIcerikDiv.innerHTML = sayfaIcerikleri[sayfaAdi];
		mevcutSayfaAdi = sayfaAdi;

		// navigasyon linklerini güncelle
		navLinkler.forEach((link) => {
			if (link.dataset.sayfa === sayfaAdi) {
				link.classList.add("aktif");
			} else {
				link.classList.remove("aktif");
			}
		});

		// sayfaya özel javascript'i çalıştır
		if (sayfaAdi === "anasayfa") {
			await anasayfaYukle();
		} else if (sayfaAdi === "analiz") {
			await analizYukle();
		} else if (sayfaAdi === "raporlar") {
			await raporlarYukle();
		} else if (sayfaAdi === "ayarlar") {
			ayarlarYukle();
		}

		yukleyici.classList.add("gizle"); // loader'ı gizle
	};

	// anasayfa (dashboard) yükleme fonksiyonu
	const anasayfaYukle = async () => {
		const veriler = await veriCek("dashboardVerileri");

		if (veriler) {
			document.getElementById(
				"toplamSatis"
			).textContent = `₺${veriler.toplamSatis.toLocaleString("tr-TR")}`;
			document.getElementById("yeniMusteri").textContent =
				veriler.yeniMusteri.toLocaleString("tr-TR");
			document.getElementById(
				"ortalamaSepet"
			).textContent = `₺${veriler.ortalamaSepet.toLocaleString("tr-TR", {
				minimumFractionDigits: 2,
			})}`;
			document.getElementById(
				"donusumOrani"
			).textContent = `%${veriler.donusumOrani.toLocaleString("tr-TR", {
				minimumFractionDigits: 1,
			})}`;

			// chart.js aylık satışlar grafiği
			const aylikSatisCtx = document.getElementById("aylikSatisGrafigi");
			if (aylikSatisCtx) {
				new Chart(aylikSatisCtx.getContext("2d"), {
					type: "line",
					data: {
						labels: veriler.aylikSatislar.etiketler,
						datasets: [
							{
								label: "Aylık Satışlar (₺)",
								data: veriler.aylikSatislar.veriler,
								borderColor: "var(--ikincil-renk)",
								backgroundColor: "rgba(52, 152, 219, 0.2)",
								tension: 0.3,
								fill: true,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							title: {
								display: true,
								text: "Aylık Satış Trendleri",
							},
						},
						scales: {
							y: {
								beginAtZero: true,
							},
						},
					},
				});
			}

			// apexcharts ürün bazlı satışlar grafiği
			const urunBazliDiv = document.getElementById("urunBazliGrafigi");
			if (urunBazliDiv) {
				const options = {
					chart: {
						type: "bar",
						height: 350,
						toolbar: { show: false },
					},
					series: [
						{
							name: "Satışlar",
							data: veriler.urunBazliSatislar.veriler,
						},
					],
					xaxis: {
						categories: veriler.urunBazliSatislar.etiketler,
					},
					colors: ["#2ecc71", "#f1c40f", "#9b59b6", "#34495e", "#e67e22"],
					plotOptions: {
						bar: {
							horizontal: false,
							columnWidth: "55%",
							endingShape: "rounded",
						},
					},
					dataLabels: {
						enabled: false,
					},
					title: {
						text: "Ürün Bazlı Satış Dağılımı",
						align: "left",
						style: {
							fontSize: "20px",
							color: "var(--birincil-renk)",
						},
					},
				};
				new ApexCharts(urunBazliDiv, options).render();
			}

			// son işlemler tablosu
			const sonIslemlerTabloVerileri = document.getElementById(
				"sonIslemlerTabloVerileri"
			);
			if (sonIslemlerTabloVerileri) {
				sonIslemlerTabloVerileri.innerHTML = "";
				veriler.sonIslemler.forEach((islem) => {
					const satir = document.createElement("tr");
					satir.innerHTML = `
                                <td>${islem.id}</td>
                                <td>${islem.musteri}</td>
                                <td>${islem.tarih}</td>
                                <td>₺${islem.tutar.toLocaleString("tr-TR", {
																	minimumFractionDigits: 2,
																})}</td>
                                <td>${islem.durum}</td>
                            `;
					sonIslemlerTabloVerileri.appendChild(satir);
				});
			}
		}
	};

	// analiz sayfası yükleme fonksiyonu
	const analizYukle = async () => {
		const veriler = await veriCek("analizVerileri");

		if (veriler) {
			document.getElementById("ortOturumSuresi").textContent =
				veriler.kullaniciEtkilesimi.veriler[1];
			document.getElementById("hemenCikmaOrani").textContent =
				veriler.kullaniciEtkilesimi.veriler[2];
			document.getElementById("sayfaGoruntuleme").textContent =
				veriler.kullaniciEtkilesimi.veriler[0].toLocaleString("tr-TR");

			// trafik kaynakları grafiği (chart.js - pasta)
			const trafikKaynaklariCtx = document.getElementById(
				"trafikKaynaklariGrafigi"
			);
			if (trafikKaynaklariCtx) {
				new Chart(trafikKaynaklariCtx.getContext("2d"), {
					type: "doughnut",
					data: {
						labels: veriler.trafikKaynaklari.etiketler,
						datasets: [
							{
								label: "Trafik Kaynakları (%)",
								data: veriler.trafikKaynaklari.veriler,
								backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c"],
								hoverOffset: 8,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							title: {
								display: true,
								text: "Web Sitesi Trafik Kaynakları",
							},
						},
					},
				});
			}

			// kullanıcı etkileşimi grafiği (chart.js - çubuk)
			const kullaniciEtkilesimiCtx = document.getElementById(
				"kullaniciEtkilesimiGrafigi"
			);
			if (kullaniciEtkilesimiCtx) {
				new Chart(kullaniciEtkilesimiCtx.getContext("2d"), {
					type: "bar",
					data: {
						labels: veriler.kullaniciEtkilesimi.etiketler,
						datasets: [
							{
								label: "Değer",
								data: veriler.kullaniciEtkilesimi.veriler,
								backgroundColor: [
									"rgba(52, 152, 219, 0.8)",
									"rgba(46, 204, 113, 0.8)",
									"rgba(231, 76, 60, 0.8)",
								],
								borderColor: [
									"var(--ikincil-renk)",
									"#27ae60",
									"var(--vurgu-renk)",
								],
								borderWidth: 1,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							title: {
								display: true,
								text: "Kullanıcı Etkileşimi Metrikleri",
							},
							legend: {
								display: false,
							},
						},
						scales: {
							y: {
								beginAtZero: true,
							},
						},
					},
				});
			}
		}
	};

	// raporlar sayfası yükleme fonksiyonu
	const raporlarYukle = async () => {
		raporTumVeriler = await veriCek("raporVerileri");
		raporFiltrelenmisVeriler = [...raporTumVeriler];
		raporMevcutSayfa = 1;

		const raporTabloVerileri = document.getElementById("raporTabloVerileri");
		const mevcutSayfaSpan = document.getElementById("mevcutSayfa");
		const toplamSayfaSpan = document.getElementById("toplamSayfa");
		const oncekiSayfaDugme = document.getElementById("oncekiSayfa");
		const sonrakiSayfaDugme = document.getElementById("sonrakiSayfa");
		const filtreUygulaDugme = document.getElementById("filtreUygulaDugme");
		const csvExportDugme = document.getElementById("csvExportDugme");
		const excelExportDugme = document.getElementById("excelExportDugme");
		const filtreKategori = document.getElementById("filtreKategori");
		const filtreUrunAdi = document.getElementById("filtreUrunAdi");
		const filtreBaslangicTarihi = document.getElementById(
			"filtreBaslangicTarihi"
		);
		const filtreBitisTarihi = document.getElementById("filtreBitisTarihi");

		const tabloyuGoster = (veriler) => {
			raporTabloVerileri.innerHTML = "";
			const baslangicIndeksi = (raporMevcutSayfa - 1) * raporSayfaBoyutu;
			const bitisIndeksi = baslangicIndeksi + raporSayfaBoyutu;
			const sayfaVerileri = veriler.slice(baslangicIndeksi, bitisIndeksi);

			sayfaVerileri.forEach((veri) => {
				const satir = document.createElement("tr");
				satir.innerHTML = `
                            <td>${veri.id}</td>
                            <td>${veri.urunAdi}</td>
                            <td>${veri.kategori}</td>
                            <td>${veri.miktar}</td>
                            <td>₺${veri.fiyat}</td>
                            <td>₺${veri.toplam}</td>
                            <td>${veri.tarih}</td>
                        `;
				raporTabloVerileri.appendChild(satir);
			});

			toplamSayfaSpan.textContent = Math.ceil(
				veriler.length / raporSayfaBoyutu
			);
			mevcutSayfaSpan.textContent = raporMevcutSayfa;

			oncekiSayfaDugme.disabled = raporMevcutSayfa === 1;
			sonrakiSayfaDugme.disabled =
				raporMevcutSayfa === Math.ceil(veriler.length / raporSayfaBoyutu);
		};

		const verileriFiltrele = () => {
			const kategori = filtreKategori.value;
			const urunAdi = filtreUrunAdi.value.toLowerCase();
			const baslangicTarihi = filtreBaslangicTarihi.value;
			const bitisTarihi = filtreBitisTarihi.value;

			raporFiltrelenmisVeriler = raporTumVeriler.filter((veri) => {
				let kategoriUygun = true;
				if (kategori !== "tumu") {
					kategoriUygun = veri.kategori === kategori;
				}

				let urunAdiUygun = true;
				if (urunAdi) {
					urunAdiUygun = veri.urunAdi.toLowerCase().includes(urunAdi);
				}

				let tarihUygun = true;
				const veriTarih = new Date(veri.tarih);
				if (baslangicTarihi) {
					tarihUygun = tarihUygun && veriTarih >= new Date(baslangicTarihi);
				}
				if (bitisTarihi) {
					tarihUygun = tarihUygun && veriTarih <= new Date(bitisTarihi);
				}
				return kategoriUygun && urunAdiUygun && tarihUygun;
			});

			raporMevcutSayfa = 1; // filtrelemede ilk sayfaya dön
			tabloyuGoster(raporFiltrelenmisVeriler);
		};

		const csvExport = () => {
			if (raporFiltrelenmisVeriler.length === 0) {
				alert("dışa aktarılacak veri bulunmamaktadır.");
				return;
			}
			const basliklar = Object.keys(raporFiltrelenmisVeriler[0])
				.map((baslik) => `"${baslik}"`)
				.join(",");
			const satirlar = raporFiltrelenmisVeriler
				.map((veri) =>
					Object.values(veri)
						.map((deger) => `"${String(deger).replace(/"/g, '""')}"`)
						.join(",")
				)
				.join("\n");
			const csvIcerik = basliklar + "\n" + satirlar;

			const blob = new Blob([csvIcerik], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.setAttribute("download", "rapor_verileri.csv");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};

		const excelExport = () => {
			// basit bir excel exportu için csv tabanlı bir çözüm sunulabilir
			// daha karmaşık excel exportu için kütüphaneler (örneğin sheetjs) gereklidir.
			// bu örnekte, basitlik adına csv'yi çağırıyoruz.
			alert(
				"excel export özelliği için daha gelişmiş bir kütüphane (örneğin sheetjs) kullanılması gerekmektedir. şimdilik csv olarak indirebilirsiniz."
			);
			csvExport();
		};

		// olay dinleyicileri
		oncekiSayfaDugme.addEventListener("click", () => {
			if (raporMevcutSayfa > 1) {
				raporMevcutSayfa--;
				tabloyuGoster(raporFiltrelenmisVeriler);
			}
		});

		sonrakiSayfaDugme.addEventListener("click", () => {
			if (
				raporMevcutSayfa <
				Math.ceil(raporFiltrelenmisVeriler.length / raporSayfaBoyutu)
			) {
				raporMevcutSayfa++;
				tabloyuGoster(raporFiltrelenmisVeriler);
			}
		});

		filtreUygulaDugme.addEventListener("click", verileriFiltrele);
		csvExportDugme.addEventListener("click", csvExport);
		excelExportDugme.addEventListener("click", excelExport);

		// ilk yüklemede tabloyu göster
		tabloyuGoster(raporFiltrelenmisVeriler);
	};

	// ayarlar sayfası yükleme fonksiyonu (basit)
	const ayarlarYukle = () => {
		const ayarlarFormu = document.querySelector(".ayarlar-formu");
		if (ayarlarFormu) {
			ayarlarFormu.addEventListener("submit", (e) => {
				e.preventDefault();
				const kullaniciAdi = document.getElementById("kullaniciAdi").value;
				const eposta = document.getElementById("eposta").value;
				// burada ayarları kaydetme mantığı eklenebilir (örn. localstorage veya api'ye gönderme)
				alert(
					`ayarlar kaydedildi!\nkullanıcı adı: ${kullaniciAdi}\ne-posta: ${eposta}`
				);
			});
		}
	};

	// navigasyon linklerine tıklama olay dinleyicisi
	navLinkler.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const hedefSayfa = e.target.dataset.sayfa;
			if (hedefSayfa) {
				sayfaYukle(hedefSayfa);
			}
		});
	});

	// sayfa ilk yüklendiğinde varsayılan olarak anasayfa'yı göster
	sayfaYukle("anasayfa");
});
