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

      //horizontal walls
      for(let i = 8; i < 64; i++)
        if (field[i] % 2 === 1)
          ctx.rect(side - wall + (i % 8) * (cell + wall), side - wall + Math.floor(i / 8) * (cell + wall),
              cell + 2 * wall, wall);

      //vertical walls
      for(let i = 8; i < 64; i++)
        if (field[Math.floor(i / 8) + (i % 8) * 8] > 7)
          ctx.rect(side - wall + Math.floor(i / 8) * (cell + wall), side - wall + (i % 8) * (cell + wall),
              wall, cell + 2 * wall);

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

      if (mouse.x <= side || width - mouse.x <= side ||
          mouse.y <= side || height - mouse.y <= side)
        return;

      let position = -1;

      for (let i = 1; i <= 8; i++)
        if (mouse.x <= side + i * (cell + wall))
        {
          position = i - 1;
          break;
        }

      for (let i = 1; i <= 8; i++)
        if (mouse.y <= side + i * (cell + wall))
        {
          position += (i - 1) * 8;
          break;
        }

      if (position < 0 || position > 63)
        return;

      let dir = 0;

      //x
      if (mouse.x < side + (position % 8) * (cell + wall))
        dir += 8;
      else if (mouse.x > side + (position % 8) * (cell + wall) + cell)
        dir += 2;

      //y
      if (mouse.y < side + Math.floor(position / 8) * (cell + wall))
        dir += 1;
      else if (mouse.y > side + Math.floor(position / 8) * (cell + wall) + cell)
        dir += 4;


      if (dir === 1 || dir === 2 || dir === 4 || dir === 8)
      {
        //alert(field[position] ^ dir);
        field[position] ^= dir;
        if (dir === 1)
          field[position - 8] ^= 4;
        else if (dir === 2)
          field[position + 1] ^= 8;
        else if (dir === 4)
          field[position + 8] ^= 1;
        else if (dir === 8)
          field[position - 1] ^= 2;

        localStorage.setItem('field', JSON.stringify(field));
        ctx.beginPath();
        ctx.clearRect(0, 0, width, height);
        create();
        ctx.closePath();
      }

      //ctx.clearRect(mouse.x, mouse.y, wall*4, wall*4);
      //ctx.rect(side + (position % 8) * (cell + wall), side + Math.floor(position / 8) * (cell + wall), cell, cell);
      //ctx.fillStyle = "#0000ff";
      //ctx.fill();

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
