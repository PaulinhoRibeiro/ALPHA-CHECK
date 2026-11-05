/* ============================================================
   ALPHA GARAGE — CHECKLIST DIGITAL
   app.js — Toda a lógica JavaScript
   ============================================================ */

// ===== ESTADO GLOBAL =====
const appState = {
    os: '',
    ferramenta: 1,
    aba: 'lat_esq',
    zoom: false,
    marcadores: [],
    fotos: {}
};

// ===== SILHUETAS DE CARRO POR TIPO =====
const CARRO_SVGS = {
    sedan: `
        <path d="M 50 160 L 550 160 C 570 160 580 150 580 130 L 580 110 C 580 90 560 80 540 80 L 440 80 L 380 30 L 180 30 L 120 80 L 40 90 C 20 90 10 100 10 120 L 10 140 C 10 155 20 160 50 160 Z" fill="#c62828" stroke="#000" stroke-width="3"/>
        <path d="M 130 80 L 170 40 L 250 40 L 250 80 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <path d="M 260 80 L 260 40 L 360 40 L 400 80 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <circle cx="150" cy="160" r="35" fill="#111" stroke="#666" stroke-width="5"/>
        <circle cx="450" cy="160" r="35" fill="#111" stroke="#666" stroke-width="5"/>
        <rect x="10" y="120" width="30" height="20" fill="#555" rx="5"/>
        <rect x="540" y="100" width="30" height="20" fill="#f1c40f" rx="5"/>
    `,
    hatch: `
        <path d="M 40 160 L 560 160 C 580 160 590 145 590 125 L 590 95 C 590 75 575 65 550 60 L 470 55 L 430 25 L 155 25 L 100 55 L 35 70 C 15 75 5 90 5 115 L 5 140 C 5 155 20 160 40 160 Z" fill="#c62828" stroke="#000" stroke-width="3"/>
        <path d="M 120 60 L 165 30 L 245 30 L 245 60 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <path d="M 255 60 L 255 30 L 395 30 L 430 55 L 425 60 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <circle cx="140" cy="160" r="32" fill="#111" stroke="#666" stroke-width="5"/>
        <circle cx="460" cy="160" r="32" fill="#111" stroke="#666" stroke-width="5"/>
        <rect x="10" y="120" width="25" height="18" fill="#555" rx="5"/>
        <rect x="550" y="90" width="35" height="18" fill="#f1c40f" rx="5"/>
    `,
    suv: `
        <path d="M 40 155 L 560 155 C 580 155 590 140 590 120 L 590 60 C 590 40 575 30 550 25 L 460 20 L 415 5 L 185 5 L 130 25 L 60 25 C 25 25 5 40 5 65 L 5 130 C 5 150 20 155 40 155 Z" fill="#c62828" stroke="#000" stroke-width="3"/>
        <path d="M 130 30 L 175 10 L 260 10 L 260 30 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <path d="M 270 30 L 270 10 L 400 10 L 445 25 L 445 30 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <circle cx="145" cy="160" r="38" fill="#111" stroke="#666" stroke-width="5"/>
        <circle cx="455" cy="160" r="38" fill="#111" stroke="#666" stroke-width="5"/>
        <rect x="10" y="115" width="25" height="22" fill="#555" rx="5"/>
        <rect x="550" y="90" width="35" height="22" fill="#f1c40f" rx="5"/>
    `,
    pickup: `
        <path d="M 30 160 L 570 160 C 585 160 590 150 590 135 L 590 100 L 380 100 L 380 45 L 355 20 L 180 20 L 130 45 L 45 50 C 15 55 5 75 5 95 L 5 140 C 5 155 15 160 30 160 Z" fill="#c62828" stroke="#000" stroke-width="3"/>
        <path d="M 145 45 L 185 25 L 260 25 L 260 45 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <path d="M 270 45 L 270 25 L 340 25 L 365 45 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <circle cx="140" cy="160" r="38" fill="#111" stroke="#666" stroke-width="5"/>
        <circle cx="460" cy="160" r="38" fill="#111" stroke="#666" stroke-width="5"/>
        <rect x="10" y="120" width="25" height="20" fill="#555" rx="5"/>
        <rect x="555" y="120" width="30" height="20" fill="#f1c40f" rx="5"/>
        <rect x="380" y="90" width="210" height="10" fill="#555"/>
    `,
    van: `
        <path d="M 30 160 L 570 160 C 585 160 590 145 590 125 L 590 30 C 590 15 575 10 555 10 L 130 10 L 30 45 C 15 50 5 70 5 95 L 5 140 C 5 155 15 160 30 160 Z" fill="#c62828" stroke="#000" stroke-width="3"/>
        <path d="M 130 15 L 130 45 L 45 50 L 45 15 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <path d="M 145 15 L 545 15 L 545 65 L 145 65 Z" fill="#111" stroke="#555" stroke-width="2"/>
        <circle cx="140" cy="160" r="38" fill="#111" stroke="#666" stroke-width="5"/>
        <circle cx="460" cy="160" r="38" fill="#111" stroke="#666" stroke-width="5"/>
        <rect x="555" y="80" width="30" height="20" fill="#f1c40f" rx="5"/>
    `
};

