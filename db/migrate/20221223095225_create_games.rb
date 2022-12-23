class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.references :user, null: false, foreign_key: {on_delete: :cascade}
      t.integer :opponent

      t.timestamps
    end
  end
end
