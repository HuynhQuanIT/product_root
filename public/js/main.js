// Main JavaScript file for the supplier-product management system

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto dismiss alerts after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert-dismissible');
        alerts.forEach(function(alert) {
            var bsAlert = new bootstrap.Alert(alert);
            if (bsAlert) {
                bsAlert.close();
            }
        });
    }, 5000);

    // Add fade-in animation to cards
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card, index) {
        setTimeout(function() {
            card.classList.add('fade-in');
        }, index * 100);
    });
});

// Utility Functions
const Utils = {
    // Format number as Vietnamese currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    // Format date as Vietnamese format
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('vi-VN');
    },

    // Show loading state on button
    showLoading: function(button, text = 'Đang xử lý...') {
        const originalText = button.innerHTML;
        button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>${text}`;
        button.disabled = true;
        return originalText;
    },

    // Hide loading state on button
    hideLoading: function(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
    },

    // Show toast notification
    showToast: function(message, type = 'success') {
        // Create toast element if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1055';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    },

    // Confirm dialog
    confirm: function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    },

    // Debounce function for search
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Form Validation
const FormValidator = {
    // Validate Vietnamese phone number
    validatePhone: function(phone) {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    },

    // Validate email
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate required fields
    validateRequired: function(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    },

    // Add real-time validation
    addRealTimeValidation: function(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }

                // Special validation for email and phone
                if (this.type === 'email' && this.value) {
                    if (!FormValidator.validateEmail(this.value)) {
                        this.classList.add('is-invalid');
                    } else {
                        this.classList.remove('is-invalid');
                    }
                }

                if (this.type === 'tel' && this.value) {
                    if (!FormValidator.validatePhone(this.value)) {
                        this.classList.add('is-invalid');
                    } else {
                        this.classList.remove('is-invalid');
                    }
                }
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }
};

// AJAX Helper
const AjaxHelper = {
    // Generic AJAX request
    request: function(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin'
        };

        const finalOptions = { ...defaultOptions, ...options };

        return fetch(url, finalOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('AJAX Error:', error);
                Utils.showToast('Có lỗi xảy ra khi kết nối với server', 'danger');
                throw error;
            });
    },

    // DELETE request
    delete: function(url) {
        return this.request(url, { method: 'DELETE' });
    },

    // POST request
    post: function(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // PUT request
    put: function(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

// Search functionality
const SearchHandler = {
    init: function() {
        const searchForms = document.querySelectorAll('form[action*="search"], form[action="/"], form[action="/products"], form[action="/suppliers"]');
        
        searchForms.forEach(form => {
            const searchInput = form.querySelector('input[name="search"]');
            if (searchInput) {
                searchInput.addEventListener('input', Utils.debounce(function() {
                    // Auto-submit search form after user stops typing
                    if (this.value.length >= 3 || this.value.length === 0) {
                        form.submit();
                    }
                }, 500));
            }
        });
    }
};

// Table enhancements
const TableEnhancer = {
    init: function() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            // Add hover effect
            table.classList.add('table-hover');
            
            // Add sorting capability (basic)
            const headers = table.querySelectorAll('th');
            headers.forEach(header => {
                if (!header.querySelector('button') && !header.querySelector('a')) {
                    header.style.cursor = 'pointer';
                    header.addEventListener('click', function() {
                        // Basic sorting logic could be added here
                        console.log('Sorting by', this.textContent);
                    });
                }
            });
        });
    }
};

// Initialize all modules when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add form validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        FormValidator.addRealTimeValidation(form);
    });

    // Initialize search
    SearchHandler.init();
    
    // Initialize table enhancements
    TableEnhancer.init();

    // Initialize any custom tooltips
    const customTooltips = document.querySelectorAll('[title]');
    customTooltips.forEach(element => {
        element.setAttribute('data-bs-toggle', 'tooltip');
        new bootstrap.Tooltip(element);
    });
});

// Export for global use
window.Utils = Utils;
window.FormValidator = FormValidator;
window.AjaxHelper = AjaxHelper;