// ===== OS AUTOMÁTICA =====
function gerarNovaOS() {
    const data = new Date();
    const ymd = data.getFullYear() + String(data.getMonth() + 1).padStart(2, '0') + String(data.getDate()).padStart(2, '0');
    let counter = parseInt(localStorage.getItem('alpha_os_counter') || '0') + 1;
    localStorage.setItem('alpha_os_counter', counter);
    const os = `ALPHA-${ymd}-${String(counter).padStart(3, '0')}`;
    localStorage.setItem('alpha_os_current', os);
    return os;
}

function carregarOSAtual() {
    const saved = localStorage.getItem('alpha_os_current');
    const savedData = localStorage.getItem('alpha_checklist');
    if (saved && savedData) return saved;
    return gerarNovaOS();
}

function atualizarDisplayOS() {
    const el = document.getElementById('os-num-display');
    if (el) el.innerText = appState.os;
}

// ===== TIPO DE VEÍCULO =====
function mudarTipoVeiculo(tipo) {
    const svgEsq = document.querySelector('#view-lat_esq .view-imagem');
    const svgDir = document.querySelector('#view-lat_dir .view-imagem');
    
    if (svgEsq && CARRO_SVGS[tipo]) {
        svgEsq.innerHTML = CARRO_SVGS[tipo];
    }
    if (svgDir && CARRO_SVGS[tipo]) {
        svgDir.innerHTML = `<g transform="translate(600, 0) scale(-1, 1)">${CARRO_SVGS[tipo]}</g>`;
    }
    
    salvarDados();
}

// ===== TESTES OBRIGATÓRIOS =====
function testesCompletos() {
    const bateriaSim = document.querySelector('input[name="teste_bateria"][value="Sim"]')?.checked || false;
    const scannerSim = document.querySelector('input[name="scanner"][value="Sim"]')?.checked || false;
    const fotoBateria = !!appState.fotos['bateria'];
    const fotoScanner = !!appState.fotos['scanner'];
    return { bateriaSim, scannerSim, fotoBateria, fotoScanner, ok: bateriaSim && scannerSim && fotoBateria && fotoScanner };
}

function atualizarStatusTestes() {
    const s = testesCompletos();
    const boxBateria = document.getElementById('box-bateria');
    const tituloBateria = document.getElementById('titulo-bateria');
    const lblBSim = document.getElementById('lbl-bateria-sim');
    const lblBNao = document.getElementById('lbl-bateria-nao');
    const bateriaOK = s.bateriaSim && s.fotoBateria;
    
    if (boxBateria) {
        boxBateria.classList.toggle('completo', bateriaOK);
        boxBateria.classList.toggle('pendente', !bateriaOK);
    }
    if (tituloBateria) tituloBateria.classList.toggle('completo', bateriaOK);
    if (lblBSim) lblBSim.classList.toggle('selecionado-sim', s.bateriaSim);
    const radioBateriaNao = document.querySelector('input[name="teste_bateria"][value="Não"]');
    if (lblBNao) lblBNao.classList.toggle('selecionado-nao', !s.bateriaSim && radioBateriaNao?.checked);
    
    const boxScanner = document.getElementById('box-scanner');
    const tituloScanner = document.getElementById('titulo-scanner');
    const lblSSim = document.getElementById('lbl-scanner-sim');
    const lblSNao = document.getElementById('lbl-scanner-nao');
    const scannerOK = s.scannerSim && s.fotoScanner;
    
    if (boxScanner) {
        boxScanner.classList.toggle('completo', scannerOK);
        boxScanner.classList.toggle('pendente', !scannerOK);
    }
    if (tituloScanner) tituloScanner.classList.toggle('completo', scannerOK);
    if (lblSSim) lblSSim.classList.toggle('selecionado-sim', s.scannerSim);
    const radioScannerNao = document.querySelector('input[name="scanner"][value="Não"]');
    if (lblSNao) lblSNao.classList.toggle('selecionado-nao', !s.scannerSim && radioScannerNao?.checked);
    
    const statusBar = document.getElementById('status-obrigatorio');
    const statusBateria = document.getElementById('status-item-bateria');
    const statusScanner = document.getElementById('status-item-scanner');
    
    if (statusBateria) {
        statusBateria.innerHTML = bateriaOK ? '✅ Teste de Bateria' : '⏳ Teste de Bateria';
        statusBateria.className = 'status-item ' + (bateriaOK ? 'ok' : 'falta');
    }
    if (statusScanner) {
        statusScanner.innerHTML = scannerOK ? '✅ Scanner' : '⏳ Scanner';
        statusScanner.className = 'status-item ' + (scannerOK ? 'ok' : 'falta');
    }
    
    if (statusBar) {
        const span = statusBar.querySelector('span');
        if (s.ok) {
            statusBar.classList.remove('pendente');
            statusBar.classList.add('completo');
            if (span) span.innerHTML = '✅ <strong>Todos os testes obrigatórios realizados!</strong>';
        } else {
            statusBar.classList.remove('completo');
            statusBar.classList.add('pendente');
            if (span) span.innerHTML = '⚠️ <strong>Status dos testes obrigatórios:</strong>';
        }
    }
    
    document.getElementById('btn-imprimir')?.classList.toggle('bloqueado', !s.ok);
    document.getElementById('btn-pdf')?.classList.toggle('bloqueado', !s.ok);
    document.getElementById('btn-wpp')?.classList.toggle('bloqueado', !s.ok);
    
    salvarDados();
}

