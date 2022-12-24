ActiveAdmin.register User do
  actions :index, :show, :edit, :update
  permit_params :email, :confirmed_at
  index do
    selectable_column
    id_column
    column :email
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :email
      row :created_at
    end
  end

  form do
  |f|
    f.inputs do
      f.input :email
      f.input :confirmed_at
  end
    f.actions
  end
end