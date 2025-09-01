import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {CLIENT_ID_SCHEMES} from "../constants/constants";
import Button from "../components/common/Button";
import {backgroundStyle, Palette, font} from "../styles/palette";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Home';
    }, []);

    // const endpoints = [
    //     { name: "By value - Redirect", path: "/verifier/generate-auth-request-by-value-redirect-qr" },
    //     { name: "By value - Pre-Registered", path: "/verifier/generate-auth-request-by-value-pre-registered-qr" },
    //     { name: "By Reference", path: "/verifier/generate-auth-request-by-reference-qr" },
    // ];

    const endpoints = [
        {
            name: CLIENT_ID_SCHEMES.PRE_REGISTERED
        },
        {
            name: CLIENT_ID_SCHEMES.REDIRECT_URI
        },
        {
            name: CLIENT_ID_SCHEMES.DID
        }
    ]

    // const handleClick = (endpointObj) => {
    //     navigate('/qr', { state: { endpoint: endpointObj.path, name: endpointObj.name } });
    // };

    const handleClick = (endpointObj) => {
        navigate('/qr', {state: {name: endpointObj.name}});
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            // justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            textAlign: 'start',
            background: backgroundStyle.primaryGradient,
            color: Palette.primaryText,
            font: font.primary,
            fontSize: 'large'
        }}>
            <h1 style={{fontSize: 'xxx-large', marginBottom: -10}}>Inji Mock Services</h1>
            <h1 style={{fontSize: 'xxx-large'}}>Mock Verifier</h1>
            <div style={{justifyContent: 'start', maxWidth: '800px', margin: '0 20px'}}>
                <p style={{maxWidth: '600px'}}>
                    This is a mock verifier service for demonstration purposes.
                </p>
                <p>
                    Supported Device flows:
                    <ol>
                        <li>Same device flow (Click the QR code to simulate same device flow)</li>
                        <li>Cross device flow (Scan the rendered QR code from your Wallet application)</li>
                    </ol>
                </p>
            </div>
            <div>
                <p>Please select a client id scheme to
                    generate an authentication request QR code.</p>
                <div style={{
                    display: 'grid',
                    flexDirection: 'column',
                    margin: '10px',
                    gap: '18px',
                    alignItems: 'baseline',
                    justifyContent: 'stretch'
                }}>
                    {endpoints.map(e => (
                        <div>
                            <span role="img" aria-label="emoji"
                                  style={{cursor: 'pointer', marginRight: '10px', fontSize: '24px'}}>
                                                            {e.name === CLIENT_ID_SCHEMES.PRE_REGISTERED ? '🔐' :
                                                                e.name === CLIENT_ID_SCHEMES.REDIRECT_URI ? '🔄' : '🆔'}
                                                        </span>
                            <Button onClick={() => handleClick(e)} variant={"secondary"}
                                    style={{fontSize: 'large', padding: '12px 84px', width: 400}}
                                    key={e.name}>
                                {e.name}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
