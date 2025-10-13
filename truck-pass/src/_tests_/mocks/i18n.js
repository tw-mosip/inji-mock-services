jest.mock('react-i18next', () => ({
    useTranslation: () => {
        let currentLanguage = 'English';
        return {
            t: (key) => key, // Return keys as-is for predictable test output
            i18n: {
                changeLanguage: jest.fn((lng) => {
                    currentLanguage = lng === 'fr' ? 'French' : 'English';
                }),
                language: currentLanguage,
            },
        };
    },
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    },
}));
export {};
