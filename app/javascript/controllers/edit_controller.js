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

    let color_side = "#6e6e6e";
    let color_wall_exist = "#6e6e6e";
    let color_wall_clear = "#282828";
    let color_wall_exist_move = "rgba(90,90,90,0.9)";
    let color_wall_clear_move = "#3c3c3c";

    let field = [];

    function create_wall(is_horizontal, is_exist, i, color)
    {
      ctx.beginPath();
      if (is_horizontal)
        ctx.rect(side - ((is_exist) ? wall : 0) + (i % 8) * (cell + wall),
            side + cell + Math.floor(i / 8) * (cell + wall),
            cell + ((is_exist) ? 2 * wall : 0), wall);
      else
        ctx.rect(side + cell + Math.floor(i / 8) * (cell + wall),
            side - ((is_exist) ? wall : 0) + (i % 8) * (cell + wall),
            wall, cell + ((is_exist) ? 2 * wall : 0));

      ctx.fillStyle = color;

      ctx.fill();
      ctx.closePath();
    }

    function create()
    {
      ctx.beginPath();
      ctx.clearRect(0, 0, width, height);
      ctx.closePath();

      if (localStorage.getItem('field') === null)
      {
        for(let i = 0; i < 64; i++)
          field[i] = 0;
        localStorage.setItem('field', JSON.stringify(field));
      }

      field = JSON.parse(localStorage.getItem('field'));

      //horizontal walls
      for(let i = 0; i < 56; i++)
        if ((field[i] & 4) === 4)
          create_wall(true, true, i, color_wall_exist);
        else
          create_wall(true, false, i, color_wall_clear);

      //vertical walls
      for(let i = 0; i < 56; i++)
        if ((field[Math.floor(i / 8) + (i % 8) * 8] & 2) === 2)
          create_wall(false, true, i, color_wall_exist);
        else
          create_wall(false, false, i, color_wall_clear);

      ctx.beginPath();

      ctx.rect(0, 0, width, side);
      ctx.rect(0, 0, side, height);
      ctx.rect(width-side, 0, side, height);
      ctx.rect(0, height-side, width, side);

      ctx.fillStyle = color_side;
      ctx.fill();
      ctx.closePath();
    }

    function windowToCanvas(x, y)
    {
      let bbox = canvas.getBoundingClientRect();
      return { x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height) };
    }

    function mouse(event, click)
    {
      let mouse = windowToCanvas(event.clientX, event.clientY);

      if (mouse.x <= side || width - mouse.x <= side ||
          mouse.y <= side || height - mouse.y <= side)
      {
        if (!click)
          create();
        return;
      }

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

      let dir = 0;

      //x
      if (mouse.x > side + (position % 8) * (cell + wall) + cell)
        dir += 2;

      //y
      if (mouse.y > side + Math.floor(position / 8) * (cell + wall) + cell)
        dir += 4;


      if (dir === 2 || dir === 4)
      {
        if (click)
        {
          field[position] ^= dir;
          if (dir === 2)
            field[position + 1] ^= 8;
          else if (dir === 4)
            field[position + 8] ^= 1;
          localStorage.setItem('field', JSON.stringify(field));
        }
        create();
        if (dir === 2)
        {
          let color = ((field[position] & 2) === 2 ? color_wall_exist_move : color_wall_clear_move);
          create_wall(false, false,
              Math.floor(position / 8) + (position % 8) * 8, color);
        }
        else if (dir === 4)
        {
          let color = ((field[position] & 4) === 4 ? color_wall_exist_move : color_wall_clear_move);
          create_wall(true, false, position, color);
        }

      }
      else
        create();
    }

    canvas.onmousemove = function(event) { mouse(event, false) };
    canvas.onmousedown = function(event) { mouse(event, true) };

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
