desc "Delete Old Tags Directory"
task :delete do
  puts "\## Deleting related-content/"
  status = system("rm -r related-content")
  puts status ? "Success" : "Failed"
end

desc "Move Tags Directory"
task :move do
  puts "\## Moving Directories"
  status = system("mv _site/related-content .")
  puts status ? "Success" : "Failed"
end

desc "Image Optim"
task :optim do
  puts "\n## Optimizing Images"
  status = system("imageOptim --directory /Applications/MAMP/htdocs/conspiracyofshadows/ksenkowski.github.io/img # [options]")
  puts status ? "Success" : "Failed"
end

desc "Preview Site"
task :preview do
  puts "\n## Opening site at http://0.0.0.0:4000"
  status = system("jekyll serve -w")
  puts status ? "Success" : "Failed"
end

desc "Build and Commit Site"
task :build do
  Rake::Task["optim"].invoke
  puts "\n## Opening _site/ in browser"
  status = system("jekyll build")
  puts status ? "Success" : "Failed"
  Rake::Task["delete"].invoke
  Rake::Task["move"].invoke
  puts "\n## Staging modified files"
  status = system("git add .")
  puts status ? "Success" : "Failed"
  puts "\n## Committing a site build at #{Time.now.utc}"
  message = "Build site at #{Time.now.utc}"
  status = system("git commit -m \"#{message}\"")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing commits to remote"
  status = system("git push")
  puts status ? "Success" : "Failed"
end