export async function sendEmail(to: string, subject: string, text: string) {
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, text }),
  });
} 