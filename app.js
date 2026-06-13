/* =====================================================================
   SIPANGAN EDU — Prototype + Design System (model aktor diperbaiki)
   3 aktor: SPPG (Admin Pusat) · Petugas Pengantar · Pihak Sekolah
   QR = verifikasi penyaluran: sekolah tampilkan QR → petugas scan saat
   tiba → sekolah konfirmasi sesuai/tidak → bisa lapor ketidaksesuaian.
   Mengikuti dokumen 02 Design System · 04 User Flow · 05 Panduan.
   ===================================================================== */

/* ---------- Helper komponen (sesuai Komponen Inti) ---------- */
const ic = (n, c = 'w-5 h-5') => `<i data-lucide="${n}" class="${c}"></i>`;
const pbtn = (label, { icon = '', onclick = '', full = true } = {}) =>
  `<button ${onclick ? `onclick="${onclick}"` : ''} class="tap ${full ? 'w-full' : ''} h-12 px-5 rounded-btn bg-primary hover:bg-primary-dark text-white font-semibold shadow-soft flex items-center justify-center gap-2">${icon ? ic(icon, 'w-4 h-4') : ''}${label}</button>`;
const sbtn = (label, { icon = '', onclick = '', full = true } = {}) =>
  `<button ${onclick ? `onclick="${onclick}"` : ''} class="tap ${full ? 'w-full' : ''} h-12 px-5 rounded-btn bg-white border-2 border-primary text-primary font-semibold flex items-center justify-center gap-2">${icon ? ic(icon, 'w-4 h-4') : ''}${label}</button>`;
const field = (label, ph, { icon = '', type = 'text', help = '', error = '' } = {}) => `
  <label class="block">
    ${label?`<span class="text-[13px] font-semibold text-ink">${label}</span>`:''}
    <span class="mt-1.5 flex items-center gap-2 h-12 px-3 rounded-btn border ${error ? 'border-danger' : 'border-line'} bg-white focus-within:border-primary">
      ${icon ? `<span class="text-ink-soft">${ic(icon, 'w-4 h-4')}</span>` : ''}
      <input type="${type}" placeholder="${ph}" class="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400" />
    </span>
    ${error ? `<span class="mt-1 text-[12px] text-danger flex items-center gap-1">${ic('alert-circle','w-3 h-3')}${error}</span>` : help ? `<span class="mt-1 text-[12px] text-ink-soft">${help}</span>` : ''}
  </label>`;
const card = (inner, extra = '') => `<div class="bg-white rounded-card p-4 shadow-soft border border-line ${extra}">${inner}</div>`;
const badge = (text, type = 'info') => {
  const m = { success:'bg-primary-light text-primary', proses:'bg-amber-100 text-amber-700', gagal:'bg-red-100 text-danger', info:'bg-slate-100 text-ink-soft', accent:'bg-amber-100 text-amber-700' };
  const dot = { success:'bg-secondary', proses:'bg-accent', gagal:'bg-danger', info:'bg-slate-400', accent:'bg-accent' };
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${m[type]}"><span class="w-1.5 h-1.5 rounded-full ${dot[type]}"></span>${text}</span>`;
};
const bar = (title, { back = true, action = '', sub = '' } = {}) => `
  <div class="sticky top-0 z-10 bg-bg/95 backdrop-blur px-4 pt-2 pb-3 flex items-center gap-3 border-b border-line">
    ${back ? `<button onclick="prevScreen()" class="tap w-9 h-9 grid place-items-center rounded-full bg-white border border-line">${ic('chevron-left','w-5 h-5')}</button>` : ''}
    <div class="flex-1 min-w-0"><h2 class="font-display font-semibold text-[17px] truncate">${title}</h2>${sub ? `<p class="text-[12px] text-ink-soft truncate">${sub}</p>` : ''}</div>
    ${action}
  </div>`;

// Bottom Navigation: 5 tab per role (varian sesuai model aktor baru)
const NAV = {
  admin: [['home-dashboard','Dashboard','layout-dashboard'],['school-list','Sekolah','school'],['distribution-schedule','Jadwal','calendar-days'],['admin-reports','Laporan','clipboard-list'],['profile','Profil','user']],
  petugas: [['petugas-home','Beranda','home'],['distribution-schedule','Jadwal','calendar-days'],['qr-scanner','Scan','scan-line'],['riwayat','Riwayat','history'],['profile','Profil','user']],
  sekolah: [['school-home','Beranda','home'],['school-allocation','Jatah','utensils'],['school-qr','QR','qr-code'],['report-tracking','Laporan','clipboard-list'],['profile','Profil','user']],
};
const nav = (role, active) => {
  const tabs = NAV[role] || [];
  return `<div class="sticky bottom-0 mt-auto bg-white border-t border-line" style="height:64px">
    <div class="h-full grid grid-cols-5">
      ${tabs.map(([k,l,i],idx)=>{
        const on = k===active; const center = idx===2 && (l==='Scan'||l==='QR');
        if(center) return `<button onclick="go('${k}')" class="tap relative grid place-items-center"><span class="absolute -top-5 w-12 h-12 rounded-full bg-primary text-white grid place-items-center shadow-card border-4 border-white">${ic(i,'w-5 h-5')}</span><span class="mt-7 text-[10px] font-semibold ${on?'text-primary':'text-ink-soft'}">${l}</span></button>`;
        return `<button onclick="go('${k}')" class="tap flex flex-col items-center justify-center gap-0.5 ${on?'nav-active':'text-ink-soft'}">${ic(i,'w-5 h-5')}<span class="text-[10px] ${on?'font-semibold':''}">${l}</span></button>`;
      }).join('')}
    </div>
  </div>`;
};
const screenWrap = (body, role, active) => `<div class="min-h-full flex flex-col">${body}${role?nav(role,active):''}</div>`;

/* ============================ LAYAR ============================ */
const S = {};

/* 1. Splash */
S['splash'] = () => `
  <div class="h-full flex flex-col items-center justify-center bg-primary text-white px-8 text-center">
    <div class="w-28 h-28 rounded-[28px] bg-white grid place-items-center shadow-card overflow-hidden mb-6"><img src="logo.png" class="w-full h-full object-contain p-2" alt="logo"/></div>
    <h1 class="font-display text-3xl font-extrabold tracking-tight">SIPANGAN EDU</h1>
    <p class="mt-3 text-sm text-white/90 leading-relaxed max-w-[260px]">Platform Pengawasan & Transparansi Program Makan Bergizi Gratis untuk Sekolah</p>
    <div class="mt-10">${ic('loader-circle','w-7 h-7 animate-spin text-white/80')}</div>
    <button onclick="go('onboarding-1')" class="tap absolute bottom-10 text-xs text-white/70 underline">Lewati intro</button>
  </div>`;

/* 2-3 Onboarding */
const onboard = (n, { icon, color, title, desc, next, active }) => screenWrap(`
  <div class="flex-1 flex flex-col px-7 pt-10">
    <div class="flex justify-end"><button onclick="go('login')" class="text-sm text-ink-soft font-medium">Lewati</button></div>
    <div class="flex-1 flex flex-col items-center justify-center text-center">
      <div class="w-44 h-44 rounded-full grid place-items-center ${color}">${ic(icon,'w-20 h-20')}</div>
      <h2 class="font-display text-2xl font-bold mt-8">${title}</h2>
      <p class="text-sm text-ink-soft mt-3 leading-relaxed">${desc}</p>
    </div>
    <div class="flex items-center justify-center gap-2 mb-6">
      <span class="w-2 h-2 rounded-full ${active===1?'bg-primary w-6':'bg-slate-300'}"></span>
      <span class="w-2 h-2 rounded-full ${active===2?'bg-primary w-6':'bg-slate-300'}"></span>
    </div>
    <div class="pb-8">${pbtn(active===2?'Mulai Sekarang':'Lanjut',{icon:'arrow-right',onclick:`go('${next}')`})}</div>
  </div>`);
