class CreateComments < ActiveRecord::Migration[6.1]
  def change
    create_table :comments do |t|
      t.string :comment, null: false
      t.timestamps
    end

        add_reference :comments, :simulation, foreign_key: true
    add_reference :comments, :user, foreign_key: true
  end
end
