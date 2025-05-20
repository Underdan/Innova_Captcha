import axios from 'axios';

const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeG0nAPAAAAADsxxxaW9dkfNw2p3xk82q8d_C2Nes9M4w';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

export const validateCaptcha = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post<RecaptchaResponse>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );

    return response.data.success;
  } catch (error) {
    console.error('Error validando reCAPTCHA:', error);
    return false;
  }
};
