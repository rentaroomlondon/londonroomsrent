"use client"

import React, { useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function ForgetPassword() {

  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token")

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  const [success,setSuccess] = useState("")
  const [showPassword,setShowPassword] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      setError("")
      setSuccess("")

      // STEP 1 → SEND RESET EMAIL
      if(!token){

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body: JSON.stringify({ email })
          }
        )

        const data = await res.json()

        if(!res.ok){
          throw new Error(data.message)
        }

        setSuccess("Password reset email sent. Check your inbox.");
        toast.success("Password reset email sent. Check your inbox.");

      }

      // STEP 2 → RESET PASSWORD
      else{

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`,
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body: JSON.stringify({ password })
          }
        )

        const data = await res.json()

        if(!res.ok){
          throw new Error(data.message)
        }

        setSuccess("Password reset successful. Redirecting to login...");
        toast.success("Password reset successful. Redirecting to login...");

        setTimeout(()=>{
          router.push("/login")
        },2000)

      }

    } catch(err){

      setError(err.message);
      toast.error(err.message);

    } finally{

      setLoading(false)

    }

  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">

      <div className="w-full max-w-md">

        <h2 className="text-3xl font-bold text-[#0a192f] mb-2">

          {token ? "Reset Password" : "Forgot Password"}

        </h2>

        <p className="text-gray-500 text-sm mb-8">

          {token
            ? "Enter your new password below"
            : "Enter your email to receive a reset link"}

        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL STEP */}
          {!token && (

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

          )}

          {/* PASSWORD STEP */}
          {token && (

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text":"password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />

                <button
                  type="button"
                  onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  👁️
                </button>

              </div>

            </div>

          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e36b2c] hover:bg-[#c95a1f] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            {loading
              ? "Processing..."
              : token
              ? "Reset Password"
              : "Send Reset Link"}

            <ArrowRight size={18}/>
          </button>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-orange-500 font-semibold">
            Back to login
          </Link>
        </p>

      </div>

    </div>
  )
}