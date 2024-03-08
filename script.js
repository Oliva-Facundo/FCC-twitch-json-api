const list = document.querySelector(".list");
const btnAll = document.querySelector(".show-all");
const btnOnline = document.querySelector(".show-online");
const btnOffline = document.querySelector(".show-offline");

const streamers = [
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "freecodecamp",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "noobs2ninjas",
];

function getInfoStreamers(type) {
  const list = document.querySelector(".list");
  list.innerHTML = "";
  streamers.forEach((name, i) => {
    Promise.all([
      fetch(
        `https://twitch-proxy.freecodecamp.rocks/twitch-api/channels/${name}`
      ).then((res) => res.json()),

      fetch(
        `https://twitch-proxy.freecodecamp.rocks/twitch-api/streams/${name}`
      ).then((res) => res.json()),
    ])
      .then(([channel, stream]) => {
        showChannelAndStream(channel, stream);
      })
      .catch((err) => console.error("Error: ", err));
  });
}

function showChannelAndStream(channel, stream) {
  console.log(channel);
  console.log(stream);
  const isOnline = stream.stream === null ? "offline" : "online";
  const online =
    stream.stream === null
      ? "Offline"
      : `<strong>${stream.stream.game}</strong> : ${channel.status}`;
  const views = stream.stream === null ? "" : `👁 ${stream.stream.viewers}`;

  const html = `
  <li class="item-list all ${isOnline}">
    <a href="${channel.url}" target="_blank">
      <img src="${channel.logo}" class="image" alt="Logo" />
      <h3 class="name-channel">${channel.display_name}</h3>
      <p class="game-title">${online}</p>
      <p class="views">${views}</p>
    </a>
  </li>
  `;

  if (isOnline === "online") {
    list.innerHTML = html + list.innerHTML;
  } else {
    list.innerHTML += html;
  }
}

function filterList(type) {
  const itemsList = document.querySelectorAll(".item-list");

  itemsList.forEach((item, i) => {
    if (item.classList.contains(type)) {
      item.classList.remove("not-show");
      setTimeout(() => item.style.display = 'block', 300)
      
    } else {
      item.classList.add("not-show");
      setTimeout(() => item.style.display = 'none', 300)
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getInfoStreamers();

  btnAll.addEventListener("click", function () {
    this.classList.add("active");
    btnOffline.classList.remove('active')
    btnOnline.classList.remove('active')
    filterList("all");
  });
  btnOnline.addEventListener("click", function () {
    this.classList.add("active");
    btnAll.classList.remove('active')
    btnOffline.classList.remove('active')
    filterList("online");
  });
  btnOffline.addEventListener("click", function () {
    this.classList.add('active')
    btnAll.classList.remove('active')
    btnOnline.classList.remove('active')
    filterList("offline");
  });
});
