require "reduce"

desc "Delete _site/"
task :delete do
  puts "\## Deleting _site/"
  status = system("rm -r _site")
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
  puts "\n## Opening _site/ in browser"
  status = system("jekyll build")
  puts status ? "Success" : "Failed"
  Rake::Task["minify"].invoke
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

desc "Minify _site/"
task :minify do
  puts "\n## Compressing static assets"
  original = 0.0
  compressed = 0
  Dir.glob("_site/**/*.*") do |file|
    case File.extname(file)
      when ".css", ".gif", ".html", ".jpg", ".jpeg", ".js", ".png", ".xml"
        puts "Processing: #{file}"
        original += File.size(file).to_f
        min = Reduce.reduce(file)
        File.open(file, "w") do |f|
          f.write(min)
        end
        compressed += File.size(file)
      else
        puts "Skipping: #{file}"
      end
  end
  puts "Total compression %0.2f\%" % (((original-compressed)/original)*100)
end