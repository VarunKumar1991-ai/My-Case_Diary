// Case operations
document.addEventListener('DOMContentLoaded', () => {
    const caseForm = document.getElementById('caseForm');
    const caseList = document.getElementById('caseList');
    const successMsg = document.getElementById('successMsg');
    
    // Elements for case detail modal
    const caseModal = document.getElementById('caseModal');
    const closeModal = document.getElementById('closeModal');
    
    // Handle Case Submission
    if (caseForm) {
        caseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const caseData = {
                title: document.getElementById('caseTitle').value,
                number: document.getElementById('caseNumber').value,
                date: document.getElementById('caseDate').value,
                station: document.getElementById('policeStation').value,
                description: document.getElementById('caseDescription').value
            };
            
            Storage.saveCase(caseData);
            
            // Show success message
            successMsg.style.display = 'block';
            caseForm.reset();
            
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            caseForm.reset();
            successMsg.style.display = 'none';
        });
    }

    // Render cases in View Cases page
    if (caseList) {
        renderCases();
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            caseModal.classList.remove('active');
        });
        
        // Close modal when clicking outside content
        caseModal.addEventListener('click', (e) => {
            if (e.target === caseModal) {
                caseModal.classList.remove('active');
            }
        });
    }
    
    function renderCases() {
        const cases = Storage.getCases();
        
        if (cases.length === 0) {
            caseList.innerHTML = `<div class="empty-state">
                <h2>No case diaries found</h2>
                <p>You haven't written any case diaries yet.</p>
                <a href="new-case.html" class="btn" style="margin-top:1rem;">Write New Case</a>
            </div>`;
            return;
        }
        
        // Sort by timestamp descending
        cases.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        caseList.innerHTML = '';
        
        cases.forEach(c => {
            const caseItem = document.createElement('div');
            caseItem.className = 'case-item';
            caseItem.innerHTML = `
                <div class="case-info">
                    <h3>${c.title} (#${c.number})</h3>
                    <div class="case-meta">
                        ${c.date} | ${c.station}
                    </div>
                </div>
                <div class="case-actions">
                    <button class="btn btn-outline" onclick="viewCase('${c.id}')">View</button>
                    <button class="btn btn-danger" onclick="deleteCase('${c.id}')">Delete</button>
                </div>
            `;
            caseList.appendChild(caseItem);
        });
    }
    
    // Expose functions globally so inline event handlers work
    window.viewCase = function(id) {
        const caseData = Storage.getCaseById(id);
        if (caseData && caseModal) {
            document.getElementById('modalTitle').textContent = `${caseData.title} (#${caseData.number})`;
            document.getElementById('modalDate').textContent = caseData.date;
            document.getElementById('modalStation').textContent = caseData.station;
            document.getElementById('modalDesc').textContent = caseData.description;
            
            caseModal.classList.add('active');
        }
    };
    
    window.deleteCase = function(id) {
        if (confirm("Are you sure you want to delete this case diary? This action cannot be undone.")) {
            Storage.deleteCase(id);
            renderCases();
        }
    };
});
