class DropTablePlayerStatuses < ActiveRecord::Migration[7.0]
  def change
    drop_table :player_statuses
  end
end
