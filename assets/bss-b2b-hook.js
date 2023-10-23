window.bssB2BHooks = window.bssB2BHooks || {
    actions: {},
    filters: {},
};

window.BSS_B2B = window.BSS_B2B || {};

window.BSS_B2B.addAction = (tag, priority = 5, callback) => {
    window.bssB2BHooks.actions[tag] = window.bssB2BHooks.actions[tag] || [];
    window.bssB2BHooks.actions[tag][priority] = window.bssB2BHooks.actions[tag][priority] || [];
    window.bssB2BHooks.actions[tag][priority].push(callback);
}
window.BSS_B2B.addFilter = (tag, priority = 5, value) => {
    window.bssB2BHooks.filters[tag] = window.bssB2BHooks.filters[tag] || [];
    window.bssB2BHooks.filters[tag][priority] = window.bssB2BHooks.filters[tag][priority] || [];
    window.bssB2BHooks.filters[tag][priority].push(value);
}
