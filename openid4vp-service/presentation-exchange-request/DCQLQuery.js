const dcqlQuery = {
  "credentials": [
    // {
    //     "id": "mvrc",
    //     "format": "mso_mdoc",
    //     "meta": {
    //         "doctype_value": "org.iso.7367.1.mVRC"
    //     },
    //     "require_cryptographic_holder_binding": true,
    //     "claims": [
    //         {
    //             "path": [
    //                 "org.iso.7367.1",
    //                 "vehicle_holder"
    //             ],
    //             "intent_to_retain": false
    //         },
    //         {
    //             "path": [
    //                 "org.iso.18013.5.1",
    //                 "first_name"
    //             ],
    //             "intent_to_retain": true
    //         }
    //     ],
    //     "trusted_authorities": [
    //         {
    //             "type": "aki",
    //             "values": [
    //                 "one",
    //                 "two"
    //             ]
    //         }
    //     ]
    // }
    // Mock SD_JWT
    // {
    //   "id": "mvrc",
    //   "format": "vc+sd-jwt",
    //   "meta": {},
    //   "require_cryptographic_holder_binding": true,
    //   "claims": [
    //     {
    //       "path": [
    //         "credentialSubject",
    //         "VID"
    //       ],
    //     },
    //     {
    //       "path": [
    //         "credentialSubject",
    //         "dateOfBirth"
    //       ],
    //     }
    //   ]
    // },
    // // Health ID SD_JWT
    // {
    //   "id": "mvrc2",
    //   "format": "vc+sd-jwt",
    //   "meta": {
    //     "vct_values": ["eu.europa.ec.eudi.hiid.1"]
    //   },
    //   "require_cryptographic_holder_binding": false,
    // }
    // ldp_vc
    {
      "id": "insurance_credential",
      "format": "ldp_vc",
      "meta": {
        "type_values": [
          [
            "https://www.w3.org/2018/credentials#VerifiableCredential",
            "https://example.org/examples#AlumniCredential",
            "https://example.org/examples#BachelorDegree"
          ],
          [
            "https://www.w3.org/2018/credentials#VerifiableCredential",
            "https://example.org/examples#UniversityDegreeCredential"
          ],
          [
            "https://www.w3.org/2018/credentials#VerifiableCredential",
            "https://inji.github.io/inji-config/contexts/insurance-context.json#InsuranceCredential"
          ]
        ]
      },
      "require_cryptographic_holder_binding": true,
      // "claims": [
      //   {
      //     "path": [
      //       "credentialSubject",
      //       "policyNumber"
      //     ],
      //   }
      //   ]
    }
  ]
}

module.exports = {
  dcqlQuery
}