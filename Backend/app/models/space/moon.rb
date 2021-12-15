class Space::Moon < ApplicationRecord
  include Celestial
  include Celestial::Spherical
  include Celestial::Orbitable
  include Celestial::Textured
  self.table_name = 'moons'

  has_many :simulation_moons, class_name: 'Sim::SimulationMoon', dependent: :destroy
  has_many :simulation_planets, through: :simulation_moons
  has_many :simulations, through: :simulation_planets
  has_many :planets, through: :simulation_planets
end
