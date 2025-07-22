import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Home';
    }, []);

    const endpoints = [
        { name: "By value - Redirect", path: "/verifier/generate-auth-request-by-value-redirect-qr" },
        { name: "By value - Pre-Registered", path: "/verifier/generate-auth-request-by-value-pre-registered-qr" },
        { name: "By Reference", path: "/verifier/generate-auth-request-by-reference-qr" },
    ];

    const handleClick = (endpointObj) => {
        navigate('/qr', { state: { endpoint: endpointObj.path, name: endpointObj.name } });
    };

    return (
        <div style={{paddingLeft: '40px', paddingTop: '20px'}}>
            <h1 style={{marginBottom: '20px'}}>Home screen</h1>
            <h2>Select Auth Request Type</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px'}}>
                {endpoints.map(e => (
                    <button
                        key={e.name}
                        onClick={() => handleClick(e)}
                        style={{
                            width: '250px',
                            textAlign: 'left',
                            padding: '10px 20px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            backgroundColor: '#f0f0f0',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={e => e.target.style.backgroundColor = '#e0e0e0'}
                        onMouseLeave={e => e.target.style.backgroundColor = '#f0f0f0'}
                    >
                        {e.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
