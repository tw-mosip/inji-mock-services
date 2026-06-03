const fullPreset = {
  credentials: [
    {
      id: "sd-jwt",
      format: "vc+sd-jwt",
      meta: {},
      require_cryptographic_holder_binding: false,
      multiple: true
    },
    {
      id: "national-id",
      format: "ldp_vc",
      meta: {
        type_values: [
          [
            "https://www.w3.org/2018/credentials#VerifiableCredential",
            "https://inji.github.io/inji-config/contexts/mosip-identity-context.json#MOSIPVerifiableCredential"
          ]
        ]
      },
      require_cryptographic_holder_binding: true,
      multiple: false,
      claims: [
        {
          path: ["credentialSubject", "UIN"],
        },
        {
          path: ["credentialSubject", "fullName"],
        },
      ],
    }
  ],
  credential_sets: [
    {
      options: [["sd-jwt"], ["national-id"]],
      required: true
    }
  ]
};

const minimalPreset = {
  credentials: [
    {
      id: "sample-credential",
      format: "vc+sd-jwt",
      meta: {},
      require_cryptographic_holder_binding: false
    }
  ],
  credential_sets: []
};

const landPreset = {
  credentials: [
    {
      id: "land",
      format: "ldp_vc",
      meta: {},
      require_cryptographic_holder_binding: true,
      multiple: false,
      claims: [
        {
          path: ["credentialSubject", "HolderName"],
        },
        {
          path: ["credentialSubject", "RuralPropertyName"],
        },
      ],
    },
  ],
  credential_sets: [
    {
      options: [["land"]],
      required: true,
    },
  ],
};

const nationalIdPreset = {
  credentials: [
    {
      id: "national-id",
      format: "ldp_vc",
      meta: {
        type_values: [
          [
            "https://www.w3.org/2018/credentials#VerifiableCredential",
            "https://inji.github.io/inji-config/contexts/mosip-identity-context.json#MOSIPVerifiableCredential",
          ],
        ],
      },
      require_cryptographic_holder_binding: true,
      multiple: false,
      claims: [
        {
          path: ["credentialSubject", "UIN"],
        },
        {
          path: ["credentialSubject", "fullName"],
        },
      ],
    },
  ],
  credential_sets: [
    {
      options: [["national-id"]],
      required: true,
    },
  ],
};

const emptyPreset = {
  credentials: [],
  credential_sets: []
};

export const DCQL_PRESETS = [
  { name: "Land", value: "land", query: landPreset },
  { name: "National ID", value: "national-id", query: nationalIdPreset },
  { name: "Minimal Starter", value: "minimal", query: minimalPreset },
];

export const DCQL_FORMAT_OPTIONS = ["vc+sd-jwt", "dc+sd-jwt", "mso_mdoc", "ldp_vc"];
