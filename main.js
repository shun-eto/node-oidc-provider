const dotenv = require("dotenv");
const express = require("express");

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());

const { Issuer, generators } = require("openid-client");

app.listen(port, async () => {
  app.get("/.well-known/openid-configuration", (req, res) => {
    return res.sendFile(__dirname + "/.well-known/openid-configuration.json");
  });

  console.log(`Server listening on http://localhost:${port}`);
  try {
    const issuer = await Issuer.discover("http://localhost:3000");
    console.log("Issuer discovered:", issuer.metadata.issuer);

    const client = new issuer.Client({
      client_id: "client_id",
      client_secret: "client_secret",
      redirect_uris: [`http://localhost:3000/callback`],
      response_types: ["code"],
    });
  } catch (err) {
    console.error("Error discovering issuer:", err.message);
  }
});
