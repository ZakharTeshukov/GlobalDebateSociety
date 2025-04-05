document.addEventListener('DOMContentLoaded', () => {
    // Handle pricing plan selection
    const pricingCards = document.querySelectorAll('.pricing-card');
    const membershipSelect = document.getElementById('membershipType');
    
    pricingCards.forEach(card => {
        const selectButton = card.querySelector('.btn-primary');
        selectButton.addEventListener('click', (e) => {
            const planType = card.querySelector('h3').textContent.toLowerCase();
            
            // Update the select dropdown
            for (let i = 0; i < membershipSelect.options.length; i++) {
                const option = membershipSelect.options[i];
                if (option.value === planType || option.text.toLowerCase().includes(planType)) {
                    membershipSelect.selectedIndex = i;
                    break;
                }
            }
            
            // Smooth scroll to form
            const form = document.getElementById('registration-form');
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Toggle payment method fields
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardFields = document.getElementById('credit-card-fields');
    
    const togglePaymentFields = () => {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        if (selectedMethod === 'credit-card') {
            creditCardFields.style.display = 'block';
            
            // Make credit card fields required
            document.getElementById('cardName').required = true;
            document.getElementById('cardNumber').required = true;
            document.getElementById('expiryMonth').required = true;
            document.getElementById('expiryYear').required = true;
            document.getElementById('cvv').required = true;
        } else {
            creditCardFields.style.display = 'none';
            
            // Remove required attribute from credit card fields
            document.getElementById('cardName').required = false;
            document.getElementById('cardNumber').required = false;
            document.getElementById('expiryMonth').required = false;
            document.getElementById('expiryYear').required = false;
            document.getElementById('cvv').required = false;
        }
    };
    
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentFields);
    });
    
    // Run initially to set correct state
    togglePaymentFields();
    
    // Form validation and submission
    const membershipForm = document.querySelector('.membership-form');
    
    membershipForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Custom validation
        const isValid = validateForm(this);
        
        if (isValid) {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                submitButton.textContent = 'Processing...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = 'Registration successful! Welcome to Global Debate Society!';
                this.insertBefore(successMessage, this.firstChild);
                
                // Scroll to top of form to see the message
                this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Clear form after success
                this.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-error';
                errorMessage.textContent = 'An error occurred during registration. Please try again.';
                this.insertBefore(errorMessage, this.firstChild);
                
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }
    });
    
    // Form validation function
    function validateForm(form) {
        let isValid = true;
        
        // Clear previous error messages
        const existingErrorMessages = form.querySelectorAll('.error-message');
        existingErrorMessages.forEach(message => message.remove());
        
        // Remove error class from all inputs
        const allInputs = form.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => input.classList.remove('error'));
        
        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, `${field.getAttribute('placeholder') || field.previousElementSibling.textContent.trim() || 'This field'} is required`);
            }
        });
        
        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
            isValid = false;
            showError(emailField, 'Please enter a valid email address');
        }
        
        // Phone validation (optional)
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value.trim() && !isValidPhone(phoneField.value)) {
            isValid = false;
            showError(phoneField, 'Please enter a valid phone number');
        }
        
        // Credit card validation (if credit card payment is selected)
        const creditCardMethod = form.querySelector('input[name="paymentMethod"][value="credit-card"]');
        if (creditCardMethod && creditCardMethod.checked) {
            const cardNumber = document.getElementById('cardNumber');
            const cvv = document.getElementById('cvv');
            
            if (cardNumber.value.trim() && !isValidCreditCard(cardNumber.value)) {
                isValid = false;
                showError(cardNumber, 'Please enter a valid credit card number');
            }
            
            if (cvv.value.trim() && !isValidCVV(cvv.value)) {
                isValid = false;
                showError(cvv, 'Please enter a valid CVV (3 or 4 digits)');
            }
        }
        
        return isValid;
    }
    
    // Error display function
    function showError(input, message) {
        input.classList.add('error');
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Insert after the input or its parent container for radio/checkbox groups
        if (input.type === 'radio' || input.type === 'checkbox') {
            // Find the closest parent container
            const container = input.closest('.checkbox-group') || input.closest('.payment-options');
            if (container && !container.nextElementSibling?.classList.contains('error-message')) {
                container.parentNode.insertBefore(errorMessage, container.nextSibling);
            }
        } else {
            input.parentNode.insertBefore(errorMessage, input.nextSibling);
        }
    }
    
    // Validation helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Basic phone validation, can be enhanced for specific formats
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    function isValidCreditCard(cardNumber) {
        // Remove spaces and dashes
        const card = cardNumber.replace(/[\s-]/g, '');
        // Simple validation: check if it's 13-19 digits
        return /^[0-9]{13,19}$/.test(card);
    }
    
    function isValidCVV(cvv) {
        // CVV should be 3 or 4 digits
        return /^[0-9]{3,4}$/.test(cvv);
    }
    
    // Format credit card number as the user types
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove all non-digit characters
            let value = this.value.replace(/\D/g, '');
            
            // Add a space after every 4th digit
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            
            // Update the input value
            this.value = value;
        });
    }
    
    // Format CVV as the user types
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            // Remove all non-digit characters
            this.value = this.value.replace(/\D/g, '');
            
            // Limit to 4 characters
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
    }
}); 