import React from 'react';
import PropTypes from 'prop-types';
import OverlayModal from '../common/OverlayModal';
import Button from '../common/Button';

const INSTRUCTIONS = [
    {
        heading: null,
        body: "Use the DCQL Query editor to define which credentials the verifier requests. You can start from a preset or build a query from scratch using form mode or JSON mode.",
    },
    {
        heading: null,
        body: "Each credential entry requires a unique id, a format (e.g. vc+sd-jwt, ldp_vc), and optional meta, claims, and holder binding settings.",
    },
    {
        heading: null,
        body: "Click Submit to apply your query and regenerate the QR code. Cancel discards any unsaved edits.",
    },
];

const QUICK_TIPS = [
    "Pick a preset (Land, National ID, Minimal) to pre-fill the query and adjust as needed.",
    "Use credential_sets to express OR-logic between credential groups (e.g. accept either a national-id or an sd-jwt).",
    "Enable 'Allow invalid request' to send malformed queries for negative testing — the JSON editor will stay open.",
];

export default function DcqlInstructionsModal({ isOpen, onClose }) {
    return (
        <OverlayModal
            isOpen={isOpen}
            onClose={onClose}
            width={'min(760px, 94vw)'}
            maxHeight={'82vh'}
            zIndex={10000}
        >
            <div style={{ padding: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>DCQL Editor Instructions</h3>
                    <Button variant={"tertiary"} onClick={onClose}>Close</Button>
                </div>

                {INSTRUCTIONS.map((item, i) => (
                    <p key={i}>{item.body}</p>
                ))}

                <h4 style={{ marginBottom: 8 }}>Quick Tips</h4>
                <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                    {QUICK_TIPS.map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            </div>
        </OverlayModal>
    );
}

DcqlInstructionsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