function verificarBloqueio() {
    const s = testesCompletos();
    if (s.ok) return true;
    let faltas = [];
    if (!s.bateriaSim) faltas.push('• Marcar "Sim" no Teste de Bateria');
    if (!s.fotoBateria) faltas.push('• Tirar foto do Teste de Bateria');
    if (!s.scannerSim) faltas.push('• Marcar "Sim" no Scanner');
    if (!s.fotoScanner) faltas.push('• Tirar foto do Scanner');
    alert('⚠️ ATENÇÃO!\n\nComplete os itens obrigatórios antes de continuar:\n\n' + faltas.join('\n'));
    return false;
}

// ===== ABAS E ZOOM =====
function mudarAba(viewId, btn) {
    appState.aba = viewId;
    document.querySelectorAll('.view-wrapper').forEach(el => el.style.display = 'none');
    const target = document.getElementById('view-' + viewId);
    if (target) target.style.display = 'block';
    document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));
    if (btn) btn.classList.add('ativa');
    document.querySelectorAll('.view-container').forEach(c => c.classList.remove('zoom-2x'));
    document.getElementById('btn-zoom')?.classList.remove('ativo');
    appState.zoom = false;
}

function toggleZoom() {
    const container = document.querySelector('#view-' + appState.aba + ' .view-container');
    if (!container) return;
    container.classList.toggle('zoom-2x');
    document.getElementById('btn-zoom')?.classList.toggle('ativo');
    appState.zoom = container.classList.contains('zoom-2x');
}

// ===== MAPA DE AVARIAS =====
function selecionarFerramenta(codigo) {
    appState.ferramenta = codigo;
    document.querySelectorAll('.btn-tool').forEach(btn => btn.classList.remove('ativo'));
    document.getElementById('tool-' + codigo)?.classList.add('ativo');
}

function adicionarPino(event, view) {
    if (event.target.classList.contains('pin')) return;
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const id = 'pin_' + Date.now() + Math.random().toString(36).substr(2, 5);
    const pinData = { id, view, x, y, codigo: appState.ferramenta };
    appState.marcadores.push(pinData);
    criarPinoVisual(pinData, container);
    atualizarTextoAvarias();
    salvarDados();
}

function criarPinoVisual(data, container) {
    const pin = document.createElement('div');
    pin.id = data.id;
    pin.className = `pin pin-${data.codigo}`;
    pin.style.left = data.x + '%';
    pin.style.top = data.y + '%';
    pin.innerText = data.codigo;
    pin.onclick = function(e) {
        e.stopPropagation();
        this.remove();
        appState.marcadores = appState.marcadores.filter(m => m.id !== data.id);
        atualizarTextoAvarias();
        salvarDados();
    };
    container.appendChild(pin);
}

function limparMapa() {
    if (confirm("Apagar todas as marcações do mapa?")) {
        document.querySelectorAll('.pin').forEach(p => p.remove());
        appState.marcadores = [];
        atualizarTextoAvarias();
        salvarDados();
    }
}

function atualizarTextoAvarias() {
    let riscos = [], amassados = [], quebrados = [];
    const nomesViews = { lat_esq: "Lat. Esq.", lat_dir: "Lat. Dir.", frente: "Frente", tras: "Trás", teto: "Teto" };
    appState.marcadores.forEach(m => {
        let texto = nomesViews[m.view];
        if (m.codigo === 1) riscos.push(texto);
        if (m.codigo === 2) amassados.push(texto);
        if (m.codigo === 3) quebrados.push(texto);
    });
    let resultado = [];
    if (riscos.length > 0) resultado.push(`Riscos (${[...new Set(riscos)].join(', ')})`);
    if (amassados.length > 0) resultado.push(`Amassados (${[...new Set(amassados)].join(', ')})`);
    if (quebrados.length > 0) resultado.push(`Quebrados (${[...new Set(quebrados)].join(', ')})`);
    const el = document.getElementById('avarias');
    if (el) el.value = resultado.join(' | ');
}

