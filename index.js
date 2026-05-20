import express from "express";

const app = express();

/* =========================
   ブラウザUI
========================= */
app.get("/", (req, res) => {

  res.send(`
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Proxy Browser</title>

<style>

body{
  margin:0;
  font-family:sans-serif;
  background:#111;
  color:white;
}

#bar{
  display:flex;
  gap:8px;
  padding:10px;
  background:#222;
}

input{
  flex:1;
  padding:10px;
  border:none;
  border-radius:999px;
}

button{
  padding:10px;
  border:none;
  border-radius:10px;
}

iframe{
  width:100%;
  height:calc(100vh - 60px);
  border:none;
  background:white;
}

</style>
</head>

<body>

<div id="bar">
  <input id="url" placeholder="URL or search">
  <button onclick="go()">Open</button>
</div>

<iframe id="view"></iframe>

<script>

function normalize(v){

  if(v.startsWith("http")) return v;

  if(v.includes(".")){
    return "https://" + v;
  }

  return "https://duckduckgo.com/?q=" +
    encodeURIComponent(v);
}

function go(){

  const value =
    document.getElementById("url").value;

  const url = normalize(value);

  document.getElementById("view").src =
    "/proxy?url=" +
    encodeURIComponent(url);

}

</script>

</body>
</html>
  `);

});

/* =========================
   プロキシ
========================= */
app.get("/proxy", async (req, res) => {

  const target = req.query.url;

  if(!target){
    return res.send("no url");
  }

  try{

    const response = await fetch(target, {
      headers:{
        "User-Agent":"Mozilla/5.0"
      }
    });

    const html = await response.text();

    res.setHeader(
      "Content-Type",
      "text/html; charset=UTF-8"
    );

    res.send(html);

  }catch(e){

    res.send("error: " + e);

  }

});

/* =========================
   起動
========================= */
app.listen(3000, () => {
  console.log("running");
});
