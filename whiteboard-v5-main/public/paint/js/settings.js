class Settings {
  static changePowers(nick) {
    let users = [];
    elements.settingsBar.childNodes.forEach((elem) => {
      if (elem.className) users.push(elem);
    });
    users.forEach((userElem) => {
      if (userElem.innerText == nick) {
        switch (userElem.className) {
          case "user":
            userElem.className = "superUser";
            break;
          case "superUser":
            userElem.className = "user";
            break;
        }
        return;
      }
    });
  }
  static onNewUser(nick) {
    new Whiteboard({ nick }, "black", 2, "brush");
    this.addUserToBar({ nick });
  }
  static addUserToBar(user) {
    let elem = document.createElement("div");
    elem.className = "user";
    if (user.isSuperUser) elem.className = "superUser";
    if (user.isAdmin) elem.className = "admin";
    elem.innerText = user.nick;
    elements.settingsBar.appendChild(elem);
  }
  constructor(users) {
    console.log(users);
    this.users = users;
    this.settings = elements.settings;
    this.settingsBar = elements.settingsBar;
    this.isHidden = true;

    this.filterUsers(); //FOR SOME REASON I GET SOME EMPTY USERS //TODO
    this.setupWhiteboards();
    this.setupBar();
    this.setupListeners();
    Socket.onNewUser();
  }
  filterUsers() {
    let users = [];
    this.users.forEach((user) => {
      if (user.nick) users.push(user);
    });
    this.users = users;
  }
  setupWhiteboards() {
    this.users.forEach((user) => {
      let me = Storage.get("me");
      if (user.nick !== me.nick) new Whiteboard({ nick: user.nick }, "black", 2, "brush"); //TODO change it
    });
  }
  setupBar() {
    this.users.forEach((user) => {
      console.log(user);
      Settings.addUserToBar(user);
    });
  }
  setupListeners() {
    this.settings.addEventListener("click", () => {
      this.displayBar();
    });
    window.addEventListener("click", (e) => {
      if (this.isHidden) return;
      this.bar(e);
    });
    Socket.onChangePowers();

    let perm = Storage.get("me").perm;
    if (perm == 2) {
      this.settingsBar.addEventListener("click", (e) => {
        if (e.target.className !== "settings-slider" && e.target.innerText.length > 0) {
          Settings.changePowers(e.target.innerText);
          Socket.changePowers(e.target.innerText);
        }
      });
    }
  }
  bar(e) {
    let flag = true;
    e.path.forEach((element) => {
      if (element.className == "settings" || element.className == "settings-slider") flag = false;
    });
    if (flag) this.hideBar();
  }
  hideBar() {
    this.settingsBar.style.display = "none";
    this.isHidden = true;
  }
  displayBar() {
    this.settingsBar.style.display = "";
    this.isHidden = false;
  }
}