// ===== VALIDAÇÃO DE PLACA =====
function validarPlaca() {
    const input = document.getElementById('placa');
    if (!input) return;
    const v = input.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    input.value = v;
    const raw = v.replace(/-/g, '');
    const isValida = /^[A-Z]{3}\d{4}$/.test(raw) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(raw);
    if (raw.length === 7 && !isValida) input.classList.add('invalid');
    else input.classList.remove('invalid');
    salvarDados();
}

function formatarPlaca() {
    const input = document.getElementById('placa');
    if (!input) return;
    const raw = input.value.replace(/[^A-Z0-9]/g, '');
    if (/^[A-Z]{3}\d{4}$/.test(raw)) input.value = raw.slice(0, 3) + '-' + raw.slice(3);
    else input.value = raw;
    salvarDados();
}

// ===== FOTOS =====
function adicionarFoto(event, slot) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        comprimirImagem(e.target.result, 900, 0.7, function(base64) {
            appState.fotos[slot] = base64;
            const img = document.getElementById('img_' + slot);
            if (img) { img.src = base64; img.style.display = 'block'; }
            const container = document.querySelector(`[data-slot="${slot}"]`);
            if (container) {
                container.classList.add('tem-foto');
                container.querySelector('.slot-remove')?.style.setProperty('display', 'block');
                const label = container.querySelector('label');
                if (label) label.style.opacity = '0';
            }
            salvarFotos();
            atualizarStatusTestes();
        });
    };
    reader.readAsDataURL(file);
}

function removerFotoSlot(slot) {
    delete appState.fotos[slot];
    const img = document.getElementById('img_' + slot);
    if (img) { img.src = ''; img.style.display = 'none'; }
    const fileInput = document.getElementById('file_' + slot);
    if (fileInput) fileInput.value = '';
    const container = document.querySelector(`[data-slot="${slot}"]`);
    if (container) {
        container.classList.remove('tem-foto');
        container.querySelector('.slot-remove')?.style.setProperty('display', 'none');
        const label = container.querySelector('label');
        if (label) label.style.opacity = '1';
    }
    salvarFotos();
    atualizarStatusTestes();
}

function comprimirImagem(base64Str, maxWidth, quality, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', quality));
    };
}

function salvarFotos() {
    try { localStorage.setItem('alpha_fotos', JSON.stringify(appState.fotos)); } catch(e) {}
}

// ===== LUZES =====
function toggleLuzes() {
    const radios = document.getElementsByName('luz_painel');
    let isSim = false;
    for (let r of radios) { if (r.checked && r.value === 'Sim') isSim = true; }
    const el = document.getElementById('qual_luz');
    if (el) el.style.display = isSim ? 'block' : 'none';
}

// ===== DATA/HORA =====
function preencherDataHoraEntrada() {
    const now = new Date();
    const d = document.getElementById('data');
    const h = document.getElementById('hora_entrada');
    if (d) d.value = now.toISOString().split('T')[0];
    if (h) h.value = now.toTimeString().slice(0, 5);
}

function registrarSaida() {
    const now = new Date();
    const ds = document.getElementById('data_saida');
    const hs = document.getElementById('hora_saida');
    const tc = document.getElementById('tipoChecklist');
    if (ds) ds.value = now.toISOString().split('T')[0];
    if (hs) hs.value = now.toTimeString().slice(0, 5);
    if (tc) tc.value = 'saida';
    mudarModo();
    salvarDados();
}

function mudarModo() {
    const modo = document.getElementById('tipoChecklist')?.value;
    const texto = document.getElementById('textoDeclaracao');
    if (!texto) return;
    if (modo === 'entrada') {
        texto.innerHTML = "Declaro que deixei o veículo especificado nesta folha de inspeção nas condições informadas. Autorizo a movimentação deste veículo, dentro ou fora da empresa, para a realização de testes de funcionamento e elaboração de orçamento.";
    } else {
        texto.innerHTML = "Declaro retirar o veículo especificado nesta folha de inspeção nas condições informadas. Atesto que todos os serviços realizados e peças usadas pela oficina foram devidamente verificados e não apresentam qualquer tipo de falha.";
        if (!document.getElementById('data_saida')?.value) registrarSaida();
    }
    salvarDados();
}

