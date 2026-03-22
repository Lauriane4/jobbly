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

    const app = {
    id: Date.now(),
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

    applications.push(app);
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
                    · ${app.type}
                    ${app.dateApplied ? '· ' + new Date(app.dateApplied).toLocaleDateString('fr-FR') : ''}
                </p>
            </div>
            <div class="application-actions">
                <span class="status-badge ${getStatusClass(app.status)}">${app.status}</span>
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

window.updateSpecialties = updateSpecialties;