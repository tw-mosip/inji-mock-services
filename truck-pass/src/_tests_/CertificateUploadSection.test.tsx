import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CertificateUploadSection from '../components/CertificateUploadSection';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, 
  }),
}));

describe('CertificateUploadSection', () => {
  const defaultProps = {
    showUploadingBlock: false,
    setShowUploadingBlock: jest.fn(),
    setFileUploaded: jest.fn(),
    errorMsg: '',
    setErrorMsg: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mockFileReader = {
      readAsText: jest.fn().mockImplementation((file) => {
        if (mockFileReader.onload) {
          setTimeout(() => mockFileReader.onload(new ProgressEvent('load')), 0);
        }
      }),
      onload: null,
      result: 'mocked-text-data',
    };
    global.FileReader = jest.fn(() => mockFileReader);
  });

  afterEach(() => {
    delete global.FileReader;
  });

  // Checks if the upload screen shows up correctly when the page loads
  test('renders initial upload UI', () => {
    render(
      <MemoryRouter>
        <CertificateUploadSection {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByAltText('upload cloud icon')).toBeInTheDocument();
    expect(screen.getByText(/certificationUploadSec\.clickToBrowse/i)).toBeInTheDocument();
    expect(screen.getByText(/certificationUploadSec\.uploadCertificateInfo/i)).toBeInTheDocument();
  });

  // Tests if uploading a valid file (like a PDF) works and shows progress
  test('handles valid file upload and simulates progress', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadSection {...defaultProps} />
      </MemoryRouter>
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-upload-input');
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(true);
    }, { timeout: 500 });

    await waitFor(() => {
      const uploadBlock = screen.getByRole('region', { name: /upload block/i });
      expect(uploadBlock).toBeInTheDocument();
      expect(uploadBlock.textContent).toMatch(/test\.pdf/);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(screen.getByText(/100%/i)).toBeInTheDocument();
      expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(true);
    }, { timeout: 5000 });
  });

  // Checks if an error shows up when uploading an unsupported file type (like a JPG)
  test('shows error for unsupported file type', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadSection {...defaultProps} />
      </MemoryRouter>
    );

    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('file-upload-input');
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(defaultProps.setErrorMsg).toHaveBeenCalledWith('upload.error.unsupportedFileType');
    }, { timeout: 500 });

    await waitFor(() => {
      const errorBlock = screen.getByRole('region', { name: /error block/i });
      expect(errorBlock).toBeInTheDocument();
      expect(errorBlock.textContent).toMatch(/certificationUploadSec\.failed/);
    }, { timeout: 4000 });
  });

  // Tests if an error appears when the file size is too big
  test('shows error for file size exceeding limit', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadSection {...defaultProps} />
      </MemoryRouter>
    );

    const largeData = 'x'.repeat(6 * 1024 * 1024); 
    const file = new File([largeData], 'large.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-upload-input');
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(defaultProps.setErrorMsg).toHaveBeenCalledWith('upload.error.fileSizeExceeded');
    }, { timeout: 500 });

    await waitFor(() => {
      const errorBlock = screen.getByRole('region', { name: /error block/i });
      expect(errorBlock).toBeInTheDocument();
      expect(errorBlock.textContent).toMatch(/certificationUploadSec\.failed/);
    }, { timeout: 4000 });
  });

  // Checks if canceling an upload removes the file and resets everything
  test('cancels upload and resets state', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadSection {...defaultProps} />
      </MemoryRouter>
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-upload-input');
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      const uploadBlock = screen.getByRole('region', { name: /upload block/i });
      expect(uploadBlock).toBeInTheDocument();
      expect(uploadBlock.textContent).toMatch(/test\.pdf/);
    }, { timeout: 5000 });

    const trashIcon = screen.getByAltText('trash icon');
    await act(async () => {
      fireEvent.click(trashIcon);
    });

    await waitFor(() => {
      expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(false);
      expect(screen.queryByText('test.pdf')).toBeNull();
      expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(false);
    }, { timeout: 1000 });
  });

  // Tests if changing a file resets the upload state and opens the file picker
  test('changes file and resets state', async () => {
    render(
      <MemoryRouter>
        <CertificateUploadSection {...defaultProps} showUploadingBlock={true} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const changeButton = screen.getByText(/certificationUploadSec\.changeFile/i);
      expect(changeButton).toBeInTheDocument();
    }, { timeout: 500 });

    const changeButton = screen.getByText(/certificationUploadSec\.changeFile/i);
    const fileInput = screen.getByTestId('file-upload-input');
    const clickSpy = jest.spyOn(fileInput, 'click');

    await act(async () => {
      fireEvent.click(changeButton);
    });

    await waitFor(() => {
      expect(defaultProps.setShowUploadingBlock).toHaveBeenCalledWith(false);
      expect(screen.queryByText(/test\.pdf/i)).toBeNull();
      expect(defaultProps.setFileUploaded).toHaveBeenCalledWith(false);
      expect(clickSpy).toHaveBeenCalled(); 
    }, { timeout: 2000 });
  });
});