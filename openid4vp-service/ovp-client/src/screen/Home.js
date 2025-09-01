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

    const handleClick = (endpointObj) => {
        navigate('/qr', {state: {name: endpointObj.name}});
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
            padding: 20,
            textAlign: 'start',
            background: backgroundStyle.primaryGradient,
            color: Palette.primaryText,
            font: font.primary,
            fontSize: 'large'
        }}>
            <h1 style={{fontSize: 'xxx-large', marginBottom: -10}}>Inji Mock Services</h1>
            <h1 style={{fontSize: 'xxx-large'}}>Mock OpenID4VP Verifier</h1>
            <div style={{justifyContent: 'start', maxWidth: '800px', margin: '0 20px'}}>
                <p style={{maxWidth: '600px'}}>
                    This is a mock verifier service for demonstration purposes.
                </p>
                <p style={{marginBottom: '15px'}}>
                    <span style={{color: Palette.primaryText, fontWeight: 'bold', fontSize: 'large'}}>Supported Device flows:</span>
                    <ol style={{
                        marginTop: '10px',
                        color: Palette.secondaryText,
                        paddingLeft: '25px'
                    }}>
                        <li style={{marginBottom: '8px'}}>
                            <span style={{color: Palette.primaryText}}>Same device flow</span> - Click the QR code to
                            simulate same device flow
                        </li>
                        <li>
                            <span style={{color: Palette.primaryText}}>Cross device flow</span> - Scan the rendered QR
                            code from your Wallet application
                        </li>
                    </ol>
                </p>
            </div>
            <div>
                <p>Please select a Client Id Scheme to generate an Authorization Request QR code:</p>
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
