const express = require("express");

const app = express();
app.use(express.json());

app.use(express.static("public"));

app.get("/roblox/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const userReq = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false,
      }),
    });

    const userData = await userReq.json();

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userData.data[0];
    const userId = user.id;

    const profileReq = await fetch(
      `https://users.roblox.com/v1/users/${userId}`,
    );
    const profile = await profileReq.json();

    const avatarReq = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
    );
    const avatarData = await avatarReq.json();

    const friends = await fetch(
      `https://friends.roblox.com/v1/users/${userId}/friends/count`,
    ).then((r) => r.json());
    const followers = await fetch(
      `https://friends.roblox.com/v1/users/${userId}/followers/count`,
    ).then((r) => r.json());
    const following = await fetch(
      `https://friends.roblox.com/v1/users/${userId}/followings/count`,
    ).then((r) => r.json());

    const premiumRes = await fetch(
      `https://premiumfeatures.roblox.com/v1/users/${userId}/validate-membership`,
    );

    const premium = (await premiumRes.text()) === "true";

    const badges = await fetch(
      `
      https://accountinformation.roblox.com/v1/users/${userId}/roblox-badges
      `,
    ).then((r) => r.json());

    function hasBadge(badges, name) {
      const normalizedName = name.replace(/\s+/g, "").toLowerCase();
      return badges.some(
        (b) => b.name.replace(/\s+/g, "").toLowerCase() === normalizedName,
      );
    }

    const badgeNamesToCheck = [
      "Welcome To The Club",
      "Administrator",
      "Veteran",
      "Friendship",
      "Ambassador",
      "Inviter",
      "Homestead",
      "Bricksmith",
      "Official Model Maker",
      "Combat Initiation",
      "Warrior",
      "Bloxxer",
    ];

    const badgeResults = {};
    for (const badgeName of badgeNamesToCheck) {
      badgeResults[badgeName] = hasBadge(badges, badgeName);
    }

    res.json({
      id: userId,
      username: profile.name,
      displayName: profile.displayName,
      description: profile.description,
      created: profile.created,
      avatar: avatarData.data[0].imageUrl,
      friends: friends.count,
      followers: followers.count,
      following: following.count,
      premium: premium,
      userBadges: badgeResults,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("API ON → http://localhost:3000");
});
