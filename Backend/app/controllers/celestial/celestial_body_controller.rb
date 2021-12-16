# TODO: Add endpoint for generating random celestial body
class Celestial::CelestialBodyController < ApplicationController

  def initialize
    @record = Space::Planet
    @body = ''
    @texture_controller = Media::TexturesController.new
    @atmosphere_texture_controller = Media::AtmosphereTexturesController.new
    @specular_map_controller = Media::SpecularMapsController.new
    @bump_map_controller = Media::BumpMapsController.new
    super
  end

  # GET /celestial/{resource}/
  def all
    bodies = @record.all.map { |n| serialise_body(n) }
    render json: { "#{@body}": bodies }, status: :ok
  end

  def title_folder
    @body.humanize.downcase.singularize
  end

  # GET /celestial/{resource}/{id}
  def get
    begin
      body = @record.find(params[:id])
      render json: { "#{@body.singularize}": serialise_body(body) }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Could not find a #{title_folder} with ID #{params[:id]}." },
             status: :not_found
    end
  end

  def serialise_body(body)
    add_textures(body).merge(body.as_json)
  end

  def add_textures(body)
    data = @texture_controller.get_texture(body.texture)
    data = data.merge(@atmosphere_texture_controller.get_texture(body.atmosphere_texture)) unless body.atmosphere_texture.nil?
    data = data.merge(@bump_map_controller.get_texture(body.bump_map)) unless body.bump_map.nil?
    data = data.merge(@specular_map_controller.get_texture(body.specular_map)) unless body.specular_map.nil?
    data
  end

  # POST /celestial/{resource}/
  def new
    begin
      body = build(create_params(params))
      render json: { id: body.id }, status: :created
    rescue ActiveRecord::RecordInvalid => invalid
      render json: { errors: invalid.record.errors }, status: :unprocessable_entity
    end
  end

  def create_params(params)
    params = params.require(@body.singularize.to_sym).permit(*required_params, **optional_params)
    params.require(required_params)
    params
  end

  def update_params(params)
    params.require(@body.singularize.to_sym).permit(*required_params, **optional_params)
  end

  # TODO: Add support for atmospheres and rings
  # TODO: Override for Planets (for implementing rings)
  # Can be overridden
  def build(params)
    body = @record.create(params.except(:atmosphere))
    body.save!
    body
  end

  # Can be overridden
  def required_params
    [:name, :caption, :short_description, :description, :mass, :mean_velocity,
     :axial_tilt, :day_length, :semi_major, :semi_minor, :inclination,
     :orbital_period, :radius, :eccentricity, :texture_id]
  end

  # Can be overridden
  def optional_params
    { bump_mad_id: nil, specular_map_id: nil }
  end
end
