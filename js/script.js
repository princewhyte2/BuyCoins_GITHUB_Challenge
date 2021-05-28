function showResponsiveNav() {
  var nav = document.getElementById("res-nav");
  if (nav.className == "mobile-nav-menu") {
    nav.className += " hidden";
  } else {
    nav.className = "mobile-nav-menu";
  }
}
var loadingDiv = document.getElementById("loading");
var dispalyInfoDiv = document.getElementById("display-info");
var formInputDiv = document.getElementById("form-input-div");
var mobileScreen = document.getElementById("mobile-screen");
var desktopView = document.getElementById("desktop-view");

var form = document.getElementById("myForm");
var repoForm = document.getElementById("repo-form");
function handleForm(event) {
  event.preventDefault();
}
form.addEventListener("submit", handleForm);
repoForm.addEventListener("submit", searchRepo);

function showSpinner() {
  loadingDiv.style.visibility = "visible";
}

function hideSpinner() {
  loadingDiv.style.visibility = "hidden";
}

function searchRepo(event) {
  event.preventDefault();

  var searchName = document.getElementById("repo-input").value;
  console.log(searchName);
  showSpinner();
  fetchData(searchName);
  repoForm.reset();
}

function getRepo() {
  var loginName = document.getElementById("login-name").value;

  console.log(loginName);

  showSpinner();

  fetchData(loginName);
}

function fetchData(loginName) {
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
  var userName = document.querySelectorAll(".username");
  var userLogin = document.querySelectorAll(".userlogin");
  var userBio = document.querySelectorAll(".bio");
  var userImage = document.querySelectorAll(".avatarUrl");
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var userRepoList = document.querySelectorAll(".user-repo-section");
  userRepoList.forEach((elem) => {
    elem.innerHTML = "";
  });
  var fullName = document.getElementById("fullName");
  var mediaQuery = window.matchMedia("(min-width : 780px)");

  function handleResponsiveness(e) {
    if (mediaQuery.matches) {
      formInputDiv.style.display = "none";
      mobileScreen.style.display = "none";
      desktopView.style.display = "block";
    } else {
      formInputDiv.style.display = "none";
      desktopView.style.display = "none";
      mobileScreen.style.display = "block";
    }
  }

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
      console.log(resp.data);
      hideSpinner();
      if (!resp.data.user) {
        dispalyInfoDiv.style.visibility = "visible";
        dispalyInfoDiv.textContent = resp.data.user;
      } else {
        handleResponsiveness(mediaQuery);
        mediaQuery.addEventListener("change", handleResponsiveness);

        userRepoList.forEach((elem) => {
          var ul = document.createElement("ul");
          ul.classList.add("user-repo-list");
          elem.appendChild(ul);
        });

        var li = document.querySelectorAll(".user-repo-list");

        if (resp.data.user.name) {
          var name = resp.data.user.name.split(" ");
          fullName.textContent = resp.data.user.name;
          firstName.textContent = name[0];
          lastName.textContent = name[1];
        }

        userName.forEach((elem) => {
          elem.textContent = resp.data.user.login;
        });

        userLogin.forEach((elem) => {
          elem.textContent = resp.data.user.login;
        });

        userBio.forEach((elem) => {
          elem.textContent = resp.data.user.bio;
        });

        userImage.forEach((elem) => {
          elem.src = resp.data.user.avatarUrl;
        });
        var repositories = resp.data.user.repositories.nodes;
        console.log(repositories);

        repositories.map((item) => {
          var date = Date.parse(item.updatedAt);
          var today = Date.parse(new Date());
          var msInDay = 24 * 60 * 60 * 1000;
          var diff = today - date;
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

          li.forEach((elem) => {
            // elem.innerHTML = "";
            var i = document.createElement("li");
            i.classList.add("user-repo-items");
            // document.querySelectorAll(".user-repo-items").innerHTML = "";
            i.innerHTML = `
      
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
     
       `;
            elem.appendChild(i);
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      hideSpinner();
      dispalyInfoDiv.textContent = err;
    });
}