S['onboarding-1'] = () => onboard(1,{icon:'shield-check',color:'bg-primary-light text-primary',title:'Transparansi Penuh',desc:'Tiap penyaluran ke sekolah diverifikasi lewat QR & dokumentasi foto, terekam end-to-end.',next:'onboarding-2',active:1});
S['onboarding-2'] = () => onboard(2,{icon:'message-square-warning',color:'bg-amber-100 text-amber-600',title:'Laporan Real-time',desc:'Pihak sekolah mengonfirmasi penerimaan & melapor bila jatah tidak sesuai — langsung ditindaklanjuti Admin Pusat.',next:'login',active:2});

/* 4. Login — 3 role */
S['login'] = () => screenWrap(`
  <div class="flex-1 flex flex-col px-7 pt-10">
    <div class="w-16 h-16 rounded-2xl bg-white grid place-items-center shadow-soft border border-line overflow-hidden mb-5"><img src="logo.png" class="w-full h-full object-contain p-1"/></div>
    <h1 class="font-display text-2xl font-bold">Selamat Datang</h1>
    <p class="text-sm text-ink-soft mt-1">Masuk untuk melanjutkan ke SIPANGAN EDU</p>
    <div class="mt-6 space-y-4">
      ${field('Email / ID Akun','nama@instansi.go.id',{icon:'mail'})}
      ${field('Kata Sandi','••••••••',{icon:'lock',type:'password'})}
      <div class="flex justify-end"><a class="text-[13px] text-primary font-semibold">Lupa kata sandi?</a></div>
    </div>
    <p class="text-[13px] font-semibold text-ink mt-2 mb-2">Masuk sebagai</p>
    <div class="space-y-2 mb-5">
      <button onclick="go('home-dashboard')" class="tap w-full flex items-center gap-3 p-3 rounded-btn border border-line bg-white hover:border-primary text-left"><span class="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center">${ic('building-2')}</span><span class="flex-1"><span class="block text-[13px] font-semibold">Admin Pusat (SPPG)</span><span class="block text-[11px] text-ink-soft">Perencanaan alokasi & monitoring</span></span>${ic('chevron-right','w-4 h-4 text-slate-300')}</button>
      <button onclick="go('petugas-home')" class="tap w-full flex items-center gap-3 p-3 rounded-btn border border-line bg-white hover:border-primary text-left"><span class="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center">${ic('truck')}</span><span class="flex-1"><span class="block text-[13px] font-semibold">Petugas Pengantar</span><span class="block text-[11px] text-ink-soft">Mengantar & scan QR di sekolah</span></span>${ic('chevron-right','w-4 h-4 text-slate-300')}</button>
      <button onclick="go('school-home')" class="tap w-full flex items-center gap-3 p-3 rounded-btn border border-line bg-white hover:border-primary text-left"><span class="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center">${ic('school')}</span><span class="flex-1"><span class="block text-[13px] font-semibold">Pihak Sekolah</span><span class="block text-[11px] text-ink-soft">Terima jatah, konfirmasi & lapor</span></span>${ic('chevron-right','w-4 h-4 text-slate-300')}</button>
    </div>
    <p class="text-center text-[13px] text-ink-soft pb-8">Belum punya akun? <button onclick="go('register')" class="text-primary font-semibold">Daftar</button></p>
  </div>`);

/* 5. Register */
S['register'] = () => screenWrap(`
  ${bar('Buat Akun',{sub:'Pendaftaran akun instansi / sekolah'})}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${field('Nama Instansi / Sekolah','Contoh: SDN 01 Menteng',{icon:'building'})}
    ${field('Email','nama@instansi.go.id',{icon:'mail'})}
    ${field('No. Telepon','08xx xxxx xxxx',{icon:'phone'})}
    ${field('Kata Sandi','Min. 8 karakter',{icon:'lock',type:'password',help:'Gunakan kombinasi huruf & angka.'})}
    <label class="flex items-start gap-2 text-[12px] text-ink-soft"><input type="checkbox" class="mt-0.5"/> Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi SIPANGAN EDU.</label>
    ${pbtn('Daftar Sekarang',{icon:'user-plus',onclick:"go('login')"})}
  </div>`);

/* 6. Home Dashboard (Admin Pusat / SPPG) */
S['home-dashboard'] = () => screenWrap(`
  <div class="px-5 pt-3 pb-2 bg-primary text-white rounded-b-3xl">
    <div class="flex items-center justify-between">
      <div><p class="text-[12px] text-white/80">Selamat pagi,</p><p class="font-display font-bold text-lg">Admin Pusat · SPPG</p></div>
      <button onclick="go('notifications')" class="tap relative w-10 h-10 grid place-items-center rounded-full bg-white/15">${ic('bell','w-5 h-5')}<span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent"></span></button>
    </div>
    <div class="grid grid-cols-3 gap-2 mt-4 mb-1">
      ${[['Sekolah','128','school'],['Penyaluran','96%','truck'],['Laporan','7','clipboard-list']].map(([l,v,i])=>`<div class="bg-white/15 rounded-2xl p-3 text-center">${ic(i,'w-4 h-4 mx-auto mb-1')}<p class="font-display font-bold text-lg">${v}</p><p class="text-[10px] text-white/80">${l}</p></div>`).join('')}
    </div>
  </div>
  <div class="flex-1 px-5 py-4 space-y-4">
    <div><h3 class="font-display font-semibold mb-2">Aksi Cepat</h3>
      <div class="grid grid-cols-4 gap-2 text-center">
        ${[['Jadwal','calendar-days','distribution-schedule'],['Sekolah','school','school-list'],['Statistik','bar-chart-3','statistics'],['Laporan','clipboard-list','admin-reports']].map(([l,i,t])=>`<button onclick="go('${t}')" class="tap flex flex-col items-center gap-1.5"><span class="w-12 h-12 rounded-2xl bg-primary-light text-primary grid place-items-center">${ic(i)}</span><span class="text-[11px] text-ink-soft">${l}</span></button>`).join('')}
      </div></div>
    <div><h3 class="font-display font-semibold mb-2">Penyaluran Hari Ini</h3>
      ${card(`<div class="flex items-center justify-between"><div><p class="font-semibold">SDN 01 Menteng</p><p class="text-[12px] text-ink-soft">240 porsi · tiba 08:30</p></div>${badge('Diterima','success')}</div>`,'mb-2')}
      ${card(`<div class="flex items-center justify-between"><div><p class="font-semibold">SMPN 5 Jakarta</p><p class="text-[12px] text-ink-soft">310 porsi · tiba 09:15</p></div>${badge('Dalam perjalanan','proses')}</div>`)}
    </div>
  </div>`,'admin','home-dashboard');