// ===== SALVAR / CARREGAR =====
function salvarDados() {
    try {
        const dados = {
            os: appState.os,
            placa: document.getElementById('placa')?.value || '',
            marca: document.getElementById('marca')?.value || '',
            modelo: document.getElementById('modelo')?.value || '',
            cor: document.getElementById('cor')?.value || '',
            tipoVeiculo: document.getElementById('tipoVeiculo')?.value || 'sedan',
            ano: document.getElementById('ano')?.value || '',
            km: document.getElementById('km')?.value || '',
            chassi: document.getElementById('chassi')?.value || '',
            data: document.getElementById('data')?.value || '',
            hora_entrada: document.getElementById('hora_entrada')?.value || '',
            data_saida: document.getElementById('data_saida')?.value || '',
            hora_saida: document.getElementById('hora_saida')?.value || '',
            queixas: document.getElementById('queixas')?.value || '',
            avarias: document.getElementById('avarias')?.value || '',
            qual_luz: document.getElementById('qual_luz')?.value || '',
            obs: document.getElementById('observacoes')?.value || '',
            combustivel: document.getElementById('combustivel')?.value || '50',
            tipo: document.getElementById('tipoChecklist')?.value || 'entrada',
            via: document.getElementById('viaSelect')?.value || 'cliente',
            marcadores: appState.marcadores,
            checkboxes: {},
            radios: {}
        };
        document.querySelectorAll('.acc').forEach(cb => dados.checkboxes[cb.id] = cb.checked);
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (radio.name) {
                const checked = document.querySelector(`input[name="${radio.name}"]:checked`);
                if (checked) dados.radios[radio.name] = checked.value;
            }
        });
        localStorage.setItem('alpha_checklist', JSON.stringify(dados));
    } catch(e) { console.log('Erro ao salvar:', e); }
}

function carregarDados() {
    try {
        const salvo = localStorage.getItem('alpha_checklist');
        if (salvo) {
            const dados = JSON.parse(salvo);
            if (dados.os) { appState.os = dados.os; atualizarDisplayOS(); }
            for (let key in dados) {
                if (key === 'marcadores') {
                    appState.marcadores = dados[key] || [];
                    appState.marcadores.forEach(m => {
                        const container = document.querySelector(`#view-${m.view} .view-container`);
                        if (container) criarPinoVisual(m, container);
                    });
                } else if (key === 'checkboxes') {
                    for (let id in dados.checkboxes) { let el = document.getElementById(id); if (el) el.checked = dados.checkboxes[id]; }
                } else if (key === 'radios') {
                    for (let name in dados.radios) { let el = document.querySelector(`input[name="${name}"][value="${dados.radios[name]}"]`); if(el) el.checked = true; }
                } else if (dados[key] !== undefined && dados[key] !== null && !['os','marcadores','checkboxes','radios'].includes(key)) {
                    let el = document.getElementById(key); if (el) el.value = dados[key];
                }
            }
            const cEl = document.getElementById('combustivel_val');
            if (cEl) cEl.innerText = dados.combustivel + '%';
            toggleLuzes();
            if (dados.tipoVeiculo) mudarTipoVeiculo(dados.tipoVeiculo);
        }
        const fotosSalvas = localStorage.getItem('alpha_fotos');
        if (fotosSalvas) {
            appState.fotos = JSON.parse(fotosSalvas);
            for (let slot in appState.fotos) {
                const img = document.getElementById('img_' + slot);
                if (img) {
                    img.src = appState.fotos[slot]; img.style.display = 'block';
                    const container = document.querySelector(`[data-slot="${slot}"]`);
                    if (container) {
                        container.classList.add('tem-foto');
                        container.querySelector('.slot-remove')?.style.setProperty('display', 'block');
                        const label = container.querySelector('label'); if (label) label.style.opacity = '0';
                    }
                }
            }
        }
        ['sigCliente', 'sigResponsavel'].forEach(id => {
            const dataUrl = localStorage.getItem('alpha_sig_' + id);
            if (dataUrl) {
                const canvas = document.getElementById(id); if (!canvas) return;
                const ctx = canvas.getContext('2d');
                const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0); img.src = dataUrl;
            }
        });
    } catch(e) { console.log('Erro ao carregar:', e); }
}

// ===== NOVO ATENDIMENTO =====
function novoAtendimento() {
    if (!confirm("Criar novo atendimento?\nO checklist atual será salvo no histórico.")) return;
    salvarNoHistorico();
    localStorage.removeItem('alpha_checklist');
    localStorage.removeItem('alpha_fotos');
    localStorage.removeItem('alpha_sig_sigCliente');
    localStorage.removeItem('alpha_sig_sigResponsavel');
    localStorage.removeItem('alpha_os_current');
    appState.marcadores = []; appState.fotos = {};
    document.getElementById('formChecklist')?.reset();
    document.querySelectorAll('.pin').forEach(p => p.remove());
    document.querySelectorAll('.slot-img').forEach(img => { img.src = ''; img.style.display = 'none'; });
    document.querySelectorAll('.foto-slot, .foto-teste').forEach(s => {
        s.classList.remove('tem-foto');
        s.querySelector('.slot-remove')?.style.setProperty('display', 'none');
        const lbl = s.querySelector('label'); if (lbl) lbl.style.opacity = '1';
    });
    document.querySelectorAll('.radio-group label').forEach(l => l.classList.remove('selecionado-sim', 'selecionado-nao'));
    limparAssinatura('sigCliente'); limparAssinatura('sigResponsavel');
    appState.os = gerarNovaOS(); atualizarDisplayOS();
    preencherDataHoraEntrada();
    const combEl = document.getElementById('combustivel'); if (combEl) combEl.value = 50;
    const combValEl = document.getElementById('combustivel_val'); if (combValEl) combValEl.innerText = '50%';
    mudarModo(); selecionarFerramenta(1);
    mudarAba('lat_esq', document.querySelector('.aba-btn'));
    if (document.getElementById('tipoVeiculo')) {
        document.getElementById('tipoVeiculo').value = 'sedan';
        mudarTipoVeiculo('sedan');
    }
    atualizarStatusTestes();
    alert('✅ Novo atendimento criado!\nO.S.: ' + appState.os);
}

