import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
function GoogleSign(props) {
    const [ profile, setProfile ] = useState([]);
    const clientId = '165135849198-ncvtt6e08fosh9arrok4dkqj0h24k1mb.apps.googleusercontent.com';
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });
    const onSuccess = (res) => {
        setProfile(res.profileObj);
        localStorage.setItem("userName",res.profileObj.email)
        props.googleLog(res.profileObj.email)
    };
    const onFailure = (err) => {
        console.log('failed', err);
    };
    const logOut = () => {
        setProfile(null);
        localStorage.removeItem("userName")
        props.logout()
    };
    return (
        <div>
            {
                props.name?
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                /> :
                <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} />
            }
        
        
        </div>
    );
}
export default GoogleSign;
