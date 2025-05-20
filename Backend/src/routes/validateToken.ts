import axios from 'axios';

const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeePUArAAAAAH9cKMJmlM6bzXB2qd-6ZNses0NW';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export const validateCaptcha = async (token: string): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const response = await axios.post<RecaptchaResponse>(
      'https://www.google.com/recaptcha/api/siteverify',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('🔍 CAPTCHA result:', response.data);

    return response.data.success === true;
  } catch (error) {
    console.error('❌ Error validando reCAPTCHA:', error);
    return false;
  }
};
