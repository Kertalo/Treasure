class DropReadyPlayers < ActiveRecord::Migration[7.0]
  def change
    drop_table :ready_players
  end
end
