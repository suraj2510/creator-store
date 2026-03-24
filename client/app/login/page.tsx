"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

const handleLogin = async (e:React.FormEvent)=>{
e.preventDefault()

setLoading(true)
setError("")

try{

const res = await fetch("http://localhost:5000/api/auth/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})
})

const data = await res.json()

if(!res.ok){
setError(data.message || "Invalid credentials")
setLoading(false)
return
}

localStorage.setItem("token",data.token)

router.push("/dashboard")

}catch(err){
setError("Server error")
}

setLoading(false)

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<form
onSubmit={handleLogin}
className="bg-white p-8 rounded-xl shadow-lg w-[380px]"
>

<h2 className="text-2xl font-bold text-center mb-6">
Login
</h2>

<input
type="email"
placeholder="Email"
className="w-full border p-2 rounded mb-3"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
className="w-full border p-2 rounded mb-3"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button
className="w-full bg-black text-white py-2 rounded"
>
{loading ? "Logging in..." : "Login"}
</button>

{error && <p className="text-red-500 mt-3">{error}</p>}

</form>

</div>

)

}