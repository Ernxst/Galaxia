class Simulations::SimulationsFetchController < ApplicationController
  # GET /simulations/{id}
  def get
    id = params[:id]
    begin
      render json: Simulation.find(id), status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Could not find a simulation with ID #{id}." }, status: :not_found
    end
  end

  # GET /simulations/all/preset
  def get_preset
    render json: Simulation.preset.all, status: :ok
  end

  # GET /simulations/all/user
  def get_user_created
    render json: Simulation.user_created.all, status: :ok
  end

  # /simulations/by/{id}
  def get_users_sims
    id = params[:id]
    begin
      render json: User.find(id).simulations, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Could not find a user with ID #{id}." }, status: :not_found
    end
  end
end