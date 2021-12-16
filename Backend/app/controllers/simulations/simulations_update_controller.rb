class Simulations::SimulationsUpdateController < Simulations::SimulationsController
  # TODO: Celestial body name uniqueness check must be done on frontend
  # TODO: The (star|moon|planet|asteroid_belt) id parameter is returned from another endpoint (e.g., Space::Planet id)
  # TODO: this endpoint returns the *simulation* (star|moon|planet|asteroid_belt) id (e.g., Sim::SimulationPlanet id)
  def initialize
    super
    @planets_controller = Celestial::PlanetsController.new
    @moons_controller = Celestial::MoonsController.new
    @stars_controller = Celestial::StarsController.new
    @asteroid_belts_controller = Celestial::AsteroidBeltsController.new
  end

  # POST /simulations/{id}/planets/{planet_id}
  def add_planet
    planet = Space::Planet.find(params[:planet_id])
    sim_planet = Sim::SimulationPlanet.create!(simulation_id: @simulation.id,
                                              planet_id: planet.id)
    render json: { id: sim_planet.id }, status: :created
  end

  # POST /simulations/{id}/stars/{star_id}
  # @note - this replaces the star in the simulation
  def add_star
    star = Space::Star.find(params[:star_id])
    star.simulations << @simulation
    @simulation.update!(star_id: star.id)
    render json: { id: star.id }, status: :created
  end

  # POST /simulations/{id}/planets/{planet_id}/moons/{moon_id}
  def add_moon
    sim_planet = Sim::SimulationPlanet.find(params[:planet_id])
    moon = Space::Moon.find(params[:moon_id])
    sim_moon = Sim::SimulationMoon.create!(simulation_planet_id: sim_planet.id,
                                          moon_id: moon.id)
    render json: { id: sim_moon.id }, status: :created
  end

  # POST /simulations/{id}/asteroid_belts/{asteroid_belt_id}
  def add_asteroid_belt
    asteroid_belt = Space::AsteroidBelt.find(params[:asteroid_belt_id])
    sim_belt = Sim::SimulationAsteroidBelt.create!(simulation_id: @simulation.id,
                                                  asteroid_belt_id: asteroid_belt.id)
    render json: { id: sim_belt.id }, status: :created
  end

  # PATCH /simulations/{id}/planets/{planet_id}
  def update_planet
    # TODO: Replace simulation_planet with new one
    # TODO: Needs a transaction to do
  end

  # PATCH /simulations/{id}/stars/{star_id}
  def update_star
    # TODO: Replace simulation_planet with new one
    # TODO: Needs a transaction to do
  end

  # PATCH /simulations/{id}/planets/{planet_id}/moons/{moon_id}
  def update_moon
    # TODO: Replace simulation_planet with new one
    # TODO: Needs a transaction to do
  end

  # PATCH /simulations/{id}/asteroid_belts/{asteroid_belt_id}
  def update_asteroid_belt
    # TODO: Replace simulation_planet with new one
    # TODO: Needs a transaction to do
  end
end