# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV['MAILER_ACCOUNT'] || 'no-reply@galaxia.co.uk'
  layout 'mailer'
end
