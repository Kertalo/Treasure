class GameController < ApplicationController
  def menu

  end

  def loading
    PlayerStatus.create([{status: "ready"}])
  end

  def change_labyrinth

  end
end
