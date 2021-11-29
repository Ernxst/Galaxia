# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV['MAILER_ACCOUNT'] || 'no-reply@APP_NAME.co'
  layout 'mailer'
end
