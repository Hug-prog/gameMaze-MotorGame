export default function callPHP(params, url) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    console.log("ok ok pass");
  };
  xhttp.open("POST", "./?action=" + url);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params);
}

// end game
export function endGame(id, health) {
  callPHP(`id=${id}&health=${health}`, "healthPlayer");
}
