require "google/cloud/storage"

class Media::CloudStorageController < ApplicationController
  attr_accessor :folder
  rescue_from NoMethodError, with: :handle_no_method_error

  def handle_no_method_error
    render json: {
      error: 'Could not access media storage. Please try again later.'
    }, status: :internal_server_error
  end

  def initialize
    super
    @storage = Google::Cloud::Storage.new(
      project_id: ENV['GCS_PROJECT_ID'],
      project: ENV['GCS_PROJECT_NAME'],
      credentials: Rails.root.join("config/secrets/galaxia-gcs.json")
    )
    @bucket = @storage.bucket "#{ENV['GCS_BUCKET_NAME']}"
  end

  def prefix
    "media"
  end

  def get_file(path)
    @bucket.file "#{prefix}/#{@folder}/#{path}"
  end

  def get_media(path)
    file = get_file(path)
    { url: file.media_url,
      size: file.size,
      public_url: file.public_url,
      api_url: file.api_url }
  end

  def get_texture(texture)
    data = get_media("#{texture.for}/#{texture.filename}")
    data.merge(texture.as_json)
  end
end
