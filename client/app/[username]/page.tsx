export default async function CreatorPage({
params
}:{
params: Promise<{username:string}>
}){

const {username} = await params

return(
<div className="p-10">
<h1>Creator Dashboard</h1>
<p>{username}</p>
</div>
)

}