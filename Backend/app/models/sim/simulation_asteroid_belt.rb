class Sim::SimulationAsteroidBelt < ApplicationRecord
  self.table_name = "simulation_asteroid_belts"

  belongs_to :asteroid_belt, class_name: 'Space::AsteroidBelt'
  belongs_to :simulation
end
