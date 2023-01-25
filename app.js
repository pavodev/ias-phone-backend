require("dotenv").config();

const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3001;

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Cors
app.use(cors());

// Body parser
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Listen
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Other endpoints
app.get("/", (req, res) => res.type("html").send(html));

app.post("/sendmail", async (req, res) => {
  // console.log(req.body);
  // res.status(200);
  // res.send();
  const token = req.body.access_token;
  const emailTo = req.body.email_to;
  const emailFrom = req.body.email_from;
  const emailSubject = req.body.email_subject;
  const emailBody = req.body.email_body;

  const { data, error } = await supabase.auth.getUser(token);

  if (data.user) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: emailTo, // Change to your recipient
      from: emailFrom, // Change to your verified sender
      subject: emailSubject,
      html: emailBody,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        res.json({ message: "E-mail sent!" });
        res.status(200);
        res.send();
      })
      .catch((error) => {
        console.error(error);
        res.json({ message: "The e-mail couldn't be sent.", error });
        res.status(404);
        res.send();
      });
  } else {
    res.json({ message: "User invalid", user: data.user, valid: false });
    res.status(403);
    res.send();
  }
});

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>IAS Phone Scheduler backend</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from IAS Phone Scheduler backend!
    </section>
  </body>
</html>
`;
