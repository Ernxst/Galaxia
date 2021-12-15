class Celestial::StarsController < Celestial::CelestialBodyController
  def initialize
    super
    @record = Space::Star
    @body = "stars"
  end

  def required_params
    [:name, :caption, :short_description, :description, :mass, :mean_velocity,
     :axial_tilt, :day_length, :radius, :luminosity, :texture_id]
  end

  def optional_params
    {}
  end
end
