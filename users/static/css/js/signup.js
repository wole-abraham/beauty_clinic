document.addEventListener('DOMContentLoaded', () => {
    const locationSelect = document.getElementById('location');
    const phoneInput = document.getElementById('phone');

    // Dynamically load locations
    const locations = ['New York', 'Lagos', 'London', 'Tokyo'];
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });

    // Phone country code picker
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: 'auto',
        geoIpLookup: callback => {
            fetch('https://ipinfo.io?token=f27fb045c33caa')
                .then(resp => resp.json())
                .then(data => callback(data.country))
                .catch(() => callback('US'));
        },
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.19/build/js/utils.js'
    });

    // Password confirmation validation
    document.getElementById('signupForm').addEventListener('submit', e => {
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        if (password1 !== password2) {
            e.preventDefault();
            alert('Passwords do not match!');
        }
    });

    // Form submission for phone number
    document.querySelector('form').addEventListener('submit', function (e) {
        var phoneNumber = iti.getNumber(); // Includes the country code
        document.querySelector('#phone').value = phoneNumber; // Pass the full phone number to the server
    });
});
