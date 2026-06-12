import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {INJIWEB_URL} from '../constants/mockui-constants';
import {Loader} from '../components/common/Loader';
import {Palette, font, spacing} from '../styles/palette';
import {DRAFT_VERSIONS, REQUEST_MODES, RESPONSE_MODES} from '../constants/constants';
import {ScanResult} from '../components/scan/ScanResult';
import Error from '../components/common/Error';
import QrScreenHeader from '../components/qr/QrScreenHeader';
import QrControls from '../components/qr/QrControls';
import PresentationRequestModal from '../components/qr/PresentationRequestModal';
import QrCodeDisplay, {QrCodeCard, QrDataSections} from '../components/qr/QrCodeDisplay';
import {useQrFetch} from '../hooks/useQrFetch';
import {usePresentationRequest} from '../hooks/usePresentationRequest';
import {downloadDebugDetails} from '../utility/debugDetails';
import {isMobileLayout} from '../utility/util';

const getPageStyles = () => {
    const isMobile = isMobileLayout();
    return {
        page: {
            minHeight: '100vh',
            background: Palette.appBackground,
            fontFamily: font.primary,
            color: Palette.headingText,
            minWidth: '100vw',
        },
        content: {
            maxWidth: isMobile ? '100%' : '85%',
            margin: '0 auto',
            padding: isMobile
                ? `${spacing.xl}px ${spacing.lg}px`
                : `${spacing.xxxl}px ${spacing.xxl}px`,
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
            columnGap: isMobile ? undefined : '2%',
            rowGap: isMobile ? spacing.lg : spacing.xl,
            gap: isMobile ? spacing.lg : spacing.xl,
            boxSizing: 'border-box',
        },
        leftColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xl,
            minWidth: 0,
        },
        errorContent: {
            maxWidth: 1152,
            margin: '0 auto',
            padding: `${spacing.xxxl}px ${spacing.xxl}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xl,
        },
    };
};

const QrScreen = () => {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [, setLayoutTick] = useState(0);

    const [isByValue, setIsByValue] = useState(true);
    const [isByReference, setIsByReference] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState(Object.values(DRAFT_VERSIONS)[0]);
    const [selectedResponseMode, setSelectedResponseMode] = useState(Object.values(RESPONSE_MODES)[0]);
    const [isRequestSigned, setIsRequestSigned] = useState(false);

    const selectedDraftIsV10 = selectedDraft === DRAFT_VERSIONS.V_1_0;

    const {
        qrData, qrSize, qrCodeData, inputData, actualAuthorizationRequestObject, errorMessage,
        fetchQrCodeData, resetValues,
    } = useQrFetch();

    const doFetch = useCallback((dcqlQueryOverride, presentationDefinitionOverride) =>
        fetchQrCodeData(
            state.name,
            isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE,
            selectedDraft,
            isRequestSigned,
            selectedResponseMode,
            dcqlQueryOverride,
            presentationDefinitionOverride,
        ),
    [fetchQrCodeData, state, isByValue, selectedDraft, isRequestSigned, selectedResponseMode]);

    const presentationRequest = usePresentationRequest({selectedDraftIsV10, onFetch: doFetch});

    useEffect(() => {
        const dcqlQueryOverride = presentationRequest.getDcqlQueryOverride();
        const presentationDefinitionOverride = presentationRequest.getPresentationDefinitionOverride();
        if (dcqlQueryOverride === null) return;
        void doFetch(dcqlQueryOverride, presentationDefinitionOverride);
    }, [state, isByValue, isByReference, selectedDraft, fetchQrCodeData, isRequestSigned, selectedResponseMode]);

    useEffect(() => {
        document.title = 'Scan';
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleResize = () => setLayoutTick((tick) => tick + 1);
        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    const handleRequestModeChange = async (mode) => {
        if ((mode === REQUEST_MODES.BY_VALUE && isByValue) || (mode === REQUEST_MODES.BY_REFERENCE && isByReference)) return;
        setIsByValue(mode === REQUEST_MODES.BY_VALUE);
        setIsByReference(mode === REQUEST_MODES.BY_REFERENCE);
        resetValues();
        const dcqlQueryOverride = presentationRequest.getDcqlQueryOverride();
        if (dcqlQueryOverride === null) return;
        await fetchQrCodeData(state.name, mode, selectedDraft, isRequestSigned, selectedResponseMode, dcqlQueryOverride);
    };

    const handleDraftVersionChange = async (version) => {
        if (version === selectedDraft) return;
        setSelectedDraft(version);
        resetValues();
        const dcqlQueryOverride = (version === DRAFT_VERSIONS.V_1_0 && presentationRequest.hasSubmittedDcqlQuery)
            ? presentationRequest.getDcqlQueryOverride()
            : undefined;
        if (dcqlQueryOverride === null) return;
        await fetchQrCodeData(state.name, isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE, version, isRequestSigned, selectedResponseMode, dcqlQueryOverride);
    };

    const handleResponseModeChange = (mode) => {
        if (mode === selectedResponseMode) return;
        setSelectedResponseMode(mode);
        resetValues();
    };

    const handleOpenInjiWeb = () => {
        const strippedRequest = qrData.split('?')[1] || '';
        window.open(`${INJIWEB_URL}?${strippedRequest}`, '_blank');
    };

    const subtitle = `${state?.name || 'QR Code Image'} · ${selectedDraft}`;
    const styles = getPageStyles();

    const controls = (
        <QrControls
            isByValue={isByValue}
            isByReference={isByReference}
            selectedDraft={selectedDraft}
            selectedResponseMode={selectedResponseMode}
            isRequestSigned={isRequestSigned}
            onRequestModeChange={handleRequestModeChange}
            onDraftVersionChange={handleDraftVersionChange}
            onResponseModeChange={handleResponseModeChange}
            onSignedChange={(isChecked) => setIsRequestSigned(isChecked)}
            onOpenPresentationDetails={presentationRequest.openPresentationRequestDetails}
        />
    );

    const presentationRequestModal = (
        <PresentationRequestModal
            isOpen={presentationRequest.showPresentationRequestDetails}
            onClose={presentationRequest.closePresentationRequestDetails}
            onSubmit={presentationRequest.submitPresentationRequestDetails}
            draftDcqlQueryValue={presentationRequest.draftDcqlQueryValue}
            onDcqlQueryChange={presentationRequest.handleDcqlQueryChange}
            draftPresentationDefinitionValue={presentationRequest.draftPresentationDefinitionValue}
            onPresentationDefinitionChange={presentationRequest.handlePresentationDefinitionChange}
            selectedDraftIsV10={selectedDraftIsV10}
            allowInvalidRequest={presentationRequest.allowInvalidDcqlRequest}
            onAllowInvalidRequestChange={presentationRequest.setAllowInvalidDcqlRequest}
        />
    );

    if (errorMessage) {
        return (
            <div style={styles.page}>
                <QrScreenHeader subtitle={subtitle} onBack={() => navigate('/')}/>
                <div style={styles.errorContent}>
                    {controls}
                    <Error message={errorMessage}/>
                </div>
                {presentationRequestModal}
            </div>
        );
    }

    if (!(qrData && qrCodeData)) {
        return (
            <div style={styles.page}>
                <QrScreenHeader subtitle={subtitle} onBack={() => navigate('/')}/>
                <Loader>Loading...</Loader>
            </div>
        );
    }

    const qrDisplayProps = {
        qrData,
        qrCodeData,
        inputData,
        actualAuthorizationRequestObject,
        isRequestSigned,
        qrSize,

        onDownloadDebugDetails: () => downloadDebugDetails(qrData, qrCodeData, inputData, actualAuthorizationRequestObject),
        onOpenInjiWeb: handleOpenInjiWeb,
    };

    const isMobile = isMobileLayout();

    return (
        <div style={styles.page}>
            <QrScreenHeader subtitle={subtitle} onBack={() => navigate('/')}/>
            <div style={styles.content}>
                <div style={styles.leftColumn}>
                    {controls}
                    {isMobile ? (
                        <QrCodeCard {...qrDisplayProps}/>
                    ) : (
                        <QrCodeDisplay {...qrDisplayProps}/>
                    )}
                </div>
                <ScanResult/>
                {isMobile && (
                    <QrDataSections
                        qrData={qrData}
                        inputData={inputData}
                        actualAuthorizationRequestObject={actualAuthorizationRequestObject}
                    />
                )}
            </div>
            {presentationRequestModal}
        </div>
    );
};

export default QrScreen;