// ===== HISTÓRICO =====
function salvarNoHistorico() {
    if (!document.getElementById('placa')?.value.trim()) return;
    try {
        let historico = JSON.parse(localStorage.getItem('alpha_historico') || '[]');
        const dados = JSON.parse(localStorage.getItem('alpha_checklist') || '{}');
        const resumo = {
            os: appState.os, placa: dados.placa || '', marca: dados.marca || '', modelo: dados.modelo || '',
            data: dados.data || '', hora_entrada: dados.hora_entrada || '', tipo: dados.tipo || 'entrada',
            queixas: dados.queixas || '', avarias: dados.avarias || '', salvoEm: new Date().toISOString()
        };
        historico.unshift(resumo);
        if (historico.length > 10) historico = historico.slice(0, 10);
        localStorage.setItem('alpha_historico', JSON.stringify(historico));
    } catch(e) {}
}

function abrirHistorico() {
    const historico = JSON.parse(localStorage.getItem('alpha_historico') || '[]');
    const lista = document.getElementById('listaHistorico');
    if (!lista) return;
    if (historico.length === 0) {
        lista.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">Nenhum atendimento anterior</p>';
    } else {
        lista.innerHTML = historico.map(h => `
            <div class="historico-item">
                <strong>${h.os}</strong><br>
                <span>🚗 ${h.placa} - ${h.marca} ${h.modelo}</span><br>
                <small>${h.data} ${h.hora_entrada} - ${h.tipo === 'entrada' ? '📥 Check-in' : '📤 Check-out'}</small>
                ${h.queixas ? `<br><small>💬 ${h.queixas.substring(0, 60)}${h.queixas.length > 60 ? '...' : ''}</small>` : ''}
            </div>
        `).join('');
    }
    document.getElementById('modalHistorico').style.display = 'flex';
}

function fecharHistorico() {
    document.getElementById('modalHistorico').style.display = 'none';
}

// ===== ASSINATURAS =====
function configurarCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let desenhando = false;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffffff';
    const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: cx - r.left, y: cy - r.top };
    };
    canvas.addEventListener('mousedown', (e) => { desenhando = true; ctx.beginPath(); ctx.moveTo(getPos(e).x, getPos(e).y); });
    canvas.addEventListener('mousemove', (e) => { if (desenhando) { ctx.lineTo(getPos(e).x, getPos(e).y); ctx.stroke(); } });
    canvas.addEventListener('mouseup', () => { desenhando = false; salvarAssinatura(id); });
    canvas.addEventListener('mouseout', () => { if(desenhando){desenhando=false; salvarAssinatura(id);} });
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); desenhando = true; ctx.beginPath(); ctx.moveTo(getPos(e).x, getPos(e).y); });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (desenhando) { ctx.lineTo(getPos(e).x, getPos(e).y); ctx.stroke(); } });
    canvas.addEventListener('touchend', () => { desenhando = false; salvarAssinatura(id); });
}

function salvarAssinatura(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    try { localStorage.setItem('alpha_sig_' + id, canvas.toDataURL('image/png')); } catch(e) {}
}

function limparAssinatura(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('alpha_sig_' + id);
}

// ===== PREPARAR/RESTAURAR IMPRESSÃO =====
function prepararParaImpressao() {
    document.body.classList.add('compact-print');
    ['sigCliente', 'sigResponsavel'].forEach(id => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        if (document.getElementById(id + '_img_temp')) return;
        const dataUrl = canvas.toDataURL('image/png');
        const img = document.createElement('img');
        img.id = id + '_img_temp';
        img.src = dataUrl;
        img.style.cssText = 'width:100%;height:45px;object-fit:contain;background:#fff;display:block;';
        canvas.parentElement.insertBefore(img, canvas);
        canvas.style.display = 'none';
    });
    const via = document.getElementById('viaSelect')?.value || 'cliente';
    let badge = document.getElementById('via_badge_temp');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'via_badge_temp';
        document.body.appendChild(badge);
    }
    badge.style.cssText = 'position:fixed;top:8px;right:8px;padding:3px 8px;background:#c62828;color:white;font-weight:bold;font-size:10px;border-radius:3px;z-index:9999;';
    badge.innerText = 'VIA: ' + via.toUpperCase();
}

function restaurarAposImpressao() {
    document.body.classList.remove('compact-print');
    ['sigCliente', 'sigResponsavel'].forEach(id => {
        const img = document.getElementById(id + '_img_temp');
        if (img) img.remove();
        const canvas = document.getElementById(id);
        if (canvas) canvas.style.display = 'block';
    });
    const badge = document.getElementById('via_badge_temp');
    if (badge) badge.remove();
}

