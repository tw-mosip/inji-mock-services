const  dcqlQuery = {
    "credentials": [
        {
            "id": "mvrc",
            "format": "mso_mdoc",
            "meta": {
                "doctype_value": "org.iso.7367.1.mVRC"
            },
            "require_cryptographic_holder_binding": true,
            "claims": [
                {
                    "path": [
                        "org.iso.7367.1",
                        "vehicle_holder"
                    ],
                    "intent_to_retain": false
                },
                {
                    "path": [
                        "org.iso.18013.5.1",
                        "first_name"
                    ],
                    "intent_to_retain": true
                }
            ],
            "trusted_authorities": [
                {
                    "type": "aki",
                    "values": [
                        "one",
                        "two"
                    ]
                }
            ]
        }
    ]
}

module.exports = {
    dcqlQuery
}