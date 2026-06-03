import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OverlayModal from '../common/OverlayModal';
import Button from '../common/Button';
import DcqlQueryEditor from '../DcqlQueryEditor';
import DcqlInstructionsModal from './DcqlInstructionsModal';
import { Palette } from '../../styles/palette';

export default function PresentationRequestModal({
    isOpen,
    onClose,
    onSubmit,
    draftDcqlQueryValue,
    onDcqlQueryChange,
    selectedDraftIsV10,
    allowInvalidRequest,
    onAllowInvalidRequestChange,
}) {
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <OverlayModal
            isOpen={isOpen}
            onClose={onClose}
            width={'min(1100px, 96vw)'}
            maxHeight={'90vh'}
            zIndex={9999}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Presentation Request Details (DCQL Query)</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                    <Button variant={"tertiary"} onClick={onClose}>Close</Button>
                </div>
            </div>

            <DcqlQueryEditor
                value={draftDcqlQueryValue}
                disabled={!selectedDraftIsV10}
                onEdited={() => {}}
                allowInvalidRequest={allowInvalidRequest}
                onAllowInvalidRequestChange={onAllowInvalidRequestChange}
                onChange={onDcqlQueryChange}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <Button variant={"tertiary"} onClick={onClose}>Cancel</Button>
                <Button
                    variant={"primary"}
                    onClick={onSubmit}
                    style={{ opacity: selectedDraftIsV10 ? 1 : 0.6 }}
                >
                    Submit
                </Button>
            </div>

            <DcqlInstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
            />
        </OverlayModal>
    );
}

PresentationRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    draftDcqlQueryValue: PropTypes.object.isRequired,
    onDcqlQueryChange: PropTypes.func.isRequired,
    selectedDraftIsV10: PropTypes.bool.isRequired,
    allowInvalidRequest: PropTypes.bool.isRequired,
    onAllowInvalidRequestChange: PropTypes.func.isRequired,
};
