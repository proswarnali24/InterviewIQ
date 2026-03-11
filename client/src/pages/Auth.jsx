import React, { useEffect, useRef, useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const tokenClientRef = useRef(null)
    const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim()

    const syncUserToBackend = async (firebaseUser) => {
        const name = firebaseUser?.displayName || "User"
        const email = firebaseUser?.email
        if (!email) {
            throw new Error("Google account email not available")
        }
        const result = await axios.post(
            ServerUrl + "/api/auth/google",
            { name, email },
            { withCredentials: true }
        )
        dispatch(setUserData(result.data))
    }

    useEffect(() => {
        if (!googleClientId) {
            return
        }

        const setupGoogleOauthClient = () => {
            if (!window.google?.accounts?.oauth2) {
                return
            }

            tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
                client_id: googleClientId,
                scope: "openid email profile",
                callback: async (tokenResponse) => {
                    try {
                        const accessToken = tokenResponse?.access_token
                        if (!accessToken) {
                            throw new Error("Google access token missing")
                        }

                        const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        })

                        if (!profileResponse.ok) {
                            throw new Error("Failed to fetch Google profile")
                        }

                        const profile = await profileResponse.json()
                        await syncUserToBackend({
                            displayName: profile?.name,
                            email: profile?.email,
                        })
                        setErrorMsg("")
                    } catch (oauthError) {
                        console.error("Google OAuth login error:", oauthError)
                        setErrorMsg("Google login failed. Check Google OAuth client origins and authorized JavaScript origins.")
                        dispatch(setUserData(null))
                    } finally {
                        setLoading(false)
                    }
                },
            })
        }

        if (window.google?.accounts?.oauth2) {
            setupGoogleOauthClient()
            return
        }

        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = setupGoogleOauthClient
        document.head.appendChild(script)

        return () => {
            script.onload = null
        }
    }, [dispatch, googleClientId])

    const tryGoogleOauthFallback = async () => {
        if (!googleClientId) {
            setErrorMsg("Missing VITE_GOOGLE_CLIENT_ID in client .env")
            return false
        }

        const tokenClient = tokenClientRef.current
        if (!tokenClient) {
            setErrorMsg("Google OAuth is still loading. Try again in 2 seconds.")
            return false
        }

        tokenClient.requestAccessToken({ prompt: "select_account" })
        return true
    }

    const handleGoogleAuth = async () => {
        setLoading(true)
        setErrorMsg("")

        // Primary login path: Google Identity Services (bypasses Firebase redirect/popup config issues)
        if (tokenClientRef.current) {
            tokenClientRef.current.requestAccessToken({ prompt: "select_account" })
            return
        }

        try {
            const response = await signInWithPopup(auth,provider)
            await syncUserToBackend(response.user)
        } catch (error) {
            const code = error?.code || ""

            if (code === "auth/popup-blocked") {
                setErrorMsg("Popup blocked by browser. Please allow popups for this site and try again.")
            } else if (code === "auth/cancelled-popup-request" || code === "auth/popup-closed-by-user") {
                setErrorMsg("Google sign-in popup was closed. Please try again.")
            } else if (code === "auth/invalid-continue-uri") {
                const startedFallback = await tryGoogleOauthFallback()
                if (startedFallback) {
                    return
                }
                setLoading(false)
                return
            } else {
                console.error("Google popup login error:", error)
                setErrorMsg(error?.message || "Google login failed")
            }
            dispatch(setUserData(null))
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:1.05}}
        className={`
        w-full 
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-white shadow-2xl border border-gray-200
      `}>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={18}/>

                </div>
                <h2 className='font-semibold text-lg'>InterviewIQ.AI</h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                Continue with
                <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                    <IoSparkles size={16}/>
                    AI Smart Interview

                </span>
            </h1>

            <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
                Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
            </p>


            <motion.button 
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.9 , scale:1.03}}
            whileTap={{opacity:1 , scale:0.98}}
            disabled={loading}
            className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md disabled:opacity-60 disabled:cursor-not-allowed'>
                <FcGoogle size={20}/>
                {loading ? "Please wait..." : "Continue with Google"}

   
            </motion.button>
            {errorMsg && (
              <p className='text-red-500 text-sm text-center mt-4 break-words'>{errorMsg}</p>
            )}
        </motion.div>

      
    </div>
  )
}

export default Auth
