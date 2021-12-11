class Media::BaseTexturesController < Media::CloudStorageController
  skip_before_action :authenticate_user!, only: [:get, :all, :planets, :stars, :moons]

  def initialize
    @record = Media::Texture
    @folder = ''
    super
  end

  # GET /media/{resource}/
  def all
    textures = @record.all.map { |n| get_texture(n) }
    render json: { "#{@folder}": textures }, status: :ok
  end

  def title_folder
    @folder.humanize.downcase.singularize
  end

  # GET /media/{resource}/{id}
  def get
    begin
      texture = @record.find(params[:id])
      render json: { "#{@folder.singularize}": get_texture(texture) }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Could not find a #{title_folder} with ID #{params[:id]}." },
             status: :not_found
    end
  end

  # GET /media/{resource}/stars/
  def stars
    textures = @record.star_textures.map { |n| get_texture(n) }
    render json: { "#{@folder}": textures }, status: :ok
  end

  # GET /media/{resource}/planets/
  def planets
    textures = @record.planet_textures.map { |n| get_texture(n) }
    render json: { "#{@folder}": textures }, status: :ok

  end

  # GET /media/{resource}/moons/
  def moons
    textures = @record.moon_textures.map { |n| get_texture(n) }
    render json: { "#{@folder}": textures }, status: :ok
  end
end
