class CreateSimulationPlanets < ActiveRecord::Migration[6.1]
  def change
    create_table :simulation_planets do |t|
      t.timestamps
    end

    add_reference :simulation_planets, :simulation, foreign_key: true, column: :simulation_id
    add_reference :simulation_planets, :planet, foreign_key: true, column: :planet_id
  end
end
