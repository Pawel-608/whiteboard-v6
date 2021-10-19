class Nick {
  static hideCurtain() {
    elements.curtain.style.display = "none";
  }
  constructor() {
    this.nickRegex = new RegExp("[<,>.=,/]{1}");
    this.input = elements.nick.I;
    this.button = elements.nick.button;
    this.warning = elements.nick.warning;
    this.button.addEventListener("click", this.updateNick.bind(this));
    elements.curtain.addEventListener("keypress", (e) => {
      if (e.key == "Enter") this.updateNick();
    });
  }
  updateNick() {
    this.warning.style.display = "";
    let nick = this.input.value;
    if (!nick) return (this.warning.innerHTML = "Nick must have min. 5 chars");
    if (nick.length < 5) return (this.warning.innerHTML = "Nick must have min. 5 chars");
    if (nick.length > 20) return (this.warning.innerHTML = "Nick is too long");
    if (this.nickRegex.test(nick)) return (this.warning.innerHTML = "Nick contains illegal chars");
    Socket.updateMyNick(nick, this.nickCallback);
  }
  nickCallback(success, nickChanged) {
    console.log(success, nickChanged);
    if (!success) return (location.href = `${location.origin}/err`);
    if (!nickChanged) {
      elements.nick.warning.style.display = "";
      return (elements.nick.warning.innerHTML = "Nick is not unique");
    }

    Nick.hideCurtain();
    whiteboardConfig.shotrcutsEnabled = true;
    let me = Storage.get("me");
    me.nick = elements.nick.I.value;
    Storage.set("me", me);
    Socket.getBasicData();
  }
}