/* 7. Distribution Schedule */
S['distribution-schedule'] = () => screenWrap(`
  ${bar('Jadwal Distribusi',{back:false,sub:'Senin, 15 Juni 2026',action:`<button class="tap w-9 h-9 grid place-items-center rounded-full bg-primary text-white">${ic('plus','w-5 h-5')}</button>`})}
  <div class="px-5 py-3 flex gap-2 overflow-x-auto">${['Sen 15','Sel 16','Rab 17','Kam 18','Jum 19'].map((d,i)=>`<button class="tap shrink-0 px-3 py-2 rounded-btn text-[12px] font-semibold ${i===0?'bg-primary text-white':'bg-white border border-line text-ink-soft'}">${d}</button>`).join('')}</div>
  <div class="flex-1 px-5 pb-4 space-y-3">
    ${[['SDN 01 Menteng','08:30','240','success','Diterima'],['SMPN 5 Jakarta','09:15','310','proses','Dikirim'],['SDN 07 Cikini','10:00','180','info','Terjadwal'],['SMAN 3 Setiabudi','10:45','420','info','Terjadwal']].map(([s,t,p,st,lb])=>`<button onclick="go('school-detail')" class="tap w-full text-left">${card(`<div class="flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-primary-light text-primary grid place-items-center">${ic('school')}</div><div class="flex-1"><p class="font-semibold">${s}</p><p class="text-[12px] text-ink-soft flex items-center gap-2">${ic('clock','w-3 h-3')}${t} · ${p} porsi</p></div>${badge(lb,st)}</div>`)}</button>`).join('')}
  </div>`,'admin','distribution-schedule');

/* 8. School List */
S['school-list'] = () => screenWrap(`
  ${bar('Daftar Sekolah',{back:false,action:`<button class="tap w-9 h-9 grid place-items-center rounded-full bg-primary text-white">${ic('plus','w-5 h-5')}</button>`})}
  <div class="px-5 py-3">${field('','Cari sekolah...',{icon:'search'})}</div>
  <div class="flex-1 px-5 pb-4 space-y-3">
    ${[['SDN 01 Menteng','Jakarta Pusat','240'],['SMPN 5 Jakarta','Jakarta Pusat','310'],['SDN 07 Cikini','Jakarta Pusat','180'],['SMAN 3 Setiabudi','Jakarta Selatan','420'],['SMK A Tebet','Jakarta Selatan','205']].map(([s,a,p])=>`<button onclick="go('school-detail')" class="tap w-full text-left">${card(`<div class="flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-primary-light text-primary grid place-items-center">${ic('school')}</div><div class="flex-1"><p class="font-semibold">${s}</p><p class="text-[12px] text-ink-soft flex items-center gap-1">${ic('map-pin','w-3 h-3')}${a} · ${p} porsi/hari</p></div>${ic('chevron-right','w-5 h-5 text-slate-300')}</div>`)}</button>`).join('')}
  </div>`,'admin','school-list');

