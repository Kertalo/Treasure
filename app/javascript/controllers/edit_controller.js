import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let wall = 12;
    let side = 20;

    let cell = (width - 2 * side + wall) / 8 - wall;
    let field = [];
    function create()
    {
      if (localStorage.getItem('field') == null)
      {
        alert("hi");
        for(let i = 0; i < 64; i++)
          field[i] = 0;
        localStorage.setItem('field', JSON.stringify(field));
      }

      ctx.beginPath();

      ctx.rect(0, 0, width, side);
      ctx.rect(0, 0, side, height);
      ctx.rect(width-side, 0, side, height);
      ctx.rect(0, height-side, width, side);

      field = JSON.parse(localStorage.getItem('field'));

      for(let i = 8; i < 64; i++)
        if (field[i] % 2 === 1)
          ctx.rect(side - wall / 2 + (i % 8) * (cell + wall), side - wall + Math.floor(i / 8) * (cell + wall),
              cell + wall, wall);
      /*for(let i = 1; i < 8; i++)
        for(let j = 0; j < 8; j++)
          ctx.rect(side - wall + i * (cell + wall), side - wall / 2 + j * (cell + wall), wall, cell + wall);*/

      ctx.fillStyle = "#838383";
      ctx.fill();
      ctx.closePath();
    }

    function windowToCanvas(x, y)
    {
      let bbox = canvas.getBoundingClientRect();
      return { x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height) };
    }

    canvas.onmousedown = function(e)
    {
      let mouse = windowToCanvas(e.clientX, e.clientY);
      ctx.beginPath();

      ctx.clearRect(mouse.x, mouse.y, wall*4, wall*4);
      ctx.rect(mouse.x, mouse.y, wall, wall);

      ctx.fillStyle = "#838383";
      ctx.fill();
      ctx.closePath();
    };

    create();

    /*function draw()
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
    }*/

    //setInterval(draw, 10);
  }
}
