import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OverlayModal from '../common/OverlayModal';
import Button from '../common/Button';
import DcqlQueryEditor from '../DcqlQueryEditor';
import PresentationDefinitionEditor from '../PresentationDefinitionEditor';
import DcqlInstructionsModal from './DcqlInstructionsModal';
import { Palette } from '../../styles/palette';

export default function PresentationRequestModal({
    isOpen,
    onClose,
    onSubmit,
    draftDcqlQueryValue,
    onDcqlQueryChange,
    draftPresentationDefinitionValue,
    onPresentationDefinitionChange,
    selectedDraftIsV10,
    allowInvalidRequest,
    onAllowInvalidRequestChange,
}) {
    const [showInstructions, setShowInstructions] = useState(false);

    const isV10 = selectedDraftIsV10;
    const title = isV10 
        ? "Presentation Request Details (DCQL Query)" 
        : "Presentation Request Details (Presentation Definition)";

    return (
        <OverlayModal
            isOpen={isOpen}
            onClose={onClose}
            width={'min(1100px, 96vw)'}
            maxHeight={'90vh'}
            zIndex={9999}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isV10 && (
                        <button
                            onClick={() => setShowInstructions(true)}
                            aria-label={"Open DCQL instructions"}
                            title={"Open instructions"}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                border: `1px solid ${Palette.primary}`,
                                background: Palette.surface,
                                color: Palette.primary,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            i
                        </button>
                    )}
                    <Button variant={"tertiary"} onClick={onClose}>Close</Button>
                </div>
            </div>

            {isV10 ? (
                <DcqlQueryEditor
                    value={draftDcqlQueryValue}
                    disabled={false}
                    onEdited={() => {}}
                    allowInvalidRequest={allowInvalidRequest}
                    onAllowInvalidRequestChange={onAllowInvalidRequestChange}
                    onChange={onDcqlQueryChange}
                />
            ) : (
                <PresentationDefinitionEditor
                    value={draftPresentationDefinitionValue}
                    disabled={false}
                    onEdited={() => {}}
                    onChange={onPresentationDefinitionChange}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <Button variant={"tertiary"} onClick={onClose}>Cancel</Button>
                <Button
                    variant={"primary"}
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            </div>

            {isV10 && (
                <DcqlInstructionsModal
                    isOpen={showInstructions}
                    onClose={() => setShowInstructions(false)}
                />
            )}
        </OverlayModal>
    );
}

PresentationRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    draftDcqlQueryValue: PropTypes.object,
    onDcqlQueryChange: PropTypes.func.isRequired,
    draftPresentationDefinitionValue: PropTypes.object,
    onPresentationDefinitionChange: PropTypes.func.isRequired,
    selectedDraftIsV10: PropTypes.bool.isRequired,
    allowInvalidRequest: PropTypes.bool,
    onAllowInvalidRequestChange: PropTypes.func,
};
