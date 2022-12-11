class GameController < ApplicationController
  def menu

  end

  def loading
    current_user.create_ready_player
  end

  def cancel
    ready = ReadyPlayer.find_by(id: session[:current_active_session_id])
    ready.destroy! if ready.present?
    redirect_to menu_path
  end

  def edit_labyrinth
    @labyrinth = "00"
  end

  def save_labyrinth
    current_user.create_labyrinth(labyrinth: "11")
    redirect_to "/edit_labyrinth"
  end
end
