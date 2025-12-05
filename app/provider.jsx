"use client"

import { onAuthStateChanged } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './_context/AuthContext'
import { supabase } from '@/services/supabaseClient'
import { auth } from '@/config/firebaseConfig'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const Provider = ({ children }) => {
	const [user, setUser] = useState()

	useEffect(() => {
		console.log("Running useEffect")
		console.log(user, "testing")
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

			if (firebaseUser) {
				CreateNewUser(firebaseUser)
				setUser(firebaseUser)
			} else {
        // no user means signed out
        setUser(null);
      }
		})
		return () => unsubscribe()
	}, [])

	const CreateNewUser = async (firebaseUser) => {
		const { email, displayName, photoURL } = firebaseUser

		// Check if user exists
		let { data: Users, error } = await supabase
			.from('Users')
			.select("*")
			.eq('email', email)

		if (error) {
	    console.error("Supabase error:", error);
	    return;
	  }

		if (Users.length === 0) {
	    // insert new user
	    const { data: inserted, error: insertError } = await supabase
	      .from("Users")
	      .insert([
	        { name: displayName, email, picture: photoURL }
	      ]);

	    if (insertError) {
	      console.error("Insert error:", insertError);
	      return;
	    }

	    // use the newly inserted record
	    setUser(inserted[0]);
	  } else {
	    // user already existed
	    setUser(Users[0]);
	  }
	}

	return (
		<PayPalScriptProvider options={{ clientId: "test" }}>
			<AuthContext.Provider value={{ user, setUser }}>
				{children}
			</AuthContext.Provider>
		</PayPalScriptProvider>
	)
}

export const useAuthContext = () => {
	const context = useContext(AuthContext)
	return context
}

export default Provider