        // Status Selection
function setStatus(btnElement, status) {
    // Reset all status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.className = 'status-btn w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 transition-all';
        const icon = btn.querySelector('svg');
        if(icon) icon.remove();
    });

    // Set active
    btnElement.className = 'status-btn w-full flex items-center justify-between p-4 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 shadow-inner transition-all';
    btnElement.innerHTML += `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
    lucide.createIcons();
}