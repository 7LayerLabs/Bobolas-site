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

      // Success - hide form and show success message
      form.style.display = 'none';
      formMessage.style.display = 'block';
      formMessage.style.backgroundColor = '#d4edda';
      formMessage.style.color = '#155724';
      formMessage.style.border = '1px solid #c3e6cb';
      formMessage.style.padding = '40px';
      formMessage.style.borderRadius = '16px';
      formMessage.style.fontSize = '1.1rem';
      formMessage.style.textAlign = 'center';
      formMessage.innerHTML = `
        <div style="margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#155724" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h2 style="color: #155724; margin-bottom: 12px;">Application Submitted!</h2>
        <p style="margin-bottom: 20px;">Thank you for your interest in joining the Bobola's team. We'll review your application and contact you soon.</p>
        <a href="index" style="display: inline-block; padding: 12px 24px; background: #155724; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Return to Homepage</a>
      `;
      // Scroll to top so user sees the message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      // Show error but keep form visible
      formMessage.style.display = 'block';
      formMessage.style.backgroundColor = '#f8d7da';
      formMessage.style.color = '#721c24';
      formMessage.style.border = '1px solid #f5c6cb';
      formMessage.style.padding = '20px';
      formMessage.style.borderRadius = '12px';
      formMessage.style.marginTop = '20px';
      formMessage.innerHTML = 'There was a problem submitting your application. Please try again or contact us at (603) 577-1086.';
      console.error('Form submission error:', error);
      submitButton.disabled = false;
      submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Submit Application`;
    }
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInstantDB);
} else {
  initInstantDB();
}
