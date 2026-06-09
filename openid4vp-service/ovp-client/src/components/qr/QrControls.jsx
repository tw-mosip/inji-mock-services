import React from 'react';
import PropTypes from 'prop-types';
import Toggle from '../common/Toggle';
import Dropdown from '../common/Dropdown';
import CheckBox from '../common/checkBox';
import Button from '../common/Button';
import { REQUEST_MODES, RESPONSE_MODES, DRAFT_VERSIONS } from '../../constants/constants';

export default function QrControls({
    isByValue,
    isByReference,
    selectedDraft,
    selectedResponseMode,
    isRequestSigned,
    onRequestModeChange,
    onDraftVersionChange,
    onResponseModeChange,
    onSignedChange,
    onOpenPresentationDetails,
}) {
    const requestModeOptions = [
        { name: "By Value", selected: isByValue, onChange: () => onRequestModeChange(REQUEST_MODES.BY_VALUE) },
        { name: "By Reference", selected: isByReference, onChange: () => onRequestModeChange(REQUEST_MODES.BY_REFERENCE) },
    ];

    const draftOptions = Object.values(DRAFT_VERSIONS).map((v) => ({
        name: v,
        selected: selectedDraft === v,
        onChange: () => onDraftVersionChange(v),
    }));

    const responseModeOptions = Object.values(RESPONSE_MODES).map((m) => ({
        name: m,
        selected: selectedResponseMode === m,
        onChange: () => onResponseModeChange(m),
    }));

    return (
        <div style={{ paddingBottom: 20 }}>
            <Toggle options={requestModeOptions} />
            <Dropdown label={"OpenID4VP Draft Version:"} options={draftOptions} />
            <Dropdown label={"Response Mode:"} options={responseModeOptions} />
            {isByValue && (
                <CheckBox
                    onClick={onSignedChange}
                    checked={isRequestSigned}
                    label={"Sign the request"}
                    id={"signed"}
                />
            )}
            <Button onClick={onOpenPresentationDetails} variant={"secondary"} style={{ marginTop: 10 }}>
                Edit Presentation Request Details
            </Button>
        </div>
    );
}

QrControls.propTypes = {
    isByValue: PropTypes.bool.isRequired,
    isByReference: PropTypes.bool.isRequired,
    selectedDraft: PropTypes.string.isRequired,
    selectedResponseMode: PropTypes.string.isRequired,
    isRequestSigned: PropTypes.bool.isRequired,
    onRequestModeChange: PropTypes.func.isRequired,
    onDraftVersionChange: PropTypes.func.isRequired,
    onResponseModeChange: PropTypes.func.isRequired,
    onSignedChange: PropTypes.func.isRequired,
    onOpenPresentationDetails: PropTypes.func.isRequired,
};
