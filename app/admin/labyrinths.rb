ActiveAdmin.register Labyrinth do
  actions :index, :show, :edit
  permit_params :user_id, :labyrinth
  index do
    selectable_column
    id_column
    column :user_id
    column :labyrinth
    actions
  end

  show do
    attributes_table do
      row :id
      row :user_id
      row :labyrinth
      row :created_at
    end
  end

  form do
  |f|
    f.inputs do
      f.input :labyrinth
    end
    f.actions
  end
end