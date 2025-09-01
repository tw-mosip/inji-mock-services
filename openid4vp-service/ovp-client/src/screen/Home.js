import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {CLIENT_ID_SCHEMES} from "./constants/constants";
import Button from "./components/Button";
import {backgroundStyle, Palette, font} from "./styles/palette";

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
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            background: backgroundStyle.primaryGradient,
            color: Palette.primaryText,
            font: font.primary
        }}>
            <h1 style={{fontSize: 'xxx-large'}}>Inji Mock Services</h1>
            <div style={{textAlign: 'center'}}>
                <h4 style={{textAlign: 'left', paddingLeft: '8px'}}>Select Client Id Scheme</h4>
                <div style={{
                    display: 'grid',
                    flexDirection: 'column',
                    margin: '10px',
                    gap: '18px',
                    alignItems: 'baseline',
                    justifyContent: 'stretch'
                }}>
                    {endpoints.map(e => (
                        <Button onClick={() => handleClick(e)} variant={"secondary"}
                                style={{fontSize: 'large', padding: '12px 84px'}}
                                key={e.name}>
                            {e.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
