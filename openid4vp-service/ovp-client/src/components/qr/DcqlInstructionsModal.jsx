import React from 'react';
import PropTypes from 'prop-types';
import OverlayModal from '../common/OverlayModal';
import Button from '../common/Button';
import { Code } from '../common/Code';

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

const metaInstructions = [
    {
        format: "ldp_vc",
        valueName: "typeValues",
        example: {
            "type_values": [[
                "https://www.w3.org/2018/credentials#VerifiableCredential",
                "https://example.org/examples#AlumniCredential",
                "https://example.org/examples#BachelorDegree"
            ]
            ]
        },
        notes: [
            "You can use https://json-ld.org/playground/ to extract the absolute type values",
            "Paste the credential (or JSON with just the 'type' and '@context' of the credential) in the JSON LD playrgound and take the '@type' property's value"
        ]
    }, {
        format: "vc+dc-jwt / vc+sd-jwt",
        valueName: "vct_values",
        example: {
            "vct_values": [
                "mdl"
            ]
        },
        notes: ["vct in sd_jwt"]
    }, {
        format: "mso_mdoc",
        valueName: "doctype_value",
        example: {
            "doctype_value": "org.iso.7367.1.mVRC"
        },
        notes: ["mdoc's docType"]
    },
]
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

                <h4>Notes</h4>
                <h5>Meta in DCQL query</h5>
                <p>This helps to filter based on the metadata of the credential</p>
                <a href='https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-6.1-3.8' target='_blank' >Spec reference</a>
                <ul>
                    {
                        metaInstructions.map(({format, valueName, example, notes }) => {
                            return (
                                <li>
                                    <p>{format}: {valueName}</p>
                                    <p>Example: </p>
                                    <Code value={JSON.stringify(example)} />
                                    <br/>
                                    <div>
                                        Notes:  {
                                            <ol>
                                                {
                                                    notes.map((note) => <li>{note}</li>)
                                                }
                                            </ol>
                                        }
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </OverlayModal>
    );
}

DcqlInstructionsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
