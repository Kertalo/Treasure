class CreateReadyPlayers < ActiveRecord::Migration[7.0]
  def change
    create_table :ready_players do |t|
      t.references :user, null: false, foreign_key: {on_delete: :cascade}

      t.timestamps
    end
  end
end
