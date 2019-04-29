const express = require("express")
const path = require("path")
const logger = require("morgan")
const bodyParser = require("body-parser")
const hbsMiddleware = require("express-handlebars")
const fs = require("fs")

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "../views"))
app.engine(
  "hbs",
  hbsMiddleware({
    defaultLayout: "default",
    extname: ".hbs"
  })
)
app.set("view engine", "hbs")

app.use(logger("dev"))
app.use(express.json())

app.use(express.static(path.join(__dirname, "../public")))
app.use(bodyParser.urlencoded({ extended: true }))

// ---------------------------------

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is listening...")
})

app.get("/", (req, res) => {
  res.send("Hello from the backend")
})

app.get("/home", (req, res) => {
  res.render("home")
})

app.get("/pizza", (req, res) => {
  let myDeliciousPizza = "BBQ Chicken on Cauliflower Crust"

  res.render("pizza", { pizza: myDeliciousPizza })
})

app.get("/podcasts", (req, res) => {
  let podcasts = [
    "The Daily",
    "MBMBAM",
    "Reply All",
    "This American Life",
    "Mission to Zyx"
  ]

  res.render("podcast-index", { podcasts: podcasts })
})

// ------

const podcastDetails = {
    "the-daily": {
        title: "The Daily",
        description: "The way daily news should sound. The most important subjects you need to know.",
        network: "New York Times",
        image: "https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fis4.mzstatic.com%2Fimage%2Fthumb%2FMusic122%2Fv4%2F1b%2F83%2F76%2F1b8376aa-90a9-eae1-662d-2b24faf1bf6e%2Fsource%2F1200x630bb.jpg&f=1"
    },
    "mbmbm": {
        title: "My Brother, My Brother, and Me",
        description: "Three comedic brothers, too many strange questions, endless funnies.",
        network: "Maximum Fun",
        image: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fstudybreaks.com%2Fwp-content%2Fuploads%2F2018%2F02%2Fpodcast.jpg&f=1"
    },
    "reply-all": {
        title: "Reply All",
        description: "A podcast about the internet that is actually an unfailingly original exploration of modern life and how to survive it.",
        network: "Gimlet",
        image: ""
    },
    "this-american-life": {
        title: "This American Life",
        description: "This American Life is a weekly public radio show, heard by 2.2 million people on more than 500 stations.",
        network: "NPR",
        image: ""
    },
    "mission-to-zyx": {
        title: "Mission to Zyx",
        description: "TMISSION TO ZYXX is an improvised science fiction podcast following a team of ambassadors as they attempt to establish diplomatic relations with planets in the remote and chaotic ZYXX QUADRANT",
        network: "Maximum Fun",
        image: "https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fis1.mzstatic.com%2Fimage%2Fthumb%2FMusic128%2Fv4%2Fe5%2Fc1%2Ff6%2Fe5c1f67e-c39b-5708-b8de-9932a3797412%2Fsource%2F600x600bb.jpg&f=1"
    }
  }

app.get("/podcasts/:podcast", (req, res) => {
  const podcast = req.params.podcast
  const designatedPodcast = podcastDetails[podcast]

  if(designatedPodcast) {
    res.render("podcast-show", { podcast: designatedPodcast })
  }
  else {
    res.status(404).send("Product not found.")
  }
})

// ---------------------------------

const getFlipResult = () => {
  if(Math.random() > 0.5) {
    return "heads"
  }
  else {
    return "tails"
  }
}

app.get("/coin-flip/:guess", (req, res) => {
  let winGif = "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif"
  let loseGif = "https://media.giphy.com/media/1lvvpG7Xa5LGQa06dJ/giphy.gif"
  let outcomeMessage = ""

  const coinFlipResult = getFlipResult()

  if(req.params.guess){
    if(req.params.guess === coinFlipResult) {
      outcomeMessage = "You win!"
      res.render("coin-flip", { outcomeMessage: outcomeMessage, gif: winGif  })
    }
    else {
      outcomeMessage = "You lose!"
      res.render("coin-flip", { outcomeMessage: outcomeMessage, gif: loseGif  })
    }
  }
  else {
    res.send(coinFlipResult)
  }
})

module.exports = app
