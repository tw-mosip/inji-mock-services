export const STATIC_LDP_VC = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://piyush7034.github.io/my-files/farmer.json",
  ],
  issuer: "did:web:vharsh.github.io:DID:local",
  type: ["VerifiableCredential", "FarmerCredential"],
  issuanceDate: "2025-01-02T05:16:46.176Z",
  expirationDate: "2027-01-02T05:16:46.176Z",
  credentialSubject: {
    fullName: "Mary Smith",
    mobileNumber: "8765432109",
    dateOfBirth: "1975-08-22",
    landArea: "25.75",
    landOwnershipType: "Leased",
    primaryCropType: "Rice",
    secondaryCropType: "Pulses",
    address: {
      village: "Koppal",
      district: "Koppal"
    },
    farmProfile: {
      landRecord: {
        surveyNumber: "SRV-2025-0091",
        registry: {
          office: "Koppal Land Records Office",
          district: "Koppal",
        },
      },
      irrigation: {
        source: {
          type: "Canal",
          provider: "Tungabhadra Channel Board",
        },
      },
    },
    cooperative: {
      membership: {
        membershipNumber: "KOP-FARM-4421",
        since: "2019-06-01",
      },
    },
    crops: ["Rice", "Pulses", "Millet"],
    plots: [
      { soilType: "Alluvial", areaAcres: 15.5 },
      { soilType: "Black", areaAcres: 10.25 }
    ],
  },
  proof: {
    type: "Ed25519Signature2018",
    created: "2025-01-01T23:46:46Z",
    proofPurpose: "assertionMethod",
    verificationMethod: "did:web:vharsh.github.io:DID:local#key-0",
    jws: "eyJ4NXQjUzI1NiI6IkhkakdicHlseVY0ZGZPZS01dDRhWGJOc3F2d1JDaExOeUxWczl2MEhqSjQiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdLCJraWQiOiIxSTZ1bVNrRDRNeWxXUmMtYWJCejIwY3hMcUVGTUp3aG9KdmhNM1ZGZ21jIiwiYWxnIjoiRWREU0EifQ..VAqXjgwvMZ-3TAUR6kW0snxqGdlycyP3cQCzdsl61CFulGlOrCpCV_KiqMrEsQ3-23Cmn-pdtnF8m4V-qwkKAg",
  },
};

export const STATIC_JWT_VC = {
  "iss": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2Iiwia2lkIjoiMSIsIngiOiI0eE9mS3pXNl96S018M04xOVM1eE1hVldreDVSR3A1YURSVmJXcHBiRzF1VG5reFYiLCJ5IjoiaVpXVk5qWmxWdlZWVmJlRWRxV0hWemVIaFNVVkpYVzFsd01XMXdjM0J2YlZSIn0",
  "sub": "did:example:holder456",
  "jti": "urn:uuid:3c67f42e-dd3c-4d9b-898a-debff416ccca",
  "iat": 1767225600,
  "nbf": 1767225600,
  "exp": 1893456000,
  "vc": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": ["VerifiableCredential", "EmployeeCredential"],
    "credentialSubject": {
      "id": "did:example:holder456",
      "employeeId": "E12345",
      "name": "Anup Kumar",
      "role": "Software Engineer",
      "address": {
        "city": "Bengaluru",
        "country": "India"
      },
      "nationalities": ["Indian", "Singaporean"],
      "degrees": [
        { "type": "B.Tech", "university": "IIT" },
        { "type": "M.S.", "university": "NUS" }
      ]
    }
  }
};

export const STATIC_SD_JWT_VC = {
  vct: "EmployeeCredential",
  employeeId: "E12345",
  name: "Anup Kumar",
  role: "Software Engineer",
  department: "R&D",
  location: "Bangalore"
};

export const STATIC_MDL_MDOC = {
  "org.iso.18013.5.1": {
    "given_name": "Anup",
    "family_name": "Kumar",
    "birth_date": "1990-01-01",
    "issue_date": "2023-01-01",
    "expiry_date": "2033-01-01",
    "issuing_country": "IN",
    "issuing_authority": "Ministry of Transport",
    "document_number": "ABC123456"
  }
};
