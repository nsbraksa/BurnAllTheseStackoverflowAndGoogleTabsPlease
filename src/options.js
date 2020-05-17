let tabsDiv = document.getElementById("tabsDiv");
let urlInput = document.getElementById("urlInput");
let checkboxInput = document.getElementById("checkboxInput");

checkboxInput.addEventListener("click", e => {
  if (e.target.value == "unchecked") e.target.value = "checked";
  else e.target.value = "unchecked";
});

urlInput.addEventListener("keypress", e => {
  if (e.keyCode == 13) {
    addUrlToOptions();
  }
});

const addUrlToOptions = () => {
  const tabInfo = {
    url: urlInput.value,
    isExactMatch: checkboxInput.value == "unchecked" ? false : true
  };

  if (tabInfo.url) {
    let singleTabDiv = createSingleTabDiv(tabInfo);
    tabsDiv.appendChild(singleTabDiv);
    chrome.storage.sync.get("tabsToClose", obj => {
      const tabsToClose = [...obj.tabsToClose, tabInfo];
      chrome.storage.sync.set({ tabsToClose }, () =>
        console.log("updated tabsToClose")
      );
    });

    // reset inputs
    urlInput.value = "";
    checkboxInput.value = "unchecked";
  }
};

const createSingleTabDiv = tabInfo => {
  let h4 = document.createElement("h4");
  h4.innerHTML = tabInfo.url;
  h4.setAttribute("checkbox", tabInfo.isExactMatch ? "checked" : "unchecked");

  let singleTabDiv = document.createElement("div");
  singleTabDiv.classList.add("urlBox");
  singleTabDiv.appendChild(h4);

  singleTabDiv.addEventListener("click", function(e) {
    chrome.storage.sync.get("tabsToClose", obj => {
      const tabsToClose = obj.tabsToClose;
      const index = tabsToClose.findIndex(element => {
        if (
          element.url == this.childNodes[0].innerText &&
          element.isExactMatch ==
            (this.childNodes[0].getAttribute("checkbox") == "checked"
              ? true
              : false)
        )
          return true;
        return false;
      });
      tabsToClose.splice(index, 1);
      console.log("tabsToClose", index, tabsToClose, this);
      chrome.storage.sync.set({ tabsToClose }, () =>
        console.log("updated tabsToClose")
      );
    });
    this.parentElement.removeChild(this);
  });
  return singleTabDiv;
};

const constructOptions = tabsToClose => {
  for (let tabInfo of tabsToClose) {
    let singleTabDiv = createSingleTabDiv(tabInfo);
    tabsDiv.appendChild(singleTabDiv);
  }
};

chrome.storage.sync.get("tabsToClose", obj => {
  constructOptions(obj.tabsToClose);
});
