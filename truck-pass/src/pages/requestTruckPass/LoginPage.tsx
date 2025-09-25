import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (email === '') {
      setError('');
    }
    setEmail(value);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !validateEmail(email)) {
      setError(t('loginPage.eailErrorMsg'));
      return;
    }
    else {
      setError('');
    }
    setIsLoading(true);
    setError('');
    // Simulate an API call delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate with state containing email
      navigate('/requestTruckpassProcess/otpVerification', { state: { email } });
    }, 1000);
  };

  const showBorder = isHovered || isFocused;

  return (
    <div className="font-inter flex flex-col min-h-screen px-4 py-8 bg-[#ECF5FF]">
      <div className="flex-grow flex justify-center items-center">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-white rounded-2xl flex items-center shadow-md justify-center transition-all duration-200 ${showBorder ? 'border-2 border-[#006DE7]' : 'border-2 border-transparent'
            }`}
          style={{ width: 405, height: 350 }}
        >
          <div className="bg-white rounded-xl p-8 w-[90%]">
            <h1 className="text-2xl font-semibold text-[#181D27] mb-4 text-center">
              {t('loginPage.header')}
            </h1>
            <p className="text-sm text-[#181D27] opacity-70 mb-6 text-center">
              {t('loginPage.desc')}
            </p>

            <form className="space-y-4" onSubmit={handleEmailSubmit} noValidate>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={t('loginPage.enterYourEmail')}
                  required
                  disabled={isLoading}
                  aria-invalid={!!error}
                  aria-describedby="email-error"
                  className={`w-full h-10 px-4 text-gray-900 placeholder-gray-500 rounded-lg transition focus:outline-none ${error
                    ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border border-gray-300 focus:ring-2 focus:ring-[#006DE7] focus:border-[#006DE7]'
                    }`}
                />
                {error && (
                  <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!email || isLoading || !!error}
                className={`w-full h-10 rounded-lg text-white font-medium transition ${!email || isLoading || !!error
                  ? 'bg-[#A0C3FF]'
                  : 'bg-[#006DE7] hover:bg-[#0050B3] cursor-pointer'
                  }`}
              >
                {isLoading ? t('loginPage.pleaseWait') : t('loginPage.continueWithEmail')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="text-sm text-[#717171] text-center pt-6 pb-4">
      </footer>
    </div>
  );
};

export default LoginPage;
