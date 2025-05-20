import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function GoogleSign({ googleLog, logout, name }) {
    const [profile, setProfile] = useState(null);

    const clientId = '165135849198-ncvtt6e08fosh9arrok4dkqj0h24k1mb.apps.googleusercontent.com';

    const handleSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        setProfile(decoded);
        localStorage.setItem("userName", decoded.email);
        googleLog(decoded.email);
    };

    const handleLogout = () => {
        googleLogout();
        setProfile(null);
        localStorage.removeItem("userName");
        logout();
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                {name ? (
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                ) : (
                    <button onClick={handleLogout}>Log out</button>
                )}
            </div>
        </GoogleOAuthProvider>
    );
}

export default GoogleSign;
