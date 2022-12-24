ActiveAdmin.register Game do
  actions :index, :show, :destroy
  permit_params :user_id, :opponent
  index do
    selectable_column
    id_column
    column :user_id
    column :opponent
    actions
  end

  show do
    attributes_table do
      row :id
      row :user_id
      row :opponent
      row :created_at
    end
  end
end