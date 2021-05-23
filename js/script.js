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
      repositories(first: 20 , isFork: false) {
        nodes {
          forkCount
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
var userRepoList = document.getElementById("user-repo-list");

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
    var name = resp.data.user.name.split(" ");
    firstName.textContent += name[0];
    lastName.textContent += name[1];
    userName.textContent += resp.data.user.login;
    userLogin.textContent += resp.data.user.login;
    userBio.textContent += resp.data.user.bio;
    userImage.src = resp.data.user.avatarUrl;
    var repositories = resp.data.user.repositories.nodes;
    console.log(repositories);
    repositories.forEach((item) => {
      userRepoList.innerHTML += `
        <li class="user-repo-items">
        <div class="user-repo-info-div">
          <div class="repo-title-div">
            <h3 id="repo-title">${item.name}</h3>
          </div>
          <div class="repo-description">
            <p>${item.description}</p>
          </div>
          <div class="repo-detail">
            <i class="fas fa-circle" style="color:${item.primaryLanguage.color}"></i>
            <span id="repo-lan"> ${item.primaryLanguage.name} </span>
            <i class="far fa-star"></i>
            <span id="repo-star-count"> ${item.forkCount} </span>
            <i class="fas fa-code-branch"></i>
            <span id="branch-count"> 345</span> Updated
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
  })
  .catch((err) => {
    console.log(err);
  });