/* 9. School Detail */
S['school-detail'] = () => screenWrap(`
  ${bar('Detail Sekolah')}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${card(`<div class="flex items-center gap-3"><div class="w-14 h-14 rounded-2xl bg-primary-light text-primary grid place-items-center">${ic('school','w-7 h-7')}</div><div><p class="font-display font-bold text-lg">SDN 01 Menteng</p><p class="text-[12px] text-ink-soft flex items-center gap-1">${ic('map-pin','w-3 h-3')}Jl. Menteng Raya, Jakpus</p></div></div>`)}
    <div class="grid grid-cols-3 gap-2">${[['Jatah/hari','240'],['Hari ini','240'],['Verifikasi','98%']].map(([l,v])=>card(`<p class="font-display font-bold text-lg text-primary">${v}</p><p class="text-[11px] text-ink-soft">${l}</p>`)).join('')}</div>
    <div><h3 class="font-display font-semibold mb-2">Penanggung Jawab</h3>${card(`<div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-slate-100 grid place-items-center">${ic('user','w-5 h-5 text-ink-soft')}</div><div class="flex-1"><p class="font-semibold text-sm">Bu Sri Wahyuni</p><p class="text-[12px] text-ink-soft">Kepala Sekolah</p></div><button class="tap w-9 h-9 grid place-items-center rounded-full bg-primary-light text-primary">${ic('phone','w-4 h-4')}</button></div>`)}</div>
    ${pbtn('Lihat di Peta',{icon:'map'})}
  </div>`,'admin','school-list');

/* 10. QR Scanner (Petugas scan QR sekolah saat tiba) */
S['qr-scanner'] = () => screenWrap(`
  <div class="flex-1 flex flex-col bg-slate-900 text-white relative">
    <div class="sticky top-0 z-10 px-4 pt-2 pb-3 flex items-center gap-3 border-b border-white/10">
      <button onclick="prevScreen()" class="tap w-9 h-9 grid place-items-center rounded-full bg-white/15">${ic('chevron-left','w-5 h-5')}</button>
      <div class="flex-1"><h2 class="font-display font-semibold text-[17px]">Scan QR Sekolah</h2><p class="text-[12px] text-white/60">Verifikasi penyaluran saat tiba</p></div>
      <button class="tap w-9 h-9 grid place-items-center rounded-full bg-white/15">${ic('zap','w-5 h-5')}</button>
    </div>
    <div class="flex-1 grid place-items-center px-10">
      <div class="relative w-60 h-60">
        ${['-top-1 -left-1 border-t-4 border-l-4 rounded-tl-2xl','-top-1 -right-1 border-t-4 border-r-4 rounded-tr-2xl','-bottom-1 -left-1 border-b-4 border-l-4 rounded-bl-2xl','-bottom-1 -right-1 border-b-4 border-r-4 rounded-br-2xl'].map(p=>`<span class="absolute ${p} w-10 h-10 border-accent"></span>`).join('')}
        <span class="qr-line absolute left-3 right-3 h-0.5 bg-accent shadow-[0_0_12px_#FFC107]"></span>
        <div class="absolute inset-6 opacity-30 grid place-items-center">${ic('qr-code','w-24 h-24')}</div>
      </div>
    </div>
    <p class="text-center text-sm text-white/80 px-10">Arahkan kamera ke QR yang ditampilkan pihak sekolah</p>
    <div class="p-6"><button onclick="go('verification-success')" class="tap w-full h-12 rounded-btn bg-accent text-slate-900 font-bold flex items-center justify-center gap-2">${ic('check-circle','w-5 h-5')}Simulasi Scan Berhasil</button></div>
  </div>`,'petugas','qr-scanner');

/* 11. Verification Success (penyaluran tercatat — sisi Petugas) */
S['verification-success'] = () => screenWrap(`
  <div class="flex-1 flex flex-col items-center justify-center px-8 text-center">
    <div class="w-28 h-28 rounded-full bg-primary-light grid place-items-center mb-6"><div class="w-20 h-20 rounded-full bg-primary grid place-items-center text-white">${ic('check','w-12 h-12')}</div></div>
    <h1 class="font-display text-2xl font-bold">Penyaluran Tercatat</h1>
    <p class="text-sm text-ink-soft mt-2">QR sekolah berhasil diverifikasi</p>
    ${card(`<div class="space-y-2 text-left">${[['Sekolah','SDN 01 Menteng'],['Jumlah','240 porsi'],['Waktu tiba','15 Jun 2026, 08:32'],['Petugas','Pak Budi Santoso']].map(([k,v])=>`<div class="flex justify-between text-sm"><span class="text-ink-soft">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}</div>`,'w-full mt-6')}
    <div class="w-full mt-6 space-y-2">${pbtn('Scan Sekolah Berikutnya',{icon:'scan-line',onclick:"go('qr-scanner')"})}${sbtn('Selesai',{onclick:"go('petugas-home')"})}</div>
  </div>`);

/* 12. Distribution Report (Petugas) */
S['distribution-report'] = () => screenWrap(`
  ${bar('Laporan Distribusi',{sub:'SDN 01 Menteng · 15 Jun'})}
  <div class="flex-1 px-5 py-4 space-y-4">
    <div class="grid grid-cols-2 gap-3">${[['Jatah Dijadwalkan','240','package','text-primary'],['Diterima Sekolah','240','check-circle','text-secondary'],['Selisih','0','equal','text-ink-soft'],['Akurasi','100%','target','text-accent-dark']].map(([l,v,i,c])=>card(`${ic(i,'w-5 h-5 '+c)}<p class="font-display font-bold text-2xl mt-2">${v}</p><p class="text-[12px] text-ink-soft">${l}</p>`)).join('')}</div>
    <div><h3 class="font-display font-semibold mb-2">Dokumentasi Penyaluran</h3>${card(`<div class="grid grid-cols-3 gap-2">${[1,2,3].map(()=>`<div class="aspect-square rounded-xl bg-slate-100 grid place-items-center text-slate-300">${ic('image','w-7 h-7')}</div>`).join('')}</div>`)}</div>
    ${pbtn('Export Laporan PDF',{icon:'file-down'})}
  </div>`,'petugas','riwayat');

/* 13. Dashboard Sekolah */
S['school-home'] = () => screenWrap(`
  <div class="px-5 pt-3 pb-5 bg-primary text-white rounded-b-3xl">
    <div class="flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-11 h-11 rounded-2xl bg-white/20 grid place-items-center">${ic('school','w-6 h-6')}</div><div><p class="text-[12px] text-white/80">Pihak Sekolah</p><p class="font-display font-bold">SDN 01 Menteng</p></div></div><button onclick="go('notifications')" class="tap relative w-10 h-10 grid place-items-center rounded-full bg-white/15">${ic('bell','w-5 h-5')}<span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent"></span></button></div>
    <div class="mt-4 bg-white/15 rounded-2xl p-4"><div class="flex items-center justify-between"><p class="text-[12px] text-white/80">Jatah hari ini</p>${badge('Dalam perjalanan','accent')}</div><div class="flex items-center gap-3 mt-1">${ic('package','w-8 h-8')}<div><p class="font-display font-bold text-xl">240 porsi</p><p class="text-[12px] text-white/80">Estimasi tiba 08:30 · Petugas: Pak Budi</p></div></div></div>
  </div>
  <div class="flex-1 px-5 py-4 space-y-4">
    <div class="grid grid-cols-4 gap-2 text-center">${[['Jatah','utensils','school-allocation'],['Tampilkan QR','qr-code','school-qr'],['Konfirmasi','clipboard-check','confirm-receipt'],['Lapor','message-square-warning','report-form']].map(([l,i,t])=>`<button onclick="go('${t}')" class="tap flex flex-col items-center gap-1.5"><span class="w-12 h-12 rounded-2xl bg-primary-light text-primary grid place-items-center">${ic(i)}</span><span class="text-[11px] text-ink-soft leading-tight">${l}</span></button>`).join('')}</div>
    <div><h3 class="font-display font-semibold mb-2">Status Penyaluran</h3>${card(`<div class="space-y-3">${[['Jadwal dibuat Admin Pusat','done'],['Petugas dalam perjalanan','active'],['QR diverifikasi petugas','wait'],['Konfirmasi penerimaan','wait']].map(([t,st],i,a)=>`<div class="flex gap-3"><div class="flex flex-col items-center"><span class="w-7 h-7 rounded-full grid place-items-center ${st==='done'?'bg-primary text-white':st==='active'?'bg-accent text-slate-900':'bg-slate-100 text-slate-400'}">${ic(st==='done'?'check':st==='active'?'truck':'circle','w-4 h-4')}</span>${i<a.length-1?`<span class="w-0.5 flex-1 ${st==='done'?'bg-primary':'bg-slate-200'}" style="min-height:14px"></span>`:''}</div><p class="text-[13px] font-semibold ${st==='wait'?'text-slate-400':''} pt-1">${t}</p></div>`).join('')}</div>`)}</div>
  </div>`,'sekolah','school-home');

/* 14. Jatah & Jadwal */
S['school-allocation'] = () => screenWrap(`
  ${bar('Jatah & Jadwal',{back:false,sub:'Senin, 15 Juni 2026'})}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${card(`<div class="flex items-center justify-between mb-3"><h3 class="font-display font-bold">Alokasi Hari Ini</h3>${badge('Dalam perjalanan','proses')}</div><div class="grid grid-cols-2 gap-3">${[['Jumlah Jatah','240 porsi','package'],['Estimasi Tiba','08:30','clock'],['Petugas','Pak Budi','truck'],['Menu','Nasi Ayam','utensils']].map(([l,v,i])=>`<div class="flex items-center gap-2"><span class="w-9 h-9 rounded-xl bg-primary-light text-primary grid place-items-center">${ic(i,'w-4 h-4')}</span><div><p class="text-[11px] text-ink-soft">${l}</p><p class="text-[13px] font-semibold">${v}</p></div></div>`).join('')}</div>`)}
    <div><h3 class="font-display font-semibold mb-2">Komposisi Menu</h3>${card(`<div class="flex items-center gap-3"><div class="w-16 h-16 rounded-xl bg-amber-50 grid place-items-center text-3xl">🍛</div><div class="flex-1"><p class="font-semibold">Nasi Ayam Komplit</p><p class="text-[12px] text-ink-soft">Nasi, ayam, sayur, buah, susu · ≈650 kkal</p></div></div>`)}</div>
    <div><h3 class="font-display font-semibold mb-2">Jadwal Minggu Ini</h3><div class="space-y-2">${[['Sen 15','240','Dalam perjalanan','proses'],['Sel 16','240','Terjadwal','info'],['Rab 17','240','Terjadwal','info']].map(([d,p,lb,st])=>card(`<div class="flex items-center justify-between"><div><p class="font-semibold text-sm">${d} Juni</p><p class="text-[12px] text-ink-soft">${p} porsi</p></div>${badge(lb,st)}</div>`)).join('')}</div></div>
    ${pbtn('Tampilkan QR untuk Petugas',{icon:'qr-code',onclick:"go('school-qr')"})}
  </div>`,'sekolah','school-allocation');

/* ★ Tampilkan QR Sekolah */
S['school-qr'] = () => screenWrap(`
  ${bar('QR Sekolah')}
  <div class="flex-1 px-6 py-6 flex flex-col items-center">
    ${card(`<div class="flex flex-col items-center text-center"><p class="font-semibold">SDN 01 Menteng</p><p class="text-[12px] text-ink-soft mb-4">Penyaluran 15 Juni 2026 · 240 porsi</p><div class="w-52 h-52 rounded-2xl border-2 border-primary/20 grid place-items-center bg-white">${ic('qr-code','w-40 h-40 text-ink')}</div><p class="mt-3 text-[13px] font-mono font-semibold tracking-wider">SDN01-150626-240</p></div>`,'w-full')}
    <div class="mt-4 w-full flex items-center gap-2 px-3 py-2.5 rounded-btn bg-amber-50 text-amber-700 text-[12px] font-semibold">${ic('loader','w-4 h-4 animate-spin')}Menunggu petugas memindai QR...</div>
    <p class="text-center text-[12px] text-ink-soft mt-4 px-4">Tunjukkan QR ini ke petugas saat makanan tiba untuk memverifikasi penyaluran.</p>
    <div class="mt-auto w-full pt-4">${pbtn('Petugas Sudah Scan? Konfirmasi',{icon:'clipboard-check',onclick:"go('confirm-receipt')"})}</div>
  </div>`,'sekolah','school-qr');

/* 15. Konfirmasi Penerimaan */
S['confirm-receipt'] = () => screenWrap(`
  ${bar('Konfirmasi Penerimaan')}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${card(`<p class="text-[12px] text-ink-soft mb-2">Cocokkan jatah yang diterima</p><div class="flex items-center justify-between"><div class="text-center flex-1"><p class="text-[11px] text-ink-soft">Dijadwalkan</p><p class="font-display font-bold text-2xl text-primary">240</p></div>${ic('arrow-right','w-5 h-5 text-slate-300')}<div class="text-center flex-1"><p class="text-[11px] text-ink-soft">Diterima</p><div class="flex items-center justify-center gap-2 mt-1"><button class="tap w-7 h-7 rounded-full bg-slate-100 grid place-items-center">${ic('minus','w-4 h-4')}</button><span class="font-display font-bold text-2xl">240</span><button class="tap w-7 h-7 rounded-full bg-slate-100 grid place-items-center">${ic('plus','w-4 h-4')}</button></div></div></div>`)}
    <div><p class="text-[13px] font-semibold mb-2">Apakah penyaluran sesuai?</p><div class="grid grid-cols-2 gap-2"><button class="tap flex items-center justify-center gap-2 h-12 rounded-btn border-2 border-primary bg-primary-light text-primary font-semibold">${ic('check','w-4 h-4')}Sesuai</button><button onclick="go('report-form')" class="tap flex items-center justify-center gap-2 h-12 rounded-btn border border-line text-ink-soft font-semibold">${ic('x','w-4 h-4')}Tidak Sesuai</button></div></div>
    ${card(`<p class="text-[13px] font-semibold mb-2">Penilaian Kualitas (opsional)</p><div class="flex justify-center gap-2">${[1,2,3,4,5].map(i=>`<button class="tap">${ic('star',`w-8 h-8 ${i<=4?'text-accent fill-accent':'text-slate-300'}`)}</button>`).join('')}</div>`)}
    ${field('Catatan (opsional)','Tulis catatan penerimaan...',{icon:'pencil'})}
    <div class="space-y-2">${pbtn('Konfirmasi Sesuai',{icon:'clipboard-check',onclick:"go('receipt-done')"})}${sbtn('Lapor Ketidaksesuaian',{icon:'message-square-warning',onclick:"go('report-form')"})}</div>
  </div>`,'sekolah','school-home');

/* ★ Penerimaan Dikonfirmasi */
S['receipt-done'] = () => screenWrap(`
  <div class="flex-1 flex flex-col items-center justify-center px-8 text-center">
    <div class="w-28 h-28 rounded-full bg-primary-light grid place-items-center mb-6"><div class="w-20 h-20 rounded-full bg-primary grid place-items-center text-white">${ic('clipboard-check','w-11 h-11')}</div></div>
    <h1 class="font-display text-2xl font-bold">Penerimaan Dikonfirmasi</h1>
    <p class="text-sm text-ink-soft mt-2">Terima kasih, data tercatat & terkirim ke Admin Pusat.</p>
    ${card(`<div class="space-y-2 text-left">${[['Sekolah','SDN 01 Menteng'],['Diterima','240 / 240 porsi'],['Status','Sesuai'],['Waktu','15 Jun 2026, 08:45']].map(([k,v])=>`<div class="flex justify-between text-sm"><span class="text-ink-soft">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}</div>`,'w-full mt-6')}
    <div class="w-full mt-6 space-y-2">${pbtn('Selesai',{icon:'home',onclick:"go('school-home')"})}${sbtn('Lihat Jatah',{onclick:"go('school-allocation')"})}</div>
  </div>`);

/* 16. Lapor Ketidaksesuaian */
S['report-form'] = () => screenWrap(`
  ${bar('Lapor Ketidaksesuaian')}
  <div class="flex-1 px-5 py-4 space-y-4">
    <div><p class="text-[13px] font-semibold mb-2">Jenis Laporan</p><div class="grid grid-cols-2 gap-2">${[['Jumlah Kurang','minus-circle'],['Terlambat','clock-alert'],['Tidak Datang','truck',],['Kualitas Makanan','utensils-crossed']].map(([t,i],idx)=>`<button class="tap flex items-center gap-2 p-3 rounded-btn border ${idx===0?'border-primary bg-primary-light text-primary':'border-line bg-white text-ink-soft'}">${ic(i,'w-4 h-4')}<span class="text-[12px] font-semibold">${t}</span></button>`).join('')}</div></div>
    ${card(`<div class="flex items-center justify-between text-sm"><span class="text-ink-soft">Selisih jatah</span><span class="font-semibold text-danger">Dijadwalkan 240 · diterima 210 (−30)</span></div>`)}
    ${field('Judul Laporan','Contoh: Jatah kurang 30 porsi',{icon:'type'})}
    <label class="block"><span class="text-[13px] font-semibold">Deskripsi</span><textarea rows="4" placeholder="Jelaskan detail ketidaksesuaian..." class="mt-1.5 w-full p-3 rounded-btn border border-line bg-white outline-none text-sm focus:border-primary"></textarea></label>
    ${pbtn('Lampirkan Bukti Foto',{icon:'camera',onclick:"go('upload-evidence')"})}
  </div>`,'sekolah','report-tracking');

/* 17. Upload Bukti */
S['upload-evidence'] = () => screenWrap(`
  ${bar('Upload Bukti')}
  <div class="flex-1 px-5 py-4 space-y-4">
    <button class="tap w-full border-2 border-dashed border-primary/40 rounded-card p-8 flex flex-col items-center gap-2 text-primary bg-primary-light/40">${ic('camera','w-10 h-10')}<span class="font-semibold text-sm">Ambil / Unggah Foto Bukti</span><span class="text-[12px] text-ink-soft">JPG/PNG · maks 5MB</span></button>
    <div class="grid grid-cols-3 gap-2">${[1,2].map(()=>`<div class="relative aspect-square rounded-xl bg-slate-100 grid place-items-center text-slate-300">${ic('image','w-7 h-7')}<button class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white grid place-items-center">${ic('x','w-3 h-3')}</button></div>`).join('')}<div class="aspect-square rounded-xl border-2 border-dashed border-line grid place-items-center text-slate-300">${ic('plus','w-6 h-6')}</div></div>
    <div class="mt-auto">${pbtn('Kirim Laporan',{icon:'send',onclick:"go('report-tracking')"})}</div>
  </div>`,'sekolah','report-tracking');

/* 18. Status Laporan */
S['report-tracking'] = () => screenWrap(`
  ${bar('Status Laporan',{back:false})}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${card(`<div class="flex items-center justify-between mb-1"><p class="font-semibold">#LAP-2026-0142</p>${badge('Diproses','proses')}</div><p class="text-[13px] text-ink-soft">Jatah kurang 30 porsi · SDN 01 Menteng</p>`)}
    ${card(`<h3 class="font-display font-semibold mb-3">Lini Masa</h3><div class="space-y-4">${[['Laporan dikirim','15 Jun 08:50','done'],['Diterima Admin Pusat','15 Jun 09:10','done'],['Sedang diverifikasi','15 Jun 09:30','active'],['Tindak lanjut','Menunggu','wait'],['Selesai','Menunggu','wait']].map(([t,d,st],i,arr)=>`<div class="flex gap-3"><div class="flex flex-col items-center"><span class="w-7 h-7 rounded-full grid place-items-center ${st==='done'?'bg-primary text-white':st==='active'?'bg-accent text-slate-900':'bg-slate-100 text-slate-400'}">${ic(st==='done'?'check':st==='active'?'loader':'circle','w-4 h-4')}</span>${i<arr.length-1?`<span class="w-0.5 flex-1 ${st==='done'?'bg-primary':'bg-slate-200'}" style="min-height:18px"></span>`:''}</div><div class="pb-1"><p class="text-[13px] font-semibold ${st==='wait'?'text-slate-400':''}">${t}</p><p class="text-[11px] text-ink-soft">${d}</p></div></div>`).join('')}</div>`)}
  </div>`,'sekolah','report-tracking');

/* 19. Notifications */
S['notifications'] = () => screenWrap(`
  ${bar('Notifikasi',{action:`<button class="text-[12px] text-primary font-semibold">Tandai dibaca</button>`})}
  <div class="flex-1 px-5 py-4 space-y-3">
    ${[['truck','Petugas dalam perjalanan','Penyaluran 240 porsi menuju sekolahmu.','5 mnt','accent-dark',true],['clipboard-check','Laporan diproses','Laporan #0142 sedang diverifikasi Admin.','1 jam','primary',true],['check-circle','Penyaluran terverifikasi','SDN 01 Menteng menerima 240 porsi.','3 jam','secondary',false],['calendar-days','Jadwal diperbarui','SMPN 5 dijadwalkan ulang 09:15.','Kemarin','ink-soft',false]].map(([i,t,d,w,c,unread])=>card(`<div class="flex gap-3"><span class="w-10 h-10 rounded-full bg-primary-light text-${c} grid place-items-center shrink-0">${ic(i)}</span><div class="flex-1"><div class="flex justify-between"><p class="font-semibold text-[13px]">${t}</p>${unread?'<span class="w-2 h-2 rounded-full bg-primary mt-1"></span>':''}</div><p class="text-[12px] text-ink-soft">${d}</p><p class="text-[11px] text-slate-400 mt-1">${w} lalu</p></div></div>`)).join('')}
  </div>`);

/* 20. Statistics Dashboard */
S['statistics'] = () => screenWrap(`
  ${bar('Statistik',{back:false,sub:'Juni 2026'})}
  <div class="flex-1 px-5 py-4 space-y-4">
    <div class="grid grid-cols-2 gap-3">${[['Total Porsi','28.4k','package','text-primary'],['Sekolah Aktif','128','school','text-secondary'],['Akurasi Jatah','98%','target','text-accent-dark'],['Laporan Selesai','92%','check-circle','text-primary']].map(([l,v,i,c])=>card(`${ic(i,'w-5 h-5 '+c)}<p class="font-display font-bold text-2xl mt-1">${v}</p><p class="text-[12px] text-ink-soft">${l}</p>`)).join('')}</div>
    ${card(`<h3 class="font-display font-semibold mb-3">Penyaluran Mingguan</h3><div class="flex items-end justify-between gap-2 h-32">${[60,80,55,90,75,40,30].map((h,i)=>`<div class="flex-1 flex flex-col items-center gap-1"><div class="w-full rounded-t-lg bg-primary" style="height:${h}%;opacity:${0.5+h/200}"></div><span class="text-[10px] text-ink-soft">${['S','S','R','K','J','S','M'][i]}</span></div>`).join('')}</div>`)}
    ${card(`<h3 class="font-display font-semibold mb-3">Sebaran Status Laporan</h3><div class="space-y-2">${[['Selesai',92,'bg-secondary'],['Diproses',6,'bg-accent'],['Ditolak',2,'bg-danger']].map(([l,v,c])=>`<div><div class="flex justify-between text-[12px] mb-1"><span class="text-ink-soft">${l}</span><span class="font-semibold">${v}%</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full ${c}" style="width:${v}%"></div></div></div>`).join('')}</div>`)}
    ${pbtn('Export PDF',{icon:'file-down'})}
  </div>`,'admin','statistics');

/* 21. Profile (Pihak Sekolah) */
S['profile'] = () => screenWrap(`
  ${bar('Profil',{back:false})}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${card(`<div class="flex flex-col items-center text-center"><div class="w-20 h-20 rounded-full bg-primary-light grid place-items-center text-primary">${ic('school','w-10 h-10')}</div><p class="font-display font-bold text-lg mt-3">SDN 01 Menteng</p><p class="text-[12px] text-ink-soft">Pihak Sekolah · Jakarta Pusat</p>${badge('Akun Terverifikasi','success')}</div>`)}
    ${card(`<div class="divide-y divide-slate-100">${[['building','Profil Sekolah','settings'],['bell','Notifikasi','settings'],['shield','Privasi & Keamanan','settings'],['circle-help','Pusat Bantuan','help-center']].map(([i,t,g])=>`<button onclick="go('${g}')" class="tap w-full flex items-center gap-3 py-3">${ic(i,'w-5 h-5 text-ink-soft')}<span class="flex-1 text-left text-sm font-medium">${t}</span>${ic('chevron-right','w-4 h-4 text-slate-300')}</button>`).join('')}</div>`)}
    <button onclick="go('login')" class="tap w-full h-12 rounded-btn border-2 border-danger/30 text-danger font-semibold flex items-center justify-center gap-2">${ic('log-out','w-4 h-4')}Keluar</button>
  </div>`,'sekolah','profile');

/* 22. Settings */
S['settings'] = () => screenWrap(`
  ${bar('Pengaturan')}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${card(`<div class="space-y-1">${[['Notifikasi Push',true],['Email Ringkasan',false],['Mode Gelap',false]].map(([t,on])=>`<div class="flex items-center justify-between py-2"><span class="text-sm font-medium">${t}</span><span class="w-11 h-6 rounded-full ${on?'bg-primary':'bg-slate-200'} relative"><span class="absolute top-0.5 ${on?'right-0.5':'left-0.5'} w-5 h-5 rounded-full bg-white shadow"></span></span></div>`).join('')}</div>`)}
    ${card(`<div class="divide-y divide-slate-100">${[['globe','Bahasa','Indonesia'],['type','Ukuran Teks','Sedang'],['info','Versi Aplikasi','1.0.0']].map(([i,t,v])=>`<div class="flex items-center gap-3 py-3">${ic(i,'w-5 h-5 text-ink-soft')}<span class="flex-1 text-sm font-medium">${t}</span><span class="text-[12px] text-ink-soft">${v}</span></div>`).join('')}</div>`)}
  </div>`);

/* 23. Help Center */
S['help-center'] = () => screenWrap(`
  ${bar('Pusat Bantuan')}
  <div class="flex-1 px-5 py-4 space-y-4">
    ${field('','Cari bantuan...',{icon:'search'})}
    <div><h3 class="font-display font-semibold mb-2">FAQ</h3><div class="space-y-2">${[['Bagaimana verifikasi QR?','Sekolah membuka tab QR & menunjukkannya; petugas memindai saat tiba.'],['Bagaimana melapor jika jatah kurang?','Buka Konfirmasi Penerimaan → Tidak Sesuai, atau menu Lapor, lalu lampirkan foto.'],['Kapan jatah tiba?','Sesuai jadwal di tab Jatah; status penyaluran tampil real-time di Beranda.']].map(([q,a])=>card(`<details><summary class="font-semibold text-[13px] cursor-pointer flex items-center justify-between">${q}${ic('chevron-down','w-4 h-4 text-ink-soft')}</summary><p class="text-[12px] text-ink-soft mt-2">${a}</p></details>`)).join('')}</div></div>
    ${card(`<div class="flex items-center gap-3">${ic('headphones','w-8 h-8 text-primary')}<div class="flex-1"><p class="font-semibold text-sm">Butuh bantuan lain?</p><p class="text-[12px] text-ink-soft">Hubungi tim dukungan SPPG</p></div><button class="tap px-3 h-9 rounded-btn bg-primary text-white text-[12px] font-semibold">Chat</button></div>`)}
  </div>`);

/* 24. Empty State */
S['empty-state'] = () => screenWrap(`
  ${bar('Riwayat')}
  <div class="flex-1 flex flex-col items-center justify-center px-10 text-center">
    <div class="w-32 h-32 rounded-full bg-slate-100 grid place-items-center text-slate-300 mb-5">${ic('inbox','w-16 h-16')}</div>
    <h2 class="font-display font-bold text-lg">Belum Ada Data</h2>
    <p class="text-sm text-ink-soft mt-2">Riwayat penyaluran akan muncul di sini setelah ada aktivitas.</p>
    <div class="mt-6 w-full">${pbtn('Muat Ulang',{icon:'refresh-cw'})}</div>
  </div>`);

/* 25. Error State */
S['error-state'] = () => screenWrap(`
  <div class="flex-1 flex flex-col items-center justify-center px-10 text-center">
    <div class="w-32 h-32 rounded-full bg-red-50 grid place-items-center text-danger mb-5">${ic('wifi-off','w-16 h-16')}</div>
    <h2 class="font-display font-bold text-lg">Koneksi Terputus</h2>
    <p class="text-sm text-ink-soft mt-2">Periksa jaringan internetmu lalu coba lagi.</p>
    <div class="mt-6 w-full space-y-2">${pbtn('Coba Lagi',{icon:'refresh-cw'})}${sbtn('Kembali ke Beranda',{onclick:"go('school-home')"})}</div>
  </div>`);

/* ★ Petugas Home (Beranda) */
S['petugas-home'] = () => screenWrap(`
  <div class="px-5 pt-3 pb-5 bg-primary text-white rounded-b-3xl">
    <div class="flex items-center justify-between"><div><p class="text-[12px] text-white/80">Petugas Pengantar</p><p class="font-display font-bold text-lg">Pak Budi Santoso</p></div><button onclick="go('notifications')" class="tap w-10 h-10 grid place-items-center rounded-full bg-white/15">${ic('bell','w-5 h-5')}</button></div>
    <div class="grid grid-cols-3 gap-2 mt-4">${[['Tugas','4','clipboard-list'],['Selesai','1','check-circle'],['Porsi','1.150','package']].map(([l,v,i])=>`<div class="bg-white/15 rounded-2xl p-3 text-center">${ic(i,'w-4 h-4 mx-auto mb-1')}<p class="font-display font-bold text-lg">${v}</p><p class="text-[10px] text-white/80">${l}</p></div>`).join('')}</div>
  </div>
  <div class="flex-1 px-5 py-4 space-y-4">
    <div class="grid grid-cols-4 gap-2 text-center">${[['Jadwal','calendar-days','distribution-schedule'],['Scan QR','scan-line','qr-scanner'],['Riwayat','history','riwayat'],['Laporan','file-text','distribution-report']].map(([l,i,t])=>`<button onclick="go('${t}')" class="tap flex flex-col items-center gap-1.5"><span class="w-12 h-12 rounded-2xl bg-primary-light text-primary grid place-items-center">${ic(i)}</span><span class="text-[11px] text-ink-soft">${l}</span></button>`).join('')}</div>
    <div><h3 class="font-display font-semibold mb-2">Tugas Berikutnya</h3>${card(`<div class="flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 grid place-items-center">${ic('truck')}</div><div class="flex-1"><p class="font-semibold">SMPN 5 Jakarta</p><p class="text-[12px] text-ink-soft">09:15 · 310 porsi</p></div><button onclick="go('qr-scanner')" class="tap px-3 h-9 rounded-btn bg-primary text-white text-[12px] font-semibold">Scan</button></div>`)}</div>
  </div>`,'petugas','petugas-home');

/* ★ Riwayat Distribusi (Petugas) */
S['riwayat'] = () => screenWrap(`
  ${bar('Riwayat Distribusi',{back:false})}
  <div class="flex-1 px-5 py-4 space-y-3">
    ${[['SDN 01 Menteng','15 Jun · 08:30','240/240','success','Sesuai'],['SDN 09 Kemang','14 Jun · 08:20','190/190','success','Sesuai'],['SMPN 5 Jakarta','13 Jun · 09:15','305/310','gagal','Kurang 5'],['SDN 07 Cikini','12 Jun · 10:00','180/180','success','Sesuai']].map(([s,t,p,st,lb])=>`<button onclick="go('distribution-report')" class="tap w-full text-left">${card(`<div class="flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-slate-100 text-ink-soft grid place-items-center">${ic('history')}</div><div class="flex-1"><p class="font-semibold">${s}</p><p class="text-[12px] text-ink-soft">${t} · ${p} porsi</p></div>${badge(lb,st)}</div>`)}</button>`).join('')}
  </div>`,'petugas','riwayat');

/* ★ Monitoring Laporan (Admin Pusat) */
S['admin-reports'] = () => screenWrap(`
  ${bar('Monitoring Laporan',{back:false})}
  <div class="px-5 py-3 flex gap-2 overflow-x-auto">${['Semua','Baru','Diproses','Selesai'].map((t,i)=>`<button class="tap shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold ${i===0?'bg-primary text-white':'bg-white border border-line text-ink-soft'}">${t}</button>`).join('')}</div>
  <div class="flex-1 px-5 pb-4 space-y-3">
    ${[['#0142','Jatah kurang 30 porsi','SDN 01 Menteng','proses','Diproses'],['#0141','Makanan terlambat','SMPN 5 Jakarta','success','Selesai'],['#0140','Tidak datang','SDN 07 Cikini','gagal','Ditolak'],['#0139','Kualitas kurang baik','SMK A Tebet','proses','Diproses']].map(([id,t,s,st,lb])=>`<button onclick="go('report-tracking')" class="tap w-full text-left">${card(`<div class="flex items-start gap-3"><div class="w-10 h-10 rounded-xl bg-primary-light text-primary grid place-items-center">${ic('clipboard-list','w-5 h-5')}</div><div class="flex-1"><div class="flex justify-between"><p class="font-semibold text-[13px]">${t}</p>${badge(lb,st)}</div><p class="text-[12px] text-ink-soft mt-0.5">${id} · ${s}</p></div></div>`)}</button>`).join('')}
  </div>`,'admin','admin-reports');

/* ===================== META & URUTAN LAYAR ===================== */
const META = {
  'splash':[1,'Splash Screen','Auth'],'onboarding-1':[2,'Onboarding 1','Auth'],'onboarding-2':[3,'Onboarding 2','Auth'],'login':[4,'Login','Auth'],'register':[5,'Register','Auth'],
  'home-dashboard':[6,'Home Dashboard','Admin Dashboard'],'distribution-schedule':[7,'Distribution Schedule','Distribution'],'school-list':[8,'School List','Distribution'],'school-detail':[9,'School Detail','Distribution'],'qr-scanner':[10,'Scan QR Penyaluran','Distribution'],'verification-success':[11,'Penyaluran Tercatat','Distribution'],'distribution-report':[12,'Distribution Report','Distribution'],
  'school-home':[13,'Dashboard Sekolah','Sekolah'],'school-allocation':[14,'Jatah & Jadwal','Sekolah'],'confirm-receipt':[15,'Konfirmasi Penerimaan','Sekolah'],'report-form':[16,'Lapor Ketidaksesuaian','Laporan'],'upload-evidence':[17,'Upload Bukti','Laporan'],'report-tracking':[18,'Status Laporan','Laporan'],'notifications':[19,'Notifications','Notifications'],'statistics':[20,'Statistics Dashboard','Admin Dashboard'],'profile':[21,'Profile','Profile'],'settings':[22,'Settings','Profile'],'help-center':[23,'Help Center','Profile'],'empty-state':[24,'Empty State','System'],'error-state':[25,'Error State','System'],
  'petugas-home':['★','Petugas — Beranda','Distribution'],'riwayat':['★','Petugas — Riwayat','Distribution'],'admin-reports':['★','Admin — Monitoring Laporan','Laporan'],'school-qr':['★','Sekolah — Tampilkan QR','Sekolah'],'receipt-done':['★','Sekolah — Penerimaan OK','Sekolah'],
};
const ORDER = ['splash','onboarding-1','onboarding-2','login','register','home-dashboard','distribution-schedule','school-list','school-detail','qr-scanner','verification-success','distribution-report','school-home','school-allocation','school-qr','confirm-receipt','receipt-done','report-form','upload-evidence','report-tracking','notifications','statistics','profile','settings','help-center','empty-state','error-state','petugas-home','riwayat','admin-reports'];
const GROUPS = [['Autentikasi',['splash','onboarding-1','onboarding-2','login','register']],['Admin & Dashboard',['home-dashboard','statistics','admin-reports']],['Distribusi & Petugas',['distribution-schedule','school-list','school-detail','qr-scanner','verification-success','distribution-report','petugas-home','riwayat']],['Sekolah',['school-home','school-allocation','school-qr','confirm-receipt','receipt-done']],['Laporan',['report-form','upload-evidence','report-tracking']],['Notifikasi & Sistem',['notifications','empty-state','error-state']],['Profil',['profile','settings','help-center']]];

/* ===================== NAVIGASI PROTOTYPE ===================== */
let current = 'splash';
function go(id){ if(!S[id])return; current=id; const [no,title,mod]=META[id]; document.getElementById('screen').innerHTML=`<div class="screen-enter min-h-full">${S[id]()}</div>`; document.getElementById('stageTitle').textContent=title; document.getElementById('stageMeta').textContent=(typeof no==='number'?`Layar ${no} · `:'Pendukung · ')+mod; buildIndex(); if(window.lucide)lucide.createIcons(); document.getElementById('screen').scrollTop=0; }
function nextScreen(){ const i=ORDER.indexOf(current); go(ORDER[Math.min(i+1,ORDER.length-1)]); }
function prevScreen(){ const i=ORDER.indexOf(current); go(ORDER[Math.max(i-1,0)]); }
function buildIndex(){ const el=document.getElementById('screenIndex'); if(!el)return; el.innerHTML=GROUPS.map(([g,ids])=>`<div class="mb-3"><p class="px-2 text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">${g}</p>${ids.map(id=>{const[no,title]=META[id];const on=id===current;return `<button onclick="go('${id}')" class="tap w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left ${on?'bg-primary-light text-primary font-semibold':'hover:bg-slate-50 text-ink-soft'}"><span class="w-5 h-5 grid place-items-center text-[10px] rounded ${on?'bg-primary text-white':'bg-slate-100 text-slate-500'}">${no}</span><span class="text-[13px] truncate">${title}</span></button>`;}).join('')}</div>`).join(''); }

/* ===================== DEVICE / RESPONSIVE ===================== */
let device='phone';
function setDevice(d){
  device=d;
  const wrap=document.getElementById('deviceWrap');
  const bezel=document.getElementById('deviceBezel');
  const box=document.getElementById('deviceScreenBox');
  const notch=document.getElementById('deviceNotch');
  const bbar=document.getElementById('browserBar');
  const sbar=document.getElementById('statusBar');
  const scr=document.getElementById('screen');
  if(!wrap) return;
  document.querySelectorAll('.dev-btn').forEach(b=>b.classList.remove('dev-on'));
  const onBtn=document.getElementById('dev-'+d); if(onBtn) onBtn.classList.add('dev-on');
  const baseBox='overflow-hidden relative transition-all duration-300';
  if(d==='tablet'){
    wrap.style.width='min(720px, 100%)';
    bezel.className='relative bg-slate-900 rounded-[30px] p-3 shadow-2xl transition-all duration-300';
    box.style.height='min(78vh, 960px)'; box.className='bg-bg rounded-[20px] '+baseBox;
    notch.classList.add('hidden'); bbar.classList.add('hidden'); bbar.classList.remove('flex');
    sbar.classList.remove('hidden'); scr.classList.remove('pt-0'); scr.classList.add('pt-9');
    document.documentElement.style.setProperty('--appcol','520px');
  } else if(d==='laptop'){
    wrap.style.width='min(1100px, 100%)';
    bezel.className='relative bg-slate-800 rounded-xl p-0 shadow-2xl overflow-hidden transition-all duration-300';
    box.style.height='min(72vh, 760px)'; box.className='bg-bg '+baseBox;
    notch.classList.add('hidden'); bbar.classList.remove('hidden'); bbar.classList.add('flex');
    sbar.classList.add('hidden'); scr.classList.remove('pt-9'); scr.classList.add('pt-0');
    document.documentElement.style.setProperty('--appcol','560px');
  } else {
    wrap.style.width='372px';
    bezel.className='relative bg-slate-900 rounded-[44px] p-3 shadow-2xl transition-all duration-300';
    box.style.height='760px'; box.className='bg-bg rounded-[34px] '+baseBox;
    notch.classList.remove('hidden'); bbar.classList.add('hidden'); bbar.classList.remove('flex');
    sbar.classList.remove('hidden'); scr.classList.remove('pt-0'); scr.classList.add('pt-9');
    document.documentElement.style.setProperty('--appcol','100%');
  }
  if(window.lucide) lucide.createIcons();
}

/* ===================== INIT ===================== */
document.addEventListener('DOMContentLoaded',()=>{ setDevice('phone'); go('splash'); });
