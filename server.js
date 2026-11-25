const express=require("express");
const cors=require("cors");
const app=express();
app.use(cors());
app.use(express.json());
app.post("/ask",async(req,res)=>{
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"content-type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
      body:JSON.stringify({model:"claude-sonnet-5-5",max_tokens:500,messages:[{role:"user",content:String(req.body.question||"").slice(0,1000)}]})
    });
    const d=await r.json();
    res.json({answer:(d.content&&d.content[0]&&d.content[0].text)||"Khalad"});
  }catch(e){res.json({answer:"Khalad server"})}
});
app.listen(process.env.PORT||3000);
