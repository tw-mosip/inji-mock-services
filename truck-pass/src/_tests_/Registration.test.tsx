beforeAll(() => {
  (global as any).window = Object.create(window);
  Object.defineProperty(window, '_env_', {
    value: {
      MOCK_RELYING_PARTY_SERVER_URL: 'http://mock-url.test',
    },
    writable: true,
  });
});

import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Registration } from '../pages/driverRegistration/Registration';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18';
import relyingPartyService from '../services/relyingPartyService';
import type { ClassAttributes, HTMLAttributes } from 'react';
import type { JSX } from 'react/jsx-runtime';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../components/ErrorPopup', () => ({
 ErrorPopup: ({ showErrorPopup }: { showErrorPopup: boolean }) =>
    showErrorPopup ? <div data-testid="error-popup" /> : null,
}));

jest.mock('../commans/Stepper', () => ({
  Stepper: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => <div data-testid="stepper" {...props} />,
}));

jest.mock('../components/CertificateUploadSection', () => ({
  CertificateUploadingSection: (props: { setShowUploadingBlock: (arg0: boolean) => void; setFileUploaded: (arg0: boolean) => void; setDataInFile: (arg0: string) => void; }) => (
    <div data-testid="upload-section">
      <button onClick={() => {
        props.setShowUploadingBlock(true);
        props.setFileUploaded(true);
        props.setDataInFile('data:image/png;base64,AAAA');
      }}>Upload</button>
    </div>
  ),
}));

describe('Registration component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('renders personal info form when driver info is in localStorage', () => {
    const driverInfo = {
      name: 'John Doe',
      picture: '',
      gender: 'Male',
      email: 'john@example.com',
      phone_number: '1234',
      address: { locality: 'City' },
    };
    const company = { companyName: 'ABC Corp' };
    localStorage.setItem('driverInformation', JSON.stringify(driverInfo));
    localStorage.setItem('companySelected', JSON.stringify(company));

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Registration />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('registration.personalInformation')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Male')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('City')).toBeInTheDocument();
  });

  test('shows validation error if license format is invalid', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Registration />
        </I18nextProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/DL-/i), { target: { value: 'INVALID' } });
    fireEvent.change(screen.getByPlaceholderText(/Z\d+/i), { target: { value: 'Z123' } });
    fireEvent.click(screen.getByText('commans.submit'));
    expect(screen.getByText(/must include a '-'/)).toBeInTheDocument();
  });

  test('submits form successfully and navigates on positive response', async () => {
    const postSpy = jest.spyOn(relyingPartyService, 'post_driver_registration').mockResolvedValue({});

    const driverInfo = { name: 'A', gender: 'F', email: 'a@b.com', phone_number: '000', picture: 'data:image/png;base64,AAA', address: { locality: 'X' } };
    localStorage.setItem('driverInformation', JSON.stringify(driverInfo));

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Registration />
        </I18nextProvider>
      </BrowserRouter>
    );

    // fill in inputs
    fireEvent.change(screen.getByPlaceholderText(/DL-/i), { target: { value: 'DL-1234' } });
    fireEvent.change(screen.getByPlaceholderText(/Z\d+/i), { target: { value: 'Z999' } });

    // simulate upload
    fireEvent.click(screen.getByText('Upload'));
    fireEvent.click(screen.getByText('commans.submit'));

    // loader shows
    await waitFor(() => expect(screen.getByText('registration.registering')).toBeInTheDocument());

    // after timeout: navigate
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(postSpy).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/driverRegistrationProcessPage/confirmationPagePage');
  });

  test('shows error popup when registration fails', async () => {
    jest.useFakeTimers();
    jest.spyOn(relyingPartyService, 'post_driver_registration').mockRejectedValue({});

    const driverInfo = { name: 'A', gender: 'F', email: 'a@b.com', phone_number: '000', picture: '', address: { locality: 'X' } };
    localStorage.setItem('driverInformation', JSON.stringify(driverInfo));

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Registration />
        </I18nextProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/DL-/i), { target: { value: 'DL-5678' } });
    fireEvent.change(screen.getByPlaceholderText(/Z\d+/i), { target: { value: 'Z777' } });

    fireEvent.click(screen.getByText('Upload'));
    fireEvent.click(screen.getByText('commans.submit'));

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(await screen.findByTestId('error-popup')).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('base64ToFile throws on invalid input', () => {
    const { base64ToFile } = require('../pages/Registration');
    expect(() => base64ToFile('invalid-base64', 'file')).toThrow(/Invalid base64 string format/);
  });

  test('radio option toggles and disables Inji-verify section initially', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Registration />
        </I18nextProvider>
      </BrowserRouter>
    );
    const manualRadio = screen.getByLabelText('registration.manualEntry');
    fireEvent.click(manualRadio);
    expect(manualRadio).toBeChecked();

    const shareRadio = screen.getByLabelText('registration.shareViaInjiVerify');
    expect(shareRadio).toBeDisabled();
  });

  test('share via Inji verify flow shows poweredby icon and share button', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Registration />
        </I18nextProvider>
      </BrowserRouter>
    );
    fireEvent.click(screen.getByLabelText('registration.shareViaInjiVerify'));
    expect(screen.getByText('registration.shareBtn')).toBeInTheDocument();
    expect(screen.getByAltText('poweredBy_logo')).toBeInTheDocument();
    fireEvent.click(screen.getByText('registration.shareBtn'));
    expect(screen.getByText('registration.fetchedSuccessfully')).toBeInTheDocument();
  });
});
