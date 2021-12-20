namespace :db do
  desc "Checks to see if the database exists"
  task :exists do
    begin
      Rake::Task['environment'].invoke
      ActiveRecord::Base.connection
      if Media::Texture.all.length == 0
        exit 1
      end
    rescue
      puts '== Database does not exist, will seed after creation =='
      exit 1
    else
      puts '== Database exists, will not seed =='
      exit 0
    end
  end
end