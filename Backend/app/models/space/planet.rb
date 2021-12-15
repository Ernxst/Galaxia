# TODO: Ringed planets should be in same table as planets
class Space::Planet < ApplicationRecord
  include Celestial
  include Celestial::Spherical
  include Celestial::Orbitable
  include Celestial::Textured
  self.table_name = 'planets'

  has_many :simulation_planets, class_name: 'Sim::SimulationPlanet', dependent: :destroy
  has_many :simulations, through: :simulation_planets
end
