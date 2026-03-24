"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Signup(){

const router = useRouter()

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [phone,setPhone] = useState("")
const [password,setPassword] = useState("")
const [loading,setLoading] = useState(false)

const handleSignup = async (e:React.FormEvent)=>{
e.preventDefault()

setLoading(true)

await fetch("http://localhost:5000/api/auth/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name,email,phone,password})
})

setLoading(false)
router.push("/login")

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<form
onSubmit={handleSignup}
className="bg-white p-8 rounded-xl shadow-lg w-[380px]"
>

<h2 className="text-2xl font-bold text-center mb-6">
Create Creator Account
</h2>

<input
placeholder="Name"
className="w-full border p-2 rounded mb-3"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<input
placeholder="Email"
type="email"
className="w-full border p-2 rounded mb-3"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
placeholder="Phone"
className="w-full border p-2 rounded mb-3"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
required
/>

<input
placeholder="Password"
type="password"
className="w-full border p-2 rounded mb-3"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button
className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
>
{loading ? "Creating..." : "Signup"}
</button>

</form>

</div>

)

}