const verifiedDisplay = document.querySelector(".verified-dis");

const verifiedBadge = document.querySelector(".featured-badge");

verifiedBadge.addEventListener("click", () => {
  if (verifiedBadge.textContent.toLowerCase() == "dev friend") {
    if (verifiedDisplay.style.display.toLowerCase() == "none") {
      verifiedDisplay.style.display = "block";
    } else {
      verifiedDisplay.style.display = "none";
    }
  }
});

const searchBtn = document.querySelector(".searchBtn");
const searchAcc = document.querySelector(".searchAcc");
searchBtn.addEventListener("click", () => {
  const value = searchAcc.value.trim();
  if (!value) return;

  window.location.href = `http://localhost:3000/?roblox=${encodeURIComponent(value)}`;
});

searchAcc.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const value = searchAcc.value.trim();
    window.location.href = `http://localhost:3000/?roblox=${encodeURIComponent(value)}`;
  }
});

const devfriend = ["grrrrrrlesfesse2joji", "arracheur2lgbtttttt"];

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("roblox").toLowerCase() || "Dislay_R6";

  if (username == "Dislay_R6") {
    document.querySelector(".developper").style.display = "block";
  } else if (devfriend.includes(username)) {
    document.querySelector(".verified").style.display = "block";
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

  fetch(`/roblox/${username}`)
    .then((res) => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then((data) => {
      console.log(data.premium);
      creatSplitT = data.created.split("T");
      document.getElementById("username").textContent = data.username;
      document.getElementById("displayName").textContent = data.displayName;
      document.getElementById("userid").textContent = data.id;
      document.getElementById("description").textContent =
        data.description || "Aucune description";
      document.getElementById("created").textContent = `${creatSplitT[0]}`;
      document.getElementById("avatar").src = data.avatar;
      document.getElementById("friends").textContent = data.friends;
      document.getElementById("followers").textContent = data.followers;
      document.getElementById("following").textContent = data.following;

      const userBadges = data.userBadges;

      badgeNamesToCheck.forEach((badgeName) => {
        const badgeId = badgeName.replace(/\s+/g, "").toLowerCase();
        const badgeEl = document.getElementById(badgeId);
        if (!badgeEl) return;

        if (userBadges?.[badgeName] === true) {
          if (badgeEl.id == "administrator") {
            badgeEl.style.display = "inline-block";
          } else {
            badgeEl.style.display = "block";
          }
        } else {
          badgeEl.style.display = "none";
        }
      });
    })
    .catch((err) => {
      console.error(err);
      alert("Utilisateur introuvable");
    });
});
