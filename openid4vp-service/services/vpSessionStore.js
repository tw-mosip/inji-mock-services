const crypto = require('crypto');
const session = require('express-session');

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function createVpSessionStore() {
    const sessionStore = new session.MemoryStore();

    const sessionMiddleware = session({
        secret: 'openid4vp-session-secret',
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: SESSION_MAX_AGE_MS,
        },
    });

    const generateSessionId = () => crypto.randomBytes(16).toString('hex');

    const clearSessionStoreOnStartup = () => new Promise((resolve, reject) => {
        sessionStore.clear((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });

    const storeVPRequestInSession = async (sessionId, dcqlOverride, pdOverride) => {
        const sessionRecord = {
            cookie: {
                maxAge: SESSION_MAX_AGE_MS,
                httpOnly: true,
                secure: false,
            },
            vpRequest: {
                dcqlQuery: dcqlOverride,
                presentationDefinition: pdOverride,
                timestamp: Date.now(),
            },
        };

        await new Promise((resolve, reject) => {
            sessionStore.set(sessionId, sessionRecord, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    const getVPRequestFromSession = async (sessionId) => {
        const sessionData = await new Promise((resolve, reject) => {
            sessionStore.get(sessionId, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(data || null);
            });
        });

        return sessionData?.vpRequest || null;
    };

    return {
        sessionMiddleware,
        clearSessionStoreOnStartup,
        generateSessionId,
        storeVPRequestInSession,
        getVPRequestFromSession,
    };
}

module.exports = { createVpSessionStore };
