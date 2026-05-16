// store.js - The Unified Database

const storeCurrentUser = localStorage.getItem('teachstackCurrentUser');

// --- Global Security Check ---
// If no user is logged in, and they aren't already on the landing page, kick them out.
if (!storeCurrentUser && !window.location.href.includes('index.html')) {
    window.location.href = 'index.html';
}

const DATA_KEY = storeCurrentUser ? `teachstack_data_${storeCurrentUser}` : "teachstack_data_temp";

// ... the rest of your store.js code remains exactly the same ...

// 1. Safely retrieve and parse data
let appData = { sections: [], currentSectionId: null };
try {
    const rawData = localStorage.getItem(DATA_KEY);
    if (rawData) {
        appData = JSON.parse(rawData);
    }
} catch (e) {
    console.error("Local data was corrupted. Starting fresh.");
}

// 2. THE CATCH-ALL FIX
// If the data was saved incorrectly in a previous test, this prevents the .push() crash!
if (!appData.sections || !Array.isArray(appData.sections)) {
    appData.sections = [];
}

function saveData() {
    localStorage.setItem(DATA_KEY, JSON.stringify(appData));
}

function getCurrentSection() {
    if (appData.sections.length === 0) {
        return { 
            id: "empty", 
            name: "No Section Selected", 
            code: "---", 
            subject: "Please add a section in the Dashboard", 
            students: [], 
            attendance: { dates: [], records: {} }, 
            grades: { 
                weights: { quiz: 10, pt: 50, exam: 40 }, 
                cols: { quiz: 0, pt: 0, exam: 0 }, 
                maxScores: {}, 
                records: {} 
            } 
        };
    }
    return appData.sections.find(s => s.id === appData.currentSectionId) || appData.sections[0];
}

// ... keep your existing toggleModal, updateHeaderUI, etc. below ...

function toggleModal(id) {
    const modal = document.getElementById(id);
    if(modal) modal.classList.toggle('active');
}

function updateHeaderUI() {
    const section = getCurrentSection();
    document.querySelectorAll('.ui-sec-name').forEach(el => el.textContent = section.name);
    document.querySelectorAll('.ui-sub-code').forEach(el => el.textContent = `${section.code}: ${section.subject}`);
    document.querySelectorAll('.ui-enroll-count').forEach(el => el.textContent = `${section.students.length} Student${section.students.length !== 1 ? 's' : ''} Enrolled`);
}

// --- Dynamic Sidebar Logic ---
function renderSidebar() {
    const subNav = document.getElementById('sidebarSubNav');
    if (!subNav) return; // Ignore if we are on a page without this sidebar ID

    subNav.innerHTML = '';
    
    appData.sections.forEach(sec => {
        // Highlight the section we are currently viewing
        const isActive = sec.id === appData.currentSectionId 
            ? 'style="color: var(--green); font-weight: 700;"' 
            : '';
        
        subNav.innerHTML += `<a href="#" ${isActive} onclick="switchSection('${sec.id}')">${sec.name}</a>`;
    });
}

function switchSection(secId) {
    appData.currentSectionId = secId;
    saveData();
    // Reload the current page. This is a neat UX trick:
    // If you are on Attendance and click a new section, it keeps you on Attendance!
    window.location.reload(); 
}

// Automatically render the sidebar as soon as any page loads
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
});

// --- Global Logout Function ---
function logout() {
    localStorage.removeItem('teachstackCurrentUser');
    window.location.href = 'index.html';
}