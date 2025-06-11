document.addEventListener('DOMContentLoaded', function() {
            // Generate captcha on page load
            generateCaptcha();

            // DOM elements
            const form = document.getElementById('registrationForm');
            const registrationSection = document.getElementById('registrationSection');
            const confirmationPage = document.getElementById('confirmationPage');
            const userDetailsSummary = document.getElementById('userDetailsSummary');
            const backToFormBtn = document.getElementById('backToForm');
            const togglePassword = document.getElementById('togglePassword');
            const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            // Toggle password visibility
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });

            toggleConfirmPassword.addEventListener('click', function() {
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });

            // Form validation
            const fullName = document.getElementById('fullName');
            const username = document.getElementById('username');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const phone = document.getElementById('phone');
            const captcha = document.getElementById('captcha');
            const terms = document.getElementById('terms');
            const profilePicture = document.getElementById('profilePicture');
            const imagePreview = document.getElementById('imagePreview');

            // Username availability simulation
            username.addEventListener('blur', function() {
                const usernameValue = username.value.trim();
                const usernameError = document.getElementById('usernameError');
                const usernameSuccess = document.getElementById('usernameSuccess');

                if (usernameValue.length < 4 || usernameValue.length > 20) {
                    showError(usernameError, 'Username must be 4-20 characters');
                    hideSuccess(usernameSuccess);
                } else {
                    // Simulate checking username availability
                    setTimeout(() => {
                        const takenUsernames = ['admin', 'user', 'test', 'demo'];
                        if (takenUsernames.includes(usernameValue.toLowerCase())) {
                            showError(usernameError, 'Username is already taken');
                            hideSuccess(usernameSuccess);
                        } else {
                            hideError(usernameError);
                            showSuccess(usernameSuccess, 'Username available');
                        }
                    }, 500);
                }
            });

            // Password strength indicator
            password.addEventListener('input', function() {
                const passwordValue = password.value;
                const strengthBar = document.getElementById('passwordStrength');
                let strength = 0;

                // Check password length
                if (passwordValue.length >= 8) strength += 1;
                if (passwordValue.length >= 12) strength += 1;

                // Check for numbers
                if (/\d/.test(passwordValue)) strength += 1;

                // Check for special characters
                if (/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) strength += 1;

                // Check for uppercase and lowercase letters
                if (/[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue)) strength += 1;

                // Update strength bar
                let width = 0;
                let color = '#c93c37'; // red

                if (strength === 1) {
                    width = 20;
                    color = '#c93c37'; // red
                } else if (strength === 2) {
                    width = 40;
                    color = '#da7a2c'; // orange
                } else if (strength === 3) {
                    width = 60;
                    color = '#d7a229'; // yellow
                } else if (strength === 4) {
                    width = 80;
                    color = '#539bf5'; // blue
                } else if (strength >= 5) {
                    width = 100;
                    color = '#57ab5a'; // green
                }

                strengthBar.style.width = `${width}%`;
                strengthBar.style.backgroundColor = color;
            });

            // Confirm password validation
            confirmPassword.addEventListener('input', function() {
                const confirmPasswordValue = confirmPassword.value;
                const passwordValue = password.value;
                const confirmPasswordError = document.getElementById('confirmPasswordError');

                if (confirmPasswordValue !== passwordValue) {
                    showError(confirmPasswordError, 'Passwords do not match');
                } else {
                    hideError(confirmPasswordError);
                }
            });

            // Email validation
            email.addEventListener('blur', function() {
                const emailValue = email.value.trim();
                const emailError = document.getElementById('emailError');

                if (!isValidEmail(emailValue)) {
                    showError(emailError, 'Please enter a valid email address');
                } else {
                    hideError(emailError);
                }
            });

            // Phone validation
            phone.addEventListener('blur', function() {
                const phoneValue = phone.value.trim();
                const phoneError = document.getElementById('phoneError');

                if (phoneValue && !isValidPhone(phoneValue)) {
                    showError(phoneError, 'Please enter a valid phone number');
                } else {
                    hideError(phoneError);
                }
            });

            // Full name validation
            fullName.addEventListener('blur', function() {
                const fullNameValue = fullName.value.trim();
                const fullNameError = document.getElementById('fullNameError');

                if (!fullNameValue) {
                    showError(fullNameError, 'Please enter your full name');
                } else {
                    hideError(fullNameError);
                }
            });

            // Profile picture preview
            profilePicture.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        imagePreview.src = event.target.result;
                        imagePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Captcha refresh
            document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);

            // Form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate all fields
                let isValid = true;

                // Full name validation
                if (!fullName.value.trim()) {
                    showError(document.getElementById('fullNameError'), 'Please enter your full name');
                    isValid = false;
                }

                // Username validation
                const usernameValue = username.value.trim();
                if (usernameValue.length < 4 || usernameValue.length > 20) {
                    showError(document.getElementById('usernameError'), 'Username must be 4-20 characters');
                    isValid = false;
                }

                // Email validation
                if (!isValidEmail(email.value.trim())) {
                    showError(document.getElementById('emailError'), 'Please enter a valid email address');
                    isValid = false;
                }

                // Password validation
                if (password.value.length < 8) {
                    showError(document.getElementById('passwordError'), 'Password must be at least 8 characters');
                    isValid = false;
                }

                // Confirm password validation
                if (confirmPassword.value !== password.value) {
                    showError(document.getElementById('confirmPasswordError'), 'Passwords do not match');
                    isValid = false;
                }

                // Phone validation (if provided)
                if (phone.value.trim() && !isValidPhone(phone.value.trim())) {
                    showError(document.getElementById('phoneError'), 'Please enter a valid phone number');
                    isValid = false;
                }

                // Captcha validation
                const captchaText = document.getElementById('captchaText').textContent;
                if (captcha.value.trim().toLowerCase() !== captchaText.toLowerCase()) {
                    showError(document.getElementById('captchaError'), 'Captcha does not match');
                    isValid = false;
                }

                // Terms validation
                if (!terms.checked) {
                    showError(document.getElementById('termsError'), 'You must agree to the terms');
                    isValid = false;
                }

                // If form is valid, show confirmation
                if (isValid) {
                    showConfirmationPage();
                }
            });

            // Back to form button
            backToFormBtn.addEventListener('click', function() {
                confirmationPage.style.display = 'none';
                registrationSection.style.display = 'block';
                form.reset();
                imagePreview.style.display = 'none';
                generateCaptcha();
            });

            // Show confirmation page with user details
            function showConfirmationPage() {
                // Create user details summary
                let summaryHTML = `
                    <div class="user-detail">
                        <div class="user-detail-label">Full Name:</div>
                        <div class="user-detail-value">${fullName.value}</div>
                    </div>
                    <div class="user-detail">
                        <div class="user-detail-label">Username:</div>
                        <div class="user-detail-value">${username.value}</div>
                    </div>
                    <div class="user-detail">
                        <div class="user-detail-label">Email:</div>
                        <div class="user-detail-value">${email.value}</div>
                    </div>`;

                // Add optional fields if they have values
                if (phone.value) {
                    summaryHTML += `
                    <div class="user-detail">
                        <div class="user-detail-label">Phone:</div>
                        <div class="user-detail-value">${phone.value}</div>
                    </div>`;
                }

                if (document.querySelector('input[name="gender"]:checked')) {
                    summaryHTML += `
                    <div class="user-detail">
                        <div class="user-detail-label">Gender:</div>
                        <div class="user-detail-value">${document.querySelector('input[name="gender"]:checked').value}</div>
                    </div>`;
                }

                if (document.getElementById('studentId').value) {
                    summaryHTML += `
                    <div class="user-detail">
                        <div class="user-detail-label">Student ID:</div>
                        <div class="user-detail-value">${document.getElementById('studentId').value}</div>
                    </div>`;
                }

                // Add profile picture if uploaded
                if (imagePreview.style.display !== 'none') {
                    summaryHTML += `
                    <div class="user-detail">
                        <div class="user-detail-label">Profile Picture:</div>
                        <div class="user-detail-value">
                            <img src="${imagePreview.src}" class="profile-preview" alt="Profile Preview">
                        </div>
                    </div>`;
                }

                userDetailsSummary.innerHTML = summaryHTML;
                
                // Show confirmation page
                registrationSection.style.display = 'none';
                confirmationPage.style.display = 'block';
            }

            // Helper functions
            function isValidEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }

            function isValidPhone(phone) {
                const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                return re.test(phone);
            }

            function showError(element, message) {
                element.textContent = message;
                element.style.display = 'block';
            }

            function hideError(element) {
                element.style.display = 'none';
            }

            function showSuccess(element, message) {
                element.textContent = message;
                element.style.display = 'block';
            }

            function hideSuccess(element) {
                element.style.display = 'none';
            }

            function generateCaptcha() {
                const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                let captcha = '';
                for (let i = 0; i < 6; i++) {
                    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                document.getElementById('captchaText').textContent = captcha;
                document.getElementById('captcha').value = '';
                hideError(document.getElementById('captchaError'));
            }
        });