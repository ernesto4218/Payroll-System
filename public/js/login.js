const loginform = document.getElementById('loginform');

if (loginform){
    loginform.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = loginform.querySelector('#email').value;
        const password = loginform.querySelector('#password').value;
        
        const data = {
            email,
            password,
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // ✅ correct for JSON
                },
                body: JSON.stringify(data) // ✅ convert JS object to JSON string
            });

            if (!response.ok) {
                const errorData = await response.json();
                showToast('error', errorData.message || 'Unknown error');
                console.error('Server error:', errorData);
                return; 
            }

            const result = await response.json();
            if (result){
                loginform.reset();
                console.log(result);
                if (result.success){
                    showToast('success', result.message);
                    setTimeout(() => {
                        location.replace('/admin/dashboard');
                    }, 500);
                } else {
                    showToast('error', result.message);
                }
            } else {
                showToast('error', 'No result found.');
            }
                        console.log('Server response:', result);
        } catch (error) {
            showToast('error', error.message);
            console.error('Submit error:', error);
        }
    });
}