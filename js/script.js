function showResponsiveNav() {
  var nav = document.getElementById("res-nav");
  if (nav.className == "mobile-nav-menu") {
    nav.className += " hidden";
  } else {
    nav.className = "mobile-nav-menu";
  }
}

var loginName = "princewhyte2";

var content = {
  query: `query($loginName: String!){
    user(login: $loginName) {
      bio
      createdAt
      avatarUrl
      name
      login
      repositories(last: 20 , isFork: false) {
        nodes {
          forkCount
          stargazerCount
          description
          name
          updatedAt
          url
          primaryLanguage {
            color
            name
          }
        
        }
      }
    }
  },
  `,
  variables: { loginName },
};

var body = JSON.stringify(content);
var userName = document.getElementById("username");
var userLogin = document.getElementById("userlogin");
var userBio = document.getElementById("bio");
var userImage = document.getElementById("avatarUrl");
var firstName = document.getElementById("firstName");
var lastName = document.getElementById("lastName");
var userRepoList = document.querySelectorAll(".user-repo-list");
var repositories;

fetch("https://api.github.com/graphql", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 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",
  },
  body: body,
})
  .then((res) => res.json())
  .then((resp) => {
    //console.log(resp.data);
    console.log("the inner width = ", window.innerWidth);
    var name = resp.data.user.name.split(" ");
    firstName.textContent += name[0];
    lastName.textContent += name[1];
    userName.textContent += resp.data.user.login;
    userLogin.textContent += resp.data.user.login;
    userBio.textContent += resp.data.user.bio;
    userImage.src = resp.data.user.avatarUrl;
    repositories = resp.data.user.repositories.nodes;
    console.log(repositories);

    repositories.map((item) => {
      var date = Date.parse(item.updatedAt);
      var today = Date.parse(new Date());
      var msInDay = 24 * 60 * 60 * 1000;
      var diff = today - date;
      //console.log(today);
      console.log(diff);
      var color = `<i style="display:none"></i>`;
      var description = `<div style="margin: 12px"></div>`;
      var stargazerCount = `<i style="display:none"></i>`;
      var forkCount = `<i style="display:none"></i>`;
      if (item.primaryLanguage) {
        color = `<i class="fas fa-circle" style="display:'inline-block';color:${item.primaryLanguage.color}"></i>
        <span id="repo-lan "> ${item.primaryLanguage.name} </span>`;
      }

      if (item.description) {
        description = `<div class="repo-description">
        <p>${item.description}</p>
      </div>`;
      }

      if (item.stargazerCount) {
        stargazerCount = ` <i class="far fa-star"></i>
        <span id="repo-star-count"> ${item.stargazerCount} </span>`;
      }

      if (item.forkCount) {
        forkCount = `<i class="fas fa-code-branch"></i>
        <span id="branch-count"> ${item.forkCount}</span>`;
      }
      userRepoList.forEach((elem) => {
        elem.innerHTML += `
        <li class="user-repo-items">
        <div class="user-repo-info-div">
          <div class="repo-title-div">
            <h3 id="repo-title">${item.name}</h3>
          </div>
         ${description}
          <div class="repo-detail">
          ${color}
           ${stargazerCount} ${forkCount}
             Updated
            <span class="repo-update"> on days ago</span>
          </div>
        </div>
        <div class="user-star-div">
          <div class="position-right-div">
            <div class="star-button-div">
              <button class="repo-star-button">
                <i class="far fa-star"></i> Star
              </button>
            </div>
          </div>
        </div>
      </li>
       `;
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
