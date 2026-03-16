import React, { useState, useEffect } from "react";
import * as adminApi from "../../../service/adminapi";
import { toast } from "./component/Toast";

export default function Dashboard(){

const [stats,setStats]=useState({
projects:0,
skills:0,
blogs:0,
testimonials:0,
messages:0
})

const [loading,setLoading]=useState(true)
const [recentMessages,setRecentMessages]=useState([])

useEffect(()=>{
loadDashboard()
},[])

async function loadDashboard(){

setLoading(true)

try{

const [projects,skills,blogs,testimonials,messages]=await Promise.all([
adminApi.getProjects().catch(()=>({data:[]})),
adminApi.getSkills().catch(()=>({data:[]})),
adminApi.getBlogs().catch(()=>({data:[]})),
adminApi.getTestimonials().catch(()=>({data:[]})),
adminApi.getMessages().catch(()=>({data:[]}))
])

setStats({
projects:projects.data?.length||0,
skills:skills.data?.length||0,
blogs:blogs.data?.length||0,
testimonials:testimonials.data?.length||0,
messages:messages.data?.length||0
})

setRecentMessages((messages.data||[]).slice(0,5))

}catch(err){

toast.error("Failed to load dashboard")

}
finally{

setLoading(false)

}

}

const statCards=[
{title:"Projects",value:stats.projects,icon:"🚀"},
{title:"Skills",value:stats.skills,icon:"⚡"},
{title:"Blog Posts",value:stats.blogs,icon:"📝"},
{title:"Testimonials",value:stats.testimonials,icon:"⭐"},
{title:"Messages",value:stats.messages,icon:"💬"}
]

if(loading){

return(

<div className="flex flex-col items-center justify-center h-64 gap-4 text-black">
<div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
<p className="text-gray-500">Loading dashboard...</p>
</div>
)

}

return(

<div className="space-y-8 text-black">

<div>
<h2 className="text-2xl font-bold">Dashboard</h2>
<p className="text-gray-500">Welcome back to your portfolio admin panel</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

{statCards.map(stat=>(

<div
key={stat.title}
className="bg-white rounded-xl shadow p-5 flex items-center gap-4"
>

<div className="text-2xl">
{stat.icon}
</div>

<div>
<h3 className="text-xl font-bold">{stat.value}</h3>
<p className="text-sm text-gray-500">{stat.title}</p>
</div>

</div>

))}

</div>

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-white rounded-xl shadow p-6">

<h3 className="font-semibold mb-4">Recent Messages</h3>

{recentMessages.length===0?(

<p className="text-gray-400 text-sm">No messages yet</p>
):(

<div className="space-y-4">

{recentMessages.map(msg=>(

<div key={msg.id} className="border-b pb-3">

<div className="flex justify-between text-sm">

<strong>{msg.name}</strong>

<span className="text-gray-400">
{new Date(msg.created_at).toLocaleDateString()}
</span>

</div>

<p className="text-gray-500 text-sm mt-1">
{msg.subject||msg.message?.substring(0,50)}
</p>

</div>

))}

</div>

)}

</div>

<div className="bg-white rounded-xl shadow p-6">

<h3 className="font-semibold mb-4">Quick Actions</h3>

<div className="grid grid-cols-2 gap-4">

<button
className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100"
onClick={()=>window.location.href="/admin?page=projects"}

>

➕ Add Project </button>

<button
className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100"
onClick={()=>window.location.href="/admin?page=blogs"}

>

📝 Write Blog </button>

<button
className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100"
onClick={()=>window.location.href="/admin?page=skills"}

>

⚡ Add Skill </button>

<button
className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100"
onClick={()=>window.open("/","_blank")}

>

👁️ View Site </button>

</div>

</div>

</div>

</div>

)

}
