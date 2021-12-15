class Celestial::AsteroidBeltsController < Celestial::CelestialBodyController
  def initialize
    super
    @record = Space::AsteroidBelt
    @body = "asteroid_belts"
  end

  def required_params
    [:name, :caption, :short_description, :description, :mass, :mean_velocity,
     :axial_tilt, :day_length, :inner_semi_major, :outer_semi_major, :depth,
     :inner_eccentricity, :outer_eccentricity, :inclination, :num_of_asteroids]
  end

  def optional_params
    {}
  end

  def build(params)
    body = @record.create(params)
    body.save!
    body
  end

  def serialise_body(body)
    body.as_json
  end
end
