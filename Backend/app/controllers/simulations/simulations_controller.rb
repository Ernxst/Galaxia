class Simulations::SimulationsController < ApplicationController
  before_action :can_edit?
  skip_before_action :can_edit?, only: [:new]
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found_error
  rescue_from ActiveRecord::RecordInvalid, with: :handle_invalid_record
  rescue_from ActiveRecord::RecordNotSaved, with: :handle_invalid_record
  rescue_from ActiveRecord::RecordNotDestroyed, with: :handle_invalid_record

  # POST /simulations
  def new
    create_params = params.require(:simulation).permit(:name, :description)
    create_params.require([:name, :description])
    simulation = Simulation.create(**create_params, user_id: current_user.id)
    simulation.save!
    render json: { id: simulation.id }, status: :created
  end

  # PATCH /simulations/{id}
  def update
    update_params = params.require(:simulation).permit(:name, :description)
    @simulation.update!(update_params)
    head :no_content
  end

  # DELETE /simulations/{id}
  def delete
    @simulation.destroy!
    head :no_content
  end

  protected

    def can_edit?
      simulation = Simulation.find(params[:id])
      return render json: { error: 'You cannot modify a preset simulation.' },
             status: :unauthorized unless simulation.editable?

      return render json: { error: 'You cannot modify this simulation as you are not the owner.' },
             status: :unauthorized unless simulation.user.id == current_user.id

      @simulation = simulation
    end

    def handle_not_found_error
      render json: { error: 'Could not find a simulation with the given ID.' }, status: :not_found
    end

    def handle_invalid_record(exception)
      render json: { errors: exception.record.errors }, status: :unprocessable_entity
    end
end
