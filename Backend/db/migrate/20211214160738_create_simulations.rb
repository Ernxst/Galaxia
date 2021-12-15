class CreateSimulations < ActiveRecord::Migration[6.1]
  def change
    create_table :simulations do |t|
      t.string :name, null: false
      t.string :description, null: false, default: ""
      t.timestamps
    end

    add_reference :simulations, :user, foreign_key: true, column: :user_id
    add_reference :simulations, :star, foreign_key: true, column: :star_id
  end
end
