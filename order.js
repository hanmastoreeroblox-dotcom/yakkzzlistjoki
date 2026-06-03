import crypto from "crypto";

let orders = [];

export default async function handler(req,res){

 if(req.method==="POST"){
  const d = req.body;

  if(!d.user||!d.pass||!d.bc1||!d.bc5||!d.bukti){
   return res.status(400).json({error:"Data kurang"});
  }

  const id = "ORD-"+crypto.randomBytes(4).toString("hex");

  orders.push({
   id,
   user:d.user,
   status:"⏳ Pending"
  });

  await fetch(process.env.WEBHOOK,{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({
    content:`ORDER ${id}\nUser: ${d.user}`
   })
  });

  return res.json({id});
 }

 if(req.method==="GET"){
  return res.json(orders);
 }

 if(req.method==="PUT"){
  if(req.headers.authorization !== "Bearer "+process.env.ADMIN_TOKEN){
   return res.status(403).end();
  }

  const {id,status} = req.body;
  const o = orders.find(x=>x.id===id);
  if(o) o.status=status;

  return res.json({ok:true});
 }
}
