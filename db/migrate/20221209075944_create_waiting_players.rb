class CreateWaitingPlayers < ActiveRecord::Migration[7.0]
  def change
    create_table :player_status do |t|
      t.string :user_id
      t.string :status
      t.timestamps
    end
  end
end
