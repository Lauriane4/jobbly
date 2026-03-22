// Gestion de la modal
function openModal() {
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('form-application').reset();
}

// Fermer la modal en cliquant dehors
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Données en mémoire (temporaire, avant le backend)
let applications = [];

// Soumission du formulaire
document.getElementById('form-application').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        company: document.getElementById('company').value,
        jobTitle: document.getElementById('job-title').value,
        domain: document.getElementById('job-domain').value,
        specialty: document.getElementById('job-specialty')?.value || document.getElementById('other-domain')?.value || '',
        status: document.getElementById('status').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        salary: document.getElementById('salary').value,
        dateApplied: document.getElementById('date-applied').value,
        link: document.getElementById('link').value,
        notes: document.getElementById('notes').value,
    };

    if (editingId !== null) {
        // Mode modification
        applications = applications.map(app =>
            app.id === editingId ? { ...app, ...data } : app
        );
        editingId = null;
        document.querySelector('.modal-header h3').textContent = 'Nouvelle candidature';
    } else {
        // Mode ajout
        data.id = Date.now();
        applications.push(data);
    }

    renderApplications();
    updateStats();
    closeModal();
});

// Affichage des candidatures
function renderApplications() {
    const container = document.getElementById('applications-list');

    if (applications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Aucune candidature pour l'instant</p>
                <p class="empty-sub">Clique sur "+ Ajouter" pour commencer !</p>
            </div>`;
        return;
    }

    container.innerHTML = applications.map(app => `
        <div class="application-card">
            <div class="application-info">
                <h3>${app.company} — ${app.jobTitle}</h3>
                <p class="application-meta">
                    ${app.city}${app.country ? ', ' + app.country : ''} 
                    · ${app.specialty || app.domain || ''}
                    ${app.dateApplied ? '· ' + new Date(app.dateApplied).toLocaleDateString('fr-FR') : ''}
                </p>
            </div>
            <div class="application-actions">
                <span class="status-badge ${getStatusClass(app.status)}">${app.status}</span>
                <button class="btn-edit" onclick="editApplication(${app.id})">✏️</button>
                <button class="btn-delete" onclick="deleteApplication(${app.id})">✕</button>
            </div>
        </div>
    `).join('');
}

// Classe CSS selon le statut
function getStatusClass(status) {
    const classes = {
        'Postulé': 'status-postule',
        'Entretien': 'status-entretien',
        'Offre': 'status-offre',
        'Refusé': 'status-refuse',
        'Sans réponse': 'status-sans-reponse'
    };
    return classes[status] || 'status-postule';
}

// Suppression
function deleteApplication(id) {
    applications = applications.filter(app => app.id !== id);
    renderApplications();
    updateStats();
}

// Mise à jour des stats
function updateStats() {
    document.getElementById('stat-total').textContent = applications.length;
    document.getElementById('stat-applied').textContent = 
        applications.filter(a => a.status === 'Postulé').length;
    document.getElementById('stat-interview').textContent = 
        applications.filter(a => a.status === 'Entretien').length;
    document.getElementById('stat-offer').textContent = 
        applications.filter(a => a.status === 'Offre').length;
}

window.openModal = openModal;
window.closeModal = closeModal;
window.deleteApplication = deleteApplication;

const specialties = {
    tech: [
        "Développement logiciel (web, mobile, backend...)",
        "Data (Data Analyst, Data Engineer, Data Scientist)",
        "Cybersécurité",
        "Cloud & DevOps",
        "IA / Machine Learning",
        "Réseaux & systèmes",
        "Autre"
    ],
    business: [
        "Management / gestion d'équipe",
        "Conseil (consulting)",
        "Stratégie d'entreprise",
        "Gestion de projet / Product management",
        "Entrepreneuriat",
        "Autre"
    ],
    finance: [
        "Comptabilité / audit",
        "Finance d'entreprise",
        "Banque / assurance",
        "Analyse financière",
        "Contrôle de gestion",
        "Autre"
    ],
    marketing: [
        "Marketing digital",
        "Communication / relations publiques",
        "Branding",
        "Growth marketing",
        "Community management",
        "Autre"
    ],
    hospitality: [
        "Hôtellerie",
        "Restauration",
        "Tourisme / agences de voyage",
        "Organisation d'événements",
        "Autre"
    ],
    law: [
        "Avocat / juriste",
        "Droit des affaires",
        "Droit international",
        "Conformité (compliance)",
        "Autre"
    ],
    health: [
        "Médecine",
        "Soins infirmiers",
        "Pharmaceutique",
        "Recherche médicale",
        "Autre"
    ],
    engineering: [
        "Génie civil",
        "Génie mécanique / électrique",
        "Production industrielle",
        "Maintenance",
        "Autre "
    ],
    creative: [
        "Design UX/UI",
        "Graphisme",
        "Animation / 3D",
        "Mode",
        "Création de contenu",
        "Autre "
    ],
    education: [
        "Enseignement",
        "Recherche académique",
        "Formation professionnelle",
        "Autre"
    ],
    logistics: [
        "Supply chain",
        "Transport",
        "Gestion des opérations",
        "Autre "
    ],
    environment: [
        "Énergies renouvelables",
        "RSE (responsabilité sociétale)",
        "Gestion environnementale",
        "Autre (préciser)"
    ],
    commerce: [
        "Vente (B2B / B2C)",
        "Business development",
        "Retail / e-commerce",
        "Autre"
    ],
    public: [
        "Administration publique",
        "Organisations internationales",
        "Humanitaire",
        "Autre "
    ],
    other: []
};

function updateSpecialties() {
    const domain = document.getElementById('job-domain').value;
    const specialtySelect = document.getElementById('job-specialty');
    const otherGroup = document.getElementById('other-group');
    const specialtyGroup = document.getElementById('specialty-group');

    if (domain === 'other') {
        specialtyGroup.style.display = 'none';
        otherGroup.style.display = 'flex';
        return;
    }

    otherGroup.style.display = 'none';
    specialtyGroup.style.display = 'flex';

    const options = specialties[domain] || [];
    specialtySelect.innerHTML = options.length
        ? options.map(s => `<option value="${s}">${s}</option>`).join('')
        : '<option value="">-- Choisir un domaine d\'abord --</option>';
}

// Variable pour savoir si on est en mode édition
let editingId = null;

function editApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    // On mémorise l'id en cours d'édition
    editingId = id;

    // On pré-remplit le formulaire
    document.getElementById('company').value = app.company;
    document.getElementById('job-title').value = app.jobTitle;
    document.getElementById('job-domain').value = app.domain || '';
    document.getElementById('status').value = app.status;
    document.getElementById('city').value = app.city || '';
    document.getElementById('country').value = app.country || '';
    document.getElementById('salary').value = app.salary || '';
    document.getElementById('date-applied').value = app.dateApplied || '';
    document.getElementById('link').value = app.link || '';
    document.getElementById('notes').value = app.notes || '';

    // On met à jour les spécialités puis on sélectionne la bonne
    updateSpecialties();
    document.getElementById('job-specialty').value = app.specialty || '';

    // On change le titre de la modal
    document.querySelector('.modal-header h3').textContent = 'Modifier la candidature';

    openModal();
}


function exportExcel() {
    if (applications.length === 0) {
        alert("Aucune candidature à exporter !");
        return;
    }

    // Données à exporter
    const data = applications.map(app => ({
        'Entreprise': app.company,
        'Poste': app.jobTitle,
        'Domaine': app.domain || '',
        'Spécialité': app.specialty || '',
        'Statut': app.status,
        'Ville': app.city || '',
        'Pays': app.country || '',
        'Salaire': app.salary || '',
        'Date de candidature': app.dateApplied || '',
        'Lien': app.link || '',
        'Notes': app.notes || ''
    }));

    // Création du workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Largeur des colonnes
    ws['!cols'] = [
        { wch: 20 }, // Entreprise
        { wch: 25 }, // Poste
        { wch: 20 }, // Domaine
        { wch: 30 }, // Spécialité
        { wch: 15 }, // Statut
        { wch: 15 }, // Ville
        { wch: 15 }, // Pays
        { wch: 15 }, // Salaire
        { wch: 20 }, // Date
        { wch: 30 }, // Lien
        { wch: 40 }, // Notes
    ];

    // Style des headers
    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Segoe UI", sz: 11 },
        fill: { fgColor: { rgb: "7B2FFF" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            bottom: { style: "medium", color: { rgb: "FF4D00" } }
        }
    };

    // Style des lignes paires
    const evenRowStyle = {
        fill: { fgColor: { rgb: "F3EEFF" } },
        font: { name: "Segoe UI", sz: 10 },
        alignment: { vertical: "center" }
    };

    // Couleurs par statut
    const statusColors = {
        'Postulé': 'F3EEFF',
        'Entretien': 'FFF0EB',
        'Offre': 'EAF3DE',
        'Refusé': 'FCEBEB',
        'Sans réponse': 'F1EFE8'
    };

    // Appliquer les styles
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    for (let C = range.s.c; C <= range.e.c; C++) {
        // Style header (ligne 0)
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
        if (ws[headerCell]) {
            ws[headerCell].s = headerStyle;
        }
    }

    for (let R = 1; R <= range.e.r; R++) {
        const statusCell = XLSX.utils.encode_cell({ r: R, c: 4 }); // colonne Statut
        const status = ws[statusCell]?.v;
        const bgColor = statusColors[status] || 'FFFFFF';

        for (let C = range.s.c; C <= range.e.c; C++) {
            const cell = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cell]) ws[cell] = { v: '', t: 's' };
            ws[cell].s = {
                fill: { fgColor: { rgb: bgColor } },
                font: { name: "Segoe UI", sz: 10 },
                alignment: { vertical: "center" },
                border: {
                    bottom: { style: "thin", color: { rgb: "C49EFF" } }
                }
            };
        }
    }

    // Hauteur des lignes
    ws['!rows'] = [{ hpt: 30 }]; // header plus haut
    for (let R = 1; R <= range.e.r; R++) {
        ws['!rows'].push({ hpt: 22 });
    }

    // Ajouter une feuille titre
    const titleWs = XLSX.utils.aoa_to_sheet([
        [''],
        ['  JOBBLY — Mes candidatures'],
        [''],
        [`  Exporté le ${new Date().toLocaleDateString('fr-FR')}`],
        [`  Total : ${applications.length} candidature(s)`],
        [''],
    ]);

    titleWs['!cols'] = [{ wch: 40 }];
    titleWs['B2'] = {
        v: 'JOBBLY — Mes candidatures',
        s: {
            font: { bold: true, sz: 16, color: { rgb: "7B2FFF" }, name: "Segoe UI" }
        }
    };

    // Ajout des feuilles
    XLSX.utils.book_append_sheet(wb, titleWs, "Jobbly");
    XLSX.utils.book_append_sheet(wb, ws, "Candidatures");

    // Téléchargement
    const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    XLSX.writeFile(wb, `Jobbly_candidatures_${date}.xlsx`);
}

window.exportExcel = exportExcel;

window.updateSpecialties = updateSpecialties;
window.editApplication = editApplication;
