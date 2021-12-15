class Celestial::MoonsController < Celestial::CelestialBodyController
  def initialize
    super
    @record = Space::Moon
    @body = "moons"
  end
end
