const express = require("express");
const router = express.Router();
const axios = require("axios");

// Define your GitHub OAuth configuration here
const clientId = '787dea0261fc8914ebd0';
const clientSecret = 'ce334ebbdd0c355906ff23ba9fc533e17dca2f6f';
const redirectUri = "http://13.234.23.179:3001/github";

// Define your API routes here
router.get("/auth", (req, res) => {
  // Your authentication logic here
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`
  );
});

router.get("/callback", async (req, res) => {
    try {
      const { code } = req.query;
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const accessToken = response.data.access_token;
  
      // Store the access token in the session
      req.session.accessToken = accessToken;
  
      // Redirect back to the frontend without the access token in the URL
      res.redirect("http://13.234.23.179:3001"); // Change the URL to your frontend URL
    } catch (error) {
      console.error(error);
  
      // Handle authorization failure
      res.status(500).send("Authorization failed.");
    }
  });
    
  

router.get("/user", async (req, res) => {
  // Your user data retrieval logic here
  try {
    const accessToken = req.session.accessToken;
    if (!accessToken) {
      res.status(401).send("Access token not found.");
      return;
    }
    // Make an authenticated request to fetch user data from GitHub API
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = response.data;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch user data.");
  }
});

router.get("/fetch-repo/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const accessToken = req.session.accessToken;
    if (!accessToken) {
      res.status(401).send("Access token not found.");
      return;
    }
    // Make an authenticated request to fetch repository data from GitHub API
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const repoData = repoResponse.data;

    // Make another request to fetch the branches for the repository
    const branchesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/branches`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const branchesData = branchesResponse.data;
    // Combine the repository data and branches data
    const responseData = {
      repository: repoData,
      branches: branchesData,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch repository data.");
  }
});

module.exports = router;
