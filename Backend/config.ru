# This file is used by Rack-based servers to start the application.

require_relative "config/environment"

# Load credentials in production mode
if ENV['RAILS_ENV'] === 'production'
  Rails.root.join('config/secrets/galaxia-gcs.json')
  config = JSON.parse(ENV['GOOGLE_APPLICATION_CREDENTIALS'])
  pkey = config["private_key"]
  config["private_key"] = pkey.gsub("PRIVATEKEY", " PRIVATE KEY")

  dir_path = File.join Rails.root, 'config', 'secrets'
  FileUtils.mkdir_p(dir_path) unless File.exist?(dir_path)
  File.open(Rails.root.join('config/secrets/galaxia-gcs.json'), "w") do |f|
    f.write(JSON.dump(config))
  end
end

run Rails.application
Rails.application.load_server