function imprimir() {
    if (!verificarBloqueio()) return;
    prepararParaImpressao();
    setTimeout(() => {
        window.print();
        setTimeout(restaurarAposImpressao, 1500);
    }, 400);
}

window.onbeforeprint = prepararParaImpressao;
window.onafterprint = restaurarAposImpressao;

// ===== PDF =====
async function criarPDFBlob() {
    prepararParaImpressao();
    const imgs = document.querySelectorAll('img[id$="_img_temp"]');
    await Promise.all(Array.from(imgs).map(img => {
        if (img.complete && img.naturalHeight > 0) return Promise.resolve();
        return new Promise(r => { img.onload = r; img.onerror = r; });
    }));
    await new Promise(r => setTimeout(r, 400));
    try {
        const element = document.getElementById('area-pdf');
        const canvas = await html2canvas(element, {
            scale: 2, useCORS: true, backgroundColor: '#ffffff',
            logging: false, scrollX: 0, scrollY: 0,
            windowWidth: element.scrollWidth, windowHeight: element.scrollHeight
        });
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
        const pageW = 210, pageH = 297, margin = 3;
        const contentW = pageW - margin * 2;
        const contentH = pageH - margin * 2;
        const imgAspect = canvas.width / canvas.height;
        const contentAspect = contentW / contentH;
        let imgW, imgH;
        if (imgAspect > contentAspect) { imgW = contentW; imgH = contentW / imgAspect; }
        else { imgH = contentH; imgW = contentH * imgAspect; }
        const imgX = margin + (contentW - imgW) / 2;
        const imgY = margin + (contentH - imgH) / 2;
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', imgX, imgY, imgW, imgH);
        return pdf.output('blob');
    } finally {
        restaurarAposImpressao();
    }
}

async function gerarPDF() {
    if (!verificarBloqueio()) return;
    const btn = document.getElementById('btn-pdf');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ Gerando...';
    try {
        const pdfBlob = await criarPDFBlob();
        const placa = document.getElementById('placa').value || 'Veiculo';
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Checklist_AlphaGarage_${placa}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
        console.error('Erro PDF:', err);
        alert('Erro ao gerar PDF: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ===== WHATSAPP =====
async function enviarWhatsApp() {
    if (!verificarBloqueio()) return;
    const btn = document.getElementById('btn-wpp');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ Gerando PDF...';
    const placa = document.getElementById('placa').value || 'Veiculo';
    const filename = `Checklist_AlphaGarage_${placa}.pdf`;
    const textoResumo = coletarDados();
    try {
        const pdfBlob = await criarPDFBlob();
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: `Checklist Alpha Garage - ${placa}`,
                    text: `Checklist Alpha Garage - O.S. ${appState.os}`
                });
                btn.disabled = false;
                btn.innerHTML = originalText;
                return;
            } catch (shareErr) {
                if (shareErr.name === 'AbortError') {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    return;
                }
            }
        }
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        btn.disabled = false;
        btn.innerHTML = originalText;
        setTimeout(() => {
            const numeroOficina = "";
            const urlWpp = numeroOficina
                ? `https://wa.me/${numeroOficina}?text=${encodeURIComponent(textoResumo)}`
                : `https://wa.me/?text=${encodeURIComponent(textoResumo)}`;
            window.open(urlWpp, '_blank');
            alert('✅ PDF baixado!\n\n📱 No TABLET: o PDF vai direto pelo compartilhamento.\n\n💻 No PC: PDF foi baixado e WhatsApp Web abriu.\nClique no 📎 clipe e escolha o arquivo baixado.\n\nArquivo: ' + filename);
        }, 500);
    } catch (err) {
        console.error('Erro ao enviar WhatsApp:', err);
        alert('Erro ao gerar PDF: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ===== QR CODE =====
let qrcodeObj = null;
function mostrarQR() {
    document.getElementById('modalQR').style.display = 'flex';
    const textoQR = coletarDados();
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';
    const urlWpp = `https://wa.me/?text=${encodeURIComponent(textoQR)}`;
    qrcodeObj = new QRCode(qrcodeDiv, { text: urlWpp, width: 200, height: 200, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
}

function fecharQR() {
    document.getElementById('modalQR').style.display = 'none';
}

// ===== COLETAR DADOS =====
function coletarDados() {
    const modo = document.getElementById('tipoChecklist').options[document.getElementById('tipoChecklist').selectedIndex].text;
    const acessorios = [];
    document.querySelectorAll('.acc:checked').forEach(cb => acessorios.push(cb.parentElement.textContent.trim()));
    const pneus = `DD: ${document.querySelector('input[name="pneu_dd"]:checked').value} | DE: ${document.querySelector('input[name="pneu_de"]:checked').value} | TD: ${document.querySelector('input[name="pneu_td"]:checked').value} | TE: ${document.querySelector('input[name="pneu_te"]:checked').value} | Estepe: ${document.querySelector('input[name="pneu_estepe"]:checked').value}`;
    const bateria = document.querySelector('input[name="teste_bateria"]:checked');
    const scanner = document.querySelector('input[name="scanner"]:checked');
    return `
*${modo} - Alpha Garage*
📋 *O.S.: ${appState.os}*

*VEÍCULO:*
Placa: ${document.getElementById('placa').value}
Marca/Modelo: ${document.getElementById('marca').value} ${document.getElementById('modelo').value}
Tipo: ${document.getElementById('tipoVeiculo').value}
Cor/Ano: ${document.getElementById('cor').value} / ${document.getElementById('ano').value}
KM: ${document.getElementById('km').value}
Entrada: ${document.getElementById('data').value} ${document.getElementById('hora_entrada').value}
${document.getElementById('data_saida').value ? 'Saída: ' + document.getElementById('data_saida').value + ' ' + document.getElementById('hora_saida').value : ''}

*TESTES OBRIGATÓRIOS:*
🔋 Teste de Bateria: ${bateria ? bateria.value : 'Não respondido'} ${appState.fotos['bateria'] ? '(com foto)' : ''}
💻 Scanner: ${scanner ? scanner.value : 'Não respondido'} ${appState.fotos['scanner'] ? '(com foto)' : ''}

*QUEIXAS DO CLIENTE:*
${document.getElementById('queixas').value || 'Nenhuma'}

*AVARIAS:* ${document.getElementById('avarias').value || 'Nenhuma apontada'}
*Luz no Painel:* ${document.querySelector('input[name="luz_painel"]:checked').value} ${document.getElementById('qual_luz').value ? '- ' + document.getElementById('qual_luz').value : ''}

*ACESSÓRIOS:* ${acessorios.length > 0 ? acessorios.join(', ') : 'Nenhum'}
*PNEUS:* ${pneus}
*COMBUSTÍVEL:* ${document.getElementById('combustivel').value}%

*OBSERVAÇÕES:*
${document.getElementById('observacoes').value || 'Nenhuma'}

_Via: ${document.getElementById('viaSelect').value.toUpperCase()}_
    `.trim();
}

function enviarEmail() {
    const texto = encodeURIComponent(coletarDados());
    const assunto = encodeURIComponent("Checklist Alpha Garage - " + appState.os + " - " + document.getElementById('placa').value);
    const emailOficina = "contato@alphagarage.com.br";
    window.location.href = `mailto:${emailOficina}?subject=${assunto}&body=${texto}`;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => alert(`Erro: ${err.message}`));
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); }
    }
}

