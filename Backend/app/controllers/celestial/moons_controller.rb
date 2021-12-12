class Celestial::MoonsController < Celestial::CelestialBodyController
  def initialize
    super
    @record = Celestial::Moon
    @body = "moons"
  end
end
