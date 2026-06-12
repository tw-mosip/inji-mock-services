const dcqlQuery = {
  "credentials": [
    {
      "id": "vc-sd-jwt",
      "format": "dc+sd-jwt", // This is the format for SD-JWT - vc+sd-jwt / dc+sd-jwt
      "meta": {},
      "require_cryptographic_holder_binding": false,
      "multiple": true
    },
    {
      "id": "dc-sd-jwt",
      "format": "dc+sd-jwt", // This is the format for SD-JWT - vc+sd-jwt / dc+sd-jwt
      "meta": {},
      "require_cryptographic_holder_binding": false,
      "multiple": true
    },
    {
      "id": "vehicle-registration_mso_mdoc",
      "format": "mso_mdoc",
      "meta": {
        "doctype_value": "org.iso.18013.5.1.mDL"
      },
      "require_cryptographic_holder_binding": true,
      "claims": [
        {
          "path": [
            "given_name"
          ],
          "intent_to_retain": false
        }
      ]
    },
    {
      "id": "health-id",
      "format": "vc+sd-jwt",
      "multiple": true,
      "meta": {
      },
      "require_cryptographic_holder_binding": false,
      "claims": [
        {
          "path": ["health_insurance_id"]
        },
        {
          "path": ["wallet_e_prescription_code"]
        }
      ]
    },
    {
      "id": "driving-license",
      "format": "vc+sd-jwt",
      "meta": {
        "vct_values": ["https://example.eudi.ec.europa.eu/mdl/1"]
      },
      "require_cryptographic_holder_binding": false,
      "claims": [
        {
          "path": ["document_number"]
        },
        {
          "path": ["driving_privileges"]
        }, {
          "path": ["age_over_18"]
        }
      ]
    },
    {
      "id": "age-proof-18",
      "format": "vc+sd-jwt",
      "meta": {
      },
      "multiple": false,
      "require_cryptographic_holder_binding": false,
      "claims": [
        {
          "id": "age-18-proof",
          "path": ["age_over_18"]
        }
      ],
      "claim_sets": [
        ["age-18-proof"]
      ]
    },
    {
      "id": "age-proof-21",
      "format": "vc+sd-jwt",
      "meta": {
      },
      "multiple": false,
      "require_cryptographic_holder_binding": false,
      "claims": [
        {
          "id": "age-21-proof",
          "path": ["age_over_21"]
        }
      ],
      "claim_sets": [
        ["age-21-proof"],
      ]
    },
    {
      /**
       *   address: {
    city: "Bengaluru",
    country: {
      name: "India",
      postalCode: "560001"
    }
  },
  degrees: [
    { type: "B.Tech", university: "IIT" },
    { type: "M.S.", university: "NUS" }
  ]
       */
      "id": "employee-sd_jwt",
      "format": "vc+sd-jwt",
      "meta": {
      },
      "require_cryptographic_holder_binding": false,
      "claims": [
        {
          "path": ["address", "city"]
        },
        // {
        //   "path": ["address", 0, "city"]
        // },
        {
          "path": ["degrees", 0, "type"]
        }
      ]
    },
    /**
     * selected disclosure - path to disclosure - match
     * 
     * address.city.name  - adress.city
     *                    - address.city.name  
     *                    - address
     * 
     * degrees[0].type - degrees.0.type
     *                 - degrees
     * 
     * degrees[*].type - degrees.0.type and degrees.1.type (degrees[*].type means all the items in the array, so it can match with any of the items in the array)
     *                 - degrees
     *                 - degrees.0
     * 
     */
    {
      "id": "tax-id",
      "format": "vc+sd-jwt",
      "meta": {
        "vct_values": ["https://example.eudi.ec.europa.eu/tax-id/1"]
      },
      "require_cryptographic_holder_binding": false,
      "claims": [
        {
          "path": ["tax_number"]
        },
        {
          "path": ["issuing_authority"],
          "values": ["DE"]
        }
      ]
    },
    {
      "id": "msisdn",
      "format": "vc+sd-jwt",
      "meta": {
      },
      "require_cryptographic_holder_binding": true,
      "claims": [
        {
          "path": ["mobile_operator"]
        },
        {
          "path": ["registered_family_name"]
        },
        {
          "path": ["issuing_organization"],
          "values": ["DE", "TelOrg"]
        }
      ]
    },
    {
      "id": "land",
      "format": "ldp_vc",
      "meta": {},
      "require_cryptographic_holder_binding": true,
      "multiple": false,
      "claims": [
        {
          "path": [
            "credentialSubject",
            "HolderName"
          ],
        },
        {
          "path": [
            "credentialSubject",
            "RuralPropertyName"
          ],
        }
      ]
    },
    {
      "id": "national-id",
      "format": "ldp_vc",
      "meta": {
        "type_values": [
          [
            "https://www.w3.org/2018/credentials#VerifiableCredential",
            "https://inji.github.io/inji-config/contexts/mosip-identity-context.json#MOSIPVerifiableCredential"
          ]
        ]
        // Meta can be empty as well if there are no specific requirements for the type values
        // "type_values": [
        //   [
        //     "https://www.w3.org/2018/credentials#VerifiableCredential",
        //     "https://holashchand.github.io/test_project/insurance-context.json#InsuranceCredential"
        //   ]
        // ]
        // This type values hold the expanded @type values for the credential
        // To Modify this meta use this - https://json-ld.org/playground/ to expand the credential
        // From the expanded credential, take the @type values and add them as an array in type_values in meta
      },
      "require_cryptographic_holder_binding": true,
      "multiple": false,
      // If no claim matching is required, remove this entire claim object - don't leave it empty, remove it entirely
      "claims": [
        // reference https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-claims-path-pointer-example
        {
          "path": [
            "credentialSubject", // UIN
            "UIN"
          ],
        },
        {
          "path": [
            "credentialSubject",
            "fullName"
          ],
        }
      ]
    }
  ],
  "credential_sets": [
    {
      "options": [
        ["age-proof-18"], // age over 18 proof
        ["age-proof-21"], // age over 21 proof
      ],
      "required": true
    },
    {
      "options": [
        ["tax-id"], // hid, dl
        ["msisdn", "national-id"], // hid, dl
      ],
      "required": true
    },
    // {
    //   "options": [
    //     ["vehicle-registration_mso_mdoc"], // wallet does not have this
    //     ["tax-id"], // tax id
    //     ["driving-license"],
    //     ["land", "age-proof-18"]
    //   ],
    //   "required": false
    // },
    {
      "options": [
        ["tax-id"], // tax id

      ],
      "required": false
    },
    // {
    //   "options": [
    //     ["msisdn"] // msisdn
    //   ],
    //   "required": false
    // },
    // {
    //   "options": [
    //     ["health-id"] // hid
    //   ],
    //   "required": true
    // },
    {
      "options": [
        ["employee-sd_jwt"]
      ],
      "required": false
    }
  ]
}

module.exports = {
  dcqlQuery
}