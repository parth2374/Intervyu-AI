'use client'

import { auth } from '@/config/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react'

const Authentication = ({ children }) => {

	const provider = new GoogleAuthProvider();

	const onSignInClick = () => {
		signInWithPopup(auth, provider)
	  .then((result) => {
	    // This gives you a Google Access Token. You can use it to access the Google API.
	    const credential = GoogleAuthProvider.credentialFromResult(result);
	    const token = credential.accessToken;
	    // The signed-in user info.
	    const user = result.user;
			console.log(user)
	    // IdP data available using getAdditionalUserInfo(result)
	    // ...
	  }).catch((error) => {
	    // Handle Errors here.
	    const errorCode = error.code;
	    const errorMessage = error.message;
	    // The email of the user's account used.
	    const email = error.customData.email;
	    // The AuthCredential type that was used.
	    const credential = GoogleAuthProvider.credentialFromError(error);
	    // ...
	  });
	}

	return (
		<div className='w-full' onClick={() => onSignInClick()}>
			{children}
		</div>
	)
}

export default Authentication
