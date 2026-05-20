import express from "express";
import { chromium } from "playwright";

const app = express();

app.get("/", (req, res) => {

  res.send(`
<!DOCTYPE html>
<html>
<body style="margin:0">

<div style="
display:flex;
padding:10px;
background:#111;
gap:10px;
">

<input id="u"
style="
flex:1;
padding:10px;
border-radius:999px;
border:none;
"
placeholder="URL">

<button onclick="go()">
Open
</button>

</div>

<iframe
id="v"
style="
width:100%;
height:calc(100vh - 60px);
border:none;
">
</iframe>

<script>

function go(){

  let u =
    document.getElementById("u").value;

  if(!u.startsWith("http")){
    u = "https://" + u;
  }

  document.getElementById("v").src =
    "/browse?url=" +
    encodeURIComponent(u);

}

</script>

</body>
</html>
  `);

});

app.get("/browse", async (req, res) => {

  const url = req.query.url;

  let browser;

  try{

    browser = await chromium.launch({
      headless:true,
      args:["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(url,{
      waitUntil:"networkidle"
    });

    const html = await page.content();

    await browser.close();

    res.send(html);

  }catch(e){

    if(browser) await browser.close();

    res.send("error: " + e);

  }

});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("running");
});
