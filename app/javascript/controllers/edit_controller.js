import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let wall = 15;

    ctx.beginPath();
    ctx.rect(0, 0, width, wall);
    ctx.rect(0, 0, wall, height);
    ctx.rect(width-wall, 0, wall, height);
    ctx.rect(0, height-wall, width, wall);
    ctx.rect(width/8-wall/2, 0, wall, height/8);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();

    let x = 0;
    let y = 0;

    function draw()
    {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      document.addEventListener("mousedown", (event)=>(x=0, y=0));
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#0000ff";
      ctx.fill();
      ctx.closePath();
      x += 1;
      y += 1;
    }

    /*let event = new MouseEvent("click", {
      x = 0;
      y = 0;
    });*/

    setInterval(draw, 10);
  }
}
