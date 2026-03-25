"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const handleLogin = async (e:any)=>{
e.preventDefault()

const res = await fetch("http://localhost:5000/api/auth/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
})

const data = await res.json()

console.log(data)

if(res.ok){
router.push(`/${data.user.username}`)
}else{
alert(data.message)
}

}

return(

<div className="flex justify-center items-center min-h-screen">

<form onSubmit={handleLogin} className="bg-white p-8 shadow rounded w-96">

<h2 className="text-2xl font-bold mb-6">Login</h2>

<input
type="email"
placeholder="Email"
className="border w-full p-2 mb-4"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border w-full p-2 mb-4"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="bg-black text-white w-full p-2 rounded">
Login
</button>

</form>

</div>

)

}