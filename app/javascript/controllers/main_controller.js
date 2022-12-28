import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const myCanvas = document.getElementById("myMove");
    const otherCanvas = document.getElementById("otherMove");
    const myCtx = myCanvas.getContext("2d");
    const otherCtx = otherCanvas.getContext("2d");

    let width = myCanvas.offsetWidth;
    let height = myCanvas.offsetHeight;

    let way = 10;
    let wall = 10;
    let side = 14;

    let cell = (width - 2 * side + wall) / 8 - wall;

    let color_treasure = "#ffff00";
    let color_way = "#8888ff";
    let color_side = "#6e6e6e";
    let color_wall_exist = "#6e6e6e";
    let color_wall_clear = "#282828";
    let color_wall_exist_move = "#3c3c3c";

    let myField = [];
    let otherField = [];
    let editField = [];

    let myWay = [0];
    let otherWay = [0];

    let myPosition = 0;
    let otherPosition = 0;

    function draw_treasure(position, ctx)
    {
      ctx.beginPath();
      ctx.rect(side + wall + (position % 8) * (cell + wall),
          side + wall + Math.floor(position / 8) * (cell + wall),
          cell - 2 * wall, cell - 2 * wall);
      ctx.fillStyle = color_treasure;
      ctx.fill();
      ctx.closePath();
    }

    function create_road(ctx, position, rotation)
    {
      let new_position = (rotation & 10) > 0 ? (rotation === 2 ? position + 1 : position - 1) :
          (rotation === 4 ? position + 8 : position - 8);
      ctx.beginPath();
      if ((rotation & 10) > 0)
        ctx.rect(side + cell / 2 - way / 2 + ((rotation === 2 ? position : new_position) % 8) * (cell + wall),
          side + cell / 2 - way / 2 + Math.floor(position / 8) * (cell + wall), cell + wall + way, way);
      else
        ctx.rect(side + cell / 2 - way / 2 + (position % 8) * (cell + wall), side + cell / 2 - way / 2 +
          Math.floor((rotation === 4 ? position : new_position) / 8) * (cell + wall), way, cell + wall + way);
      ctx.fillStyle = color_way;
      ctx.fill();
      ctx.closePath();
      return new_position;
    }

    function create_position(ctx, position)
    {
      ctx.beginPath();
      ctx.arc(side + cell / 2 + (position % 8) * (cell + wall), side + cell / 2 + Math.floor(position / 8)
          * (cell + wall), way/2, 0, Math.PI * 2, true);
      ctx.fillStyle = "#0000ff";
      ctx.fill();
      ctx.closePath();
    }

    function create_wall(ctx, position, rotation, is_exist, color)
    {
      ctx.beginPath();
      if ((rotation & 4) > 0)
        ctx.rect(side - ((is_exist) ? wall : 0) + (position % 8) * (cell + wall),
            side + cell + Math.floor(position / 8) * (cell + wall),
            cell + ((is_exist) ? 2 * wall : 0), wall);
      else
        ctx.rect(side + cell + (position % 8) * (cell + wall),
            side - ((is_exist) ? wall : 0) + Math.floor(position / 8) * (cell + wall),
            wall, cell + ((is_exist) ? 2 * wall : 0));

      ctx.fillStyle = color;

      ctx.fill();
      ctx.closePath();
    }

    function move(rotation, isClear, isMyTurn, isTreasure = false)
    {
      let ctx = isMyTurn ? myCtx : otherCtx;
      let position = isMyTurn ? myPosition : otherPosition;
      if (isClear)
      {
        position = create_road(ctx, position, rotation);
        create_position(ctx, position);
        if (isMyTurn)
        {
          myPosition = position;
          myWay.push(myPosition);
        }
        else
        {
          otherPosition = position;
          otherWay.push(otherPosition);
        }
        if (isTreasure)
        {
          let field = isMyTurn ? myField : otherField;
          field[position] += 16;
          update();
          alert('SOMEBODY WIN!');
        }
      }
      if (!isClear)
      {
        if (rotation === 1)
        {
          rotation = 4;
          position -= 8;
        }
        if (rotation === 8)
        {
          rotation = 2;
          position -= 1;
        }
        if ((myField[position] & rotation) !== rotation)
          myField[position] += rotation;
      }
    }

    function start()
    {
      for(let i = 0; i < 64; i++)
        myField[i] = 0;
      localStorage.setItem('my_field', JSON.stringify(myField));

      for(let i = 0; i < 64; i++)
        otherField[i] = 0;
      localStorage.setItem('other_field', JSON.stringify(otherField));

      localStorage.setItem('my_way', JSON.stringify(myWay));
      localStorage.setItem('other_way', JSON.stringify(otherWay));

      editField = JSON.parse(localStorage.getItem('field'));

      update();
    }

    function horizontal_vertical_walls(ctx, field, is_edit)
    {
      //horizontal walls
      for (let i = 0; i < 56; i++)
        if ((field[i] & 4) === 4)
          create_wall(ctx, i, 4, true, color_wall_exist);
        else if (is_edit && ((editField[i] & 4) === 4))
          create_wall(ctx, i, 4, true, color_wall_exist_move);
        else
          create_wall(ctx, i, 4, false, color_wall_clear);

      //vertical walls
      for (let i = 0; i < 64; i++)
        if (i % 8 !== 7)
        {
          if ((field[i] & 2) === 2)
            create_wall(ctx, i, 2, true, color_wall_exist);
          else if (is_edit && ((editField[i] & 2) === 2))
            create_wall(ctx, i, 2, true, color_wall_exist_move);
          else
            create_wall(ctx, i, 2, false, color_wall_clear);
        }
    }

    function find_rotation(pos1, pos2)
    {
      if (pos1 + 1 === pos2)
        return 2;
      if (pos1 - 1 === pos2)
        return 8;
      if (pos1 + 8 === pos2)
        return 4;
      if (pos1 - 8 === pos2)
        return 1;
    }

    function update_with_ctx(ctx, field, way, is_edit)
    {
      ctx.beginPath();
      ctx.clearRect(0, 0, width, height);
      ctx.closePath();

      horizontal_vertical_walls(ctx, field, is_edit);

      for (let i = 0; i < way.length - 1; i++)
        create_road(ctx, way[i], find_rotation(way[i], way[i + 1]));
      create_position(ctx, way[way.length - 1]);

      if (is_edit)
        for (let i = 0; i < 64; i++)
          if ((editField[i] & 16) === 16)
            draw_treasure(i, ctx);

      ctx.beginPath();
      ctx.rect(0, 0, width, side);
      ctx.rect(0, 0, side, height);
      ctx.rect(width-side, 0, side, height);
      ctx.rect(0, height-side, width, side);
      ctx.fillStyle = color_side;
      ctx.fill();
      ctx.closePath();
    }

    function update()
    {
      update_labyrinth().then(r => r);
      update_with_ctx(myCtx, myField, myWay, false);
      update_with_ctx(otherCtx, otherField, otherWay, true);
    }

    setInterval(update, 60);

    const button_up = document.getElementById("up");
    const button_right = document.getElementById("right");
    const button_down = document.getElementById("down");
    const button_left = document.getElementById("left");
    button_up.addEventListener('click', (event) =>
        move_up().then(r => r));
    button_right.addEventListener('click', (event) =>
        move_right().then(r => r));
    button_down.addEventListener('click', (event) =>
        move_down().then(r => r));
    button_left.addEventListener('click', (event) =>
        move_left().then(r => r));

    async function update_labyrinth()
    {
      fetch('/update_labyrinth')
          .then(response => response.json())
          .then(results => {
            if (results % 100 !== otherWay[otherWay.length - 1])
              move(find_rotation(otherWay[otherWay.length - 1],
                  results % 100), true, false)
          });
    }

    function before_move(results, rotation)
    {
      if (results === 0)
        move(rotation, false, true);
      else if (results === 1)
        move(rotation, true, true);
      else if (results === 2)
        move(rotation, true, true, true);
      else
        alert("NOT YOUR TURN!");
    }

    async function move_up()
    {
      fetch('/move_up')
          .then(response => response.json())
          .then(results => before_move(results, 1))
    }

    async function move_right()
    {
      fetch('/move_right')
          .then(response => response.json())
          .then(results => before_move(results, 2))
    }

    async function move_down()
    {
      fetch('/move_down')
          .then(response => response.json())
          .then(results => before_move(results, 4))
    }

    async function move_left()
    {
      fetch('/move_left')
          .then(response => response.json())
          .then(results => before_move(results, 8))
    }

    async function set_other_labyrinth()
    {
      fetch('/set_other_labyrinth')
          .then(response => response.json())
          .then(results => { localStorage.setItem('field', JSON.stringify(results)); start(); });
    }

    set_other_labyrinth().then(r => r);
  }
}
