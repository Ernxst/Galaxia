class CreateSimulationAsteroidBelts < ActiveRecord::Migration[6.1]
  def change
    create_table :simulation_asteroid_belts do |t|
      t.timestamps
    end

    add_reference :simulation_asteroid_belts, :simulation, foreign_key: true, column: :simulation_id
    add_reference :simulation_asteroid_belts, :asteroid_belt, foreign_key: true, column: :asteroid_belt_id
  end
end
