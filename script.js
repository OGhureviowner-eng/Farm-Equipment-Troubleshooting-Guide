// Sample troubleshooting data
const troubleshootingData = [
    {
        id: 1,
        title: "Tractor Won't Start",
        category: "tractor",
        steps: [
            "Check fuel level - ensure tank is at least 1/4 full",
            "Inspect battery connections - clean corrosion with baking soda solution",
            "Check dashboard error codes - note any codes displayed",
            "Verify starter solenoid connection",
            "Test glow plugs (diesel) or spark plugs (gas)"
        ]
    },
    {
        id: 2,
        title: "Tractor Overheating",
        category: "tractor",
        steps: [
            "Check coolant level in radiator",
            "Inspect radiator for debris/blockages",
            "Verify water pump belt tension",
            "Check thermostat operation",
            "Inspect fan shroud for damage"
        ]
    },
    {
        id: 3,
        title: "Irrigation Pump Won't Prime",
        category: "irrigation",
        steps: [
            "Check suction line for air leaks",
            "Verify foot valve is functioning",
            "Prime pump with water through priming port",
            "Check pump impeller for debris",
            "Inspect check valves"
        ]
    },
    {
        id: 4,
        title: "Irrigation System Low Pressure",
        category: "irrigation",
        steps: [
            "Check main shutoff valve position",
            "Inspect filter screens for clogging",
            "Verify pump pressure gauge reading",
            "Check for leaks in main line",
            "Adjust pressure regulator setting"
        ]
    },
    {
        id: 5,
        title: "Farm WiFi Network Down",
        category: "network",
        steps: [
            "Power cycle router/modem (30 seconds)",
            "Check Ethernet cables for damage",
            "Verify router lights (power, internet, wireless)",
            "Test connection with phone hotspot",
            "Reset router to factory settings if needed"
        ]
    },
    {
        id: 6,
        title: "Soil Moisture Sensor Not Reading",
        category: "soil",
        steps: [
            "Check sensor cable connections",
            "Verify power supply (usually 5-24VDC)",
            "Clean sensor probes with sandpaper",
            "Test sensor with multimeter (resistance)",
            "Check data logger/recorder settings"
        ]
    },
    {
        id: 7,
        title: "No Internet on Farm Computer",
        category: "network",
        steps: [
            "Check Ethernet cable/link lights",
            "Restart computer network adapter",
            "Flush DNS: <code>ipconfig /flushdns</code>",
            "Test with different network cable",
            "Check router port configuration"
        ]
    }
];

// DOM elements
const searchInput = document.getElementById('searchInput');
const issuesContainer = document.getElementById('issuesContainer');
const categoryBtns = document.querySelectorAll('.category-btn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderIssues(troubleshootingData);
    setupThemeToggle();
    setupCategoryFilters();
    setupSearch();
});

// Render issues
function renderIssues(data) {
    issuesContainer.innerHTML = data.map(issue => `
        <div class="troubleshoot-card" data-category="${issue.category}" data-title="${issue.title.toLowerCase()}">
            <span class="category-badge">${getCategoryName(issue.category)}</span>
            <h3>${issue.title}</h3>
            <div class="checklist">
                ${issue.steps.map((step, index) => `
                    <div class="checklist-item" data-step="${index}">
                        <input type="checkbox" id="step-${issue.id}-${index}">
                        <label for="step-${issue.id}-${index}">${step}</label>
                    </div>
                `).join('')}
            </div>
            <button class="done-btn" onclick="markSectionComplete(this)">
                <i class="fas fa-check"></i> Mark Section Complete
            </button>
        </div>
    `).join('');
}

// Category filter
function setupCategoryFilters() {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            const cards = document.querySelectorAll('.troubleshoot-card');
            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search function
function setupSearch() {
    searchInput.addEventListener('input', performSearch);
}

function performSearch() {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.troubleshoot-card');
    
    cards.forEach(card => {
        const title = card.dataset.title;
        if (title.includes(query)) {
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            card.style.display = 'none';
        }
    });
}

function searchIssues() {
    performSearch();
}

// Mark complete
function markSectionComplete(btn) {
    const card = btn.closest('.troubleshoot-card');
    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(cb => cb.checked = true);
    btn.textContent = '✅ Section Complete!';
    btn.style.background = '#28a745';
}

// Print checklist
function printChecklist() {
    const printWindow = window.open('', '_blank');
    const visibleCards = document.querySelectorAll('.troubleshoot-card[style*="block"], .troubleshoot-card:not([style*="none"])');
    
    let printContent = `
        <html>
        <head><title>Farm Troubleshooting Checklist</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-card { margin-bottom: 30px; padding: 20px; border: 2px solid #4a7c59; border-radius: 10px; }
            .print-card h3 { color: #2d5a3e; border-bottom: 2px solid #4a7c59; padding-bottom: 10px; }
            .step { margin: 10px 0; }
            .completed { text-decoration: line-through; background: #e8f5e8; }
        </style>
        </head>
        <body>
            <h1>Farm Equipment Troubleshooting Checklist</h1>
            <p><em>Generated: ${new Date().toLocaleString()}</em></p>
    `;
    
    visibleCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const steps = card.querySelectorAll('.checklist-item');
        printContent += `<div class="print-card"><h3>${title}</h3>`;
        
        steps.forEach((step, index) => {
            const checkbox = step.querySelector('input[type="checkbox"]');
            const stepText = step.querySelector('label').textContent;
            const completed = checkbox.checked ? 'completed' : '';
            printContent += `<div class="step ${completed}">• ${stepText}</div>`;
        });
        
        printContent += '</div>';
    });
    
    printContent += '</body></html>';
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Theme toggle
function setupThemeToggle() {
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    themeIcon.addEventListener('click', () => {
        body.classList.toggle('dark');
        if (body.classList.contains('dark')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
        themeIcon.className = 'fas fa-sun';
    }
}

function getCategoryName(category) {
    const names = {
        tractor: 'Tractor',
        irrigation: 'Irrigation',
        network: 'Network',
        soil: 'Soil Sensors'
    };
    return names[category] || category;
}
