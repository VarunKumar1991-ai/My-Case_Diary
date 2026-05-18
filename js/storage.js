// LocalStorage operations
const Storage = {
    // Keys
    KEYS: {
        CASES: 'mcd_cases',
        USER: 'mcd_user',
        THEME: 'mcd_theme'
    },

    // Save item
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Get item
    get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    // Remove item
    remove(key) {
        localStorage.removeItem(key);
    },

    // Case specific operations
    saveCase(caseData) {
        const cases = this.get(this.KEYS.CASES) || [];
        // Add ID and timestamp
        caseData.id = Date.now().toString();
        caseData.timestamp = new Date().toISOString();
        cases.push(caseData);
        this.set(this.KEYS.CASES, cases);
        return caseData;
    },

    getCases() {
        return this.get(this.KEYS.CASES) || [];
    },

    deleteCase(id) {
        let cases = this.getCases();
        cases = cases.filter(c => c.id !== id);
        this.set(this.KEYS.CASES, cases);
    },
    
    getCaseById(id) {
        const cases = this.getCases();
        return cases.find(c => c.id === id);
    }
};
