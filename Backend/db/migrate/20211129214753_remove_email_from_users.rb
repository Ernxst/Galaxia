class RemoveEmailFromUsers < ActiveRecord::Migration[6.1]
  def change
    remove_index :users, :email
    remove_column :users, :email
  end
end
