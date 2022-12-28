import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    let radios = document.querySelectorAll('input[type="radio"]');

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let wall = 10;
    let side = 14;

    let cell = (width - 2 * side + wall) / 8 - wall;

    let color_cell_treasure = "#c8c800";
    let color_treasure = "#ffff00";
    let color_cell = "#484848";
    let color_side = "#6e6e6e";
    let color_wall_exist = "#6e6e6e";
    let color_wall_clear = "#282828";
    let color_wall_exist_move = "#5a5a5a";
    let color_wall_clear_move = "#3c3c3c";

    let field = [];

    function draw_treasure(position, color)
    {
      ctx.beginPath();
      ctx.rect(side + wall + (position % 8) * (cell + wall),
          side + wall + Math.floor(position / 8) * (cell + wall),
          cell - 2 * wall, cell - 2 * wall);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }

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


    function update()
    {
      if (localStorage.getItem('field') === null)
        clear();

      ctx.beginPath();
      ctx.clearRect(0, 0, width, height);
      ctx.closePath();

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

      for(let i = 0; i < 64; i++)
        if ((field[i] & 16) === 16)
          draw_treasure(i, color_treasure);

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
          update();
        return;
      }

      let is_walls = true;
      for (let radio of radios)
        if (radio.checked && radio.value === "treasure")
          is_walls = false;

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

      if (!is_walls)
      {
        if (click)
        {
          for (let i = 0; i < 64; i++)
            field[i] = field[i] % 16;
          field[position] += 16;
          localStorage.setItem('field', JSON.stringify(field));
        }
        update();
        if ((field[position] & 16) === 16)
          draw_treasure(position, color_cell_treasure);
        else
          draw_treasure(position, color_cell);
        return;
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
        update();
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
        update();
    }

    function clear()
    {
      for(let i = 0; i < 64; i++)
        field[i] = 0;
      for(let i = 0; i < 8; i++)
        field[i] += 1;
      for(let i = 56; i < 64; i++)
        field[i] += 4;
      for(let i = 0; i < 64; i += 8)
        field[i] += 8;
      for(let i = 7; i < 64; i += 8)
        field[i] += 2;
      field[63] += 16;

      localStorage.setItem('field', JSON.stringify(field));
    }

    canvas.onmousemove = function(event) { mouse(event, false) };
    canvas.onmousedown = function(event) { mouse(event, true) };

    const button_clear = document.getElementById("clear");
    button_clear.addEventListener('click', (event) =>
    {
      clear();
      update();
    });

    async function reset_labyrinth()
    {
      await fetch('/reset_labyrinth')
          .then(response => response.json())
          .then(results => { localStorage.setItem('field', JSON.stringify(results)); update(); });
    }

    const button_reset = document.getElementById("reset");
    button_reset.addEventListener('click', (event) => reset_labyrinth());

    async function save_labyrinth()
    {
      let labyrinth = { field: localStorage.getItem('field') };

      const token = document.querySelector('meta[name="csrf-token"]').content;

      await fetch('/save_labyrinth', {
        method: 'POST',
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(labyrinth)
      });
    }

    const button_save = document.getElementById("save");
    button_save.addEventListener('click', (event) => save_labyrinth());

    update();
  }
}