// ===== UI FUTURISTA =====
function addRipple(e) {
    const target = e.currentTarget;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple-fx';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    const originalPos = getComputedStyle(target).position;
    if (originalPos === 'static') target.style.position = 'relative';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
}

function haptic(ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms || 15); } catch(e) {}
}

let audioCtx = null;
function playBeep(freq, duration, volume) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq || 1000;
        osc.type = 'sine';
        gain.gain.setValueAtTime(volume || 0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration || 0.05));
        osc.start();
        osc.stop(audioCtx.currentTime + (duration || 0.05));
    } catch(e) {}
}

function initFuturisticUI() {
    document.querySelectorAll('.btn, .btn-tool, .btn-top, .check-item, .radio-group label, .aba-btn, .tire-options label').forEach(el => {
        el.addEventListener('click', addRipple);
    });
    document.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            haptic(20);
            playBeep(1300, 0.04, 0.025);
        } else if (e.target.type === 'checkbox') {
            if (e.target.checked) { haptic(15); playBeep(1100, 0.04, 0.02); }
            else { haptic(10); playBeep(650, 0.03, 0.015); }
        }
    });
    document.querySelectorAll('.btn-tool').forEach(btn => {
        btn.addEventListener('click', () => { haptic(25); playBeep(1700, 0.05, 0.025); });
    });
    let lastStatus = false;
    setInterval(() => {
        const statusEl = document.getElementById('status-obrigatorio');
        if (!statusEl) return;
        const isComplete = statusEl.classList.contains('completo');
        if (isComplete && !lastStatus) {
            haptic([30, 50, 30]);
            playBeep(1800, 0.08, 0.03);
            setTimeout(() => playBeep(2200, 0.08, 0.03), 100);
        }
        lastStatus = isComplete;
    }, 500);
}

// ===== INICIALIZAÇÃO =====
window.addEventListener('load', function() {
    initFuturisticUI();
    configurarCanvas('sigCliente');
    configurarCanvas('sigResponsavel');
    appState.os = carregarOSAtual();
    atualizarDisplayOS();
    if (!localStorage.getItem('alpha_checklist')) {
        preencherDataHoraEntrada();
        mudarTipoVeiculo('sedan');
    }
    carregarDados();
    mudarModo();
    selecionarFerramenta(1);
    atualizarStatusTestes();
});