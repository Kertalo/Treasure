class GameController < ApplicationController
  def menu

  end

  def loading
    PlayerStatus.create([{status: "ready"}])
  end

  def edit_labyrinth
    @labyrinth = "00"
  end

  def save_labyrinth
    Labyrinth.create([{labyrinth: "0000000000000000000000000000000000000000000000000000000000000000"}])
    redirect_to "/edit_labyrinth"
  end
end
