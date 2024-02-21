import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    const response = await axios.get(
      `https://v2.jokeapi.dev/joke/Any?contains=${name}`
    );
    const result = response.data;
    console.log(result);
    if (result.error) {
      res.render("index.ejs", {
        error: "No jokes found for your name. Try again with a different name.",
        data: null, // Ensure data is defined even when no jokes are found
      });
    } else if (result.joke) {
      res.render("index.ejs", {
        data: { name, joke: result.joke },
        error: null,
      });
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "An unexpected error occurred. Please try again later.",
      data: null, // Ensure data is defined even when an unexpected error occurs
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
