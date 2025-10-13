import { render, fireEvent, screen, act } from '@testing-library/react';
import { CertificateUploadingSection } from '../components/CertificateUploadSection';

jest.useFakeTimers();

const mockSetShowUploadingBlock = jest.fn();
const mockSetFileUploaded = jest.fn();
const mockSetDataInFile = jest.fn();
const mockSetCpcUploadErrorMsg = jest.fn();

const setup = (props = {}) =>
  render(
    <CertificateUploadingSection
      showUploadingBlock={false}
      setShowUploadingBlock={mockSetShowUploadingBlock}
      setFileUploaded={mockSetFileUploaded}
      setDataInFile={mockSetDataInFile}
      clickableText={'Browse'}
      fileUploadErrorMsg=""
      setFileUploadErrorMsg={mockSetCpcUploadErrorMsg}
      {...props}
    />
  );

// Mocks FileReader
class MockFileReader {
  onload: ((e: any) => void) | null = null;
  readAsDataURL = jest.fn(function () {
    if (this.onload) {
      this.onload({ target: { result: 'mock-file-data' } });
    }
  });
}
(global as any).FileReader = MockFileReader;

describe('CertificateUploadingSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial UI correctly', () => {
    setup();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('browse-link')).toBeInTheDocument();
  });

  test('triggers file input on icon click', () => {
    setup();
    const input = screen.getByTestId('file-input');
    const clickSpy = jest.spyOn(input, 'click');
    fireEvent.click(screen.getByAltText('upload icon'));
    expect(clickSpy).toHaveBeenCalled();
  });

  test('accepts valid file type and shows upload progress', async () => {
    const file = new File(['dummy content'], 'certificate.pdf', { type: 'application/pdf' });

    setup();

    const input = screen.getByTestId('file-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(mockSetShowUploadingBlock).toHaveBeenCalledWith(true);
    expect(mockSetDataInFile).toHaveBeenCalledWith('mock-file-data');

    // simulate timer intervals
    await act(async () => {
      jest.runAllTimers();
    });

    expect(mockSetFileUploaded).toHaveBeenCalledWith(true);
  });

  test('rejects invalid file type and shows error', async () => {
    const file = new File(['invalid'], 'invalid.exe', { type: 'application/x-msdownload' });

    setup();

    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockSetCpcUploadErrorMsg).toHaveBeenCalledWith('errors.uploadingCertificateErr');
  });

  test('displays uploading progress UI', () => {
    setup({ showUploadingBlock: true });
    expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
  });

  test('displays error block when cpcUploadErrorMsg is present', () => {
    setup({ showUploadingBlock: true, cpcUploadErrorMsg: 'Upload failed' });
    expect(screen.getByTestId('upload-error')).toBeInTheDocument();
  });

  test('clicking cancelUpload resets all states', () => {
    setup({ showUploadingBlock: true });

    fireEvent.click(screen.getAllByAltText('trash icon')[0]);

    expect(mockSetFileUploaded).toHaveBeenCalledWith(false);
    expect(mockSetShowUploadingBlock).toHaveBeenCalledWith(false);
    expect(mockSetCpcUploadErrorMsg).toHaveBeenCalledWith('');
    expect(mockSetDataInFile).toHaveBeenCalledWith(null);
  });

  test('clicking change file resets states', () => {
    setup({ showUploadingBlock: true });

    fireEvent.click(screen.getByTestId('change-file-button'));

    expect(mockSetShowUploadingBlock).toHaveBeenCalledWith(false);
    expect(mockSetFileUploaded).toHaveBeenCalledWith(false);
    expect(mockSetDataInFile).toHaveBeenCalledWith(null);
    expect(mockSetCpcUploadErrorMsg).toHaveBeenCalledWith('');
  });
});
