// InstantDB Application Form Handler
const APP_ID = '5f42c029-7198-4aec-b13d-03289ce1f54f';

// Get IP address for tracking
async function getIPInfo() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (e) {
    return 'unknown';
  }
}

// Initialize when InstantDB loads
async function initInstantDB() {
  const { init, tx, id } = await import('https://www.unpkg.com/@instantdb/core@0.14.31/dist/module/index.js');
  const db = init({ appId: APP_ID });

  // Form submission handler
  document.getElementById('hiringForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = document.getElementById('submitButton');
    const formMessage = document.getElementById('formMessage');

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const ipAddress = await getIPInfo();
      const formData = new FormData(form);

      // Get checkbox values
      const positions = formData.getAll('position');
      const employment = formData.getAll('employment');

      // Build availability
      const availability = {
        monday: { morning: !!formData.get('monday_morning'), afternoon: !!formData.get('monday_afternoon'), evening: !!formData.get('monday_evening') },
        tuesday: { morning: !!formData.get('tuesday_morning'), afternoon: !!formData.get('tuesday_afternoon'), evening: !!formData.get('tuesday_evening') },
        wednesday: { morning: !!formData.get('wednesday_morning'), afternoon: !!formData.get('wednesday_afternoon'), evening: !!formData.get('wednesday_evening') },
        thursday: { morning: !!formData.get('thursday_morning'), afternoon: !!formData.get('thursday_afternoon'), evening: !!formData.get('thursday_evening') },
        friday: { morning: !!formData.get('friday_morning'), afternoon: !!formData.get('friday_afternoon'), evening: !!formData.get('friday_evening') },
        saturday: { morning: !!formData.get('saturday_morning'), afternoon: !!formData.get('saturday_afternoon'), evening: !!formData.get('saturday_evening') },
        sunday: { morning: !!formData.get('sunday_morning'), afternoon: !!formData.get('sunday_afternoon'), evening: !!formData.get('sunday_evening') }
      };

      // Save to InstantDB
      const applicationId = id();
      await db.transact(
        tx.applications[applicationId].update({
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          workExperience: formData.get('workExperience') || '',
          positions: positions,
          employment: employment,
          daysPerWeek: formData.get('daysPerWeek'),
          hoursPerWeek: formData.get('hoursPerWeek'),
          availability: JSON.stringify(availability),
          additionalInfo: formData.get('additionalInfo') || '',
          ipAddress: ipAddress,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          submittedAt: Date.now(),
          status: 'new'
        })
      );

      // Success
      formMessage.style.display = 'block';
      formMessage.style.backgroundColor = '#d4edda';
      formMessage.style.color = '#155724';
      formMessage.style.border = '1px solid #c3e6cb';
      formMessage.innerHTML = 'Thank you for your application! We will review it and contact you soon.';
      form.reset();

    } catch (error) {
      formMessage.style.display = 'block';
      formMessage.style.backgroundColor = '#f8d7da';
      formMessage.style.color = '#721c24';
      formMessage.style.border = '1px solid #f5c6cb';
      formMessage.innerHTML = 'There was a problem submitting your application. Please try again or contact us at (603) 577-1086.';
      console.error('Form submission error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Application';
    }
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInstantDB);
} else {
  initInstantDB();
}
