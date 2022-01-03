class Simulations::SimulationsUpdateController < Simulations::SimulationsController
  # TODO: Celestial body name uniqueness check must be done on frontend
  # @note: The (star|moon|planet|asteroid_belt) id parameter is returned from another endpoint (e.g., Space::Planet id)
  # @note: this endpoint returns the *simulation* (star|moon|planet|asteroid_belt) id (e.g., Sim::SimulationPlanet id)
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
    copy = Space::Planet.create!(planet.attributes.except('id', 'created_at', 'updated_at'))
    sim_planet = Sim::SimulationPlanet.create!(simulation_id: @simulation.id,
                                               planet_id: copy.id)
    render json: { id: sim_planet.id }, status: :created
  end

  # POST /simulations/{id}/stars/{star_id}
  # @note - this replaces the star in the simulation
  def add_star
    star = Space::Star.find(params[:star_id])
    copy = Space::Star.create!(star.attributes.except('id', 'created_at', 'updated_at'))
    copy.simulations << @simulation
    @simulation.update!(star_id: copy.id)
    render json: { id: copy.id }, status: :created
  end

  # POST /simulations/{id}/planets/{planet_id}/moons/{moon_id}
  def add_moon
    sim_planet = Sim::SimulationPlanet.find(params[:planet_id])
    moon = Space::Moon.find(params[:moon_id])
    copy = Space::Moon.create!(moon.attributes.except('id', 'created_at', 'updated_at'))
    sim_moon = Sim::SimulationMoon.create!(simulation_planet_id: sim_planet.id,
                                           moon_id: copy.id)
    render json: { id: sim_moon.id }, status: :created
  end

  # POST /simulations/{id}/asteroid_belts/{asteroid_belt_id}
  def add_asteroid_belt
    asteroid_belt = Space::AsteroidBelt.find(params[:asteroid_belt_id])
    copy = Space::AsteroidBelt.create!(asteroid_belt.attributes.except('id', 'created_at', 'updated_at'))
    sim_belt = Sim::SimulationAsteroidBelt.create!(simulation_id: @simulation.id,
                                                   asteroid_belt_id: copy.id)
    render json: { id: sim_belt.id }, status: :created
  end

  # PATCH /simulations/{id}/planets/{planet_id}
  def update_planet
    sim_planet = Sim::SimulationPlanet.find(params[:planet_id])
    update_params = @planets_controller.update_params(params.except(:id, :planet_id))
    sim_planet.planet.update!(update_params)
    head :no_content
  end

  # PATCH /simulations/{id}/stars/{star_id}
  def update_star
    update_params = @stars_controller.update_params(params.except(:star_id, :id))
    star = Space::Star.find(params[:star_id])
    star.update!(update_params)
    head :no_content
  end

  # PATCH /simulations/{id}/planets/{planet_id}/moons/{moon_id}
  def update_moon
    sim_moon = Sim::SimulationMoon.find(params[:moon_id])
    update_params = @moons_controller.update_params(params.except(:moon_id, :id, :planet_id))
    sim_moon.moon.update!(update_params)
    head :no_content
  end

  # PATCH /simulations/{id}/asteroid_belts/{asteroid_belt_id}
  def update_asteroid_belt
    sim_belt = Sim::SimulationAsteroidBelt.find(params[:asteroid_belt_id])
    update_params = @asteroid_belts_controller.update_params(params.except(:id, :asteroid_belt_id))
    sim_belt.asteroid_belt.update!(update_params)
    head :no_content
  end

  # DELETE /simulations/{id}/planets/{planet_id}
  def delete_planet
    planet = Sim::SimulationPlanet.find(params[:planet_id])
    planet.destroy!
    head :no_content
  end

  # DELETE /simulations/{id}/stars/{star_id}
  def remove_star
    star = Space::Star.find(params[:star_id])
    star.simulations.delete(@simulation)
    head :no_content
  end

  # DELETE /simulations/{id}/planets/{planet_id}/moons/{moon_id}
  def delete_moon
    moon = Sim::SimulationMoon.find(params[:moon_id])
    moon.destroy!
    head :no_content
  end

  # DELETE /simulations/{id}/asteroid_belts/{asteroid_belt_id}
  def delete_asteroid_belt
    asteroid_belt = Sim::SimulationAsteroidBelt.find(params[:asteroid_belt_id])
    asteroid_belt.destroy!
    head :no_content
  end
end
