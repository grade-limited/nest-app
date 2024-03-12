export default async function sendEmail(template_params: {
  to_name: string;
  message: string;
  from_name: string;
  reply_to: string;
  to_email: string;
}) {
  // POST - https://api.emailjs.com/api/v1.0/email/send

  if (!process.env.EMAILJS_TEMPLATE_ID) {
    return;
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${process.env.EMAILJS_API_KEY}`,
    },
    body: JSON.stringify({
      accessToken: process.env.EMAILJS_API_KEY,
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_USER_ID,
      template_params,
    }),
  });
  console.log(response);
}
