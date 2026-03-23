const API_URL = "http://localhost:8000";

// Vérifie que l'utilisateur est connecté
const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
if (!token) window.location.href = 'index.html';

// Affiche l'email dans la navbar
document.getElementById('user-email').textContent = email || '';

// Déconnexion
document.getElementById('btn-logout').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = 'index.html';
});

// Headers avec token JWT
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ── Chargement des candidatures ──
async function loadApplications() {
    try {
        const res = await fetch(`${API_URL}/applications/`, {
            headers: authHeaders()
        });
        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }
        const data = await res.json();
        renderApplications(data);
        updateStats(data);
    } catch (error) {
        console.error("Erreur chargement:", error);
    }
}

// ── Affichage des candidatures ──
function renderApplications(applications) {
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
                <h3>${app.company} — ${app.job_title}</h3>
                <p class="application-meta">
                    ${app.city || ''}${app.country ? ', ' + app.country : ''}
                    ${app.specialty || app.domain ? '· ' + (app.specialty || app.domain) : ''}
                    ${app.date_applied ? '· ' + new Date(app.date_applied).toLocaleDateString('fr-FR') : ''}
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

// ── Stats ──
function updateStats(applications) {
    document.getElementById('stat-total').textContent = applications.length;
    document.getElementById('stat-applied').textContent =
        applications.filter(a => a.status === 'Postulé').length;
    document.getElementById('stat-interview').textContent =
        applications.filter(a => a.status === 'Entretien').length;
    document.getElementById('stat-offer').textContent =
        applications.filter(a => a.status === 'Offre').length;
}

// ── Statut CSS ──
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

// ── Modal ──
let editingId = null;

function openModal() {
    document.getElementById('modal').style.display = 'flex';
    document.querySelector('.modal-header h3').textContent = 'Nouvelle candidature';
    editingId = null;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('form-application').reset();
    editingId = null;
}

document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// ── Soumission formulaire ──
document.getElementById('form-application').addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
        company: document.getElementById('company').value,
        job_title: document.getElementById('job-title').value,
        domain: document.getElementById('job-domain').value,
        specialty: document.getElementById('job-specialty')?.value ||
                   document.getElementById('other-domain')?.value || '',
        status: document.getElementById('status').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        salary: document.getElementById('salary').value,
        date_applied: document.getElementById('date-applied').value,
        link: document.getElementById('link').value,
        notes: document.getElementById('notes').value,
    };

    try {
        let res;
        if (editingId !== null) {
            res = await fetch(`${API_URL}/applications/${editingId}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(data)
            });
        } else {
            res = await fetch(`${API_URL}/applications/`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(data)
            });
        }

        if (res.ok) {
            closeModal();
            loadApplications();
        } else {
            const err = await res.json();
            alert(err.detail || "Erreur lors de l'enregistrement");
        }
    } catch (error) {
        alert("Erreur de connexion au serveur");
    }
});

// ── Modifier ──
async function editApplication(id) {
    try {
        const res = await fetch(`${API_URL}/applications/`, {
            headers: authHeaders()
        });
        const applications = await res.json();
        const app = applications.find(a => a.id === id);
        if (!app) return;

        editingId = id;
        document.getElementById('company').value = app.company;
        document.getElementById('job-title').value = app.job_title;
        document.getElementById('job-domain').value = app.domain || '';
        document.getElementById('status').value = app.status;
        document.getElementById('city').value = app.city || '';
        document.getElementById('country').value = app.country || '';
        document.getElementById('salary').value = app.salary || '';
        document.getElementById('date-applied').value = app.date_applied || '';
        document.getElementById('link').value = app.link || '';
        document.getElementById('notes').value = app.notes || '';

        updateSpecialties();
        document.getElementById('job-specialty').value = app.specialty || '';
        document.querySelector('.modal-header h3').textContent = 'Modifier la candidature';
        openModal();
    } catch (error) {
        alert("Erreur lors du chargement");
    }
}

// ── Supprimer ──
async function deleteApplication(id) {
    if (!confirm("Supprimer cette candidature ?")) return;

    try {
        const res = await fetch(`${API_URL}/applications/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (res.ok) loadApplications();
    } catch (error) {
        alert("Erreur lors de la suppression");
    }
}

// ── Export Excel ──
async function exportExcel() {
    try {
        const res = await fetch(`${API_URL}/export/excel`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            alert("Erreur lors de l'export");
            return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Jobbly_candidatures_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        alert("Erreur de connexion au serveur");
    }
}

// ── Spécialités ──
const specialties = {
    tech: ["Développement logiciel (web, mobile, backend...)", "Data (Data Analyst, Data Engineer, Data Scientist)", "Cybersécurité", "Cloud & DevOps", "IA / Machine Learning", "Réseaux & systèmes", "Autre (préciser)"],
    business: ["Management / gestion d'équipe", "Conseil (consulting)", "Stratégie d'entreprise", "Gestion de projet / Product management", "Entrepreneuriat", "Autre (préciser)"],
    finance: ["Comptabilité / audit", "Finance d'entreprise", "Banque / assurance", "Analyse financière", "Contrôle de gestion", "Autre (préciser)"],
    marketing: ["Marketing digital", "Communication / relations publiques", "Branding", "Growth marketing", "Community management", "Autre (préciser)"],
    hospitality: ["Hôtellerie", "Restauration", "Tourisme / agences de voyage", "Organisation d'événements", "Autre (préciser)"],
    law: ["Avocat / juriste", "Droit des affaires", "Droit international", "Conformité (compliance)", "Autre (préciser)"],
    health: ["Médecine", "Soins infirmiers", "Pharmaceutique", "Recherche médicale", "Autre (préciser)"],
    engineering: ["Génie civil", "Génie mécanique / électrique", "Production industrielle", "Maintenance", "Autre (préciser)"],
    creative: ["Design UX/UI", "Graphisme", "Animation / 3D", "Mode", "Création de contenu", "Autre (préciser)"],
    education: ["Enseignement", "Recherche académique", "Formation professionnelle", "Autre (préciser)"],
    logistics: ["Supply chain", "Transport", "Gestion des opérations", "Autre (préciser)"],
    environment: ["Énergies renouvelables", "RSE (responsabilité sociétale)", "Gestion environnementale", "Autre (préciser)"],
    commerce: ["Vente (B2B / B2C)", "Business development", "Retail / e-commerce", "Autre (préciser)"],
    public: ["Administration publique", "Organisations internationales", "Humanitaire", "Autre (préciser)"],
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

// Initialisation
loadApplications();

window.openModal = openModal;
window.closeModal = closeModal;
window.deleteApplication = deleteApplication;
window.editApplication = editApplication;
window.updateSpecialties = updateSpecialties;
window.exportExcel = exportExcel;