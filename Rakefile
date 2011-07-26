require File.expand_path('../lib/package', __FILE__)

uglify_bin = `which uglifyjs`.chomp
uglify_bin = '~/node_modules/uglify-js/bin/uglifyjs' if uglify_bin.empty?

root       = File.expand_path '..', __FILE__
version    = File.read File.join(root, 'VERSION').chomp

path       = File.join root, 'public', 'js', "vizard-#{ version }.min.js"

load 'vizard.join'
pkg = Package[:vizard]

task :clean do
  File.unlink pkg.path if File.exist? pkg.path
  File.unlink path if File.exist? path
end
task :build do
  pkg.build unless File.exist? pkg.path
  File.open(path, 'w') { |file| file << `#{ uglify_bin } -nc #{ pkg.path }` }
end

task :default => :build
